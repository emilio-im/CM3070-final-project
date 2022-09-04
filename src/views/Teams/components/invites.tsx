import Input from "@components/input";
import React from "react";

type Props = {
  onChange: (invites: string[]) => void;
};

const Invites: React.FC<Props> = ({ onChange }) => {
  const [emails, setEmails] = React.useState<string[]>([]);
  const [isAddingNew, setIsAddingNew] = React.useState(true);
  const [newEmailValue, setNewEmailValue] = React.useState("");

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewEmailValue(event.target.value);
    },
    []
  );

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setEmails([...emails, newEmailValue]);
      setNewEmailValue("");
      setIsAddingNew(false);
    },
    [emails, setEmails, newEmailValue, setNewEmailValue, setIsAddingNew]
  );

  const handleRemoveEmail = React.useCallback(
    (email: string) => setEmails((prev) => prev.filter((e) => e !== email)),
    [setEmails]
  );

  React.useEffect(() => {
    if (onChange) onChange(emails);
  }, [emails, onChange]);

  return (
    <div className="w-full">
      {emails.length ? (
        <div className="my-4 px-4">
          <h3 className="text-lg font-sans font-semibold">Invites to send:</h3>

          {emails.map((email) => (
            <div
              key={`invite-${email}`}
              className="flex py-2 border-b border-b-gray-100"
            >
              <span className="flex-1">{email}</span>
              <button
                className={"text-md font-sans text-gray-500"}
                onClick={() => handleRemoveEmail(email)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {isAddingNew ? (
        <div>
          <h3 className="text-lg font-sans font-semibold px-4">
            Invite a new team member:
          </h3>
          <form onSubmit={handleSubmit} className="flex w-full gap-2 my-2">
            <div className="flex-1">
              <Input
                id="email"
                label="Email"
                onChange={handleChange}
                value={newEmailValue}
                placeholder={"new@member.com"}
                type="email"
              />
            </div>

            <div className="flex">
              <input
                type="submit"
                value="Add"
                disabled={!newEmailValue}
                className="disabled:cursor-not-allowed disabled:opacity-50 font-sans text-md cursor-pointer mt-5"
              />
            </div>
          </form>
        </div>
      ) : (
        <div className="flex px-4">
          <button
            onClick={() => setIsAddingNew(true)}
            className="ml-auto font-sans text-md text-gray-500"
          >
            Add member
          </button>
        </div>
      )}
    </div>
  );
};

export default Invites;
