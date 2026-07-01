import { HTMLAttributes, ReactNode } from "react";
import "./ui.css";

export function Card({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}
