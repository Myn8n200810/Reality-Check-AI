import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Reality Check AI",
  description: "Know if you're making a bad decision",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}