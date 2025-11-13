import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui";

interface PostInputProps {
  onSubmit: (title: string, content: string) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  initialTitle?: string;
  initialContent?: string;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
  errorMessage?: string;
}

export function PostInput({
  onSubmit,
  isSubmitting = false,
  mode = "create",
  initialTitle = "",
  initialContent = "",
  submitText,
  cancelText,
  onCancel,
  autoFocus = mode === "edit",
  errorMessage,
}: PostInputProps) {
  const [isExpanded, setIsExpanded] = useState(mode === "edit" ? true : false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const prevIsSubmitting = useRef(isSubmitting);

  useEffect(() => {
    if (autoFocus && isExpanded && titleRef.current) {
      titleRef.current.focus();
    }
  }, [autoFocus, isExpanded]);

  useEffect(() => {
    if (mode === "create") {
      if (prevIsSubmitting.current && !isSubmitting) {
        setTitle("");
        setContent("");
        setIsExpanded(false);
      }
      prevIsSubmitting.current = isSubmitting;
    }
  }, [isSubmitting, mode]);

  const handleExpand = () => {
    if (mode === "create") {
      setIsExpanded(true);
    }
  };

  const handleCancel = () => {
    if (mode === "create") {
      setTitle("");
      setContent("");
      setIsExpanded(false);
    } else {
      onCancel?.();
    }
  };

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit(title, content);
    }
  };

  return (
    <div className="border border-gray-300 rounded-2xl transition-all duration-200 focus-within:border-gray-400 overflow-hidden">
      {mode === "create" && !isExpanded ? (
        <div onClick={handleExpand} className="px-4 py-2.5 cursor-text">
          <p className="text-gray-500">Crear un nuevo post...</p>
        </div>
      ) : (
        <>
          <textarea
            ref={titleRef}
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={1}
            disabled={isSubmitting}
            className="mt-1 w-full px-3 py-2 border-none focus:outline-none resize-none bg-transparent font-semibold text-lg"
          />

          <div className="h-px bg-gray-200 mx-3" />

          <textarea
            placeholder="¿Qué quieres compartir?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border-none focus:outline-none resize-none bg-transparent max-h-64 overflow-y-auto"
          />

          {errorMessage && (
            <div className="px-3 text-xs text-red-600" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="flex justify-end gap-2 p-2 pt-1">
            <Button
              onClick={handleCancel}
              disabled={isSubmitting}
              variant="outline"
            >
              {cancelText ?? "Cancelar"}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting
                ? mode === "edit"
                  ? "Guardando..."
                  : "Publicando..."
                : (submitText ?? (mode === "edit" ? "Guardar" : "Publicar"))}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
