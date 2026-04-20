"use client";
import React, { useState } from "react";
import Header from "@/components/HomeLayout/header";
import Sidebar from "@/components/HomeLayout/sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[#EAEAF4]">
      {/* Background */}
      <div className="fixed inset-0 bg-linear-to-br from-[#E9164B]/5 via-transparent to-[#4E54E9]/5 pointer-events-none" />

      {/* Header */}
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Content */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-10 lg:hidden"
          />
        )}

        <main className="flex-1 overflow-y-auto z-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;