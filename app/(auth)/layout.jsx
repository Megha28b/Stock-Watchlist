export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
}
