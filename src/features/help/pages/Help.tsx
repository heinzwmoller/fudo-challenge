const faqs = [
  {
    question: "¿Cómo publico un nuevo post?",
    answer:
      "Ve al listado principal y usa el formulario superior. Escribe un título, algo memorable y pulsa Publicar. Si cambias de idea, siempre puedes editarlo.",
  },
  {
    question: "¿Por qué no veo mis comentarios?",
    answer:
      "Porque aún no has comentado nada o estás en el post equivocado. Deja un comentario y aparecerá en la lista. Si sigue sin verse, recarga y cuéntanos en soporte.",
  },
  {
    question: "¿Puedo editar o borrar mis aportes?",
    answer:
      "Sí. Cada post y comentario tiene un menú de opciones para editar o eliminar. Aprovéchalo para corregir despistes o retirar ideas que ya no te convencen.",
  },
  {
    question: "¿Qué hay del contador de likes?",
    answer:
      "Los likes son locales y sirven como indicador ligero. Si pulsas el corazón vuelve a restar uno, así que úsalo para mostrar apoyo sin miedo.",
  },
  {
    question: "¿Cómo accedo a mi configuración?",
    answer:
      "Abre el menú de tu avatar en la esquina superior derecha y selecciona Ajustes. Encontrarás una página dedicada a tu perfil y futuras opciones de cuenta.",
  },
  {
    question: "¿Qué hago si algo falla?",
    answer:
      "Respira, recarga la página y revisa nuestra documentación. Si persiste, anota lo ocurrido y abre un ticket. Prometemos investigar antes de que termine el día.",
  },
];

export default function Help() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Centro de ayuda
        </h1>
        <p className="text-slate-600">
          Sabemos que puede haber dudas, aquí encontrarás las respuestas a las preguntas más frecuentes.
        </p>
      </header>
      <section className="space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 open:shadow-md transition-shadow"
          >
            <summary className="cursor-pointer select-none text-sm font-semibold text-slate-800">
              {faq.question}
            </summary>
            <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </section>
    </div>
  );
}

