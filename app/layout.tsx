import type {Metadata} from "next";
import "./globals.css";
export const metadata: Metadata = {title: "WaiverPath — Overpayment readiness", description: "A demo readiness check for Social Security overpayment notices."};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>}
