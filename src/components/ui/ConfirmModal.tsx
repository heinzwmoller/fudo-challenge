import * as Dialog from "@radix-ui/react-dialog";
import { Button } from ".";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmModal({
  open,
  title,
  content,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isConfirming = false,
  onConfirm,
  onCancel,
  onOpenChange,
}: ConfirmModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg border border-gray-200 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
          aria-describedby={undefined}
        >
          <div className="px-5 py-4 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {title}
            </Dialog.Title>
          </div>
          <div className="px-5 py-4 text-gray-700">{content}</div>
          <div className="px-5 py-4 flex justify-end gap-2 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isConfirming}
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? "Procesando..." : confirmText}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
