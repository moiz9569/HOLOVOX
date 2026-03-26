import './globals.css';
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <ToastContainer />
    </html>
  );
}