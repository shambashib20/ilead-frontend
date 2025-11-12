"use client";

import { useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export default function RichTextEditor({
  value,
  onChange,
  onBlur,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 bg-primary border-b border-gray-300">
        <button
          type="button"
          onClick={() => applyFormat("bold")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-sm font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => applyFormat("italic")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-sm italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => applyFormat("underline")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-sm underline"
          title="Underline"
        >
          U
        </button>
        <div className="w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => applyFormat("insertUnorderedList")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-sm"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => applyFormat("insertOrderedList")}
          className="px-2 py-1 hover:bg-gray-200 rounded text-sm"
          title="Numbered List"
        >
          1.
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={onBlur}
        className="w-full p-4 min-h-48 focus:outline-none bg-primary text-foreground"
        suppressContentEditableWarning
      />
    </div>
  );
}
