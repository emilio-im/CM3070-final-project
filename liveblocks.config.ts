import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

import type { BaseUserMeta } from "@liveblocks/client";

const client = createClient({
  publicApiKey:
    process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY! ||
    "pk_live_xg8p7s0qyryHwQ5pqmVls_TL",
});

type Presence = {
  cursor: {
    x: number;
    y: number;
  } | null;
  message: string;
};

type Storage = {
  // animals: LiveList<string>,
  // ...
};

type UserMeta = BaseUserMeta;

type RoomEvent = {
  x: number;
  y: number;
  value: string;
};

export const {
  RoomProvider,
  useOthers,
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
