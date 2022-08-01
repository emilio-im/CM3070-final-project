import React from "react";

import type { Document } from "@lib/get-document";
import MainLayout from "@layout/main-layout";
import Link from "next/link";

type Props = {
  documents: Document[];
};

const Page: React.FC<Props> = ({ documents }) => {
  return (
    <MainLayout>
      <div>
        <h1>Your documents</h1>
      </div>

      <ul>
        {documents.map((document) => (
          <Link key={document._id} href={`/documents/${document._id}`} passHref>
            <a>
              <li>
                {(document.blocks as Record<string, string>[])?.[0].html ||
                  "New Document"}
              </li>
            </a>
          </Link>
        ))}
      </ul>
    </MainLayout>
  );
};

export default Page;