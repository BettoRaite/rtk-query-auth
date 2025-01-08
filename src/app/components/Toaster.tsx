type Props = {
  className?: string;
  toastText: React.ReactNode;
};

export function Toaster({ className = "", toastText }: Props) {
  return (
    <div className={className || "absolute"} role="alert" aria-live="assertive">
      {toastText}
    </div>
  );
}
