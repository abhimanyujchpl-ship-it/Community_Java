import { Button } from "./Button";
import "./ui.css";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state state-error">
      <h3>Something needs attention</h3>
      <p>{message}</p>
      {onRetry && <Button type="button" variant="secondary" onClick={onRetry}>Retry</Button>}
    </div>
  );
}
