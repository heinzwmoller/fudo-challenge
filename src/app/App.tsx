import { Providers } from "./providers.tsx";
import { AppRouter } from "./router.tsx";

export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
