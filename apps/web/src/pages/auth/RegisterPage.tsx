import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brand } from "../../components/layout/PublicLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { routes } from "../../constants/routes";
import { getApiError } from "../../services/api";
import { authService } from "../../services/auth.service";
import "./auth.css";

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!form.fullName || !form.email || !form.mobile || !form.password) {
      setError("Full name, email, mobile, and password are required.");
      return;
    }
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        password: form.password
      });
      setMessage("Account created. Please sign in.");
      setTimeout(() => navigate(routes.login), 800);
    } catch (err) {
      const message = getApiError(err);
      setError(message.includes("Backend not reachable")
        ? "Backend is not running. Registration is disabled in offline mode. Use Demo Login."
        : message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Brand />
        <h1>Create account</h1>
        <p>Join your community</p>
        <form className="form-grid" onSubmit={submit}>
          <Input label="Full Name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Test Member" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="test@example.com" />
          <Input label="Mobile" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="9999999999" />
          <Input label="Password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Pass@123" />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="Pass@123" />
          {error && <div className="message error">{error}</div>}
          {message && <div className="message success">{message}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
          <Link to={routes.login}>Already have an account? Sign in</Link>
        </form>
      </Card>
    </main>
  );
}
