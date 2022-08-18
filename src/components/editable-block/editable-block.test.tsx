import "@testing-library/jest-dom";
import EditableBlock from ".";

import { fireEvent, render, screen } from "@testing-library/react";
import { uid } from "@utils/id";

describe("Calculator", () => {
  it("renders a calculator", () => {
    const props = {
      id: uid(),
      tag: "h1",
      html: "Hello this is content",
      onChange: console.log,
      addBlock: () => null,
      deleteBlock: () => null,
    };

    const generatedId = `block-${props.tag}-${props.id}`;

    render(<EditableBlock {...props} />);
    expect(screen.getByTestId(generatedId)).toBeInTheDocument();
  });
});
