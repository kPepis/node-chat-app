const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => console.log("Disconnected from server"));

socket.on("newMessage", msg => {
  console.log("newMessage", msg);
  const li = $("<li></li>");
  li.text(`${msg.from}: ${msg.text}`);

  $("#messages").append(li);
});

socket.on("newLocationMessage", msg => {
  const li = $("<li></li>");
  const a = $("<a target='_blank'>My current location</a>");

  li.text(`${msg.from}: `);
  a.attr("href", msg.url);
  li.append(a);
  $("#messages").append(li);
});

$("#message-form").on("submit", e => {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: $("[name=message]").val()
    },
    () => {}
  );
});

const geolocationButton = $("#send-location");
geolocationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      socket.emit("createLocationMsg", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      console.log(position);
    },
    () => {
      alert("Unable to fetch location.");
    }
  );
});
