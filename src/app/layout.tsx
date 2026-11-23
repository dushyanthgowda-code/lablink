import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LabLink | GenAI Campus Laboratory Resource-Sharing Platform',
  description: 'AI-powered campus laboratory resource discovery, intelligent slot booking, project-based access, and fair allocation conflict resolution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
