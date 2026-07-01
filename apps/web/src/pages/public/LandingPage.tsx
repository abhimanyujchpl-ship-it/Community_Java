import { Link } from "react-router-dom";
import { routes } from "../../constants/routes";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import "./public.css";

const features = ["Member Profiles", "Community Access", "Post Approval", "Event Calendar", "Notifications", "Admin Dashboard"];

export function LandingPage() {
  return (
    <main className="landing">
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">Premium community SaaS</span>
          <h1>Manage your community in one simple platform</h1>
          <p>Join communities, manage members, approve posts, schedule events, and send reminders.</p>
          <div className="actions">
            <Link to={routes.register}><Button type="button">Create Account</Button></Link>
            <Link to={routes.communitySearch}><Button type="button" variant="secondary">Browse Communities</Button></Link>
          </div>
        </div>
        <Card className="preview-card">
          <div className="preview-row"><strong>Community feed</strong><span>Live</span></div>
          <div className="preview-row"><strong>Pending approvals</strong><span>8</span></div>
          <div className="preview-row"><strong>Upcoming events</strong><span>3</span></div>
          <div className="mini-feed">
            <div />
            <div />
            <div />
          </div>
        </Card>
      </section>

      <section id="features" className="container landing-section">
        <h2 className="section-title">Everything your community needs</h2>
        <p className="section-subtitle">Designed for admins and members who want less chaos and more clarity.</p>
        <div className="grid grid-3 feature-grid">
          {features.map((feature) => (
            <Card key={feature}>
              <h3>{feature}</h3>
              <p>Real workflows, clear status, and fast actions connected to your backend.</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="communities" className="landing-band">
        <div className="container grid grid-2">
          <div>
            <h2 className="section-title">Browse, request, join</h2>
            <p className="section-subtitle">Members can discover communities, request access, and unlock private dashboards after approval.</p>
          </div>
          <Link to={routes.communitySearch}><Button type="button" variant="secondary">Explore Communities</Button></Link>
        </div>
      </section>

      <section id="events" className="container landing-section grid grid-2">
        <Card>
          <h3>Events and reminders</h3>
          <p>Admins create events, members see calendars, and notifications keep everyone in sync.</p>
        </Card>
        <Card id="admin">
          <h3>Admin control center</h3>
          <p>Review access requests, approve posts, manage members, and monitor dashboard stats.</p>
        </Card>
      </section>

      <footer className="footer">Community Connect © 2026</footer>
    </main>
  );
}
