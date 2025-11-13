import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";

interface EditCommentInputProps {
  initialValue: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  errorMessage?: string;
}

export function EditCommentInput({
  initialValue,
  onSubmit,
  onCancel,
  isSubmitting = false,
  placeholder = "Edita tu comentario...",
  autoFocus = true,
  errorMessage,
}: EditCommentInputProps) {
  const [content, setContent] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (content.trim() && content !== initialValue) {
      onSubmit(content.trim());
    }
  };

  return (
    <div className="border border-gray-300 rounded-2xl transition-all duration-200 focus-within:border-gray-400">
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        className="mt-1 w-full px-3 py-2 border-none focus:outline-none resize-none bg-transparent max-h-32 overflow-y-auto"
      />
      {errorMessage && (
        <div className="px-3 text-xs text-red-600" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="flex justify-end gap-2 p-2 pt-1">
        <Button onClick={onCancel} disabled={isSubmitting} variant="outline">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim() || content === initialValue}
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
}
