import { cn } from "@/lib/utils"; // Ensure this exists
import "../styles/globals.css"; // Use relative import

export const metadata = {
  title: "My Next.js App",
  description: "A modern app using shadcn components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("bg-gray-100 text-gray-900")}>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
