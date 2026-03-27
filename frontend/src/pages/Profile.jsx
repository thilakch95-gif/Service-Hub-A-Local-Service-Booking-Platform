import { useEffect, useMemo, useState } from "react";
import { Camera, Phone, Save, UserRound } from "lucide-react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/image";

const Profile = () => {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    bio: "",
    profileImage: "",
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Total Orders",
        value: stats.totalOrders || 0,
        meta: "All booking activity",
      },
      {
        label: "Completed",
        value: stats.completedOrders || 0,
        meta: "Finished service requests",
      },
      {
        label: "Pending",
        value: stats.pendingOrders || 0,
        meta: "Awaiting completion",
      },
    ],
    [stats]
  );

  const loadProfile = async () => {
    try {
      const res = await client.get("/users/profile");
      setProfile({
        fullName: res.data.fullName || "",
        phone: res.data.phone || "",
        bio: res.data.bio || "",
        profileImage: res.data.profileImage || "",
      });
    } catch (err) {
      console.log("Profile load error:", err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await client.get("/bookings/user/stats");
      setStats(res.data.data || {});
    } catch (err) {
      console.log("Stats error:", err);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setProfile((prev) => ({
      ...prev,
      profileImage: URL.createObjectURL(file),
    }));
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", profile.fullName);
      formData.append("phone", profile.phone || "");
      formData.append("bio", profile.bio || "");

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const res = await client.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully");

      updateUser({
        fullName: res.data.fullName,
        profileImage: res.data.profileImage,
      });

      loadProfile();
    } catch (err) {
      console.log("Update error:", err.response?.data || err);
      alert(err.response?.data || "Profile update failed");
    }
  };

  return (
    <div className="app-page">
      <div className="panel" style={{ padding: "28px" }}>
        <p className="page-kicker">Account Profile</p>
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          Keep your personal information, contact details, and public-facing profile up to date.
        </p>
      </div>

      <div className="stat-grid" style={{ marginTop: "24px" }}>
        {statCards.map((card) => (
          <div key={card.label} className="panel" style={{ padding: "22px" }}>
            <p className="stat-label">{card.label}</p>
            <p className="stat-value">{card.value}</p>
            <p className="stat-meta">{card.meta}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginTop: "24px",
          alignItems: "start",
        }}
      >
        <div className="panel" style={{ padding: "24px", textAlign: "center" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              margin: "0 auto",
              borderRadius: "32px",
              overflow: "hidden",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-soft)",
            }}
          >
            {profile.profileImage ? (
              <img
                src={getImageUrl(profile.profileImage)}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <UserRound size={38} color="var(--text-faint)" />
              </div>
            )}
          </div>

          <h2
            style={{
              margin: "18px 0 6px",
              fontFamily: "var(--font-display)",
              fontSize: "28px",
            }}
          >
            {profile.fullName || "Your profile"}
          </h2>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Update your profile image and basic information used across the application.
          </p>

          <label className="btn-secondary" style={{ marginTop: "20px", cursor: "pointer" }}>
            <Camera size={16} />
            Upload Photo
            <input type="file" accept="image/*" onChange={handleImage} hidden />
          </label>
        </div>

        <div className="panel" style={{ padding: "24px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label className="field-label">Full Name</label>
              <div className="field-shell">
                <UserRound size={18} color="var(--text-faint)" />
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Phone</label>
              <div className="field-shell">
                <Phone size={18} color="var(--text-faint)" />
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Add your phone number"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Bio</label>
              <div className="field-shell">
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell others a bit about yourself."
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "22px" }}>
            <button onClick={saveProfile} className="btn-primary">
              <Save size={16} />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
