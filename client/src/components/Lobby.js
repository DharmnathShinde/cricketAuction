import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faUsers,
  faPlay,
  faSignOutAlt,
  faUser,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const Lobby = ({
  socket,
  code,
  setErrors,
  error,
  users,
  main,
  user,
  setCreated,
  setJoin,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(code);
    } else {
      document.execCommand("copy", true, code);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const start = () => {
    if (users.length < 2) {
      return setErrors((prev) => ({
        ...prev,
        lobby: "At least two users should join for the auction to start.",
      }));
    }
    socket.emit("requestPlay", {
      room: code,
      username: user.username,
    });
  };

  const exit = () => {
    socket.emit("exit", {
      room: code,
      user: user.username,
    });
    setCreated(false);
    setJoin(false);
  };

  const cancelAuction = () => {
    if (window.confirm("Are you sure you want to cancel this auction? This will end the auction for all participants.")) {
      socket.emit("cancelAuction", {
        room: code,
        username: user.username,
      });
    }
  };

  useEffect(() => {
    socket.on("auction-cancelled", (data) => {
      alert(data.message);
      setCreated(false);
      setJoin(false);
    });

    socket.on("cancel-error", (data) => {
      alert(data.message);
    });

    socket.on("start-error", (data) => {
      setErrors((prev) => ({
        ...prev,
        lobby: data.message,
      }));
    });

    return () => {
      socket.off("auction-cancelled");
      socket.off("cancel-error");
      socket.off("start-error");
    };
  }, [socket, setCreated, setJoin, setErrors]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
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

      <div className="relative z-10 max-w-4xl w-full">
        {/* Heading Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <FontAwesomeIcon
              icon={faUsers}
              className="text-4xl text-primary mr-3"
            />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Auction Lobby
              </span>
            </h1>
          </div>
          <p className="text-text-secondary text-lg">
            Waiting for players to join. Share the room code below to invite
            others.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full mt-4"></div>
        </div>

        {/* Main Content Card */}
        <div className="glassmorphism p-8 md:p-10 rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl">
          {/* Room Code Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
              <FontAwesomeIcon icon={faCopy} className="mr-2 text-primary" />
              Room Code
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-6 py-4 bg-background-tertiary/50 border border-white/10 rounded-xl flex items-center justify-between group hover:border-primary/50 transition-all duration-300">
                <code className="text-2xl md:text-3xl font-mono font-bold text-primary tracking-wider">
                  {code}
                </code>
                <button
                  onClick={copyToClipboard}
                  className={`ml-4 px-4 py-2 rounded-lg transition-all duration-300 ${
                    copied
                      ? "bg-green-500/20 border border-green-500/50"
                      : "bg-primary/20 border border-primary/50 hover:bg-primary/30"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faCopy}
                    className={`text-lg ${
                      copied ? "text-green-400" : "text-primary"
                    }`}
                  />
                </button>
              </div>
            </div>
            {copied && (
              <p className="mt-2 text-sm text-green-400 font-medium flex items-center gap-1">
                <span>✓</span>
                <span>Code copied to clipboard!</span>
              </p>
            )}
            <p className="mt-3 text-sm text-text-muted">
              Share this code with your friends so they can join the auction
              room.
            </p>
          </div>

          {/* Users Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary flex items-center">
                <FontAwesomeIcon icon={faUsers} className="mr-2 text-primary" />
                Players Joined
              </h2>
              <div className="px-4 py-1.5 bg-primary/20 border border-primary/50 rounded-full">
                <span className="text-primary font-semibold">
                  {users.length} {users.length === 1 ? "Player" : "Players"}
                </span>
              </div>
            </div>
            {main && user?.role === "organizer" && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-sm text-blue-400">
                  <span className="font-semibold">Organizer Mode:</span> You are managing this auction. You cannot join as a player.
                </p>
              </div>
            )}

            {users.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-4xl mb-3 opacity-50"
                />
                <p>
                  No players joined yet. Share the room code to invite others.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {users.map((userItem) => (
                  <div
                    key={userItem.user}
                    className="flex items-center gap-3 p-4 bg-background-tertiary/50 border border-white/10 rounded-xl hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-white text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-semibold">
                        {userItem.user}
                      </p>
                      {userItem.user === user.username && (
                        <p className="text-xs text-primary">You</p>
                      )}
                    </div>
                    {main && userItem.user === user.username && (
                      <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full border border-primary/50">
                        Host
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {users.length < 2 && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-sm text-yellow-400">
                  <span className="font-semibold">Note:</span> At least 2
                  players are required to start the auction. Currently{" "}
                  {users.length}{" "}
                  {users.length === 1 ? "player has" : "players have"} joined.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {main && user?.role === "organizer" && (
              <button
                onClick={start}
                disabled={users.length < 2}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  users.length < 2
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-lg hover:scale-105 transform"
                }`}
              >
                <FontAwesomeIcon icon={faPlay} />
                Start Auction
              </button>
            )}
            {main && user?.role === "organizer" && (
              <button
                onClick={cancelAuction}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-500/70"
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel Auction
              </button>
            )}
            <button
              onClick={exit}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 bg-background-tertiary/50 border border-white/20 text-text-primary hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Exit Lobby
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <p className="text-center text-red-400 text-sm font-medium">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
