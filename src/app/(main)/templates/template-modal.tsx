"use client"

import handleCreateTitlePage from "../title-pages/handle-create-title-page";
import useFormStateWithToast from "../../common/useFormStateWithToast";
import FileInput from "../../common/file-input";
import { useModal } from "../../common/modal/modal";
import { useEffect } from "react";

export default function useTemplateModal() {
  const [formAction, state] = useFormStateWithToast(handleCreateTitlePage);
  useEffect(() => {
    if (state?.ok && state.message) {
      closeModal();
    }
  }, [state])
  const { Modal, closeModal, ...rest } = useModal();
  const TemplateModal = (<Modal
    className="rounded-xs"
    header="Добавить титульный лист:"
  >
    <form className="min-w-sm" action={formAction}>
      <FileInput className="mt-4" name="file" accept="application/pdf" />
      <div className="flex items-center justify-end mt-4 space-x-2 text-sm">
        <button type="button" onClick={closeModal} className="bg-slate-300 py-2 px-8 rounded-xs text-black/80">Отмена</button>
        <button type="submit" className="bg-slate-700 py-2 px-8 rounded-xs text-white">Создать</button>
      </div>
    </form>
  </Modal>)
  return { Modal: TemplateModal, closeModal, ...rest }
}
