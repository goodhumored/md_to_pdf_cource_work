"use client"

import { useCallback, useEffect, useState } from "react";
import { TitlePageDTO } from "../../api/title-pages/route";
import TitlePageItem from "./title-page-item";
import useTitlePageModal from "./title-page-modal";
import useConfirmModal from "../../common/modal/confirm-modal";
import DeleteTitlePage from "../../api/title-pages/delete";

export default function TitlePageList({ className }: { className?: string; }) {
  const { Modal, openModal, isOpen } = useTitlePageModal()
  const [titles, setTitles] = useState<TitlePageDTO[]>([]);
  const [trigger, setTrigger] = useState(false);
  const { openModal: openConfirmModal, Modal: ConfirmModal } = useConfirmModal()

  useEffect(() => {
    fetch("/api/title-pages").then((r) => r.json()).then(r => { console.log(r); setTitles(r as TitlePageDTO[]) }).catch(console.error)
  }, [isOpen, trigger])

  const handleDelete = useCallback(async (titlePageId: string, titlePageName: string) => {
    const r = await openConfirmModal(`Уверены что хотите удалить титульный лист "${titlePageName}"?`)
    if (!r) return;
    await DeleteTitlePage(titlePageId)
    setTrigger(v => !v)
  }, [])

  return (
    <div className={`grid grid-cols-[repeat(auto-fit,20rem)] gap-x-12 gap-y-8 pt-5 ${className}`}>
      {titles.map((doc, i) => (
        <TitlePageItem key={i} onDelete={() => { handleDelete(doc.id, doc.name).catch(console.error) }} titlePage={doc} />
      ))}
      <button className="flex-col aspect-[1/1.414] px-4 flex items-center justify-center hover:bg-slate-300 bg-slate-200" onClick={openModal}>Загрузить титульник</button>
      {Modal}
      {ConfirmModal}
    </div>
  );
}
