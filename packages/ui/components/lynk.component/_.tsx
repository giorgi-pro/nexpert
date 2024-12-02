"use client";

import { forwardRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "../../helpers";

const ROOT_PATHNAME = "/";

type LynkProps = {
  to: string;
  isActive?: (pathname: string) => boolean;
  activeClassName?: string | false;
  className?: string;
  children: ReactNode;
};

const Lynk = forwardRef<HTMLAnchorElement, LynkProps>(
  function Lynk(props, ref) {
    const { to, className, activeClassName, children, isActive } = props;
    const locationPathname = usePathname();

    const isLinkActive =
      isActive?.(locationPathname) ||
      (locationPathname === to && locationPathname === ROOT_PATHNAME) ||
      (to !== ROOT_PATHNAME && locationPathname.startsWith(`${to}`));

    return (
      <Link
        {...{ ref }}
        href={to}
        passHref
        className={clsx(className, isLinkActive && activeClassName)}
      >
        {children}
      </Link>
    );
  }
);

export default Lynk;
