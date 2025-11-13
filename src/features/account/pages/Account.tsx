import { Avatar } from "@/components/ui";
import { useAuthUser } from "@/features/auth";

export default function Account() {
  const user = useAuthUser();

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Mi cuenta</h1>
        <p className="text-slate-600">
          No encontramos información de la cuenta. Intenta volver a iniciar
          sesión para recuperarla.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Mi cuenta</h1>
        <p className="text-slate-600">
          Revisa los datos principales asociados a tu sesión. Esta es una vista
          informativa; el flujo de edición se puede implementar más adelante.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} alt={user.name} size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {user.name}
            </h2>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nombre visible
            </dt>
            <dd className="text-sm text-slate-700">{user.name}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Correo
            </dt>
            <dd className="text-sm text-slate-700">{user.email}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Avatar
            </dt>
            <dd className="text-sm text-slate-700">
              Esta imagen se reutiliza en tus publicaciones y comentarios para
              ayudarte a identificarte rápidamente. En el futuro podrás
              cambiarla desde acá
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
