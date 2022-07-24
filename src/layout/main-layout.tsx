import React from "react";
import Navbar from "./navbar";

import type { FC } from "react";

const MainLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <div className="w-full flex flex-col">
    <Navbar />

    <div className="max-w-2xl w-full px-4 md:px-0 mx-auto">{children}</div>
  </div>
);

export default MainLayout;
