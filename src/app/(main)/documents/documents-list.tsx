"use client"

import { useEffect, useState } from "react";
import DocumentItem from "./document-item";
import useDocumentCreationModal from "./create-document-modal";
import Link from "next/link";

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
  useEffect(() => {
    fetch("/api/documents").then((r) => r.json()).then(r => { console.log(r); setDocuments(r) })
  }, [isOpen])

  return (
    <div className={`grid grid-cols-[repeat(auto-fit,9.75rem)] gap-x-4 pt-5 ${className}`}>
      {documents.map((doc, i) => (
        <Link className="w-fit" key={i} href={`/documents/${doc.id}`}><DocumentItem document={doc} /></Link>
      ))}
      <button className="w-40 flex-col h-56.5 px-4 flex items-center justify-center hover:bg-slate-300 bg-slate-200" onClick={openModal}>Новый документ</button>
      {Modal}
    </div>
  );
}
