import { useEffect, useState } from "react";
import ViewAuction from "../components/ViewAuction";
import Game from "../components/Game";
import Loader from "./Loading";
import io from "socket.io-client";

const url = "https://cricketauction-production-8eae.up.railway.app/";

const ViewAuctionPage = () => {
  const [socket] = useState(io(url));
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [play, setPlay] = useState(false);
  const [errors, setErrors] = useState({
    form: "",
    room: "",
  });
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(false);
  const [initial, setInitial] = useState(true);
  const [defaultPlayer, setDefaultPlayer] = useState("");
  const [isViewer, setIsViewer] = useState(true); // Always true for public viewers

  // Generate a guest username - generate once on mount
  const [guestUsername] = useState(
    () => `guest_${Math.random().toString(36).substring(2, 9)}`
  );

  useEffect(() => {
    socket.emit("check-user", {
      user: { username: guestUsername },
    });
  }, [socket, guestUsername]);

  useEffect(() => {
    socket.on("existing-user", (data) => {
      setUsers(data.users || []);
      setRoom(data.room);
      setInitial(false);
      setDefaultPlayer(data.initial);
      setIsViewer(data.isViewer || true);
      if (data.started) {
        setPlay(true);
        setView(false);
      } else {
        setView(true);
      }
    });

    socket.on("no-existing-user", () => {
      setInitial(false);
    });

    socket.on("view-result", (message) => {
      setLoading(false);
      if (!message.success) {
        return setErrors((prev) => ({
          ...prev,
          form: message.error,
        }));
      }
      // Success - the existing-user event will handle the rest
    });

    socket.on("start", () => {
      setPlay(true);
    });

    socket.on("players-preview", (data) => {
      // Players preview received (can be used for future features)
      console.log("Players preview:", data.players);
    });

    socket.on("users", (data) => {
      setUsers(data.users || []);
    });

    return () => {
      socket.off("existing-user");
      socket.off("no-existing-user");
      socket.off("view-result");
      socket.off("start");
      socket.off("players-preview");
      socket.off("users");
    };
  }, [socket]);

  return (
    <div className="glassmorphism min-h-screen">
      {initial ? (
        <Loader />
      ) : play ? (
        <Game
          room={room}
          socket={socket}
          users={users}
          user={{ username: guestUsername }}
          initial={defaultPlayer}
          isViewer={isViewer}
        />
      ) : view ? (
        <ViewAuction
          socket={socket}
          user={{ username: guestUsername }}
          room={room}
          setRoom={setRoom}
          errors={errors}
          loading={loading}
          setLoading={setLoading}
        />
      ) : (
        <ViewAuction
          socket={socket}
          user={{ username: guestUsername }}
          room={room}
          setRoom={setRoom}
          errors={errors}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default ViewAuctionPage;
