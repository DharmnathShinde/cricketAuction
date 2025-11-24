//Hooks
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../hooks/UserContext";

// Components
import JoinAuction from "../components/JoinAuction";
import CreateAuction from "../components/CreateAuction";
import Game from "../components/Game";
import Lobby from "../components/Lobby";
import ViewAuction from "../components/ViewAuction.js";
import Loader from "./Loading";

import io from "socket.io-client";

const url = "https://cricketauction-production-8eae.up.railway.app/";

const Auction = () => {
  const { user } = useContext(UserContext);
  const [socket] = useState(io(url));
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [play, setPlay] = useState(false);
  const [main, setMain] = useState(false);
  const [errors, setErrors] = useState({
    form: "",
    room: "",
    lobby: "",
  });
  const [users, setUsers] = useState([]);
  const [created, setCreated] = useState(false);
  const [join, setJoin] = useState(false);
  const [view, setView] = useState(false);
  const [initial, setInitial] = useState(true);
  const [defaultPlayer, setDefaultPlayer] = useState("");
  const [isViewer, setIsViewer] = useState(false);
  const [playersPreview, setPlayersPreview] = useState([]);

  useEffect(() => {
    socket.emit("check-user", {
      user: user,
    });
  }, [socket, user]);

  useEffect(() => {
    socket.on("existing-user", (data) => {
      setUsers(data.users);
      setRoom(data.room);
      setInitial(false);
      setDefaultPlayer(data.initial);
      setIsViewer(data.isViewer || false);
      if (data.started) {
        setPlay(true);
        setView(false);
        setCreated(false);
      } else {
        if (data.isViewer) {
          // If viewing, show view mode lobby
          setView(true);
          setCreated(true);
          setMain(false);
        } else {
          setCreated(true);
          setMain(data.starter || false);
          setView(false);
        }
      }
    });

    socket.on("no-existing-user", () => {
      setInitial(false);
    });

    socket.on("join-result", (message) => {
      console.log(message);
      if (message.success) {
        console.log(message);
        setRoom(message.room);
        setIsViewer(message.isViewer || false);
        return setCreated(true);
      }
      return setErrors((prev) => ({
        ...prev,
        form: message.error,
      }));
    });

    socket.on("view-result", (message) => {
      console.log(message);
      if (!message.success) {
        return setErrors((prev) => ({
          ...prev,
          form: message.error,
        }));
      }
    });

    socket.on("start", () => {
      setPlay(true);
    });

    socket.on("players-preview", (data) => {
      setPlayersPreview(data.players || []);
    });
  }, [socket, user, users]);

  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data.users);
    });
  }, [user, socket]);

  return (
    <div className="glassmorphism min-h-screen">
      {initial ? (
        <Loader />
      ) : play ? (
        <Game
          room={room}
          socket={socket}
          users={users}
          user={user}
          initial={defaultPlayer}
          isViewer={isViewer}
        />
      ) : !created && !join && !view ? (
        <CreateAuction
          socket={socket}
          user={user}
          setCreated={setCreated}
          setJoin={setJoin}
          setView={setView}
          setRoom={setRoom}
          setMain={setMain}
        />
      ) : created ? (
        <Lobby
          socket={socket}
          users={users}
          code={room}
          setPlay={setPlay}
          setErrors={setErrors}
          main={main}
          error={errors.lobby}
          user={user}
          setCreated={setCreated}
          setJoin={setJoin}
        />
      ) : view && !created ? (
        <ViewAuction
          socket={socket}
          user={user}
          room={room}
          setRoom={setRoom}
          errors={errors}
          loading={loading}
          setLoading={setLoading}
        />
      ) : view && created ? (
        <div className="glassmorphism min-h-screen flex items-center justify-center text-xl">
          <div className="mx-auto py-4 px-1 w-[45rem] h-auto rounded-md glassmorphism border-none bg-background-tertiary">
            <div className="p-1 text-center tracking-[1.5px] m-4 flex flex-col">
              <div>
                Viewing Auction Room:{" "}
                <span className="text-theme font-semibold">{room}</span>
              </div>
              <div className="mt-4 text-hover">
                Users joined:{" "}
                {users.map((user) => {
                  return <div key={user.user}>{user.user}</div>;
                })}
              </div>
            </div>
            {playersPreview.length > 0 && (
              <div className="mt-4 p-4 bg-background-secondary rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-center">
                  Players Preview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {playersPreview.map((player, index) => (
                    <div
                      key={player._id || index}
                      className="p-2 bg-background-tertiary rounded-lg text-center"
                    >
                      <p className="font-semibold text-sm">{player.name}</p>
                      <p className="text-xs text-gray-400 capitalize mt-1">
                        {player.stats?.role || player.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col items-center justify-center mt-4">
              <p className="text-sm text-gray-400 italic mb-4">
                You are in view-only mode. Waiting for auction to start...
              </p>
            </div>
          </div>
        </div>
      ) : (
        <JoinAuction
          socket={socket}
          user={user}
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

export default Auction;
