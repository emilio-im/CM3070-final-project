import useStateCallback from "@hooks/set-callback-state";
import EditableBlock from "@components/editable-block";
import React from "react";

import { uid } from "@utils/id";

const initialBlock = {
  id: uid(),
  html: "",
  tag: "h1",
};

const EditorPage = () => {
  const [blocks, setBlocks] = useStateCallback<typeof initialBlock[]>([
    initialBlock,
  ]);

  const blocksContainerRef = React.useRef<HTMLDivElement>(null);

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
    },
    [setBlocks, blocks]
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
  );
};

export default EditorPage;
