import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
} from "../api/notificationApi";
import { WS_BASE_URL } from "../api/client";
import { useAuth } from "../context/AuthContext";

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);

      const unread = await getUnreadCount();
      setCount(unread.data || 0);
    } catch (err) {
      console.log("Notification error", err);
    }
  };

  useEffect(() => {
    if (!user) return undefined;

    loadNotifications();

    const socket = new SockJS(`${WS_BASE_URL}/ws`, undefined, {
      transports: ["xhr-streaming", "xhr-polling"],
    });
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/notifications/${user.userId}`, (msg) => {
        const notification = JSON.parse(msg.body);

        setNotifications((prev) => {
          const exists = prev.some((item) => item.id === notification.id);
          return exists ? prev : [notification, ...prev];
        });
        setCount((prev) => prev + 1);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      console.log("Mark read error", err);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="btn-secondary"
        title="Notifications"
        style={{ position: "relative", paddingInline: "14px" }}
      >
        <Bell size={18} />
        <span style={{ fontWeight: 800 }}>Alerts</span>
        {count > 0 && (
          <span
            style={{
              minWidth: "22px",
              height: "22px",
              padding: "0 6px",
              borderRadius: "999px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 800,
              boxShadow: "0 10px 24px rgba(220,38,38,0.28)",
            }}
          >
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-popover">
          <div
            style={{
              padding: "18px 18px 12px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <p className="page-kicker" style={{ marginBottom: "8px" }}>
              Notifications
            </p>
            <h4
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                letterSpacing: "-0.03em",
              }}
            >
              Recent Updates
            </h4>
          </div>

          {notifications.length === 0 ? (
            <div className="empty-state" style={{ padding: "28px 18px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  margin: "0 auto",
                  borderRadius: "16px",
                  display: "grid",
                  placeItems: "center",
                  background: "var(--bg-soft)",
                }}
              >
                <CheckCheck size={22} color="var(--text-secondary)" />
              </div>
              <h3 style={{ fontSize: "20px", marginTop: "14px" }}>
                All caught up
              </h3>
              <p style={{ fontSize: "14px" }}>
                New provider updates and booking events will show up here.
              </p>
            </div>
          ) : (
            <div style={{ padding: "12px", display: "grid", gap: "8px" }}>
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markRead(notification.id)}
                  className="btn-secondary"
                  style={{
                    width: "100%",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    borderRadius: "18px",
                    padding: "14px 16px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      marginTop: "6px",
                      borderRadius: "999px",
                      background: "linear-gradient(135deg, #3b82f6, #14b8a6)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      fontWeight: 700,
                      lineHeight: 1.55,
                    }}
                  >
                    {notification.message}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
