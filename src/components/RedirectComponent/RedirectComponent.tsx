import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function RedirectComponent() {
  const user = useSelector((store) => store.user);

  // We return a Route component that gets added to our list of routes
  return (
    <>
      {user.access_level > 1 ? (
        <Navigate to="/admin" />
      ) : user.id ? (
        <Navigate to={`/site/${user.site_id}`} />
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}

export default RedirectComponent;
