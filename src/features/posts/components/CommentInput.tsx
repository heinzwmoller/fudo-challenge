import { useState, useRef, useEffect } from "react";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";

interface CommentInputProps {
  mode: "post" | "reply";
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  errorMessage?: string;
}

export function CommentInput({
  mode,
  onSubmit,
  onCancel,
  isSubmitting = false,
  placeholder = "Escribe un comentario...",
  autoFocus = false,
  errorMessage,
}: CommentInputProps) {
  const [isExpanded, setIsExpanded] = useState(mode === "reply");
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevIsSubmitting = useRef(isSubmitting);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus, isExpanded]);

  useEffect(() => {
    if (prevIsSubmitting.current && !isSubmitting && !errorMessage) {
      setContent("");
      if (mode === "post") {
        setIsExpanded(false);
      }
    }
    prevIsSubmitting.current = isSubmitting;
  }, [errorMessage, isSubmitting, mode]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setContent("");
    if (mode === "post") {
      setIsExpanded(false);
    }
    onCancel?.();
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
    }
  };

  if (mode === "reply" && !isExpanded) {
    return (
      <button
        onClick={handleExpand}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ChatBubbleLeftIcon className="w-4 h-4" />
        <span>Responder</span>
      </button>
    );
  }

  return (
    <div
      className={`border border-gray-300 rounded-2xl transition-all duration-200 ${
        isExpanded ? "focus-within:border-gray-400" : ""
      }`}
    >
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={handleExpand}
        rows={isExpanded ? 2 : 1}
        className={`mt-1 w-full px-3 py-2 border-none focus:outline-none resize-none bg-transparent ${
          isExpanded ? "max-h-32 overflow-y-auto" : ""
        }`}
      />
      {isExpanded && (
        <>
          {errorMessage && (
            <div className="px-3 text-xs text-red-600 mb-1" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="flex justify-end gap-2 p-2 pt-0">
            <Button
              onClick={handleCancel}
              disabled={isSubmitting}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "Enviando..." : "Comentar"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
