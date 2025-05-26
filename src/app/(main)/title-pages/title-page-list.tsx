"use client"

import { useEffect, useState } from "react";
import { TitlePageDTO } from "../../api/title-pages/route";
import TitlePageItem from "./title-page-item";
import useTitlePageModal from "./title-page-modal";

export default function TitlePageList({ className }: { className?: string; }) {
  const { Modal, openModal, isOpen } = useTitlePageModal()
  const [titles, setTitles] = useState<TitlePageDTO[]>([]);
  useEffect(() => {
    fetch("/api/title-pages").then((r) => r.json()).then(r => { console.log(r); setTitles(r as TitlePageDTO[]) }).catch(console.error)
  }, [isOpen])
  return (
    <div className={`grid grid-cols-[repeat(auto-fit,9.75rem)] gap-x-4 gap-y-2 pt-5 ${className}`}>
      {titles.map((doc, i) => (
        <TitlePageItem key={i} titlePage={doc} />
      ))}
      <button className="w-40 flex-col aspect-[1/1.414] px-4 flex items-center justify-center hover:bg-slate-300 bg-slate-200" onClick={openModal}>Загрузить титульник</button>
      {Modal}
    </div>
  );
}
