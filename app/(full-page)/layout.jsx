import Header from "@/components/Header";

export default function FullPageLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden py-2 px-6">{children}</main>
      </body>
    </html>
  );
}
