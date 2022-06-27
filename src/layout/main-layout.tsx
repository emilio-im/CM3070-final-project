import React from "react";

import type { FC } from "react";

const MainLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <div className="w-full flex flex-col">
    <div className="py-4 mx-auto max-w-2xl w-full px-4 md:px-0">
      <h1>CM3070</h1>
    </div>

    <div className="max-w-2xl w-full px-4 md:px-0 mx-auto">{children}</div>
  </div>
);

export default MainLayout;
