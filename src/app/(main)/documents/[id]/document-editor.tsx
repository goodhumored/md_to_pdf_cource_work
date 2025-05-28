"use client";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cog from "@/../public/icons/cog.svg";
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image"
import "reflect-metadata";
import handleUpdateMd from "./handle-update-md";
import Link from "next/link";
import useDebounce from "../../../hooks/common/use-debounce";
import randInt from "../../../../utils/randint";
import PdfViewer from './pdf-viewer';
import { UserDocumentDTO } from "../../../api/documents/user-document.dto";
import useUpdateDocumentModal from "../update-document-modal";
import { cn } from "../../../../utils/cn";

type DocumentEditorProps = {
  className?: string;
  doc: UserDocumentDTO
}

export default function DocumentEditor(props: DocumentEditorProps) {
  const {
    className,
    doc
  } = props;

  const [md, setMd] = useState<string>(doc.md_code ?? "");
  const [pdfSource, setPdfSource] = useState(doc.pdf_url);
  const [loading, setLoading] = useState(false);
  const debauncedMd = useDebounce(md, 1000);
  const isInitialMount = useRef(true);
  const { Modal, openModal } = useUpdateDocumentModal(doc);

  function refreshPdf() {
    return setPdfSource(`${doc.md_code}?random=${randInt(0, 1000000)}`);
  }
  function loadingWhile<TPromise extends Promise<unknown>>(promise: TPromise): TPromise {
    setLoading(true);
    promise.finally(() => setLoading(false)).catch(console.error);
    return promise;
  }

  const handleUpdate = useCallback(async () => {
    const result = await openModal();
    if (result)
      document.location.reload();
  }, [openModal])

  useEffect(() => {
    if (isInitialMount.current === true) { isInitialMount.current = false; return }
    if (debauncedMd) loadingWhile(handleUpdateMd(doc.id, debauncedMd).then(refreshPdf)).catch(console.error);
  }, [debauncedMd]);

  return (
    <div className={cn(className, "container relative pt-12 pb-20")}>
      <div className="flex items-end text-4xl">
        <h1 className="font-medium">&laquo;{doc.name}&raquo;</h1>
        <div className="ml-4">
          <button type="button" onClick={() => { handleUpdate().catch(console.error) }} className="p-1 w-[.8em] hover:brightness-120 rounded-sm bg-black/30"><Image className="w-full" src={cog} alt="settings" /></button>
        </div>
      </div>
      <div className={`flex mt-4 gap-x-1`}>
        <div className="flex-1">
          <div className="text-2xl">Markdown</div>
          <div className="mt-4 aspect-[1/1.414] relative">
            <MDEditor
              className="absolute inset-0"
              preview="edit"
              height={"100%"}
              value={md}
              onChange={(newValue) => setMd(newValue ?? "")}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-2xl">
            <div className="">PDF result</div>{" "}
            <div className="">
              <Link href={pdfSource} target="_blank">
                <FontAwesomeIcon icon={faDownload} />
              </Link>
            </div>
          </div>
          <PdfViewer loading={loading} className="" link={pdfSource} />
        </div>
      </div>
      {Modal}
    </div>
  );
}
