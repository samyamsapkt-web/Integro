import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function AppShell() {
  const location = useLocation();
  const dashboardPaths = ["/dashboard", "/workflows", "/settings", "/onboarding"];
  const isProductArea = dashboardPaths.some((path) => location.pathname.startsWith(path));

  return (
    <div className={isProductArea ? "app-shell product-shell" : "app-shell marketing-shell"}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <Navbar />
      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
