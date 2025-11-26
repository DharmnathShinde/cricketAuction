import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUsers,
  faGavel,
  faExclamationTriangle,
  faTimes,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { getPlayerCount } from "../services/player.service";

const CreateAuction = ({
  socket,
  user,
  setCreated,
  setJoin,
  setView, // eslint-disable-line no-unused-vars
  setRoom,
  setMain,
}) => {
  const [showNoPlayersModal, setShowNoPlayersModal] = useState(false);
  const [checkingPlayers, setCheckingPlayers] = useState(false);
  const history = useHistory();

  useEffect(() => {
    socket.on("create-success", (data) => {
      setCreated(true);
      setRoom(data.room);
      setMain(true);
    });

    socket.on("create-error", (data) => {
      // Error handling can be added here if needed
      console.error("Create auction error:", data.message);
    });

    return () => {
      socket.off("create-success");
      socket.off("create-error");
    };
  }, [socket, setCreated, setRoom, setMain]);

  const newAuction = async () => {
    // Check if user is organizer
    if (user.role !== "organizer") {
      alert("Only organizers can create auctions.");
      return;
    }

    setCheckingPlayers(true);
    try {
      const response = await getPlayerCount();
      if (response.success && response.count > 0) {
        // User has players, proceed with creating auction
        const room = uuidv4();
        socket.emit("createAuction", {
          username: user.username,
          room,
        });
      } else {
        // No players found, show modal
        setShowNoPlayersModal(true);
      }
    } catch (error) {
      console.error("Error checking players:", error);
      // On error, show modal to be safe
      setShowNoPlayersModal(true);
    } finally {
      setCheckingPlayers(false);
    }
  };

  const handleGoToPlayers = () => {
    setShowNoPlayersModal(false);
    history.push("/players");
  };

  const joinAuction = () => {
    // Organizers cannot join auctions as players
    if (user?.role === "organizer") {
      alert("Organizers cannot join auctions as players. You can only create and manage auctions.");
      return;
    }
    setJoin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Static background with subtle pattern */}
      <div className="absolute inset-0 bg-background-secondary">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-background-secondary to-slate-800/50"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/30 mr-4">
              <FontAwesomeIcon
                icon={faGavel}
                className="text-5xl md:text-6xl text-primary"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Auction Hub
              </span>
            </h1>
          </div>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-6">
            Start a new auction room or join an existing one to begin bidding on
            your favorite players
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full"></div>
        </div>

        {/* Action Cards - Using flexbox for equal heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Create Auction Card */}
          <div className="glassmorphism p-8 rounded-3xl border border-white/20 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transform flex flex-col h-full">
            <div className="flex flex-col items-center text-center flex-grow">
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-blue-700 flex items-center justify-center shadow-xl shadow-primary/30 transform transition-transform duration-300 group-hover:scale-110">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-4xl text-white"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary animate-pulse"></div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Create Auction
              </h2>

              {/* Description - flex-grow to push button down */}
              <p className="text-text-secondary text-base mb-8 leading-relaxed flex-grow">
                {user?.role === "organizer" 
                  ? "Start your own auction room and become the host. Set up a new bidding session where you can invite other players to join and compete for the best talent."
                  : "Only organizers can create auction rooms. Please join an existing auction or contact an organizer."}
              </p>

              {/* Button */}
              <button
                onClick={newAuction}
                disabled={checkingPlayers || user?.role !== "organizer"}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-primary-dark text-white font-semibold uppercase tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {checkingPlayers 
                  ? "Checking..." 
                  : user?.role !== "organizer" 
                    ? "Organizers Only" 
                    : "Create New Room"}
              </button>
            </div>
          </div>

          {/* Join Auction Card */}
          <div className="glassmorphism p-8 rounded-3xl border border-white/20 backdrop-blur-xl hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/20 hover:-translate-y-2 transform flex flex-col h-full">
            <div className="flex flex-col items-center text-center flex-grow">
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary via-purple-600 to-purple-700 flex items-center justify-center shadow-xl shadow-secondary/30 transform transition-transform duration-300 group-hover:scale-110">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-4xl text-white"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary animate-pulse"></div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Join Auction
              </h2>

              {/* Description - flex-grow to push button down */}
              <p className="text-text-secondary text-base mb-8 leading-relaxed flex-grow">
                {user?.role === "organizer" 
                  ? "Organizers cannot join auctions as players. You can only create and manage auctions."
                  : "Enter an existing auction room using a room ID. Join other bidders in real-time and compete to build your dream team through strategic bidding."}
              </p>

              {/* Button */}
              <button
                onClick={joinAuction}
                disabled={user?.role === "organizer"}
                className={`w-full px-6 py-4 rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-secondary/30 hover:scale-105 transform active:scale-95 ${
                  user?.role === "organizer"
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-secondary via-purple-600 to-purple-700 text-white"
                }`}
              >
                {user?.role === "organizer" ? "Not Available" : "Join Existing Room"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* No Players Modal */}
      {showNoPlayersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="glassmorphism p-8 rounded-3xl border border-white/20 backdrop-blur-xl max-w-md w-full transform transition-all duration-300 animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setShowNoPlayersModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background-tertiary/50 hover:bg-background-tertiary border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="text-text-primary text-sm"
              />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-yellow-400 text-4xl"
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-4">
              No Players Added
            </h2>

            {/* Message */}
            <p className="text-text-secondary text-center mb-6 leading-relaxed">
              You need to add at least one player before creating an auction.
              Please go to the Players section and add players first.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoToPlayers}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-primary-dark text-white font-semibold uppercase tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Go to Players</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </button>
              <button
                onClick={() => setShowNoPlayersModal(false)}
                className="w-full px-6 py-3 rounded-xl bg-background-tertiary border border-white/20 text-text-primary font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-white/10 hover:border-white/30"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAuction;
