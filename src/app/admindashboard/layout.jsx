import React from 'react'
import AdminHeader from '@/components/AdminLayout/header'
import AdminSidebar from '@/components/AdminLayout/sidebar'

const Layout = ({ children }) => {
  return (
   <div className="min-h-screen bg text-white">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 bg-linear-to-br from-[#E9164B]/5 via-transparent to-[#4E54E9]/5 pointer-events-none" />
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
