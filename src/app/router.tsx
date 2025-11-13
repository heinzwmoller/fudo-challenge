import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import PostsList from "../features/posts/pages/PostsList";
import PostDetails from "../features/posts/pages/PostDetails";
import NotFound from "../features/errors/pages/NotFound";
import Login from "@/features/auth/pages/Login";
import { RequireAuth } from "@/features/auth";
import Account from "@/features/account/pages/Account";
import Help from "@/features/help/pages/Help";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: (
      <RequireAuth>
        <RootLayout />
      </RequireAuth>
    ),
    errorElement: (
      <div className="p-4">Ocurrió un error al cargar la ruta.</div>
    ),
    children: [
      { index: true, element: <PostsList /> },
      { path: "posts/:postId", element: <PostDetails /> },
      { path: "account", element: <Account /> },
      { path: "help", element: <Help /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
