import client from "./client";

export const getNotifications = () => {
  return client.get("/notifications/me");
};

export const getUnreadCount = () => {
  return client.get("/notifications/me/unread");
};

export const markNotificationRead = (id) => {
  return client.put(`/notifications/${id}/read`);
};