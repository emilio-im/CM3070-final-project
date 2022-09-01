import Link from "next/link";
import MainLayout from "@layout/main-layout";

import type { EnhancedDocument } from "@lib/get-all-user-documents";

type Props = {
  documents: EnhancedDocument[];
};

const Page: React.FC<Props> = ({ documents }) => (
  <MainLayout>
    <div className="mb-4">
      <h1 className="font-sans font-bold text-xl">Latest documents</h1>
    </div>

    {documents?.length > 0 ? (
      documents.map((document) => (
        <div key={`document-preview-${document._id}`}>
          <Link key={document._id} href={`/documents/${document._id}`} passHref>
            <a>
              <li className="text-sm font-sans my-2 list-disc">
                {(document.blocks as Record<string, string>[])?.[0]?.html ||
                  "New Document"}
              </li>
            </a>
          </Link>
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

export default Page;
