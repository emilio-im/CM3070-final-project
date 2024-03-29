import React from "react";

const DropdownButton = React.forwardRef(
  (
    {
      children,
      ...props
    }: React.HTMLAttributes<HTMLButtonElement> & { disabled?: boolean },
    ref: any
  ) => (
    <button
      {...props}
      ref={ref}
      className={[
        "transition-all font-sans",
        "w-56 py-2 px-4 md:px-6",
        "hover:bg-gray-50 hover:border-gray-100",
        "text-sm text-left text-gray-600 hover:text-gray-900",
        "disabled:text-gray-300 disabled:hover:bg-gray-50 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      {children}
    </button>
  )
);

DropdownButton.displayName = "NAVBAR_DROPDOWN_BUTTON";

export default DropdownButton;
