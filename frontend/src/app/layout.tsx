import type { Metadata } from "next";
import RootLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "Puppy Spa",
  description: "Manage your puppy spa waiting list with ease"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
