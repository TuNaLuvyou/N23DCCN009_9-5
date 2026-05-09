import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <style jsx global>{`
        :root {
          --bg: #f3efe7;
          --bg-accent: #e7dcc8;
          --surface: rgba(255, 255, 255, 0.78);
          --surface-strong: rgba(255, 255, 255, 0.92);
          --text: #1e1f24;
          --muted: #666872;
          --border: rgba(30, 31, 36, 0.1);
          --primary: #203a4f;
          --primary-deep: #10212e;
          --primary-soft: #dce5ec;
          --danger: #b34343;
          --success: #2d6a4f;
          --shadow: 0 24px 80px rgba(27, 31, 35, 0.14);
        }

        html,
        body,
        #__next {
          min-height: 100%;
        }

        body {
          margin: 0;
          font-family: "Trebuchet MS", "Segoe UI", sans-serif;
          color: var(--text);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        * {
          box-sizing: border-box;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }
      `}</style>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
