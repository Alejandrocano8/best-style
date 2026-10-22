import type { ReactNode } from "react";

export function AuthLayout({
  id,
  quote,
  children,
  cardStyle,
}: {
  id: string;
  quote: string;
  children: ReactNode;
  cardStyle?: React.CSSProperties;
}) {
  return (
    <section className="screen active" id={id}>
      <div className="auth-wrap">
        <div className="auth-visual">
          <div className="brand">
            <div className="brand-mark" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
              B
            </div>
            <div className="brand-name" style={{ color: "#fff" }}>
              Best Style
            </div>
          </div>
          <div>
            <div className="quote">&quot;{quote}&quot;</div>
            <div className="quote-by" style={{ color: "#F3D9DF" }}>
              — Equipo Best Style
            </div>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-card" style={cardStyle}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
