import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import DropdownButton from "./dropdown-button";
import { useRouter } from "next/router";
import DropdownSeparator from "./dropdown-separator";

const Auth: React.FC<unknown> = () => {
  const { data: session, status } = useSession();
  const { image, name } = session?.user || {};

  const isLoggedIn = React.useMemo(() => status === "authenticated", [status]);

  const profileSrc = React.useMemo(
    () =>
      image ||
      `https://avatar.tobi.sh/${name}` ||
      "https://avatar.tobi.sh/logged-out",
    [image, name]
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
              <Link href="/documents/new" passHref>
                <DropdownButton>New Document</DropdownButton>
              </Link>

              <DropdownSeparator />

              <Link href="/workspaces/new" passHref>
                <DropdownButton>New Workspace</DropdownButton>
              </Link>

              <DropdownSeparator />

              <Link href="/settings" passHref>
                <DropdownButton>Settings</DropdownButton>
              </Link>
              <DropdownButton onClick={() => signOut()}>Log Out</DropdownButton>
            </>
          ) : (
            <DropdownButton
              onClick={() => signIn("github", { callbackUrl: `/profile` })}
            >
              Log In with Github
            </DropdownButton>
          )}
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

const Navbar: React.FC<unknown> = () => {
  const [loading, setLoading] = useState(false);

  return (
    <nav
      className="py-4 mx-auto max-w-2xl w-full px-4 md:px-0 flex"
      aria-label="Navbar"
    >
      <Auth />
      {/* {status !== "loading" &&
        (session?.user ? (
          <Link href={`/${session.username}`}>
            <a className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={
                  session.user.image ||
                  `https://avatar.tobi.sh/${session.user.name}`
                }
                alt={session.user.name || "User"}
                width={300}
                height={300}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
              />
            </a>
          </Link>
        ) : (
          <button
            disabled={loading}
            onClick={() => {
              setLoading(true);
              signIn("github", { callbackUrl: `/profile` });
            }}
            className={`${
              loading
                ? "bg-gray-200 border-gray-300"
                : "bg-black hover:bg-white border-black"
            } w-36 h-8 py-1 text-white hover:text-black border rounded-md text-sm transition-all`}
          >
            {loading ? "Loading..." : "Log in with GitHub"}
          </button>
        ))} */}
    </nav>
  );
};

export default Navbar;
