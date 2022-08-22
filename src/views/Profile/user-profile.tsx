import React from "react";

import MainLayout from "@layout/main-layout";
import Link from "next/link";

import type { EnhancedDocument } from "@lib/get-all-user-documents";

type Props = {
  documents: EnhancedDocument[];
};

const Page: React.FC<Props> = ({ documents }) => {
  const documentsGroupedByWorkspace = React.useMemo(
    () =>
      documents.reduce((previous, current) => {
        const { workspace } = current;
        const element = previous.find((p) => p.id === workspace.id);

        if (element) {
          element.documents.push(current);
          return previous;
        }

        return [...previous, { ...workspace, documents: [current] }];
      }, [] as (EnhancedDocument["workspace"] & { documents: EnhancedDocument[] })[]),
    [documents]
  );

  return (
    <MainLayout>
      <div>
        <h1 className="text-lg font-bold font-sans">Your documents</h1>
      </div>

      {documentsGroupedByWorkspace.map((workspace) => (
        <div key={`workspace-item-${workspace.id}`}>
          <h2>{workspace.name}</h2>

          <ul className="my-2">
            {workspace.documents.map((document) => (
              <Link
                key={document._id}
                href={`/documents/${document._id}`}
                passHref
              >
                <a>
                  <li className="text-sm font-sans my-2 list-disc">
                    {(document.blocks as Record<string, string>[])?.[0]?.html ||
                      "New Document"}
                  </li>
                </a>
              </Link>
            ))}
          </ul>
        </div>
      ))}
    </MainLayout>
  );
};

export default Page;
