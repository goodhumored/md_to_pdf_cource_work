"use client"

import { useModal } from "../../common/modal/modal";
import { useCallback, useRef, useState } from "react";

export default function useConfirmModal() {
  const { Modal, closeModal: _closeModal, openModal: _openModal, ...rest } = useModal();
  const [header, setHeader] = useState<string>("Вы уверены?")
  const resolveResult = useRef<(arg: unknown) => unknown>(null);
  const openModal = useCallback((_header: string) => {
    setHeader(_header);
    _openModal()
    return new Promise(res => {
      resolveResult.current = res;
    })
  }, [_openModal, setHeader]);
  const closeModal = useCallback((result: boolean) => {
    if (!resolveResult.current) return;
    resolveResult.current(result)
    _closeModal()
  }, [_closeModal])
  const TemplateModal = (<Modal
    className="rounded-xs"
    header={header}
  >
    <div className="flex items-center justify-end mt-4 space-x-2 text-sm">
      <button type="button" onClick={() => closeModal(false)} className="bg-slate-300 py-2 px-8 rounded-xs text-black/80">Отмена</button>
      <button type="button" onClick={() => closeModal(true)} className="bg-slate-700 py-2 px-8 rounded-xs text-white">Да</button>
    </div>
  </Modal>)
  return {
    Modal: TemplateModal, closeModal, openModal, ...rest
  }
}
