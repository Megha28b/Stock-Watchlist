"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const token = localStorage.getItem("authToken");
  const router = useRouter();
  if (!token) {
    router.push("/login");
  }
  return (
    <div className="sticky top-0 left-0 w-full bg-[#0a0a0a] text-[#ededed] border-b border-[#333] shadow-md z-50">
      <div className="max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo or Title */}
        <div className="px-2 flex gap-4 justify-center items-center">
          <span className="rounded-full overflow-hidden">
            <Image src="/logo.jpg" width={50} height={50} alt="Logo" />
          </span>
          <h1 className="text-2xl font-bold">Stock Watch</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
