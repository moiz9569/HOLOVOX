import { useState } from "react";

export const usePermissions = (isHost, showNotification) => {
  const [permissions, setPermissions] = useState({
    chat: true,
    shareScreen: true,
    startVideo: true,
    shareWhiteboard: true,
    renameSelf: true,
  });

  const updatePermissions = (permission, value) => {
    if (isHost) {
      setPermissions({ ...permissions, [permission]: value });
      showNotification(
        `${permission} ${value ? "enabled" : "disabled"}`,
        "success",
      );
    }
  };

  return {
    permissions,
    updatePermissions,
  };
};
