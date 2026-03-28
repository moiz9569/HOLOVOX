import React from "react";
import Header from "@/components/HomeLayout/header";
import Sidebar from "@/components/HomeLayout/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-linear-to-br from-[#E9164B]/5 via-transparent to-[#4E54E9]/5 pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
