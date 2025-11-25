import { useEffect, useState, useContext } from "react";
import {
  getPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
} from "../services/player.service";
import { UserContext } from "../hooks/UserContext";
import Loader from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUser,
  faPlus,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";

const Players = () => {
  const { user } = useContext(UserContext);
  const isOrganizer = user && user.role === "organizer";
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    isOrganizerPlayer: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    const response = await getPlayers();
    if (response.success) {
      setPlayers(response.players || []);
    } else {
      setError(response.message || "Error fetching players");
    }
    setLoading(false);
  };

  // Separate players into user's own and organizer players
  const userPlayers = players.filter((p) => !p.isOrganizerPlayer);
  const organizerPlayers = players.filter((p) => p.isOrganizerPlayer);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.role) {
      setError("Please enter player name and select role");
      return;
    }

    setAdding(true);
    const response = await addPlayer(
      formData.name.trim(),
      formData.role,
      formData.isOrganizerPlayer
    );
    setAdding(false);

    if (response.success) {
      setSuccess(
        formData.isOrganizerPlayer
          ? "Player added successfully for all auctions!"
          : "Player added successfully!"
      );
      setFormData({ name: "", role: "", isOrganizerPlayer: false });
      fetchPlayers();
    } else {
      setError(response.message || "Error adding player");
    }
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.role) {
      setError("Please enter player name and select role");
      return;
    }

    setAdding(true);
    const response = await updatePlayer(
      editing._id,
      formData.name.trim(),
      formData.role
    );
    setAdding(false);

    if (response.success) {
      setSuccess("Player updated successfully!");
      setEditing(null);
      setFormData({ name: "", role: "" });
      fetchPlayers();
    } else {
      setError(response.message || "Error updating player");
    }
  };

  const handleDeletePlayer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this player?")) {
      return;
    }

    setError("");
    setSuccess("");
    const response = await deletePlayer(id);

    if (response.success) {
      setSuccess("Player deleted successfully!");
      fetchPlayers();
    } else {
      setError(response.message || "Error deleting player");
    }
  };

  const startEdit = (player) => {
    setEditing(player);
    setFormData({
      name: player.name,
      role: player.role,
      isOrganizerPlayer: player.isOrganizerPlayer || false,
    });
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({ name: "", role: "", isOrganizerPlayer: false });
    setError("");
    setSuccess("");
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      batter: "Batter",
      bowler: "Bowler",
      allrounder: "All Rounder",
      wicketkeeper: "Wicket Keeper",
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      batter: "from-orange-500 to-red-600",
      bowler: "from-blue-500 to-cyan-600",
      allrounder: "from-purple-500 to-pink-600",
      wicketkeeper: "from-green-500 to-emerald-600",
    };
    return colorMap[role] || "from-gray-500 to-gray-600";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/30 mr-4">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-4xl md:text-5xl text-primary"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Manage Players
              </span>
            </h1>
          </div>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            Add, edit, and manage your cricket players for the auction
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full mt-4"></div>
        </div>

        {/* Add/Edit Form - Only visible to organizers */}
        {isOrganizer && (
          <div className="glassmorphism p-8 rounded-3xl border border-white/20 backdrop-blur-xl mb-8 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                  editing
                    ? "from-secondary to-purple-600"
                    : "from-primary to-blue-600"
                } flex items-center justify-center shadow-lg`}
              >
                <FontAwesomeIcon
                  icon={editing ? faEdit : faPlus}
                  className="text-white text-xl"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                {editing ? "Edit Player" : "Add New Player"}
              </h2>
            </div>
            <form onSubmit={editing ? handleUpdatePlayer : handleAddPlayer}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-secondary mb-2 px-1 tracking-wide uppercase">
                  Player Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-text-muted text-lg"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter player name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 pl-12 py-3.5 rounded-xl bg-background-tertiary/50 border border-white/10 text-text-primary text-base placeholder:text-text-muted/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-white/20"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-secondary mb-2 px-1 tracking-wide uppercase">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-3.5 rounded-xl bg-background-tertiary/50 border border-white/10 text-text-primary text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-white/20"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="batter">Batter</option>
                  <option value="bowler">Bowler</option>
                  <option value="allrounder">All Rounder</option>
                  <option value="wicketkeeper">Wicket Keeper</option>
                </select>
              </div>
              {isOrganizer && !editing && (
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOrganizerPlayer}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isOrganizerPlayer: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded bg-background-tertiary/50 border border-white/10 text-primary focus:ring-2 focus:ring-primary/50"
                    />
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCrown}
                        className="text-yellow-400"
                      />
                      <span className="text-text-primary font-medium">
                        Add for all auctions (Organizer Player)
                      </span>
                    </div>
                  </label>
                  <p className="text-text-muted text-sm mt-2 ml-8">
                    This player will be available to all users in all auctions
                  </p>
                </div>
              )}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-primary-dark text-white font-semibold uppercase tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon
                    icon={adding ? faCheck : editing ? faEdit : faPlus}
                  />
                  {adding
                    ? "Saving..."
                    : editing
                    ? "Update Player"
                    : "Add Player"}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3.5 rounded-xl bg-background-tertiary border border-white/20 text-text-primary font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-white/10 hover:border-white/30 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400">
                <span className="text-lg">⚠</span>
                <span className="font-medium">{error}</span>
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-green-400">
                <FontAwesomeIcon icon={faCheck} />
                <span className="font-medium">{success}</span>
              </div>
            )}
          </div>
        )}

        {/* Players List */}
        <div className="glassmorphism p-8 rounded-3xl border border-white/20 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-white text-lg"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                {isOrganizer ? "All Players" : "Your Players"}
              </h2>
            </div>
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/30">
              <span className="text-primary font-bold text-lg">
                {players.length}
              </span>
            </div>
          </div>
          {players.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full bg-background-tertiary/50 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-text-muted text-4xl"
                />
              </div>
              <p className="text-text-secondary text-lg mb-2">
                No players added yet
              </p>
              <p className="text-text-muted text-sm">
                Add your first player using the form above!
              </p>
            </div>
          ) : (
            <>
              {organizerPlayers.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon
                      icon={faCrown}
                      className="text-yellow-400 text-lg"
                    />
                    <h3 className="text-xl font-bold text-text-primary">
                      Organizer Players (Available to All)
                    </h3>
                    <span className="px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-semibold">
                      {organizerPlayers.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {organizerPlayers.map((player) => (
                      <div
                        key={player._id}
                        className="glassmorphism p-6 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1 transform group relative"
                      >
                        <div className="absolute top-2 right-2">
                          <FontAwesomeIcon
                            icon={faCrown}
                            className="text-yellow-400 text-sm"
                          />
                        </div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRoleColor(
                                player.role
                              )} flex items-center justify-center shadow-lg`}
                            >
                              <span className="text-white text-lg font-bold">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-text-primary truncate">
                                {player.name}
                              </h3>
                              <div
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r ${getRoleColor(
                                  player.role
                                )}/20 border border-white/10 mt-1`}
                              >
                                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                                  {getRoleDisplay(player.role)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isOrganizer && (
                          <div className="flex gap-2 pt-4 border-t border-white/10">
                            <button
                              onClick={() => startEdit(player)}
                              className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="text-sm"
                              />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePlayer(player._id)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-sm"
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {userPlayers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-primary text-lg"
                    />
                    <h3 className="text-xl font-bold text-text-primary">
                      {isOrganizer ? "Your Personal Players" : "Your Players"}
                    </h3>
                    <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-semibold">
                      {userPlayers.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userPlayers.map((player) => (
                      <div
                        key={player._id}
                        className="glassmorphism p-6 rounded-2xl border border-white/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transform group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRoleColor(
                                player.role
                              )} flex items-center justify-center shadow-lg`}
                            >
                              <span className="text-white text-lg font-bold">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-text-primary truncate">
                                {player.name}
                              </h3>
                              <div
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r ${getRoleColor(
                                  player.role
                                )}/20 border border-white/10 mt-1`}
                              >
                                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                                  {getRoleDisplay(player.role)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-white/10">
                          <button
                            onClick={() => startEdit(player)}
                            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="text-sm"
                            />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player._id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-sm"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Players;
