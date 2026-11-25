import type { CSSProperties, SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function HomeIcon({ size = 18, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function CalendarIcon({ size = 18, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

export function CalendarPlusIcon({ size = 18, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <line x1="12" x2="12" y1="13" y2="17" />
      <line x1="10" x2="14" y1="15" y2="15" />
    </svg>
  );
}

export function ClipboardListIcon({ size = 18, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="9" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

export function UsersIcon({ size = 18, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function ShieldLockIcon({ size = 18, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <rect width="6" height="5" x="9" y="11" rx="1" />
      <path d="M10 11V9a2 2 0 0 1 4 0v2" />
    </svg>
  );
}

export function PawIcon({ size = 18, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <ellipse cx="12" cy="15.5" rx="4" ry="3.5" />
      <circle cx="6.5" cy="10" r="1.8" />
      <circle cx="17.5" cy="10" r="1.8" />
      <circle cx="9.2" cy="6.2" r="1.6" />
      <circle cx="14.8" cy="6.2" r="1.6" />
    </svg>
  );
}

export function BathIcon({ size = 20, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1Z" />
      <path d="M6 12V5a2 2 0 0 1 2-2h3a1 1 0 0 1 1 1v8" />
      <path d="M7 20v2" />
      <path d="M17 20v2" />
      <circle cx="17" cy="8" r="1" fill="currentColor" />
      <circle cx="19" cy="5" r="1" fill="currentColor" />
      <circle cx="14" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

export function ScissorsIcon({ size = 20, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" x2="8.12" y1="4" y2="15.88" />
      <line x1="14.47" x2="20" y1="14.48" y2="20" />
      <line x1="8.12" x2="12" y1="8.12" y2="12" />
    </svg>
  );
}

export function EarCareIcon({ size = 20, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </svg>
  );
}

export function SparklesIcon({ size = 20, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      <circle cx="19" cy="5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function DogIcon({ size = 24, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="M10 5.5C10 4 8.5 2 7 2S4 3.5 4 6c0 3 2 4.5 3 5" />
      <path d="M14 5.5C14 4 15.5 2 17 2s3 1.5 3 4c0 3-2 4.5-3 5" />
      <path d="M7 9h10a4 4 0 0 1 4 4v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2a4 4 0 0 1 4-4Z" />
      <circle cx="9" cy="14" r="1" fill="currentColor" />
      <circle cx="15" cy="14" r="1" fill="currentColor" />
      <path d="M11 17.5a1.2 1.2 0 0 0 2 0" />
    </svg>
  );
}

export function CatIcon({ size = 24, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="M4 10V5l4 2.5a8 8 0 0 1 8 0L20 5v5a7 7 0 0 1-2 5l-2 3.5a3 3 0 0 1-2.5 1.5h-3A3 3 0 0 1 8 18.5L6 15a7 7 0 0 1-2-5Z" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <path d="m11 15 1 1 1-1" />
      <line x1="5" x2="2" y1="12" y2="11" />
      <line x1="5" x2="2" y1="14" y2="15" />
      <line x1="19" x2="22" y1="12" y2="11" />
      <line x1="19" x2="22" y1="14" y2="15" />
    </svg>
  );
}

export function PencilIcon({ size = 16, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export function TrashIcon({ size = 16, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

export function CloseIcon({ size = 16, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16, className, style, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/**
 * ServiceIcon: Renders the appropriate SVG icon according to the service name or icon key.
 */
export function ServiceIcon({
  name,
  icon,
  size = 20,
  className,
}: {
  name?: string;
  icon?: string;
  size?: number | string;
  className?: string;
}) {
  const normalized = `${icon ?? ""} ${name ?? ""}`.toLowerCase();
  if (normalized.includes("baño") || normalized.includes("bath") || normalized.includes("shampoo")) {
    return <BathIcon size={size} className={className} />;
  }
  if (normalized.includes("corte") || normalized.includes("scissors") || normalized.includes("pelo")) {
    return <ScissorsIcon size={size} className={className} />;
  }
  if (normalized.includes("oído") || normalized.includes("ear") || normalized.includes("limpieza") || normalized.includes("salud")) {
    return <EarCareIcon size={size} className={className} />;
  }
  return <SparklesIcon size={size} className={className} />;
}

/**
 * PetIcon: Renders the appropriate dog, cat or paw SVG icon.
 */
export function PetIcon({
  species,
  icon,
  name,
  size = 22,
  className,
}: {
  species?: string;
  icon?: string;
  name?: string;
  size?: number | string;
  className?: string;
}) {
  const normalized = `${species ?? ""} ${icon ?? ""} ${name ?? ""}`.toLowerCase();
  if (normalized.includes("gato") || normalized.includes("cat") || normalized.includes("mishi")) {
    return <CatIcon size={size} className={className} />;
  }
  if (normalized.includes("perro") || normalized.includes("dog") || normalized.includes("rocky") || normalized.includes("canino")) {
    return <DogIcon size={size} className={className} />;
  }
  return <PawIcon size={size} className={className} />;
}

/**
 * HeroPetIllustration: Clean, premium editorial illustration for the landing page hero.
 */
export function HeroPetIllustration() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(79, 163, 209, 0.2), rgba(110, 127, 209, 0.25))",
          border: "2px solid rgba(79, 163, 209, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--pine-dark)",
          boxShadow: "0 12px 30px rgba(79, 163, 209, 0.15)",
        }}
      >
        <PawIcon size={56} style={{ color: "var(--pine-dark)" }} />
      </div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--pine-dark)",
          opacity: 0.85,
        }}
      >
        Cuidado Profesional
      </div>
    </div>
  );
}

