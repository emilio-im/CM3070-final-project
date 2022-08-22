import React from "react";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = ({ ...props }) => (
  <input {...props} className="hover:bg-red-900" />
);

export default Input;
