"use client"

import { useModal } from "../../common/modal/modal";
import React, { useEffect, useState } from "react";
import handleCreateDocument from "./handle-create-document";
import useTemplateModal from "../templates/template-modal";
import useFormStateWithToast from "../../common/useFormStateWithToast";
import useTitlePageModal from "../title-pages/title-page-modal";
import FileInput from "../../common/file-input";
import usePreviewModal from "../../common/modal/preview-modal";
import Image from "next/image"

type TitlePage = { name: string, id: string, thumbnail: string };
type Template = { name: string, id: string, thumbnail: string };

export default function useDocumentCreationModal() {
  const { Modal, closeModal, ...rest } = useModal();
  const { Modal: TitlePageModal, openModal: openTitlePageModal, isOpen: isTitlePageModalOpen } = useTitlePageModal();
  const { Modal: TemplateModal, openModal: openTemplateModal, isOpen: isTemplateModalOpen } = useTemplateModal();
  const [formAction, state] = useFormStateWithToast(handleCreateDocument);
  const { Modal: PreviewModal, openModal: openPreviewModal } = usePreviewModal();

  const [titlePages, setTitlePages] = useState<TitlePage[]>([]);
  const [selectedTitlePage, setSelectedTitlePage] = useState<TitlePage | undefined>(undefined)
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined)
  useEffect(() => {
    fetch("/api/templates").then((r) => r.json()).then(r => { console.log(r); setTemplates(r as Template[]) }).catch(console.error)
  }, [isTemplateModalOpen])

  useEffect(() => {
    fetch("/api/title-pages").then((r) => r.json()).then(r => { console.log(r); setTitlePages(r as TitlePage[]) }).catch(console.error)
  }, [isTitlePageModalOpen])

  useEffect(() => { if (state?.message && state.ok) closeModal() }, [state])

  const CreateDocumentModal = (
    <>
      <Modal
        className="rounded-xs"
        header="Создать документ"
      >
        <form className="min-w-sm" action={formAction}>
          <div className="mt-2">
            <label htmlFor="existing_document">Существующий документ: (необязательно)</label>
            <FileInput label={`Перетащите сюда или кликните для выбора\nсуществующего документа.`} multiple={false} className="mt-2" name="existing_document" accept="application/pdf" />
          </div>
          <div className="mt-4">
            <label htmlFor="name">Название документа</label>
            <input
              className="border border-slate-500/20 mt-2 text-gray-600 text-base bg-slate-200/50 py-2.5 px-4 rounded-xs w-full"
              id="name"
              name="name"
              required
              placeholder="Название документа"
            />
          </div>
          <div className="w-full mt-4">
            <label htmlFor="title">Титульный лист:</label>
            <div className="flex w-full mt-2">
              <select onChange={(e) => setSelectedTitlePage(titlePages.find(t => t.id === e.target.value))} className=" border border-slate-500/20 grow-1 bg-slate-100 px-4 py-2.5" name="title" id="title">
                <option value="undefined">&lt;Без титульного листа&gt;</option>
                {titlePages.map(t => (<option key={t.id} value={t.id.toString()}>{t.name}</option>))}
              </select>
              <button className="bg-slate-500 py-1 px-4 rounded-xs  ml-2 font-semibold text-white" onClick={openTitlePageModal}>+</button>
            </div>
            {selectedTitlePage && (
              <div className="mx-auto h-40 aspect-[1/1.414] relative">
                <Image onClick={() => openPreviewModal(selectedTitlePage.name, selectedTitlePage.thumbnail)} src={selectedTitlePage.thumbnail} alt={selectedTitlePage.name} fill />
              </div>
            )}
          </div>
          <div className="w-full mt-4">
            <label htmlFor="template">Шаблон:</label>
            <div className="flex w-full mt-2">
              <select onChange={(e) => setSelectedTemplate(templates.find(t => t.id === e.target.value))} className=" border border-slate-500/20 grow-1 bg-slate-100 px-4 py-2.5" name="template" id="template">
                <option value="undefined">&lt;Стандартный&gt;</option>
                {templates.map(t => (<option key={t.id} value={t.id.toString()}>{t.name}</option>))}
              </select>
              <button className="bg-slate-500 py-1 px-4 rounded-xs  ml-2 font-semibold text-white" onClick={openTemplateModal}>+</button>
            </div>
            {selectedTemplate && (
              <div className="mx-auto h-40 aspect-[1/1.414] relative">
                <Image onClick={() => openPreviewModal(selectedTemplate.name, selectedTemplate.thumbnail)} src={selectedTemplate.thumbnail} alt={selectedTemplate.name} fill />
              </div>
            )}
          </div>
          <div className="flex items-center justify-end mt-4 space-x-2 text-sm">
            <button type="button" onClick={closeModal} className="bg-slate-300 py-2 px-8 rounded-xs text-black/80">Отмена</button>
            <button type="submit" className="bg-slate-700 py-2 px-8 rounded-xs text-white">Создать</button>
          </div>
        </form>
      </Modal>
      {TemplateModal}
      {TitlePageModal}
      {PreviewModal}
    </>
  )
  return { Modal: CreateDocumentModal, closeModal, ...rest }
}
