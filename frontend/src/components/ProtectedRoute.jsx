import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles, children }) => {

  const { user } = useAuth();

  /* NOT LOGGED IN */

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ROLE NOT ALLOWED */

  if (roles && !roles.includes(user.role)) {

    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "PROVIDER") {
      return <Navigate to="/provider" replace />;
    }

    if (user.role === "USER") {
      return <Navigate to="/user" replace />;
    }

  }

  /* ACCESS GRANTED */

  return children;
};

export default ProtectedRoute;