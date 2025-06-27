interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-b-2 border-green-500 ${sizeClasses[size]}`}
      ></div>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};
