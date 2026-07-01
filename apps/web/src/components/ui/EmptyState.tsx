import "./ui.css";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
