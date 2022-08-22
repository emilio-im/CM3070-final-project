import MainLayout from "@layout/main-layout";
import React from "react";
import axios from "axios";
import Input from "@components/input";
import Invites from "./components/invites";

const Page = () => {
  const [value, setValue] = React.useState<string>("Personal Workspace");
  const [emails, setEmails] = React.useState<string[]>([]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    []
  );

  const handleSubmit = React.useCallback(async () => {
    await axios.post(`/api/workspaces`, {
      name: value,
      members: emails,
    });
  }, [value, emails]);

  return (
    <MainLayout>
      <div>
        <h1 className="font-sans text-xl font-bold">Create new Workspace</h1>
        <p className="font-sans text-sm">
          Workspaces are useful to separate your work into spaces. You can also
          invite team members to each workspace and collaborate easily.
        </p>
      </div>

      <div className="w-full">
        <Input
          onChange={handleChange}
          value={value}
          placeholder={"My Personal Workspace"}
        />

        <input
          onChange={handleChange}
          value={value}
          placeholder={"My Personal Workspace"}
        />

        <Invites onChange={setEmails} />

        <button type="button" onClick={handleSubmit}>
          Create
        </button>
      </div>
    </MainLayout>
  );
};

export default Page;
