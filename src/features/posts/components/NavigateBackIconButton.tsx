import { useNavigate } from "react-router-dom";
import { IconButton } from "../../../components/ui";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function NavigateBackIconButton() {
  const navigate = useNavigate();
  return (
    <IconButton
      icon={<ArrowLeftIcon className="w-6 h-6" />}
      onClick={() => navigate("/")}
      className="p-2 bg-gray-200 hover:bg-gray-300"
    />
  );
}
