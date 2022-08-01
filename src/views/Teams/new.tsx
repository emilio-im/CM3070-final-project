import React from "react";
import axios from "axios";

const Page = () => {
  const [value, setValue] = React.useState<string>("Personal Workspace");

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    []
  );

  const handleSubmit = React.useCallback(async () => {
    await axios.post(`/api/workspaces`, {
      name: value,
    });
  }, [value]);

  return (
    <div>
      <input
        onChange={handleChange}
        value={value}
        placeholder={"My Personal Workspace"}
      />

      <button type="button" onClick={handleSubmit}>
        Create
      </button>
    </div>
  );
};

export default Page;