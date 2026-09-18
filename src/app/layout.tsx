import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Sabjiwala — Fresh. Cut. Ready to Cook.",
    template: "%s | Sabjiwala",
  },
  description:
    "Order fresh, hygienically washed, peeled and cut vegetables and fruits delivered to your doorstep. You choose the dish, we prepare the ingredients.",
  keywords: [
    "fresh vegetables",
    "cut vegetables",
    "vegetable delivery",
    "recipe kits",
    "fresh fruits",
    "online grocery",
    "Sabjiwala",
  ],
  openGraph: {
    title: "Sabjiwala — Fresh. Cut. Ready to Cook.",
    description:
      "Fresh vegetables, fruits & recipe kits delivered to your door.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#111827",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              border: "1px solid #e5e7eb",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "white",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
