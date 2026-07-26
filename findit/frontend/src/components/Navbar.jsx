import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSearchLocation, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", syncUser);

    syncUser();

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);

    navigate("/", { replace: true });

    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">

        <Link className="navbar-brand logo" to="/">
          <FaSearchLocation className="logo-icon" />
          <span>FindIt</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarMenu"
        >
          <ul className="navbar-nav ms-auto align-items-center gap-3">

            <li>
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li>
              <Link className="nav-link" to="/search">
                Search
              </Link>
            </li>

            <li>
              <Link className="nav-link" to="/report-lost">
                Report Lost
              </Link>
            </li>

            <li>
              <Link className="nav-link" to="/report-found">
                Report Found
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link className="nav-link" to="/myreports">
                    My Reports
                  </Link>
                </li>

                <li className="user-info">
                  <FaUserCircle className="user-icon" />

                  <span>
                    {user.name}
                  </span>
                </li>

                <li>
                  <button
                    className="btn logout-btn"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className="btn login-btn"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                <li>
                  <Link
                    className="btn register-btn"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;