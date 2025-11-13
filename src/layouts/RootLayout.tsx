import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Container } from "../components/layout/Container";

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}
