"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./logout-button";
import NavItem from "./navbar-item";

type PageItem = { path: string; label: string };

const pages: PageItem[] = [
  { path: "/documents", label: "Документы" },
  { path: "/title-pages", label: "Титульники" },
  { path: "/templates", label: "LaTex шаблоны" }
];

export default function Navbar({ username }: { username?: string | undefined }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  return (
    <div className="container mx-auto">
      <div className="flex justify-between sm:hidden px-4 text-white">
        <div className="text-base uppercase font-trajan">
          <Link href="/">MD2PDF</Link>
        </div>
        <div className="hover:cursor-pointer" onClick={() => setShow(!show)}>
          <FontAwesomeIcon width={19} height={15} icon={faBars} />
        </div>
      </div>
      <div className={`flex max-sm:${show ? "block" : "hidden"}`}>
        <div className="flex"></div>
        <nav className="grow flex list-none max-sm:flex-col items-center">
          <div className="text-3xl font-bold text-white mr-10">MD2PDF</div>
          {pages.map((page, i) => (
            <NavItem className="flex-grow-0" key={i} selected={page.path === pathname} href={page.path}>
              {page.label}
            </NavItem>
          ))}
        </nav>
        {username && <div className="px-6 py-4 align-middle text-white">{username}</div>}
        {username && <LogoutButton className="px-4 py-4 navbar-item" />}
      </div>
    </div>
  );
}
