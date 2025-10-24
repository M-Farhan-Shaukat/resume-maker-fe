import "./globals.css";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReduxProvider } from "./reduxProvider";
import PusherClient from "./utils/echo";

export const metadata = {
  title: "Legal Document",
  description:
    "Structured healthcare billing, management and IT services for your hassle-free medical practice and guaranteed raise in revenue.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <ReduxProvider>
          <PusherClient />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
