import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { routes } from "../../constants/routes";

export function NotFoundPage() {
  return <main className="auth-page"><Card><h1>Page not found</h1><p className="muted">The route you opened does not exist.</p><Link to={routes.home}>Go home</Link></Card></main>;
}
