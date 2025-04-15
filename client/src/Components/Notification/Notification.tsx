import React, { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

interface NotificationProp {
  id: string;
  message: string;
  link: string | null;
}

interface NotificationContextProp {
  notify: (message: string, link: string | null) => void;
}

const NotificationContext = createContext<NotificationContextProp | null>(null);
export const useNotification = () => useContext(NotificationContext)!;

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<NotificationProp[]>([]);
  const navigate = useNavigate();

  const notify = useCallback((message: string, link: string | null) => {
    const id = v4();
    setNotification((prev) => [...prev, { id, message, link }]);
    setTimeout(() => {
      setNotification((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const handleNavigation = (link: string | null) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-10 right-10 z-50 space-y-4 w-64 rounded-lg bg-white drop-shadow-lg shadow-black hover:bg-gray-100 cursor-pointer">
        {notification.map((n) => (
          <div
            key={v4()}
            className="px-4 py-2 animate-fadeInFast space-y-2"
            onClick={() => handleNavigation(n.link)}
          >
            <h3 className="font-semibold text-xl">Notification</h3>
            <p dangerouslySetInnerHTML={{ __html: n.message }}></p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
