export default function FullPageLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "1rem", backgroundColor: "#e0e0e0" }}>
          <h2>Full Page Layout Header</h2>
        </header>
        <main style={{ padding: "2rem" }}>{children}</main>
      </body>
    </html>
  );
}
