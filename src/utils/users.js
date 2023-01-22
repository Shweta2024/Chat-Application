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

const removeuser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    });

    //user found, so remove it
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

//for testing purpose
const u1 = { id: 1, username: "shweta", room: "ss"};
const u2 = { id: 4, username: "ShwEta",room: "ss"};
const u3 = { id: 1, username: "shweta", room:""};
const u4 = { id: 1, username: "", room: "ss"};
const u5 = { id: 4, username: "ShwEta", room: "ss" };

// console.log(addUser(u1));
// console.log(addUser(u2));
// console.log(addUser(u3));
// console.log(addUser(u4));
// console.log(addUser(u5));

addUser({ id: 1, username: "shweta", room: "ss" })
addUser({ id: 2, username: "abc", room: "ss" })
addUser({ id: 3, username: "def", room: "ss" })
addUser({ id: 4, username: "ghi", room: "ss" })

addUser({ id: 3, username: "def", room: "aa" })
addUser({ id: 4, username: "ghi", room: "aa" })
console.log(users);

// console.log(removeuser(1));
// console.log(removeuser(2));

// console.log(users);

// const user = getUser(4);
// console.log(user);

// console.log(getUsersInRoom("aa"));