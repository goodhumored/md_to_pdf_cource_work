"use client"

import { useCallback, useEffect, useState } from "react";
import DocumentItem from "./document-item";
import useDocumentCreationModal from "./create-document-modal";
import Link from "next/link";
import DeleteDocument from "../../api/documents/delete";
import useConfirmModal from "../../common/modal/confirm-modal";

export type Doc = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail: string;
}

export default function DocumentsList({ className, }: { className?: string; }) {
  const { Modal, openModal, isOpen } = useDocumentCreationModal();
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [trigger, setTrigger] = useState(false);
  const { openModal: openConfirmModal, Modal: ConfirmModal } = useConfirmModal()
  useEffect(() => {
    fetch("/api/documents").then((r) => r.json()).then(r => { console.log(r); setDocuments(r as Doc[]) }).catch(console.error)
  }, [isOpen, trigger])
  const handleDelete = useCallback(async (docId: string, docName: string) => {
    const r = await openConfirmModal(`Уверены что хотите удалить документ "${docName}"?`)
    if (!r) return;
    await DeleteDocument(docId)
    setTrigger(v => !v)
  }, [])

  return (
    <div className={`grid grid-cols-[repeat(auto-fit,20rem)] gap-x-12 gap-y-8 pt-5 ${className}`}>
      {documents.map((doc, i) => (
        <Link className="" key={i} href={`/documents/${doc.id}`}><DocumentItem onDelete={() => { handleDelete(doc.id, doc.name).catch(console.error) }} document={doc} /></Link>
      ))}
      <button className="flex-col aspect-[1/1.414] px-4 flex items-center justify-center hover:bg-slate-300 bg-slate-200" onClick={openModal}><span className="text-6xl mb-2">+</span><br />Новый документ</button>
      {Modal}
      {ConfirmModal}
    </div>
  );
}
