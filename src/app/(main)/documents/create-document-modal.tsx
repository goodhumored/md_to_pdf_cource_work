"use client"

import { useModal } from "../../common/modal/modal";
import React, { useEffect, useState } from "react";
import handleCreateDocument from "./handle-create-document";
import useTemplateModal from "../templates/template-modal";
import useFormStateWithToast from "../../common/useFormStateWithToast";

type TitlePage = { name: string, id: number };

export default function useDocumentCreationModal() {
  const { Modal, closeModal, ...rest } = useModal();
  const { Modal: TemplateModal, openModal: openTemplateModal, isOpen: isTemplateModalOpen } = useTemplateModal();
  const [formAction, state] = useFormStateWithToast(handleCreateDocument);

  const [titlePages, setTitlePages] = useState<TitlePage[]>([]);
  useEffect(() => {
    fetch("/api/title-pages").then((r) => r.json()).then(r => { console.log(r); setTitlePages(r) })
  }, [isTemplateModalOpen])

  useEffect(() => { if (state?.message && state.ok) closeModal() }, [state])

  const CreateDocumentModal = (
    <>
      <Modal
        className="rounded-xs"
        header="Создать документ"
      >
        <form className="min-w-sm" action={formAction}>
          <input
            className="border border-slate-500/20 mt-2 text-gray-600 text-base bg-slate-200/50 py-2.5 px-4 rounded-xs w-full"
            name="name"
            required
            placeholder="Название документа"
          />
          <div className="w-full mt-4">
            <label htmlFor="title">Титульный лист:</label>
            <div className="flex w-full mt-2">
              <select className=" border border-slate-500/20 grow-1 bg-slate-100 px-4 py-2.5" name="title" id="title">
                <option value="undefined">&lt;Без титульного листа&gt;</option>
                {titlePages.map(t => (<option key={t.id} value={t.id.toString()}>{t.name}</option>))}
              </select>
              <button className="bg-slate-500 py-1 px-4 rounded-xs  ml-2 font-semibold text-white" onClick={openTemplateModal}>+</button>
            </div>
          </div>
          <div className="flex items-center justify-end mt-4 space-x-2 text-sm">
            <button type="button" onClick={closeModal} className="bg-slate-300 py-2 px-8 rounded-xs text-black/80">Отмена</button>
            <button type="submit" className="bg-slate-700 py-2 px-8 rounded-xs text-white">Создать</button>
          </div>
        </form>
      </Modal>
      {TemplateModal}
    </>
  )
  return { Modal: CreateDocumentModal, closeModal, ...rest }
}
