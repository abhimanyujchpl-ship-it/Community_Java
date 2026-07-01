import { Link, Outlet } from "react-router-dom";
import { routes } from "../../constants/routes";
import "./layout.css";

export function Brand() {
  return (
    <Link className="brand" to={routes.home}>
      <span className="brand-mark">CC</span>
      <span>Community Connect</span>
    </Link>
  );
}

export function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-nav">
        <Brand />
        <nav>
          <a href="/#features">Features</a>
          <a href="/#communities">Communities</a>
          <a href="/#events">Events</a>
          <a href="/#admin">Admin</a>
          <Link to={routes.login}>Login</Link>
          <Link className="nav-cta" to={routes.register}>Get Started</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
