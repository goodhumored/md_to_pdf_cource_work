"use client"

import { useModal } from "../../common/modal/modal";
import { useCallback, useRef, useState } from "react";

export default function usePromptModal() {
  const { Modal, closeModal: _closeModal, openModal: _openModal, ...rest } = useModal();
  const [header, setHeader] = useState<string>("Введите новое значение:")
  const resolveResult = useRef<(arg: unknown) => unknown>(null);
  const [inputValue, setValue] = useState("");
  const openModal = useCallback((_header: string) => {
    setHeader(_header);
    _openModal()
    return new Promise(res => {
      resolveResult.current = res;
    })
  }, [_openModal, setHeader]);
  const closeModal = useCallback((result: string | undefined) => {
    if (!resolveResult.current) return;
    resolveResult.current(result)
    _closeModal()
  }, [_closeModal])
  const TemplateModal = (<Modal
    className="rounded-xs"
    header={header}
  >
    <input
      className="border border-slate-500/20 mt-2 text-gray-600 text-base bg-slate-200/50 py-2.5 px-4 rounded-xs w-full"
      name="name"
      required
      value={inputValue}
      onChange={v => setValue(v.target.value)}
      placeholder={header}
    />
    <div className="flex items-center justify-end mt-4 space-x-2 text-sm">
      <button type="button" onClick={() => closeModal(undefined)} className="bg-slate-300 py-2 px-8 rounded-xs text-black/80">Отмена</button>
      <button type="button" onClick={() => closeModal(inputValue)} className="bg-slate-700 py-2 px-8 rounded-xs text-white">Да</button>
    </div>
  </Modal>)
  return {
    Modal: TemplateModal, closeModal, openModal, ...rest
  }
}
