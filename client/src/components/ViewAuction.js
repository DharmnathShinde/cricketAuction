import Form from "./Form";

const ViewAuction = ({
  socket,
  user,
  room,
  setRoom,
  errors,
  loading,
  setLoading,
}) => {
  const data = [
    {
      type: "room",
      title: "Room Id",
      placeholder: "Enter the auction room id",
      onChange: (value) => {
        setRoom(value);
      },
      icon: "",
      error: errors.room,
    },
  ];

  const message = () => {
    return (
      <p className="text-sm text-gray-400 italic mt-2 text-center">
        You will be able to view the auction but cannot bid.
      </p>
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!room || room.trim() === "") {
      return;
    }
    setLoading(true);
    const username =
      user?.username || `guest_${Math.random().toString(36).substring(2, 9)}`;
    socket.emit("viewAuction", {
      username: username,
      room: room.trim(),
    });
    // Don't set loading to false here - let the socket response handle it
  };

  return (
    <div>
      <Form
        title="View Auction"
        data={data}
        onFormSubmit={handleSubmit}
        message={message}
        error={errors.form}
        loading={loading}
      />
    </div>
  );
};

export default ViewAuction;
