import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/quiz");
    }
  }, [location, navigate]);

  return (
    <>
      <Outlet />
    </>
  );
}