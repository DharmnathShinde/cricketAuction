import Bars from "./Bars";
import { useState, useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../hooks/UserContext";
import Loader from "./Loading.component";
import { logout } from "../services/auth.service";
import logo from "../../public/Images/logo no side.png";

const Navbar = () => {
  const [barState, setBarState] = useState(false);
  const { user, setUser, loading } = useContext(UserContext);
  let history = useHistory();
  const location = useLocation();

  const handleClick = async () => {
    if (!user) {
      history.push("/login");
      return;
    }

    await logout();
    setUser(null);
  };

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {barState && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setBarState(false)}
        />
      )}
      <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl bg-background-secondary/80 border-b border-white/10 shadow-lg shadow-black/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16 md:h-20">
            {/* Logo - Left */}
            <Link
              to="/"
              className="flex items-center gap-2 md:gap-3 z-20 justify-self-start group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 md:w-24 md:h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30 transform transition-transform duration-300 group-hover:scale-110 p-1 md:p-2 overflow-hidden">
                  <img
                    src={logo}
                    alt="P99Soft Logo"
                    className="w-full h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                  Auction Hub
                </span>
              </div>
            </Link>

            {/* Navigation Links - Centered */}
            <nav
              className={
                barState
                  ? "fixed md:relative top-16 md:top-auto right-0 md:left-auto md:right-auto md:col-start-2 md:col-end-3 md:row-start-1 flex flex-col md:flex-row justify-start md:justify-center items-stretch md:items-center gap-2 md:gap-6 lg:gap-8 bg-background-secondary/95 md:bg-transparent backdrop-blur-xl border-l md:border-0 border-white/10 w-64 md:w-auto md:h-auto py-6 md:py-0 px-4 md:px-0 shadow-2xl md:shadow-none transition-all duration-300 ease-in-out z-50 translate-x-0"
                  : "fixed md:relative top-16 md:top-auto right-0 md:left-auto md:right-auto md:col-start-2 md:col-end-3 md:row-start-1 flex flex-col md:flex-row justify-start md:justify-center items-stretch md:items-center gap-2 md:gap-6 lg:gap-8 bg-background-secondary/95 md:bg-transparent backdrop-blur-xl border-l md:border-0 border-white/10 w-64 md:w-auto md:h-auto py-6 md:py-0 px-4 md:px-0 shadow-2xl md:shadow-none transition-all duration-300 ease-in-out z-50 translate-x-full md:translate-x-0 pointer-events-none md:pointer-events-auto"
              }
            >
              <Link
                to="/"
                className={`relative uppercase text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 group px-4 py-2.5 rounded-lg w-full md:w-auto ${
                  location.pathname === "/"
                    ? "text-primary bg-primary/10 hover:bg-primary/15"
                    : "text-text-primary hover:text-primary hover:bg-white/5"
                }`}
                onClick={() => setBarState(false)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Home
                </span>
                <span
                  className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                    location.pathname === "/"
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </Link>
              {user && (
                <Link
                  to="/auction"
                  className={`relative uppercase text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 group px-4 py-2.5 rounded-lg w-full md:w-auto ${
                    location.pathname === "/auction"
                      ? "text-primary bg-primary/10 hover:bg-primary/15"
                      : "text-text-primary hover:text-primary hover:bg-white/5"
                  }`}
                  onClick={() => setBarState(false)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Auction
                  </span>
                  <span
                    className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                      location.pathname === "/auction"
                        ? "w-3/4"
                        : "w-0 group-hover:w-3/4"
                    }`}
                  ></span>
                </Link>
              )}
              <Link
                to="/view-auction"
                className={`relative uppercase text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 group px-4 py-2.5 rounded-lg w-full md:w-auto ${
                  location.pathname === "/view-auction"
                    ? "text-primary bg-primary/10 hover:bg-primary/15"
                    : "text-text-primary hover:text-primary hover:bg-white/5"
                }`}
                onClick={() => setBarState(false)}
              >
                <span className="relative z-10 flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  View Auction
                </span>
                <span
                  className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                    location.pathname === "/view-auction"
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </Link>
              {user && (
                <Link
                  to="/players"
                  className={`relative uppercase text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 group px-4 py-2.5 rounded-lg w-full md:w-auto ${
                    location.pathname === "/players"
                      ? "text-primary bg-primary/10 hover:bg-primary/15"
                      : "text-text-primary hover:text-primary hover:bg-white/5"
                  }`}
                  onClick={() => setBarState(false)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Players
                  </span>
                  <span
                    className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                      location.pathname === "/players"
                        ? "w-3/4"
                        : "w-0 group-hover:w-3/4"
                    }`}
                  ></span>
                </Link>
              )}
              <Link
                to="/auctions/played"
                className={`relative uppercase text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 group px-4 py-2.5 rounded-lg w-full md:w-auto ${
                  location.pathname === "/auctions/played"
                    ? "text-primary bg-primary/10 hover:bg-primary/15"
                    : "text-text-primary hover:text-primary hover:bg-white/5"
                }`}
                onClick={() => setBarState(false)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Previous
                </span>
                <span
                  className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                    location.pathname === "/auctions/played"
                      ? "w-3/4"
                      : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </Link>
              {/* Login/Logout Button - Mobile */}
              <div className="md:hidden w-full px-4 pt-2 border-t border-white/10 mt-2">
                {!loading ? (
                  <button
                    onClick={() => {
                      handleClick();
                      setBarState(false);
                    }}
                    className="relative w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-primary-dark text-white font-semibold text-xs uppercase tracking-wide overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 active:scale-95 group border border-primary/30"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {user ? "Logout" : "Login"}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-secondary via-purple-600 to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </button>
                ) : (
                  <div className="flex items-center justify-center py-2.5">
                    <Loader size="2" />
                  </div>
                )}
              </div>
            </nav>

            {/* Login/Logout Button - Right (Desktop only) */}
            <div className="hidden md:flex flex-shrink-0 z-20 justify-self-end">
              {!loading ? (
                <button
                  onClick={() => handleClick()}
                  className="relative px-5 md:px-7 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-primary-dark text-white font-semibold text-xs md:text-sm uppercase tracking-wide overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 group border border-primary/30"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {user ? "Logout" : "Login"}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary via-purple-600 to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              ) : (
                <div className="flex items-center justify-center">
                  <Loader size="2" />
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden absolute top-1/2 right-4 transform -translate-y-1/2 z-30">
              <Bars barState={barState} setBarState={setBarState} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
