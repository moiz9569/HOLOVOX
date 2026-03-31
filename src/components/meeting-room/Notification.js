import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

export default function Notification({ notification, onClose }) {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 ${
          notification.type === "success"
            ? "bg-green-600"
            : notification.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
        }`}
      >
        {notification.type === "success" ? (
          <Check size={18} />
        ) : (
          <AlertCircle size={18} />
        )}
        <span className="text-sm font-medium">{notification.message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
