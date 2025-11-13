import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui";

interface SharePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  isCopied: boolean;
  onCopy: () => void;
}

export function SharePostModal({
  open,
  onOpenChange,
  shareUrl,
  isCopied,
  onCopy,
}: SharePostModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-xl border border-gray-200 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between px-5 pt-4">
            <Dialog.Title className="text-base font-semibold text-gray-900 sm:text-lg">
              Compartir post
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
              ✕
            </Dialog.Close>
          </div>
          <div className="px-5 pb-5 pt-2 flex flex-col gap-4 text-gray-700">
            <p className="text-sm leading-relaxed text-gray-500">
              Copia este enlace para compartir el post con otros usuarios.
            </p>
            <div className="flex flex-col gap-3 rounded-2xl bg-slate-100/80 p-3 sm:flex-row sm:items-center sm:gap-2">
              <code className="flex-1 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-inner overflow-x-auto">
                {shareUrl}
              </code>
              <Button
                onClick={onCopy}
                variant="primary"
                className="rounded-xl px-4 py-2"
              >
                {isCopied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
