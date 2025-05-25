"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./logout-button";
import NavItem from "./navbar-item";
import { useUserInfo } from "../../(main)/user-info-provider";

type PageItem = { path: string; label: string };

const pages: PageItem[] = [
  { path: "/documents", label: "Документы" },
  { path: "/title-pages", label: "Титульники" },
  { path: "/templates", label: "LaTex шаблоны" }
];

export default function Navbar() {
  const { username } = useUserInfo();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  return (
    <div className="bg-gray-800 shadow-gray-800/20 w-full px-5 py-2">
      <div className="flex justify-between sm:hidden px-4 text-white">
        <div className="text-base uppercase font-trajan">
        </div>
        <div className="hover:cursor-pointer" onClick={() => setShow(!show)}>
          <FontAwesomeIcon width={19} height={15} icon={faBars} />
        </div>
      </div>
      <div className={`flex w-full max-sm:${show ? "block" : "hidden"} items-center container py-`}>
        <nav className="grow flex list-none max-sm:flex-col items-center">
          <div className="text-3xl font-bold text-white mr-10">
            <Link href="/dashboard">MD2PDF</Link>
          </div>
          {pages.map((page, i) => (
            <NavItem className="grow-0" key={i} selected={page.path === pathname} href={page.path}>
              {page.label}
            </NavItem>
          ))}
        </nav>
        {username && (<><div className="text-white font-bold">Добро пожаловать, {username}!</div><LogoutButton className="ml-4 navbar-item h-full px-2 py-4" /></>)}
      </div>
    </div>
  );
}
