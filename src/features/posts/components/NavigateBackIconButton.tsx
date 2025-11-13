import { useNavigate } from "react-router-dom";
import { IconButton } from "../../../components/ui";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface NavigateBackIconButtonProps {
  className?: string;
}

export function NavigateBackIconButton({
  className = "",
}: NavigateBackIconButtonProps) {
  const navigate = useNavigate();
  return (
    <IconButton
      icon={<ArrowLeftIcon className="w-6 h-6" />}
      onClick={() => navigate("/")}
      className={cn(
        "h-10 w-10 bg-gray-200 hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
        className
      )}
      aria-label="Volver al listado"
    />
  );
}
