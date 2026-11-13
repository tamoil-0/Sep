import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface-2">
      <main id="contenido">{children}</main>
    </div>
  );
}
