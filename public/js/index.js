const socket = io();

function scrollToBottom() {
  // selectors
  const messages = $("#messages");
  const newMessage = messages.children("li:last-child");

  const numOfMessages = 5;

  // heights
  const clientHeight = messages.prop("clientHeight");
  const scrollTop = messages.prop("scrollTop");
  const scrollHeight = messages.prop("scrollHeight");
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight +
      scrollTop +
      newMessageHeight +
      lastMessageHeight * numOfMessages >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => console.log("Disconnected from server"));

socket.on("newMessage", msg => {
  const formattedTime = moment(msg.createdAt).format("h:mm a");
  const template = $("#message-template").html();
  const html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();
});

socket.on("newLocationMessage", msg => {
  const formattedTime = moment(msg.createdAt).format("h:mm a");
  const template = $("#location-message-template").html();
  const html = Mustache.render(template, {
    url: msg.url,
    from: msg.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();
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
