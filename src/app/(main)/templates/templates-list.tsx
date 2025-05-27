"use client"

import { useCallback, useEffect, useState } from "react";
import LatexTemplateItem from "./template-item";
import useTemplateModal from "./template-modal";
import { TemplateDTO } from "../../api/templates/route";
import useConfirmModal from "../../common/modal/confirm-modal";
import DeleteTemlpate from "../../api/templates/delete";

export default function TemplatesList({ className }: { className?: string; }) {
  const { Modal, openModal, isOpen } = useTemplateModal();
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [trigger, setTrigger] = useState(false);
  const { openModal: openConfirmModal, Modal: ConfirmModal } = useConfirmModal()

  useEffect(() => {
    fetch("/api/templates").then((r) => r.json()).then(r => { console.log(r); setTemplates(r as TemplateDTO[]) }).catch(console.error)
  }, [isOpen, trigger])

  const handleDelete = useCallback(async (templateId: string, templateName: string) => {
    const r = await openConfirmModal(`Уверены что хотите удалить шаблон "${templateName}"?`)
    if (!r) return;
    await DeleteTemlpate(templateId)
    setTrigger(v => !v)
  }, [])

  return (
    <div className={`grid *:w-80 grid-cols-[repeat(auto-fit,20rem)] gap-x-12 gap-y-8 pt-5 ${className}`}>
      {templates.map((doc, i) => (
        <LatexTemplateItem key={i} onDelete={() => { handleDelete(doc.id, doc.name).catch(console.error) }} template={doc} />
      ))}
      <button className="flex-col aspect-[1/1.414] px-4 flex items-center justify-center hover:bg-slate-300 bg-slate-200" onClick={openModal}>Загрузить шаблон</button>
      {Modal}
      {ConfirmModal}
    </div>
  );
}
