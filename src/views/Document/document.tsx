import ReactionSelector from "@components/reaction-selector";
import useStateCallback from "@hooks/set-callback-state";
import FlyingReaction from "@components/flying-reaction";
import EditableBlock from "@components/editable-block";
import useInterval from "@hooks/use-interval";
import Cursor from "@components/cursor";
import MainLayout from "@layout/main-layout";
import debounce from "lodash/debounce";
import React from "react";
import axios from "axios";

import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
  RoomProvider,
} from "../../../liveblocks.config";
import { uid } from "@utils/id";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

enum CursorMode {
  Hidden,
  Chat,
  ReactionSelector,
  Reaction,
}

type CursorState =
  | {
      mode: CursorMode.Hidden;
    }
  | {
      mode: CursorMode.Chat;
      message: string;
      previousMessage: string | null;
    }
  | {
      mode: CursorMode.ReactionSelector;
    }
  | {
      mode: CursorMode.Reaction;
      reaction: string;
      isPressed: boolean;
    };

type Reaction = {
  value: string;
  timestamp: number;
  point: { x: number; y: number };
};

type ReactionEvent = {
  x: number;
  y: number;
  value: string;
};

import type { Document } from "@lib/get-document";
import type { CancelTokenSource } from "axios";

const BROADCAST_EVENT = {
  document_change: "DOCUMENT_CHANGE",
};

const initialBlock = {
  id: uid(),
  html: "",
  tag: "h1",
};

const Wrapper: React.FC<{ data: Document }> = ({ data }) => {
  const [blocks, setBlocks] = useStateCallback<typeof initialBlock[]>(
    data?.blocks?.length
      ? (data.blocks as typeof initialBlock[])
      : [initialBlock]
  );

  const others = useOthers();
  const broadcast = useBroadcastEvent();

  const [{ cursor }, updateMyPresence] = useMyPresence();
  const [state, setState] = React.useState<CursorState>({
    mode: CursorMode.Hidden,
  });
  const [reactions, setReactions] = React.useState<Reaction[]>([]);
  const [blocksMetadata, setBlocksMetadata] = useStateCallback<{
    updatedAt: number;
    source: "refetch" | "myself" | "none";
  }>({ updatedAt: Date.now(), source: "none" });

  const setReaction = React.useCallback((reaction: string) => {
    setState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  // Remove reactions that are not visible anymore (every 1 sec)
  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 1000);

  useInterval(() => {
    if (state.mode === CursorMode.Reaction && state.isPressed && cursor) {
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: state.reaction,
            timestamp: Date.now(),
          },
        ])
      );
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: state.reaction,
      });
    }
  }, 100);

  React.useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setState({ mode: CursorMode.Hidden });
      } else if (e.key === "Control") {
        setState({ mode: CursorMode.ReactionSelector });
      }
    }

    window.addEventListener("keyup", onKeyUp);

    return () => window.removeEventListener("keyup", onKeyUp);
  }, [updateMyPresence]);

  useEventListener(async (eventData) => {
    const event = eventData.event as ReactionEvent;

    if (event.value === BROADCAST_EVENT.document_change) {
      const result = await axios.get<Document>(`/api/documents/${data._id}`);
      const { blocks: newBlocksData } = result.data;

      const hasDifferentValues = (newBlocksData as typeof initialBlock[])?.some(
        (block) => {
          const currentBlock = blocks.find(({ id }) => id === block.id);
          if (!currentBlock) return true;

          return currentBlock.html !== block.html;
        }
      );

      if (newBlocksData && hasDifferentValues) {
        setBlocksMetadata({ updatedAt: Date.now(), source: "refetch" }, () => {
          setBlocks(newBlocksData as typeof initialBlock[]);
        });
      }

      return;
    }

    return setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });

  React.useEffect(() => {
    if (blocksMetadata.source === "myself") {
      broadcast({ value: BROADCAST_EVENT.document_change, x: 0, y: 0 });
    }
  }, [blocks, broadcast, blocksMetadata]);

  const blocksContainerRef = React.useRef<HTMLDivElement>(null);
  const cancelToken = React.useRef<CancelTokenSource>();

  const saveInDatabase = React.useCallback(
    async (newBlocks: typeof initialBlock[]) => {
      if (typeof cancelToken?.current !== typeof undefined) {
        cancelToken?.current?.cancel("Operation canceled due to new request.");
      }

      cancelToken.current = axios.CancelToken.source();

      await axios.put(
        `/api/documents/${data._id}`,
        {
          blocks: newBlocks,
        },
        { cancelToken: cancelToken.current?.token }
      );

      setBlocksMetadata({ source: "myself", updatedAt: Date.now() });
    },
    [data._id, cancelToken, setBlocksMetadata]
  );

  const refetch = React.useRef(debounce(saveInDatabase, 200)).current;

  const handleBlockChange = React.useCallback(
    ({ id, html, tag }: { id: string; html: string; tag: string }) => {
      const editedIndex = blocks.findIndex((block) => block.id === id);
      const clonedBlocks = [...blocks];

      clonedBlocks[editedIndex] = { ...clonedBlocks[editedIndex], html, tag };

      setBlocks(clonedBlocks, () => {
        const blocksElements = blocksContainerRef.current?.childNodes || [];
        const aux = blocksElements[editedIndex].childNodes || [];
        // (aux[0] as HTMLElement)?.focus();
        (aux[1] as HTMLElement)?.focus();
      });

      refetch(clonedBlocks);
    },
    [setBlocks, blocks, refetch]
  );

  const addBlock = React.useCallback(
    (currentBlock: { ref: React.RefObject<HTMLElement>; id: string }) => {
      const newBlock = { id: uid(), html: "", tag: "p" };
      const currentIndex = blocks.findIndex(
        (block) => block.id === currentBlock.id
      );

      const clonedBlocks = [...blocks];
      clonedBlocks.splice(currentIndex + 1, 0, newBlock);

      setBlocks(clonedBlocks, () => {
        const blocksElements = blocksContainerRef.current?.childNodes || [];
        const aux =
          blocksElements[currentIndex + 2]?.childNodes ||
          blocksElements[currentIndex + 1]?.childNodes ||
          [];

        (aux[0] as HTMLElement)?.focus();
      });
    },
    [blocks, setBlocks]
  );

  const deleteBlock = React.useCallback(
    (currentBlock: { ref: React.RefObject<HTMLElement>; id: string }) => {
      const currentIndex = blocks.findIndex(
        (block) => block.id === currentBlock.id
      );

      if (currentIndex > 0) {
        setBlocks(
          blocks.filter((block) => block.id !== currentBlock.id),
          () => {
            const blocksElements = blocksContainerRef.current?.childNodes || [];
            const aux =
              blocksElements[currentIndex]?.childNodes ||
              blocksElements[currentIndex - 1]?.childNodes ||
              [];

            (aux[0] as HTMLElement)?.focus();
          }
        );
      }
    },
    [blocks, setBlocks]
  );

  return (
    <MainLayout>
      <div
        ref={blocksContainerRef}
        className="relative h-screen w-full touch-none"
        style={{
          cursor:
            state.mode === CursorMode.Chat
              ? "none"
              : "url(cursor.svg) 0 0, auto",
        }}
        onPointerMove={(event) => {
          event.preventDefault();
          if (cursor == null || state.mode !== CursorMode.ReactionSelector) {
            updateMyPresence({
              cursor: {
                x: Math.round(event.clientX),
                y: Math.round(event.clientY),
              },
            });
          }
        }}
        onPointerLeave={() => {
          setState({
            mode: CursorMode.Hidden,
          });
          updateMyPresence({
            cursor: null,
          });
        }}
        onPointerDown={(event) => {
          updateMyPresence({
            cursor: {
              x: Math.round(event.clientX),
              y: Math.round(event.clientY),
            },
          });
          setState((state) =>
            state.mode === CursorMode.Reaction
              ? { ...state, isPressed: true }
              : state
          );
        }}
        onPointerUp={() => {
          setState((state) =>
            state.mode === CursorMode.Reaction
              ? { ...state, isPressed: false }
              : state
          );
        }}
      >
        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}

        {cursor && (
          <div
            className="absolute top-0 left-0"
            style={{
              transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
            }}
          >
            {state.mode === CursorMode.ReactionSelector && (
              <ReactionSelector
                setReaction={(reaction) => {
                  setReaction(reaction);
                }}
              />
            )}
            {state.mode === CursorMode.Reaction && (
              <div className="absolute top-0 left-1 pointer-events-none select-none">
                {state.reaction}
              </div>
            )}
          </div>
        )}

        {others.map(({ connectionId, presence }) => {
          if (presence == null || !presence.cursor) {
            return null;
          }

          return (
            <Cursor
              key={connectionId}
              color={COLORS[connectionId % COLORS.length]}
              x={presence.cursor.x}
              y={presence.cursor.y}
              message={""}
            />
          );
        })}

        {blocks.map((block) => (
          <EditableBlock
            {...block}
            key={block.id}
            onChange={handleBlockChange}
            addBlock={addBlock}
            deleteBlock={deleteBlock}
          />
        ))}
      </div>
    </MainLayout>
  );
};

const Page: React.FC<{ data: Document }> = ({ data }) => {
  const roomId = React.useMemo(() => data._id, [data._id]);

  return (
    <RoomProvider
      id={roomId}
      initialPresence={() => ({
        cursor: null,
        message: "",
      })}
    >
      <Wrapper data={data} />
    </RoomProvider>
  );
};

export default Page;
