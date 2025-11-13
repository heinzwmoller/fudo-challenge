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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-xl border border-gray-200 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
          aria-describedby={undefined}
        >
          <div className="px-5 pt-4">
            <Dialog.Title className="text-base font-semibold text-gray-900 sm:text-lg">
              {title}
            </Dialog.Title>
          </div>
          <div className="px-5 pb-5 pt-3 text-sm leading-relaxed text-gray-600">
            {content}
          </div>
          <div className="px-5 pb-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isConfirming}
              className="rounded-xl px-4 py-2"
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={isConfirming}
              className="rounded-xl px-4 py-2"
            >
              {isConfirming ? "Procesando..." : confirmText}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
