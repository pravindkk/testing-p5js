const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users");
// const moment = require("moment");
// const { reset } = require("nodemon");
var timer;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// Run when client connects
io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        // socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        // Broadcast when a user connects
        // socket.broadcast
        //   .to(user.room)
        //   .emit(
        //     'message',
        //     formatMessage(botName, `${user.username} has joined the chat`)
        //   );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    socket.on("sentwhat", (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(msg);
        socket.broadcast.to(user.room).emit("receivedWhat", msg);

        // io.to(user.room).emit('receivedWhat', msg);
    });

    socket.on("sentLove", (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(msg);
        socket.broadcast.to(user.room).emit("receivedLove", msg);

        // io.to(user.room).emit('receivedWhat', msg);
    });

    socket.on("sentMissYou", (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(msg);
        socket.broadcast.to(user.room).emit("receivedMissYou", msg);

        // io.to(user.room).emit('receivedWhat', msg);
    });

    socket.on("checkPartnerHome", (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(msg);
        socket.broadcast.to(user.room).emit("isPartnerHome", msg);

        // io.to(user.room).emit('receivedWhat', msg);
    });

    // socket.on("timer", (msg) => {
    //     var after
    //     if (msg == true) {
    //         // timer = Number(moment().format('ss')) + 10
    //         const after = startCountingForHideAndSeek();
    //         console.log("hello");
    //     } else if (msg == false) {
    //         // after.cancel();
    //     }
    // });

    function startCountingForHideAndSeek() {
        // State for managing cleanup and cancelling
        let finished = false;
        let cancel = () => (finished = true);

        const promise = new Promise((resolve, reject) => {
                const id = setInterval(() => {
                    clearInterval(id);
                    toemitangry();
                    resolve();
                }, 10000);

                cancel = () => {
                    if (finished) {
                        return;
                    }

                    console.log("OK, I'll stop counting.");
                    clearInterval(id);
                    reject();
                };

                // If was cancelled before promise was launched, trigger cancel logic
                if (finished) {
                    // (to avoid duplication, just calling cancel)
                    cancel();
                }
            })
            // After any scenario, set finished = true so cancelling has no effect
            .then((resolvedValue) => {
                finished = true;
                return resolvedValue;
            })
            .catch((err) => {
                finished = true;
                return err;
            });

        return { promise, cancel };
    }

    // function toemitangry() {
    //     console.log("emiting");
    //     const user = getCurrentUser(socket.id);
    //     io.to(user.room).emit("angryface", true);
    //     // socket
    //     //   // .to(user.room)
    //     //   .emit(
    //     //     'angryface',
    //     //     true
    //     //   );
    //     // socket.emit('angryface', true)
    // }

    // Runs when client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

// function startCountingForHideAndSeek() {
//     // State for managing cleanup and cancelling
//     let finished = false;
//     let cancel = () => (finished = true);

//     const promise = new Promise((resolve, reject) => {
//             const id = setInterval(() => {
//                 clearInterval(id);
//                 toemitangry();
//                 resolve();
//             }, 10000);

//             cancel = () => {
//                 if (finished) {
//                     return;
//                 }

//                 console.log("OK, I'll stop counting.");
//                 clearInterval(id);
//                 reject();
//             };

//             // If was cancelled before promise was launched, trigger cancel logic
//             if (finished) {
//                 // (to avoid duplication, just calling cancel)
//                 cancel();
//             }
//         })
//         // After any scenario, set finished = true so cancelling has no effect
//         .then((resolvedValue) => {
//             finished = true;
//             return resolvedValue;
//         })
//         .catch((err) => {
//             finished = true;
//             return err;
//         });

//     return { promise, cancel };
// }

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));