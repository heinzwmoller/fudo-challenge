import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Avatar,
  IconButton,
} from "@/components/ui";
import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/features/auth";

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-gray-100 h-14 flex items-center px-8 gap-4">
      <nav className="flex items-center gap-4">
        <Link to="/" className="font-bold hover:text-gray-600 text-2xl">
          Redium
        </Link>
      </nav>

      <div className="ml-auto flex items-center gap-3">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                icon={<Avatar src={user.avatar} alt={user.name} size="sm" />}
                className="h-11 w-11 bg-gray-100 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
                aria-label="Abrir menú de sesión"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[12rem]">
              <div className="px-3 py-2 text-sm text-gray-500 text-center tracking-wide">
                ¡Hola {user.name}! 👋
              </div>

              <DropdownMenuItem
                onClick={() => navigate("/account")}
                className="text-gray-600 flex items-center gap-2"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                Ajustes
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/help")}
                className="text-gray-600 flex items-center gap-2"
              >
                <QuestionMarkCircleIcon className="w-4 h-4" />
                Ayuda
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => logout()}
                className="text-red-600 flex items-center gap-2"
              >
                <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
