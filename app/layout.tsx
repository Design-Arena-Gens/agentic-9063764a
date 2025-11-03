import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SwargaYatra | Bangalore Funeral Services',
  description: 'Dignified, 24x7 funeral services in Bangalore.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
