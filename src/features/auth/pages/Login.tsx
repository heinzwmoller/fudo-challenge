import { useEffect, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { Button, Input } from "@/components/ui";
import { useAuth } from "../context/AuthContext";

type LocationState = {
  from?: Location;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as LocationState | undefined)?.from
        ?.pathname;
      navigate(from ?? "/", { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Ingresa un correo y contraseña válidos.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    window.setTimeout(() => {
      login({ email, password });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-8">
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Bienvenido a Redium
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Puedes usar cualquier combinación de correo y contraseña. Este
            formulario solo simula un login para la prueba.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@email.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
