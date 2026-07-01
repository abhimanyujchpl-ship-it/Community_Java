import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brand } from "../../components/layout/PublicLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { routes } from "../../constants/routes";
import { getApiError, pageItems } from "../../services/api";
import { authService } from "../../services/auth.service";
import { communityService } from "../../services/community.service";
import { dashboardService } from "../../services/dashboard.service";
import { demoUsers } from "../../services/demoData";
import { demoLogin, saveAuth, setActiveCommunityId } from "../../store/auth.store";
import "./auth.css";

export function LoginPage() {
  const navigate = useNavigate();
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendFailed, setBackendFailed] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBackendFailed(false);
    if (!emailOrMobile || !password) {
      setError("Email/mobile and password are required.");
      return;
    }
    setLoading(true);
    try {
      const auth = await authService.login({ emailOrMobile, password });
      saveAuth(auth.accessToken || auth.token || "", auth.user);
      try {
        const communities = pageItems(await communityService.list());
        const firstCommunity = communities[0];
        if (firstCommunity) {
          if (auth.user.role === "MEMBER") {
            await dashboardService.member(firstCommunity.id);
          }
          setActiveCommunityId(firstCommunity.id);
        }
      } catch {
        // The user can still browse communities and request access after login.
      }
      navigate(auth.user.role === "MEMBER" ? routes.memberDashboard : routes.adminDashboard);
    } catch (err) {
      setBackendFailed(true);
      setError(`${getApiError(err)} You can continue in Demo Mode.`);
    } finally {
      setLoading(false);
    }
  }

  function loginAsDemo(role: "admin" | "member" | "superadmin") {
    const { password: _password, ...user } = demoUsers[role];
    demoLogin(user);
    navigate(user.role === "MEMBER" ? routes.memberDashboard : routes.adminDashboard);
  }

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Brand />
        <h1>Sign in</h1>
        <p>Welcome back to Community Connect.</p>
        <form className="form-grid" onSubmit={submit}>
          <Input label="Email or Mobile" value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} placeholder="admin@communityconnect.local" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Pass@123" />
          {error && <div className="message error">{error}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
          <div className="actions">
            <Button type="button" variant="secondary" onClick={() => loginAsDemo("admin")}>Login as Admin Demo</Button>
            <Button type="button" variant="secondary" onClick={() => loginAsDemo("member")}>Login as Member Demo</Button>
          </div>
          {backendFailed && (
            <Button type="button" variant="ghost" onClick={() => loginAsDemo("admin")}>
              Continue in Demo Mode
            </Button>
          )}
          <div className="actions">
            <Link to={routes.register}><Button type="button" variant="secondary">Create account</Button></Link>
            <Link to={routes.communitySearch}><Button type="button" variant="ghost">Browse communities</Button></Link>
          </div>
          <div className="demo-box">
            <strong>Demo credentials</strong><br />
            Admin: admin@communityconnect.local / Pass@123<br />
            Member: member@communityconnect.local / Pass@123
          </div>
        </form>
      </Card>
    </main>
  );
}
