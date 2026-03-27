import client from "./client";

export const getProviderProfile = (id) => {
  return client.get(`/providers/${id}`);
};

export const getProviderServices = (id) => {
  return client.get(`/providers/${id}/services`);
};

export const getProviderReviews = (id) => {
  return client.get(`/providers/${id}/reviews`);
};