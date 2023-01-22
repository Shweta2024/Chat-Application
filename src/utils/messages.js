const generateMessage = function (username,text) {
    return {
        username: username,
        text: text,
        createdAt: new Date().getTime()
    }
}

const generateLocation = function (username,url) {
    return {
        username: username,
        url: url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}