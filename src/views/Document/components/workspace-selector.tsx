import * as Select from "@radix-ui/react-select";
import React from "react";
import axios from "axios";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

import type { Workspace } from "@lib/get-all-user-workspaces";

type Props = {
  workspaces: Workspace[];
  initialWorkspace: string;
  documentId: string;
};

const WorkspaceSelector: React.FC<Props> = ({
  workspaces,
  initialWorkspace,
  documentId,
}) => {
  const [workspace, setWorkspace] = React.useState<string>(initialWorkspace);

  const updateWorkspace = React.useCallback(
    async (newWorkspace: string) => {
      setWorkspace(newWorkspace);

      await axios.put(`/api/documents/${documentId}`, {
        workspace: newWorkspace,
      });
    },
    [documentId]
  );

  return (
    <div className="my-4 text-end">
      <Select.Root value={workspace} onValueChange={updateWorkspace}>
        <Select.Trigger className="hover:bg-slate-200 rounded-lg inline-flex justify-center items-center px-4 py-2 font-sans text-sm">
          <Select.Value />
          <Select.Icon className="pl-2">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="bg-white shadow-md overflow-hidden rounded-lg">
            <Select.ScrollUpButton className="flex justify-center items-center py-2">
              <ChevronUpIcon />
            </Select.ScrollUpButton>

            <Select.Viewport>
              {workspaces.map((workspace) => (
                <Select.Item
                  key={`workspace-item-${workspace._id}`}
                  value={workspace._id.toString()}
                  className="flex items-center h-8 px-6 py-2 select-none hover:bg-slate-100 outline-none font-sans text-sm"
                >
                  <Select.ItemText>{workspace.name}</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 w-6 justify-center items-center">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex justify-center items-center py-2">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default WorkspaceSelector;
