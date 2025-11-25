import axiosInstance from "../utilities/axiosInstance";

const getPlayers = async () => {
  return await axiosInstance
    .get("players")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return (
        error.response?.data || {
          success: false,
          message: "Error fetching players",
        }
      );
    });
};

const addPlayer = async (name, role, isOrganizerPlayer = false) => {
  return await axiosInstance
    .post("players", {
      name,
      role,
      isOrganizerPlayer,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return (
        error.response?.data || {
          success: false,
          message: "Error adding player",
        }
      );
    });
};

const updatePlayer = async (id, name, role) => {
  return await axiosInstance
    .put(`players/${id}`, {
      name,
      role,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return (
        error.response?.data || {
          success: false,
          message: "Error updating player",
        }
      );
    });
};

const deletePlayer = async (id) => {
  return await axiosInstance
    .delete(`players/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return (
        error.response?.data || {
          success: false,
          message: "Error deleting player",
        }
      );
    });
};

const getPlayerCount = async () => {
  return await axiosInstance
    .get("players/count")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response?.data || { success: false, count: 0 };
    });
};

export { getPlayers, addPlayer, updatePlayer, deletePlayer, getPlayerCount };
