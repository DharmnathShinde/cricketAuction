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
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl bg-background-secondary/80 border-b border-white/10 shadow-lg shadow-black/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16 md:h-20">
          {/* Logo - Left */}
          <Link
            to="/"
            className="flex items-center gap-3 z-20 justify-self-start group cursor-pointer"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-20 h-20 md:w-24 md:h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30 transform transition-transform duration-300 group-hover:scale-110 p-1.5 md:p-2 overflow-hidden">
                <img
                  src={logo}
                  alt="P99Soft Logo"
                  className="w-full h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                Auction Hub
              </span>
            </div>
          </Link>

          {/* Navigation Links - Centered */}
          <nav
            className={
              barState
                ? "fixed md:relative top-16 md:top-auto left-0 right-0 md:left-auto md:right-auto md:col-start-2 md:col-end-3 md:row-start-1 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 lg:gap-8 bg-background-secondary/95 md:bg-transparent backdrop-blur-xl border-b md:border-0 border-white/10 w-full md:w-auto py-4 md:py-0 shadow-lg md:shadow-none transition-all duration-300 ease-in-out z-40 opacity-100 translate-y-0"
                : "fixed md:relative top-16 md:top-auto left-0 right-0 md:left-auto md:right-auto md:col-start-2 md:col-end-3 md:row-start-1 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 lg:gap-8 bg-background-secondary/95 md:bg-transparent backdrop-blur-xl border-b md:border-0 border-white/10 w-full md:w-auto py-4 md:py-0 shadow-lg md:shadow-none transition-all duration-300 ease-in-out z-40 opacity-0 md:opacity-100 -translate-y-4 md:translate-y-0 pointer-events-none md:pointer-events-auto max-md:invisible max-md:md:visible"
            }
          >
            <Link
              to="/"
              className={`relative uppercase text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 group px-4 py-2.5 rounded-lg ${
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
                  location.pathname === "/" ? "w-3/4" : "w-0 group-hover:w-3/4"
                }`}
              ></span>
            </Link>
            <Link
              to="/auction"
              className={`relative uppercase text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 group px-4 py-2.5 rounded-lg ${
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
            {user && (
              <Link
                to="/players"
                className={`relative uppercase text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 group px-4 py-2.5 rounded-lg ${
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
              className={`relative uppercase text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 group px-4 py-2.5 rounded-lg ${
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
          </nav>

          {/* Login/Logout Button - Right */}
          <div className="flex-shrink-0 z-20 justify-self-end">
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
  );
};

export default Navbar;
