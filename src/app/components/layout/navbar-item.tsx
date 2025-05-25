import Link from "next/link";
import React from "react";

interface NavItemProps {
  children: string;
  href: string;
  selected: boolean;
  className?: string;
}

export default function NavItem({ href, children, selected, className }: NavItemProps) {
  return (
    <Link
      className={`py-4 px-4 font-medium ${selected ? "selected" : ""
        } navbar-item align-middle mx-1 overflow-clip whitespace-nowrap text-center navbar-item ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}
