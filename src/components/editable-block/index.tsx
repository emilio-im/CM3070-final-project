import React from "react";
import ItemsMenu from "@components/items-menu";
import ContentEditable from "react-contenteditable";

import { getCaretCoordinates } from "@utils/index";

import type { ContentEditableEvent } from "react-contenteditable";

type PropsWithRef = {
  ref: React.RefObject<HTMLElement>;
  id: string;
};

type Props = {
  id: string;
  tag: string;
  html: string;
  onChange: (props: { id: string; html: string; tag: string }) => void;
  addBlock: (props: PropsWithRef) => void;
  deleteBlock: (props: PropsWithRef) => void;
};

const styles = {
  h1: "text-xl font-bold",
  h2: "text-lg font-semibold",
  h3: "text-lg",
  p: "text-sm",
};

const EditableBlock = ({ ...props }: Props) => {
  const [html, setHtml] = React.useState<string>(props.html || "");
  const [previousHtml, setPreviousHtml] = React.useState<string>("");
  const [tag, setTag] = React.useState<string>(props.tag);
  const [previousKey, setPreviousKey] = React.useState<string | null>(null);
  const [isSelectMenuOpen, setIsSelectMenuOpen] =
    React.useState<boolean>(false);

  const [selectMenuPosition, setSelectMenuPosition] = React.useState({
    x: 0,
    y: 0,
  });

  const ref = React.createRef<HTMLElement>();
  const isEmpty = React.useMemo(() => !html, [html]);

  const onChange = React.useCallback(
    (event: ContentEditableEvent) => {
      setHtml(event.target.value);
    },
    [setHtml]
  );

  React.useEffect(() => {
    if (props.html !== html || props.tag !== tag) {
      props.onChange({ id: props.id, html, tag });
    }
  }, [html, tag, props, ref]);

  const onKeyDownHandler = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "/") {
        setPreviousHtml(html);
      }

      if (
        event.key === "Enter" &&
        previousKey !== "Shift" &&
        !isSelectMenuOpen
      ) {
        event.preventDefault();
        props.addBlock({
          id: props.id,
          ref,
        });
      }

      if (event.key === "Backspace" && isEmpty) {
        event.preventDefault();
        props.deleteBlock({
          id: props.id,
          ref,
        });
      }

      setPreviousKey(event.key);
    },
    [
      previousKey,
      setPreviousKey,
      props,
      ref,
      isEmpty,
      html,
      setPreviousHtml,
      isSelectMenuOpen,
    ]
  );

  const closeSelectMenuHandler = React.useCallback(() => {
    setIsSelectMenuOpen(false);
    setPreviousHtml("");
    setSelectMenuPosition({ x: 0, y: 0 });

    document.removeEventListener("click", closeSelectMenuHandler);
  }, []);

  const tagSelectionHandler = (tag: string) => {
    setTag(tag);
    setHtml(previousHtml);
    closeSelectMenuHandler();
    ref.current?.focus();
  };

  const openSelectMenuHandler = React.useCallback(() => {
    const { x, y } = getCaretCoordinates();
    setSelectMenuPosition({ x, y });
    setIsSelectMenuOpen(true);

    document.addEventListener("click", closeSelectMenuHandler);
  }, [closeSelectMenuHandler]);

  const keyUpHandler = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "/") openSelectMenuHandler();
    },
    [openSelectMenuHandler]
  );

  return (
    <div className="relative">
      {isSelectMenuOpen ? (
        <ItemsMenu
          position={selectMenuPosition}
          onSelect={tagSelectionHandler}
          close={closeSelectMenuHandler}
        />
      ) : null}

      <ContentEditable
        className={[
          "rounded-lg px-4 py-2 my-2",
          "border border-transparent focus:border-gray-200",
          "focus:bg-gray-100 outline-none hover:bg-gray-50",
          styles[tag as keyof typeof styles] || "",
        ].join(" ")}
        innerRef={ref}
        html={html}
        tagName={tag}
        onChange={onChange}
        onKeyDown={onKeyDownHandler}
        onKeyUp={keyUpHandler}
      />
    </div>
  );
};

export default EditableBlock;
