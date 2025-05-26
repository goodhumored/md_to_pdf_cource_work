"use client"

import { useEffect, useState } from "react";
import LatexTemplateItem from "./template-item";
import useTemplateModal from "./template-modal";
import { TemplateDTO } from "../../api/templates/route";

export default function TemplatesList({ className }: { className?: string; }) {
  const { Modal, openModal, isOpen } = useTemplateModal();
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  useEffect(() => {
    fetch("/api/templates").then((r) => r.json()).then(r => { console.log(r); setTemplates(r as TemplateDTO[]) }).catch(console.error)
  }, [isOpen])
  return (
    <div className={`grid grid-cols-[repeat(auto-fit,9.75rem)] gap-x-4 gap-y-2 pt-5 ${className}`}>
      {templates.map((doc, i) => (
        <LatexTemplateItem key={i} template={doc} />
      ))}
      <button className="w-40 flex-col aspect-[1/1.414] px-4 flex items-center justify-center hover:bg-slate-300 bg-slate-200" onClick={openModal}>Загрузить шаблон</button>
      {Modal}
    </div>
  );
}
