"use client"

import { useModal } from "../../common/modal/modal";
import { useCallback, useRef, useState } from "react";
import Image from "next/image"

export default function usePreviewModal() {
  const { Modal, closeModal: _closeModal, openModal: _openModal, ...rest } = useModal();
  const [header, setHeader] = useState<string>("Предпросмотр")
  const [src, setSrc] = useState<string>("")
  const resolveResult = useRef<(arg: unknown) => unknown>(null);
  const openModal = useCallback((_header: string, _src: string) => {
    setHeader(_header);
    setSrc(_src)
    _openModal()
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
    <Image className="w-[80vmin] aspect-[1/1.414] static!" src={src} alt={header} fill />
  </Modal>)
  return {
    Modal: TemplateModal, closeModal, openModal, ...rest
  }
}
