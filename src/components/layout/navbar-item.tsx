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
      className={`px-6 py-4 ${
        selected ? "selected" : ""
      } navbar-item align-middle mx-1 overflow-clip whitespace-nowrap text-center navbar-item ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}
