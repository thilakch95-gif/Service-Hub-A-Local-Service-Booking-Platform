import client from "./client";

export const getProfile = async () => {
  try {
    return await client.get("/users/profile");
  } catch (err) {
    console.log("Profile fetch error", err);
    throw err;
  }
};

export const updateProfile = async (data) => {
  try {
    return await client.put("/users/profile", data);
  } catch (err) {
    console.log("Profile update error", err);
    throw err;
  }
};