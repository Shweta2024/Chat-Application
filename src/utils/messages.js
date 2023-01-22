const generateMessage = function (text) {
    return {
        text: text,
        createdAt: new Date().getTime()
    }
}

const generateLocation = function (url) {
    return {
        url: url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}