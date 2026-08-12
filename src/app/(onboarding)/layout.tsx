import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface-1">
      <main id="contenido" className="mx-auto w-full px-4 py-4 sm:px-6 sm:py-7 xl:px-8">
        {children}
      </main>
    </div>
  );
}
