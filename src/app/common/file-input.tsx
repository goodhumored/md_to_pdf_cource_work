"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface FileInputProps {
  name: string; // Имя поля для FormData
  accept?: string; // Типы файлов, например, "image/*"
  className?: string; // Дополнительные классы для контейнера
  multiple?: boolean; // Поддержка множественного выбора файлов
  label?: string;
}

export default function FileInput({
  name,
  label,
  accept = "image/*",
  className = "",
  multiple = false,
}: FileInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Обработка изменения файлов через input
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      setFiles(selectedFiles);
    },
    []
  );

  // Обработка drag-n-drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = e.dataTransfer.files
      ? Array.from(e.dataTransfer.files)
      : [];
    if (droppedFiles.length) {
      setFiles(droppedFiles);
      // Обновляем значение input для FormData
      if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        droppedFiles.forEach((file) => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;
      }
    }
  }, []);

  // Открытие диалога выбора файла при клике на область
  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  // Удаление файла из превью
  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        newFiles.forEach((file) => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;
      }
    },
    [files]
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Область для drag-n-drop и клика */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-gray-600 whitespace-pre-line">
          {label ?? "Перетащите файлы сюда или кликните для выбора"}
        </p>
        <button
          type="button"
          className="mt-5 bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800"
        >
          Выбрать файлы
        </button>
      </div>

      {/* Превью загруженных файлов */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file, index) => (
            <div key={index} className="relative">
              {file.type.startsWith("image/") ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={100}
                  height={100}
                  className="object-cover rounded-lg w-full h-24"
                />
              ) : (
                <div className="bg-gray-200 rounded-lg w-full h-24 flex items-center justify-center">
                  <span className="text-gray-600 text-sm truncate px-2">
                    {file.name}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
