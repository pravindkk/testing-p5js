// const { localeData } = require("moment");

// const chatForm = document.getElementById("chat-form");
// const chatMessages = document.querySelector(".chat-messages");
// const roomName = document.getElementById("room-name");
// const userList = document.getElementById("users");

// const sendLoveButton = document.getElementById("sendLove");
// const sendMissYouButton = document.getElementById("sendMissYou");
// const leaveButton = document.getElementById("leave-btn");



// const moment = require('moment')

var value = "nil";
var startCount = false
var count = 0

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
// socket.on('message', (message) => {
//   console.log(message);
//   outputMessage(message);

//   // Scroll down
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// Message submit
// chatForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   // Get message text
//   let msg = e.target.elements.msg.value;

//   msg = msg.trim();

//   if (!msg) {
//     return false;
//   }

//   // Emit message to server
//   socket.emit('chatMessage', msg);

//   // Clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();
// });

// Output message to DOM
// function outputMessage(message) {
//   const div = document.createElement('div');
//   div.classList.add('message');
//   const p = document.createElement('p');
//   p.classList.add('meta');
//   p.innerText = message.username;
//   p.innerHTML += `<span>${message.time}</span>`;
//   div.appendChild(p);
//   const para = document.createElement('p');
//   para.classList.add('text');
//   para.innerText = message.text;
//   div.appendChild(para);
//   document.querySelector('.chat-messages').appendChild(div);
// }

// Add room name to DOM
function outputRoomName(room) {
    // roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    // userList.innerHTML = "";
    // users.forEach((user) => {
    //     const li = document.createElement("li");
    //     li.innerText = user.username;
    //     userList.appendChild(li);
    // });
}

//Prompt the user before leave chat room
// leaveButton.addEventListener("click", () => {
//     const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
//     if (leaveRoom) {
//         window.location = "../index.html";
//     } else {}
// });

// sendMissYouButton.addEventListener("click", () => {
//     count = 0
//     buggy.sendMissYou();
// });

// sendLoveButton.addEventListener("click", () => {
//     count = 0
//     buggy.sendLove();
// });

// document.getElementById("willPartnerHome").addEventListener("change", () => {
//     if (document.getElementById("willPartnerHome").checked == true) {
//         console.log("I'm Home");
//         buggy.buggyAtHome = true;
//         if (buggy.buggyAtHome == true && buggy.partnerAtHome == true) {
//             startCount = true
//         }
//     } else if (document.getElementById("willPartnerHome").checked == false) {
//         console.log("I'm Not Home");
//         buggy.buggyAtHome = false;
//     }
//     buggy.sendBuggyStatus();
// });

socket.on("isPartnerHome", (msg) => {
    buggy.receivedPartnerStatus(msg);
});

socket.on("receivedLove", (msg) => {
    buggy.displayLove(msg);
});

socket.on("receivedMissYou", (msg) => {
    buggy.displayMissYou(msg);
});

// socket.on("angryface", (msg) => {
//     if (msg == true) {
//         console.log(true);
//         buggy.isHappy = false;
//     }
// });

console.log(new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""));

// if (buggy.buggyAtHome == true && buggy.partnerAtHome == true) {
//   socket.emit('timer', true)
// } else if (buggy.buggyAtHome == false || buggy.partnerAtHome == false){
//   socket.emit('timer', false)
// }

var buggy = {

    buggyAtHome: true,
    partnerAtHome: true,
    isHappy: true,

    checkBuggyStatus: function() {
        if (pulse > 10) {
            if (this.buggyAtHome == false) {
                //buggy status was changed
                //send buggy status
            }

            this.buggyAtHome = true;
        } else {
            if (this.buggyAtHome == true) {
                //buggy status was changed
                //send buggy status
            }

            this.buggyAtHome = false;
        }
    },

    receivedPartnerStatus: function(msg) {
        // var after = startTimer()
        if (msg == true) {
            console.log("partner is at home");
            this.partnerAtHome = true;

            if (this.buggyAtHome == true && this.partnerAtHome == true) {
                console.log("all good")
                startCount = true
                    // after.starting()
            } else if (this.buggyAtHome == false || this.partnerAtHome == false) {
                startCount = false
                count = 0
                    // after.cancel();
            }
        } else if (msg == false) {
            console.log("partner is not at home");
            this.partnerAtHome = false;
        }

        // this.partnerAtHome = partnerSendAtHome
    },

    sendBuggyStatus: function() {
        socket.emit("checkPartnerHome", this.buggyAtHome);
    },

    displayStatus: function() {
        if (this.buggyAtHome == true && this.partnerAtHome == true) {
            //display full heart icon
        } else if (this.buggyAtHome == true) {
            //display left heart icon
        } else if (this.partnerAtHome == true) {
            //display left heart icon
        }
    },

    sendLove: function() {
        if (this.buggyAtHome == true) {
            //send love
            console.log("sending love");
            socket.emit("sentLove", true);
        }
    },

    displayLove: function(msg) {
        if (this.buggyAtHome == true && msg == true) {
            //display love icon
            console.log("Received Love");
        }
    },

    sendMissYou: function() {
        if (this.buggyAtHome == true) {
            //send miss you
            console.log("sending miss you");
            socket.emit("sentMissYou", true);
        }
    },

    displayMissYou: function(msg) {
        if (this.buggyAtHome == true && msg == true) {
            //display miss you icon
            console.log("Received Miss You");
        }
    },

};


let backgroundIMG

function preload() {
    console.log(windowWidth)
    backgroundIMG = loadImage('/assets/bg.png');
    // loveYouImg = createImg('assets/loveYouImage.png', 'loveYouImge').size(windowWidth * 0.212, windowWidth * 0.0778)
    //     .position(windowWidth / 4 + 20, windowHeight / 4 + 20).mousePressed(console.log("works"))
    // missYouImg = createImg('assets/missYouImage.png', 'missYouImage').size(windowWidth * 0.212, windowWidth * 0.0778)
    //     .position(windowWidth / 2 + 40, windowHeight / 4 + 20).mousePressed(buggy.sendMissYou)
    // backgroundIMG.resize(windowWidth, 0.520 * windowWidth)
}

function setup() {

    // loadImage('assets/bg.png', img => {
    //     image(img, 0, 0)
    // })
    loveYouImg = createImg('assets/loveYouImage.png', 'loveYouImge').size(windowWidth * 0.212, windowWidth * 0.0778)
        .position(windowWidth / 4, windowHeight / 4).mousePressed(toSendLove)
    missYouImg = createImg('assets/missYouImage.png', 'missYouImage').size(windowWidth * 0.212, windowWidth * 0.0778)
        .position(windowWidth / 2 + windowWidth / 20, windowHeight / 4).mousePressed(toSendMissYou)
}

function toSendLove() {
    buggy.sendLove()
}

function toSendMissYou() {
    buggy.sendMissYou()
}

function draw() {
    createCanvas(windowWidth, windowHeight)

    background(255, 244, 229)

    image(backgroundIMG, 0, windowHeight / 2 - windowWidth * 0.625 / 2, windowWidth, windowWidth * 0.625);

    if (buggy.buggyAtHome == true && buggy.partnerAtHome == true && startCount == true) {
        count += 1
        console.log(count)
        if (count > 15) {
            buggy.isHappy = false
            console.log("angry")
            startCount = false
            count = 0
        }
    }


}