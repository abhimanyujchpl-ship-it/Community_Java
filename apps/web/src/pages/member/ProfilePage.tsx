import { Card } from "../../components/ui/Card";
import { getUser } from "../../store/auth.store";

export function ProfilePage() {
  const user = getUser();
  return (
    <Card>
      <h1>Profile</h1>
      <p className="muted">Your account details.</p>
      <div className="grid grid-2">
        <p><strong>Name:</strong> {user?.fullName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Mobile:</strong> {user?.mobile}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </Card>
  );
}
