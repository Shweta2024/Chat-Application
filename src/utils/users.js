//addUser, removeUser, getUser, getUsersInRoom

const users = [];

const addUser = ({ id, username, room }) => {
    //clean data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate user
    //if username OR room is empty return an error
    if (!username || !room) {
        return {
            error: "Username and Room are required!"
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.username === username && user.room === room;
    });

    //if already a user exists in the same room with same username, then show an error
    if (existingUser) {
        return {
            error: "Username is in use!"
        }
    }

    //store user
    const user = { id, username, room };
    users.push(user);
    return {
        user: user
    }
};

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    });

    //if index === -1, this implies user not found
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => {
    return users.find((user) => {
        return user.id === id;
    });
}

const getUsersInRoom = (room) => {
    return users.filter((user) => {
        return user.room === room;
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}