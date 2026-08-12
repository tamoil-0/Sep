export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f5f3fb]">
      <main id="contenido">{children}</main>
    </div>
  );
}
