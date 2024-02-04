"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavItem from "./navbar-item";

type PageItem = { path: string; label: string };

const pages: PageItem[] = [
  { path: "/", label: "Главная" },
  { path: "/documents", label: "Документы" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  return (
    <div className="bg-soft-brown">
      <div className="container mx-auto">
        <div className="flex justify-between sm:hidden px-4 text-white">
          <div className="text-base uppercase font-trajan">Alex flora</div>
          <div className="hover:cursor-pointer" onClick={() => setShow(!show)}>
            <FontAwesomeIcon width={19} height={15} icon={faBars} />
          </div>
        </div>
        <div className={`max-sm:${show ? "block" : "hidden"}`}>
          <nav className="flex list-none max-sm:flex-col items-center">
            <div className="text-3xl font-bold text-white mr-10">MD2PDF</div>
            {pages.map((page, i) => (
              <NavItem className="flex-grow-0" key={i} selected={page.path === pathname} href={page.path}>
                {page.label}
              </NavItem>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
