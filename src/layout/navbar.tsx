import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  return (
    <nav
      className="py-4 mx-auto max-w-2xl w-full px-4 md:px-0"
      aria-label="Navbar"
    >
      {status !== "loading" &&
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
        ))}
    </nav>
  );
};

export default Navbar;
