import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGavel,
  faUser,
  faCoins,
  faClock,
  faArrowRight,
  faUsers,
  faCrown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Game = ({ users, socket, room, user, initial, isViewer }) => {
  const [timer, setTimer] = useState(-1);
  const [bidder, setBidder] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(0);
  const [player, setPlayer] = useState(initial || null);
  const [displayNext, setNext] = useState(false);
  let history = useHistory();

  // Update player when initial prop changes
  useEffect(() => {
    if (initial) {
      setPlayer(initial);
    }
  }, [initial]);

  useEffect(() => {
    // Request current player and bid details when component mounts
    socket.emit("fetch-details", {
      room,
      user: user?.username,
    });

    const handleServerDetails = (data) => {
      setBidder(data.bidder || "");
      setAmount(data.amount || 0);
      // If we receive a player, update it (this ensures we get the current player even if initial prop was empty)
      if (data.player) {
        setPlayer(data.player);
      }
    };

    socket.on("server-details", handleServerDetails);

    return () => {
      socket.off("server-details", handleServerDetails);
    };
  }, [socket, room, user]);

  useEffect(() => {
    socket.on("display", (data) => {
      setTimer(data.time);
    });

    socket.on("bid", (data) => {
      setBidder(data.currentBidder.bidder);
      setAmount(data.currentBidder.bid);
    });

    socket.on("bid-error", (data) => {
      setError(data.message);
    });

    socket.on("player", (data) => {
      setPlayer(data.player);
    });

    socket.on("game-over", () => {
      history.push("/auctions/played");
    });

    socket.on("next-error", (data) => {
      setError(data.message);
    });

    return () => {
      socket.off("display");
      socket.off("bid");
      socket.off("bid-error");
      socket.off("player");
      socket.off("game-over");
      socket.off("next-error");
    };
  }, [socket, history]);

  useEffect(() => {
    if (timer === 0) {
      setBidder("");
      setAmount(0);
      setNext(true);
    } else {
      setNext(false);
    }
  }, [timer]);

  const bid = () => {
    if (timer > 0) {
      socket.emit("bid", {
        room,
        user: user.username,
      });
    }
  };

  const next = () => {
    socket.emit("next", {
      room,
      user: user.username,
    });
    setNext(false);
  };

  const cancelAuction = () => {
    if (window.confirm("Are you sure you want to cancel this auction? This will end the auction for all participants.")) {
      socket.emit("cancelAuction", {
        room,
        username: user.username,
      });
    }
  };

  useEffect(() => {
    socket.on("auction-cancelled", (data) => {
      alert(data.message);
      history.push("/auction");
    });

    socket.on("cancel-error", (data) => {
      setError(data.message);
    });

    return () => {
      socket.off("auction-cancelled");
      socket.off("cancel-error");
    };
  }, [socket, history]);

  const getTimerColor = () => {
    if (timer < 4) return "text-red-500";
    if (timer < 7) return "text-yellow-500";
    return "text-primary";
  };

  const getTimerBgColor = () => {
    if (timer < 4) return "bg-red-500/10 border-red-500/30";
    if (timer < 7) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-primary/10 border-primary/30";
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <FontAwesomeIcon
              icon={faGavel}
              className="text-4xl text-primary mr-3"
            />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Live Auction
              </span>
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full"></div>
          {/* Cancel Auction Button - Only for Organizers */}
          {user?.role === "organizer" && (
            <div className="mt-4">
              <button
                onClick={cancelAuction}
                className="px-6 py-2 rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-500/70 mx-auto"
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel Auction
              </button>
            </div>
          )}
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Player Card Section */}
          <div className="lg:col-span-1 flex justify-center">
            {player ? <PlayerCard {...player} /> : ""}
          </div>

          {/* Bidding Control Section */}
          <div className="lg:col-span-2">
            <div className="glassmorphism p-6 md:p-8 rounded-2xl border border-white/20 backdrop-blur-xl">
              {/* Timer Display */}
              <div className="flex justify-center mb-8">
                <div
                  className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full ${getTimerBgColor()} border-4 flex items-center justify-center transition-all duration-500 ${
                    timer > 0 ? "animate-pulse" : ""
                  }`}
                >
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faClock}
                      className={`text-4xl md:text-5xl mb-2 ${getTimerColor()}`}
                    />
                    <div
                      className={`text-6xl md:text-8xl font-bold ${getTimerColor()} transition-all duration-500`}
                    >
                      {timer >= 0 ? timer : "—"}
                    </div>
                    <p className="text-sm text-text-muted mt-2 uppercase tracking-wide">
                      Seconds Left
                    </p>
                  </div>
                </div>
              </div>

              {/* Bidding Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Highest Bidder Card */}
                <div className="glassmorphism p-4 rounded-xl border border-white/10 bg-background-tertiary/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-white text-sm"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">
                        Highest Bidder
                      </p>
                      <p className="text-lg font-bold text-text-primary">
                        {bidder || "No bids yet"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bid Amount Card */}
                <div className="glassmorphism p-4 rounded-xl border border-white/10 bg-background-tertiary/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faCoins}
                        className="text-white text-sm"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">
                        Current Bid
                      </p>
                      <p className="text-lg font-bold text-red-400">
                        {amount > 0 ? `${amount}cr` : "No bids"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Only captains can bid - organizers manage, not bid */}
                {!isViewer && user?.role === "captain" && (
                  <button
                    onClick={bid}
                    disabled={timer <= 0}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                      timer <= 0
                        ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-lg hover:scale-105 transform"
                    }`}
                  >
                    <FontAwesomeIcon icon={faGavel} />
                    Place Bid
                  </button>
                )}
                {/* Only organizer can proceed to next player */}
                {displayNext && user?.role === "organizer" && (
                  <button
                    onClick={next}
                    className="flex-1 px-6 py-4 rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-secondary via-purple-600 to-accent text-white hover:shadow-lg hover:scale-105 transform"
                  >
                    Next Player
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                )}
              </div>

              {/* Budgets Section */}
              <div className="glassmorphism p-4 rounded-xl border border-white/10 bg-background-tertiary/50">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCoins} className="text-primary" />
                  Remaining Budgets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {users.map((userItem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-lg border border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {userItem.user.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-text-primary font-medium">
                          {userItem.user}
                        </span>
                      </div>
                      <span className="text-red-400 font-bold">
                        {userItem.budget}cr
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Team Rosters
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((userItem) => {
              const totalPlayers =
                (userItem.batsmen?.length || 0) +
                (userItem.wicketKeepers?.length || 0) +
                (userItem.allRounders?.length || 0) +
                (userItem.bowlers?.length || 0) +
                (userItem.unknown?.length || 0);

              return (
                <div
                  key={userItem.user}
                  className="glassmorphism p-6 rounded-2xl border border-white/20 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Team Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg font-bold">
                          {userItem.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">
                          {userItem.user}
                        </h3>
                        <p className="text-xs text-text-muted">Team Manager</p>
                      </div>
                    </div>
                    {userItem.user === user.username && (
                      <div className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                        <FontAwesomeIcon
                          icon={faCrown}
                          className="text-yellow-400 text-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Budget and Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-background-tertiary/50 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon
                          icon={faCoins}
                          className="text-red-400 text-sm"
                        />
                        <p className="text-xs text-text-muted uppercase tracking-wide">
                          Budget
                        </p>
                      </div>
                      <p className="text-lg font-bold text-red-400">
                        {userItem.budget || 0}cr
                      </p>
                    </div>
                    <div className="p-3 bg-background-tertiary/50 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="text-primary text-sm"
                        />
                        <p className="text-xs text-text-muted uppercase tracking-wide">
                          Players
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {totalPlayers}
                      </p>
                    </div>
                  </div>

                  {/* Team Composition */}
                  <div className="space-y-3">
                    {userItem.batsmen?.length > 0 && (
                      <div className="p-3 bg-background-tertiary/30 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                B
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-text-primary">
                              Batsmen
                            </span>
                          </div>
                          <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-full">
                            {userItem.batsmen.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {userItem.batsmen.map((player, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-text-secondary bg-background-secondary/50 px-2 py-1 rounded"
                            >
                              {player.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {userItem.wicketKeepers?.length > 0 && (
                      <div className="p-3 bg-background-tertiary/30 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                WK
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-text-primary">
                              Wicket Keepers
                            </span>
                          </div>
                          <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-full">
                            {userItem.wicketKeepers.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {userItem.wicketKeepers.map((player, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-text-secondary bg-background-secondary/50 px-2 py-1 rounded"
                            >
                              {player.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {userItem.allRounders?.length > 0 && (
                      <div className="p-3 bg-background-tertiary/30 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                AR
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-text-primary">
                              All Rounders
                            </span>
                          </div>
                          <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-full">
                            {userItem.allRounders.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {userItem.allRounders.map((player, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-text-secondary bg-background-secondary/50 px-2 py-1 rounded"
                            >
                              {player.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {userItem.bowlers?.length > 0 && (
                      <div className="p-3 bg-background-tertiary/30 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                BWL
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-text-primary">
                              Bowlers
                            </span>
                          </div>
                          <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-full">
                            {userItem.bowlers.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {userItem.bowlers.map((player, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-text-secondary bg-background-secondary/50 px-2 py-1 rounded"
                            >
                              {player.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {userItem.unknown?.length > 0 && (
                      <div className="p-3 bg-background-tertiary/30 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                ?
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-text-primary">
                              Unknown
                            </span>
                          </div>
                          <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-full">
                            {userItem.unknown.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {userItem.unknown.map((player, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-text-secondary bg-background-secondary/50 px-2 py-1 rounded"
                            >
                              {player.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {totalPlayers === 0 && (
                      <div className="text-center py-8 text-text-muted">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="text-4xl mb-3 opacity-30"
                        />
                        <p className="text-sm">No players yet</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-4 right-4 max-w-md z-50 animate-slide-up">
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm shadow-2xl">
              <p className="text-center text-red-400 text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
