"use client";

import { LoadingIcon } from "@repo/ui/icons";

export default function PageLoadingComponent() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <LoadingIcon />
    </div>
  );
}
