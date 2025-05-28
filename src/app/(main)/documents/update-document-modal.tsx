import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image"
import { TitlePageDTO } from "../../api/title-pages/route";
import { useModal } from "../../common/modal/modal";
import usePreviewModal from "../../common/modal/preview-modal";
import useFormStateWithToast from "../../common/useFormStateWithToast";
import useTemplateModal from "../templates/template-modal";
import useTitlePageModal from "../title-pages/title-page-modal";
import { TemplateDTO } from "../../api/templates/route";
import { UserDocumentDTO } from "../../api/documents/user-document.dto";
import handleUpdateDocument from "./[id]/handle-update-document";

export default function useUpdateDocumentModal(doc: UserDocumentDTO) {
  const { Modal, openModal: _openModal, closeModal: _closeModal, isOpen } = useModal();
  const { Modal: TitlePageModal, openModal: openTitlePageModal, isOpen: isTitlePageModalOpen } = useTitlePageModal();
  const { Modal: TemplateModal, openModal: openTemplateModal, isOpen: isTemplateModalOpen } = useTemplateModal();
  const [formAction, state] = useFormStateWithToast(handleUpdateDocument);
  const { Modal: PreviewModal, openModal: openPreviewModal } = usePreviewModal();
  const resolveResult = useRef<(arg: unknown) => unknown>(null)
  const [titlePages, setTitlePages] = useState<TitlePageDTO[]>([]);
  const [selectedTitlePage, setSelectedTitlePage] = useState<TitlePageDTO | undefined>(undefined)
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDTO | undefined>(undefined)
  useEffect(() => {
    if (!isOpen && resolveResult.current)
      resolveResult.current(undefined);
  }, [isOpen])
  const openModal = useCallback(() => {
    _openModal()
    return new Promise((res) => {
      resolveResult.current = res;
    })
  }, [_openModal])

  const closeModal = useCallback((result: unknown) => {
    if (!resolveResult.current) return;
    resolveResult.current(result);
    resolveResult.current = null;
    _closeModal()
  }, [_closeModal])

  useEffect(() => {
    fetch("/api/templates").then((r) => r.json()).then((r: TemplateDTO[]) => {
      setTemplates(r)
      setSelectedTemplate(r.find(t => t.id === doc.template_id))
    }).catch(console.error)
  }, [isTemplateModalOpen])

  useEffect(() => {
    fetch("/api/title-pages").then((r) => r.json()).then((r: TitlePageDTO[]) => {
      setTitlePages(r)
      setSelectedTitlePage(r.find(t => t.id === doc.title_id))
    }).catch(console.error)
  }, [isTitlePageModalOpen])

  useEffect(() => { if (state?.message && state.ok) closeModal(true) }, [state])

  const CreateDocumentModal = (
    <>
      <Modal
        className="rounded-xs"
        header="Настройки документа"
      >
        <form className="min-w-sm" action={formAction}>
          <input type="hidden" name="id" defaultValue={doc.id} />
          <div className="mt-4">
            <label htmlFor="name">Название документа</label>
            <input
              className="border border-slate-500/20 mt-2 text-gray-600 text-base bg-slate-200/50 py-2.5 px-4 rounded-xs w-full"
              id="name"
              name="name"
              defaultValue={doc.name}
              required
              placeholder="Название документа"
            />
          </div>
          <div className="w-full mt-4">
            <label htmlFor="title">Титульный лист:</label>
            <div className="flex w-full mt-2">
              <select defaultValue={selectedTitlePage?.id} onChange={(e) => setSelectedTitlePage(titlePages.find(t => t.id === e.target.value))} className=" border border-slate-500/20 grow-1 bg-slate-100 px-4 py-2.5" name="title" id="title">
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
              <select defaultValue={selectedTemplate?.id} onChange={(e) => setSelectedTemplate(templates.find(t => t.id === e.target.value))} className=" border border-slate-500/20 grow-1 bg-slate-100 px-4 py-2.5" name="template" id="template">
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
            <button type="button" onClick={() => closeModal(undefined)} className="bg-slate-300 py-2 px-8 rounded-xs text-black/80">Отмена</button>
            <button type="submit" className="bg-slate-700 py-2 px-8 rounded-xs text-white">Сохранить</button>
          </div>
        </form>
      </Modal>
      {TemplateModal}
      {TitlePageModal}
      {PreviewModal}
    </>
  )
  return { Modal: CreateDocumentModal, openModal, closeModal, isOpen }
}
