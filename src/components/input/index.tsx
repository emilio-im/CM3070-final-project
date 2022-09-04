import React from "react";

type Props = { label?: string } & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = ({ label, ...props }) => (
  <div className="flex flex-col">
    {label ? (
      <label htmlFor={props.id} className="text-sm text-gray-500 mb-1 pl-4">
        {label}
      </label>
    ) : null}

    <input
      {...props}
      className="font-sans rounded-lg px-4 py-2 focus:bg-gray-100 outline-none hover:bg-gray-50"
    />
  </div>
);

export default Input;
