import { SelectHTMLAttributes } from "react";
import "./ui.css";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { label: string; value: string }[];
};

export function Select({ label, options, ...props }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
