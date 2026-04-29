'use client';
import { useEffect, useRef } from 'react';
import type Quill from 'quill';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function QuillEditor({ value, onChange, placeholder = 'Write something...', minHeight = '150px' }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !editorRef.current || quillRef.current) return;

    const loadQuill = async () => {
      const { default: Quill } = await import('quill');
      await import('quill/dist/quill.snow.css');

      if (!editorRef.current || quillRef.current) return;

      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            ['table'],
            ['clean'],
          ],
        },
      });

      if (value) quill.clipboard.dangerouslyPasteHTML(value);

      quill.on('text-change', () => {
        if (isUpdatingRef.current) return;
        const html = quill.getSemanticHTML();
        onChange(html);
      });

      quillRef.current = quill;
    };

    loadQuill();

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!quillRef.current) return;
    const currentHTML = quillRef.current.getSemanticHTML();
    if (currentHTML !== value && value !== undefined) {
      isUpdatingRef.current = true;
      quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
      isUpdatingRef.current = false;
    }
  }, [value]);

  return (
    <div
      className="bg-white border border-outline-variant rounded-xl overflow-hidden text-sm [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-outline-variant [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:font-sans [&_.ql-editor]:text-sm"
      style={{ '--min-height': minHeight } as React.CSSProperties}
    >
      <div ref={editorRef} />
    </div>
  );
}
