import useStateCallback from "@hooks/set-callback-state";
import EditableBlock from "@components/editable-block";
import MainLayout from "@layout/main-layout";
import debounce from "lodash/debounce";
import React from "react";
import axios from "axios";

import { uid } from "@utils/id";

import type { Document } from "@lib/get-document";
import type { CancelTokenSource } from "axios";

const initialBlock = {
  id: uid(),
  html: "",
  tag: "h1",
};

const Page: React.FC<{ data: Document }> = ({ data }) => {
  const [blocks, setBlocks] = useStateCallback<typeof initialBlock[]>(
    data?.blocks?.length
      ? (data.blocks as typeof initialBlock[])
      : [initialBlock]
  );

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
    },
    [data._id, cancelToken]
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
        (aux[0] as HTMLElement)?.focus();
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
        const aux = blocksElements[currentIndex + 1].childNodes || [];
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
            const aux = blocksElements[currentIndex - 1].childNodes || [];
            (aux[0] as HTMLElement)?.focus();
          }
        );
      }
    },
    [blocks, setBlocks]
  );

  return (
    <MainLayout>
      <div ref={blocksContainerRef}>
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

export default Page;
