import React from "react";

const allowedTags = [
  {
    id: "page-title",
    tag: "h1",
    label: "Heading 1",
  },
  {
    id: "heading",
    tag: "h2",
    label: "Heading 2",
  },
  {
    id: "subheading",
    tag: "h3",
    label: "Heading 3",
  },
  {
    id: "paragraph",
    tag: "p",
    label: "Body",
  },
];

const ItemsMenu = ({ ...props }: any) => {
  const [items] = React.useState(allowedTags);
  const [selectedItem, setSelectedItem] = React.useState(0);
  const [command, setCommand] = React.useState("");

  const keyDownHandler = React.useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          props.onSelect(items[selectedItem].tag);
          break;
        case "Backspace":
          if (!command) props.close();
          setCommand(command.substring(0, command.length - 1));
          break;
        case "ArrowUp":
          event.preventDefault();
          const prevSelected =
            selectedItem === 0 ? items.length - 1 : selectedItem - 1;
          setSelectedItem(prevSelected);
          break;
        case "ArrowDown":
        case "Tab":
          event.preventDefault();
          const nextSelected =
            selectedItem === items.length - 1 ? 0 : selectedItem + 1;
          setSelectedItem(nextSelected);
          break;
        default:
          setCommand(command + event.key);
          break;
      }
    },
    [props, command, selectedItem, setCommand, setSelectedItem, items]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [keyDownHandler]);

  const x = props.position.x;
  const y = props.position.y - 150;
  const positionAttributes = { top: y, left: x };

  return (
    <div
      className="absolute bg-gray-100 rounded-lg w-28"
      style={positionAttributes}
    >
      <div>
        {items.map((item, key) => {
          const isSelected = items.indexOf(item) === selectedItem;

          return (
            <div
              className={[
                isSelected
                  ? "bg-gray-200 cursor-not-allowed"
                  : "cursor-pointer",
                "hover:bg-gray-50",
                "px-4 py-2",
                "text-sm",
              ].join(" ")}
              key={key}
              role="button"
              tabIndex={0}
              onClick={() => props.onSelect(item.tag)}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemsMenu;
