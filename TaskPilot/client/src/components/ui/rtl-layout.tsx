import { cn } from "@/lib/utils";

interface RTLLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function RTLLayout({ children, className }: RTLLayoutProps) {
  return (
    <div dir="rtl" className={cn("font-sans", className)}>
      {children}
    </div>
  );
}
