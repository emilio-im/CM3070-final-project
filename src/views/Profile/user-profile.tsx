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
      <div className="mb-4">
        <h1 className="text-xl font-bold font-sans">Your documents</h1>
      </div>

      {documentsGroupedByWorkspace?.length > 0 ? (
        documentsGroupedByWorkspace.map((workspace) => (
          <div key={`workspace-item-${workspace.id}`}>
            <h2 className="font-sans font-bold text-lg">{workspace.name}</h2>

            <ul className="my-2 px-4">
              {workspace.documents.map((document) => (
                <Link
                  key={document._id}
                  href={`/documents/${document._id}`}
                  passHref
                >
                  <a>
                    <li className="text-sm font-sans my-2 list-disc">
                      {(document.blocks as Record<string, string>[])?.[0]
                        ?.html || "New Document"}
                    </li>
                  </a>
                </Link>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div>
          <p className="font-sans text-sm">
            You don&apos;t have documents. Start{" "}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/documents/new" className="text-blue-600 font-sans">
              creating one
            </a>
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default Page;
