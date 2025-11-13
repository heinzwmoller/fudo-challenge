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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg border border-gray-200 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
          aria-describedby={undefined}
        >
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Compartir post
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
              ✕
            </Dialog.Close>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3 text-gray-700">
            <p className="text-sm">
              Copia este enlace para compartir el post con otros usuarios.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 overflow-x-auto">
                {shareUrl}
              </code>
              <Button onClick={onCopy} variant="outline">
                {isCopied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
