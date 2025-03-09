import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Pie.Fun Super Smart AI Agent</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="Starter template showing how to use SolanaAgentKit with Langchain in Next.js projects."
        />
        <meta property="og:title" content="Pie.Fun Super Smart AI Agent" />
        <meta
          property="og:description"
          content="Starter template showing how to use SolanaAgentKit with LangChain in Next.js projects."
        />
        <meta property="og:image" content="/images/title-card.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pie.Fun Super Smart AI Agent" />
        <meta
          name="twitter:description"
          content="Starter template showing how to use SolanaAgentKit with LangChain in Next.js projects."
        />
        <meta name="twitter:image" content="/images/title-card.png" />
      </head>
      <body>
        <div className="flex flex-col  h-[100vh]">{children}</div>
      </body>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Doto:wght@100..900&display=swap');
      </style>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Quantico:ital,wght@0,400;0,700;1,400;1,700&display=swap');
      </style>
    </html>
  );
}
