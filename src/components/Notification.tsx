"use client";

import { useEffect, useState } from "react";
import Image from "./Image";
import { socket } from "@/socket";
import { set } from "zod";
import { useRouter } from "next/navigation";

type NotificationType = {
  id: string;
  senderUserName: string;
  type: "like" | "comment" | "repost" | "follow";
  link: string;
};

const Notification = () => {
  const [notifications, setNotification] = useState<NotificationType[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    socket.on("getNotification", (data: NotificationType) => {
      setNotification((prev) => [...prev, data]); // 새로운 알림 추가
    });
  }, []);

  const router = useRouter();

  // 전부 읽음 처리
  const reset = () => {
    setNotification([]); // 알림 초기화
    setOpen(false); // 알림창 닫기
  };
  const handleClick = (notification: NotificationType) => {
    console.log("notification", notification); // 클릭한 알림

    const filteredList = notifications.filter((n) => n.id !== notification.id);
    setNotification(filteredList); // 클릭한 알림 제거
    setOpen(false);
    router.push(notification.link); // 알림 클릭 시 해당 링크로 이동
  };

  //  {""} -> 공백을 넣어주는 역할
  return (
    <div className="relative">
      <div
        className="cursor-pointer p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
        onClick={() => setOpen((prev) => !prev)}
      >
        {" "}
        <div className="relative">
          <Image path={`New%20Folder/notification.svg`} alt="" w={24} h={24} />
          {notifications.length > 0 && (
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-iconBlue p-2 rounded-full flex items-center justify-center text-sm">
              {notifications.length}
            </div>
          )}
        </div>
        <span className="hidden xxl:inline">Notifications</span>
      </div>
      {open && (
        <div className="absolute -right-full p-4 rounded-lg bg-white text-black flex flex-col gap-4 w-max">
          <h1 className="text-xl text-textGray">Notification</h1>
          {notifications.map((n) => (
            <div
              className="cursor-pointer"
              key={n.id}
              onClick={() => handleClick(n)}
            >
              <b>{n.senderUserName}</b>
              {""}
              {n.type === "like"
                ? " liked your post"
                : n.type === "repost"
                ? "re-posted yout post"
                : n.type === "comment"
                ? "replied your post"
                : "followed you"}
            </div>
          ))}
          <button
            className="bg-black text-white p-2 text-sm rounded-lg"
            onClick={reset}
          >
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
