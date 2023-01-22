const socket = io()

//elements
const messageForm = document.querySelector("#message-form");
const messageFormInput = document.querySelector("input");
const messageFormButton = document.querySelector("#message-btn");
const locationButton = document.querySelector("#send-location");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//parse
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix : true});

const autoscroll =  () => {
    // new message element
    const newMessage = messages.lastElementChild;

    //height of the new message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    //visible height
    const visibleHeight = messages.offsetHeight;

    //height of message container
    const containerHeight = messages.scrollHeight;

    //how have I already scrolled
    const scrollOffset = messages.scrollTop + visibleHeight;

    if (Math.round(containerHeight - newMessageHeight - 1) <= Math.round(scrollOffset)) {
        messages.scrollTop = messages.scrollHeight;
    }
}

// client receives message from server
socket.on("message", function (message,callback) {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        text: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

//clients receives location from the server
socket.on("locationMessage", function (message) {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        locationURL: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

// receives room datas from server
socket.on("roomData", function ({ room, users }) {
    const html = Mustache.render(sidebarTemplate, {
        room: room,
        users: users
    });

    sidebar.innerHTML = html;
});

//gets the message from the client
messageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    //disable
    messageFormButton.setAttribute("disabled", "disabled");
    const message = event.target.elements.message.value;

    //sends message to the server
    socket.emit("sendMessage", message, function () {
        //enable
        messageFormButton.removeAttribute("disabled");
        messageFormInput.value = "";
        messageFormInput.focus();
        console.log("Message sent successfully!");
    });
});

//sends location to the server
locationButton.addEventListener("click", function (event) {
    //disable
    locationButton.setAttribute("disabled", "disabled");

    if (!navigator.geolocation)
        return alert("Geolocation is not supported by your device!");
    
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
            //enable
            locationButton.removeAttribute("disabled");
            console.log("Location sent successfully!");
        });
    });
});

//sends the {username,room} to the server
socket.emit("join", { username, room }, function (error) {
    //direct user back to the join page
    if (error) {
        alert(error);
        location.href = "/";
    }
});

