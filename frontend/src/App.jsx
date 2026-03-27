import { Navigate, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import UserDashboard from "./pages/user/UserDashboard";

import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderServices from "./pages/provider/ProviderServices";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderReviews from "./pages/provider/ProviderReviews";
import ProviderAnalytics from "./pages/provider/ProviderAnalytics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminServices from "./pages/admin/AdminServices";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminReviews from "./pages/admin/AdminReviews";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/LandingPage";

import PaymentConfirmPage from "./pages/PaymentConfirmPage";
import ProviderProfile from "./pages/ProviderProfile";
import UserBookings from "./pages/user/UserBookings";
import UserReviews from "./pages/user/UserReviews";

const App = () => {

  return (

    <Routes>

      {/* PUBLIC ROUTES */}

      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/payment-confirm/:bookingId/:amount"
        element={<PaymentConfirmPage />}
      />

      {/* PROTECTED ROUTES */}

      <Route element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>

        {/* USER */}

        <Route
          path="/user"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/bookings"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserBookings/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/reviews"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserReviews/>
            </ProtectedRoute>
          }
        />

        {/* PROVIDER */}

        <Route
          path="/provider"
          element={
            <ProtectedRoute roles={["PROVIDER"]}>
              <ProviderDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/services"
          element={
            <ProtectedRoute roles={["PROVIDER"]}>
              <ProviderServices/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/bookings"
          element={
            <ProtectedRoute roles={["PROVIDER"]}>
              <ProviderBookings/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/reviews"
          element={
            <ProtectedRoute roles={["PROVIDER"]}>
              <ProviderReviews/>
            </ProtectedRoute>
          }
        />
        <Route
  path="/provider/analytics"
  element={
    <ProtectedRoute roles={["PROVIDER"]}>
      <ProviderAnalytics />
    </ProtectedRoute>
  }
/>

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminUsers/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/providers"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminProviders/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminServices/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminBookings/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminReviews/>
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}

        <Route path="/profile" element={<Profile/>} />

        {/* SETTINGS */}

        <Route path="/settings" element={<Settings/>} />

      </Route>

      {/* PROVIDER PUBLIC PROFILE */}

      <Route path="/provider/:id" element={<ProviderProfile />} />

      {/* FALLBACK */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );

};

export default App;