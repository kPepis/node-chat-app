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

  const msgTexbox = $("[name=message]");

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: msgTexbox.val()
    },
    () => {
      msgTexbox.val("");
    }
  );
});

const geolocationButton = $("#send-location");

geolocationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  geolocationButton.attr("disabled", "disabled").text("Sending location...");

  navigator.geolocation.getCurrentPosition(
    position => {
      geolocationButton.removeAttr("disabled").text("Send location");
      socket.emit("createLocationMsg", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      console.log(position);
    },
    () => {
      geolocationButton.removeAttr("disabled").text("Send location");
      alert("Unable to fetch location.");
    }
  );
});
