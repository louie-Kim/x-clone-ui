import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { log } from "node:console";
import { v4 as uuidv4 } from "uuid";

// socket.io server
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// server 와 연결될때마다 onlineUsers에 넣어둠
let onlineUsers = [];
console.log("onlineUsers", onlineUsers);

// 유저들을 onlineUsers에 추가 : socket.id -> socketID
const addUser = (username, socketID) => {
  const isExist = onlineUsers.find((user) => user.socketID === socketID);
  if (!isExist) {
    onlineUsers.push({ username, socketID });
    console.log(username + "added!!!!!!!!!!!!!!!!!!!!!!");
  }
};

// 종료시 유저를 onlineUsers에서 제거
const removeUser = (socketID) => {
  onlineUsers = onlineUsers.filter((user) => user.socketID !== socketID);
  console.log("user removed!!!!!");
};

//
const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  // <Socket> 렌더링시 연결 
  io.on("connection", (socket) => {
    
    // 1.-------------------------------- from Socket.tsx
    socket.on("newUser", (username) => {
      addUser(username, socket.id); // socket.id -> socketID : 변수명 변경
    });

    // 2.-------------------------------- from PostInteraction component
    socket.on("sendNotification", ({ receiverUserName, data }) => {

      // 알림받는 사람 찾기
      // 좋아요를 받는 유저가
      // onlineUsers에 아직 등록 안 돼 있으면 당연히 undefined
      const receiver = getUser(receiverUserName);
      console.log("Notification receiver", receiver);
      console.log("Notification receiver socketID ", receiver.socketID);
      console.log("Notification data", data);

      if (!receiver) {
        console.log(`Receiver ${receiverUserName} is offline or not registered.`);
        return;
      }

      // send norification to Notification component
      io.to(receiver.socketID).emit("getNotification", {
        // 유니크 아이디
        id: uuidv4(),
        ...data,
      });
    });

     // 3.--------------------------------
    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("disconnected-----------------", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
