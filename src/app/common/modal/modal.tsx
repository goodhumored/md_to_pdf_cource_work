"use client";

import { useCallback, useState } from "react";
import Image from "next/image"
import cross from "@/../public/icons/cross.svg"
import { cn } from "../../../utils/cn";

interface ModalProps {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  header?: string
}

interface UseModalReturn {
  Modal: React.FC<ModalProps>;
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
}

export function useModal(): UseModalReturn {
  const [show, setShow] = useState(false);

  const openModal = useCallback(() => {
    setShow(true);
  }, []);

  const closeModal = useCallback(() => {
    setShow(false);
  }, []);

  // Компонент Modal, обёрнутый с уже встроенным состоянием и обработчиком закрытия
  const Modal: React.FC<ModalProps> = ({ className, children, header }) => {
    return (
      <div
        className={`fixed bg-linear-to-b from-[rgba(0,0,0,0.8)] from-[17.75%] to-transparent left-0 right-0 top-0 bottom-0 z-1000`}
      >
        <div className="relative h-full w-full flex items-center justify-center">
          <div
            className="absolute top-0 right-0 left-0 bottom-0"
            onClick={closeModal}
          />
          <div className={cn(className, "bg-white relative")}>
            <div
              className="cursor-pointer py-4  pl-6 pr-4 flex items-center justify-between w-full bg-slate-700"
            >
              <h3 className="text-xl text-white/80">{header}</h3>
              <div className="p-1 cursor-pointer hover:brightness-150" onClick={closeModal}><Image src={cross} alt="Закрыть" /></div>
            </div>
            <div className="px-4 py-2 pb-4">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  return {
    Modal: show ? Modal : () => null,
    openModal,
    closeModal,
    isOpen: show,
  };
}
