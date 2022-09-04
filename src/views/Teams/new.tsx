import MainLayout from "@layout/main-layout";
import React from "react";
import axios from "axios";
import Input from "@components/input";
import Invites from "./components/invites";

import { useRouter } from "next/router";

const Page = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("Personal Workspace");
  const [emails, setEmails] = React.useState<string[]>([]);

  const router = useRouter();

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    []
  );

  const handleSubmit = React.useCallback(async () => {
    setIsLoading(true);
    await axios.post(`/api/workspaces`, {
      name: value,
      members: emails,
    });

    router.push("/profile");
    setIsLoading(false);
  }, [value, emails, router]);

  const isDisabled = React.useMemo(
    () => !value || isLoading,
    [value, isLoading]
  );

  return (
    <MainLayout>
      <div>
        <h1 className="font-sans text-xl font-bold">Create new Workspace</h1>
        <p className="font-sans text-sm">
          Workspaces are useful to separate your work into spaces. You can also
          invite team members to each workspace and collaborate easily.
        </p>
        <p className="font-sans text-sm">
          To create a workspace fill the form bellow and invite members using
          their emails.
        </p>
      </div>

      <div className="w-full mt-8">
        <div className="mb-4">
          <Input
            onChange={handleChange}
            value={value}
            label="Workspace name"
            placeholder={"My Personal Workspace"}
          />
        </div>

        <Invites onChange={setEmails} />

        <div className="ml-auto mt-8 mb-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="bg-gray-900 text-white font-bold font-sans px-5 py-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Create"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Page;
