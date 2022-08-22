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

  React.useEffect(() => {
    if (onChange) onChange(emails);
  }, [emails, onChange]);

  return (
    <div className="w-full">
      {emails.map((email) => (
        <button key={`invite-${email}`} className={"w-full"}>
          <span>{email}</span>
        </button>
      ))}

      {isAddingNew ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <Input
            id="email"
            onChange={handleChange}
            value={newEmailValue}
            placeholder={"new@member.com"}
            type="email"
          />
          <input type="submit" value="Add" />
        </form>
      ) : (
        <button onClick={() => setIsAddingNew(true)}>Add member</button>
      )}
    </div>
  );
};

export default Invites;
