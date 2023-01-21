const socket = io()

//elements
const messageForm = document.querySelector("#message-form");
const messageFormInput = document.querySelector("input");
const messageFormButton = document.querySelector("#message-btn");
const locationButton = document.querySelector("#send-location");
const messages = document.querySelector("#messages");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

// client receives message from server
socket.on("message", function (message,callback) {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        newMessage: message
    });
    messages.insertAdjacentHTML("beforeend",html);
});

//clients receives location from the server
socket.on("locationMessage", function (url) {
    console.log(url);
    const html = Mustache.render(locationTemplate, {
        locationURL : url
    });
    messages.insertAdjacentHTML("beforeend", html);
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