/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Loading from '../../../components/common/loading';
import LinkService from 'react-pdf/dist/esm/LinkService.js';
import { ScrollPageIntoViewArgs } from 'react-pdf/dist/esm/shared/types.js';
import { cn } from '../../../../utils/cn';

type PdfViewDocumentElementRefObject = {
  linkService: React.RefObject<LinkService>;
  pages: React.RefObject<HTMLDivElement[]>;
  viewer: React.RefObject<{
    scrollPageIntoView: (args: ScrollPageIntoViewArgs) => void;
  }>
}

export default function PdfViewer({ className, loading = false, link: _link }: { className?: string, link: string, loading?: boolean }) {
  const [width, setWidth] = useState(0);
  const docRef = useRef<PdfViewDocumentElementRefObject>(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [link, setLink] = useState(_link);
  const scrollRef = useRef<HTMLDivElement>(null);
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const [numPages, setNumPages] = useState<number | null>(null);

  const updateWidth = useCallback(() => {
    const parentWidth = docRef.current?.pages.current[0]?.parentElement?.clientWidth;
    console.log(parentWidth)
    if (parentWidth)
      setWidth(parentWidth);
  }, [docRef])

  useEffect(() => {
    updateWidth()
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [updateWidth])

  useEffect(() => {
    if (scrollRef.current?.scrollTop) setLastScrollTop(scrollRef.current.scrollTop);
    setLink(_link)
  }, [_link])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    updateWidth()
  }

  const updateScrollPosition = useCallback(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = lastScrollTop;
  }, [lastScrollTop, scrollRef])

  return (
    <div className={cn(className, "relative aspect-[1/1.414] mt-4 ")}>
      {loading && <Loading />}
      <div ref={scrollRef} className="absolute inset-0 overflow-y-scroll h-full p-2 border-2 ">
        <Document
          ref={docRef as any}
          loading={(<Loading />)}
          file={link}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(
            new Array(numPages),
            (_, index) => (
              <Page
                onLoadSuccess={() => {
                  updateWidth(); updateScrollPosition();
                }}
                width={width}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                loading={(<Loading />)}
              />
            ),
          )}
        </Document>
      </div></div>
  );
}
