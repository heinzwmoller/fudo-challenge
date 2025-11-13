import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  IconButton,
} from "@/components/ui";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { ComponentProps } from "react";

interface OptionsMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  triggerProps?: ComponentProps<typeof IconButton>;
}

export function OptionsMenu({
  onEdit,
  onDelete,
  triggerProps,
}: OptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          icon={<EllipsisHorizontalIcon className="w-6 h-6" />}
          className="hover:bg-gray-300 p-1"
          {...triggerProps}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <PencilIcon className="w-4 h-4 mr-2" />
          <span>Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <TrashIcon className="w-4 h-4 mr-2" />
          <span>Eliminar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
