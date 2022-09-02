import DropdownSeparator from "./dropdown-separator";
import * as Popover from "@radix-ui/react-popover";
import DropdownButton from "./dropdown-button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { useSession, signIn, signOut } from "next-auth/react";

const Auth: React.FC<unknown> = () => {
  const { data: session, status } = useSession();
  const { image, picture, name } = session?.user || {};

  const isLoggedIn = React.useMemo(() => status === "authenticated", [status]);

  const profileSrc = React.useMemo(
    () =>
      image ||
      picture ||
      `https://avatar.tobi.sh/${name}` ||
      "https://avatar.tobi.sh/logged-out",
    [image, name, picture]
  );

  return (
    <div className="ml-auto">
      <Popover.Root>
        <Popover.Trigger className="rounded-full overflow-hidden">
          <Image
            src={profileSrc}
            alt={session?.user?.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
            placeholder="blur"
            layout="fixed"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
          />
        </Popover.Trigger>

        <Popover.Content
          align="end"
          alignOffset={-15}
          className="bg-white rounded-md shadow-md py-2 z-50 flex flex-col"
        >
          <Popover.Arrow className="fill-white" />
          {isLoggedIn ? (
            <>
              <Link href="/" passHref>
                <DropdownButton>Home</DropdownButton>
              </Link>

              <Link href="/profile" passHref>
                <DropdownButton>Profile</DropdownButton>
              </Link>

              <DropdownSeparator />

              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/documents/new">
                <DropdownButton>New Document</DropdownButton>
              </a>

              <DropdownSeparator />

              <Link href="/workspaces/new" passHref>
                <DropdownButton>New Workspace</DropdownButton>
              </Link>

              <DropdownSeparator />

              <DropdownButton aria-disabled disabled>
                (Soon) Settings
              </DropdownButton>

              <DropdownButton onClick={() => signOut()}>Log Out</DropdownButton>
            </>
          ) : (
            <>
              <DropdownButton
                onClick={() => signIn("github", { callbackUrl: `/profile` })}
              >
                Log In with Github
              </DropdownButton>

              <DropdownButton
                onClick={() =>
                  signIn("credentials", {
                    email: "jsmith@example.com",
                    password: "123123",
                    callbackUrl: `/profile`,
                  })
                }
              >
                Log In (mock account)
              </DropdownButton>

              <DropdownButton aria-disabled disabled>
                (Soon) Log In with email
              </DropdownButton>
            </>
          )}
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

const Navbar: React.FC<unknown> = () => (
  <nav
    className="py-4 mx-auto max-w-2xl w-full px-4 md:px-0 flex"
    aria-label="Navbar"
  >
    <Auth />
  </nav>
);

export default Navbar;
