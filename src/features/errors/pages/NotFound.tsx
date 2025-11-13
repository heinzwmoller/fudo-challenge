import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">La página que buscas no existe.</p>
      <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
        Volver al inicio
      </Link>
    </div>
  );
}
