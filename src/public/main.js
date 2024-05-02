const socket = io();

//get client element
const clientsTotal = document.getElementById("client-total");

//get messages elements
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

//set clients number
socket.on("clients-total", (data) => {
  clientsTotal.innerHTML = `Total clients ${data}`;
});

//handel sending messages
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;

  const data = {
    name: nameInput.value,
    message: message,
    dateTime: new Date(),
  };
  socket.emit("send-message", data);
  messageToUI(true, data);
  messageInput.value = "";
});

socket.on("chat-message", (data) => {
  console.log(data);
  messageToUI(false, data);
});

function messageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
    <p class="message">
      ${data.message}
      <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
    </p>
  </li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message`,
  });
});
messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
