import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGavel,
  faHome,
  faUsers,
  faHistory,
  faEnvelope,
  faCopyright,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../public/Images/logo no side.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full mt-16 md:mt-20 pt-12 md:pt-16 pb-8 md:pb-12 border-t border-white/10">
      {/* Decorative cricket stumps pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30 transform transition-transform duration-300 group-hover:scale-110 p-1.5 overflow-hidden">
                  <img
                    src={logo}
                    alt="P99Soft Logo"
                    className="w-full h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Auction Hub
                </span>
              </div>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Experience the thrill of cricket player auctions. Build your dream
              team through strategic bidding and competitive gameplay.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300 group"
                >
                  <FontAwesomeIcon
                    icon={faHome}
                    className="text-xs group-hover:translate-x-1 transition-transform duration-300"
                  />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/auction"
                  className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300 group"
                >
                  <FontAwesomeIcon
                    icon={faGavel}
                    className="text-xs group-hover:translate-x-1 transition-transform duration-300"
                  />
                  <span>Create Auction</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/players"
                  className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300 group"
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-xs group-hover:translate-x-1 transition-transform duration-300"
                  />
                  <span>Players</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/auctions/played"
                  className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300 group"
                >
                  <FontAwesomeIcon
                    icon={faHistory}
                    className="text-xs group-hover:translate-x-1 transition-transform duration-300"
                  />
                  <span>Previous Auctions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-text-secondary hover:text-primary transition-colors duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-text-secondary hover:text-primary transition-colors duration-300"
                >
                  How It Works
                </a>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-text-secondary hover:text-primary transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-text-secondary hover:text-primary transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:support@auctionhub.com"
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300 group"
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-sm group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-sm">support@auctionhub.com</span>
              </a>
              <p className="text-text-secondary text-sm leading-relaxed">
                Have questions? Reach out to us and we&apos;ll get back to you
                as soon as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <FontAwesomeIcon icon={faCopyright} className="text-xs" />
              <span>{currentYear} Auction Hub. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-text-secondary text-sm">
              <a
                href="#privacy"
                className="hover:text-primary transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="hover:text-primary transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative cricket stumps at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent"></div>
    </footer>
  );
};

export default Footer;
