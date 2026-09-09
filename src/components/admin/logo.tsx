import { cn } from "@/lib/utils";

export function FozGoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid place-content-center rounded-xl shadow-sm",
        "bg-gradient-to-br from-[#0EA5B7] to-[#123A5B]",
        className
      )}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M12 2C7.9 2 4.5 5.3 4.5 9.4c0 5.2 6.3 11.4 7 12.1.3.3.7.3 1 0 .7-.7 7-6.9 7-12.1C19.5 5.3 16.1 2 12 2Z"
          fill="#fff"
        />
        <circle cx="12" cy="9.4" r="3.1" fill="#0EA5B7" />
      </svg>
    </div>
  );
}
