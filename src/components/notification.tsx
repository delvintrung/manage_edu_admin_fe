import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { reloadSide } from "../function/reloadSide";
import { GoBell } from "react-icons/go";

interface Message {
  id: number;
  message: string;
  fromAdmin?: boolean;
}

interface Users {
  socketId: string;
  chats: Message[];
}

const Notify: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [totalNoti, setTotalNoti] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);

  const playNotificationSound = () => {
    const audio = new Audio("/images/bell-98033.mp3");
    audio.play();
  };

  useEffect(() => {
    const socketUrl = "http://localhost:3006";
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on("newOrderResponse", () => {
      setTotalNoti(totalNoti + 1);
      // reloadSide();
    });

    newSocket.on("error", (err) => {
      console.error("Socket error:", err);
      setError("An error occurred. Please try again later.");
    });

    return () => {
      newSocket.off("newOrderResponse");
      newSocket.close();
    };
  }, []);
  socket?.on("newOrderResponse", () => {
    playNotificationSound();
    setTotalNoti(totalNoti + 1);
    // reloadSide();
  });

  return (
    <>
      <div
        className="fixed"
        onClick={() => {
          setOpenModal(!openModal);
        }}
      >
        <GoBell size={30} fill="" />
        <p className="absolute top-0 right-[-5px] bg-red-400 text-white w-5 h-5 rounded-full text-center">
          {totalNoti}
        </p>
      </div>
      {openModal && (
        <div className=" absolute top-0 right-0 w-52 h-52 bg-white border-black border p-2 rounded-sm">
          <div className="h-40">
            <p>Có {totalNoti} đơn hàng mới</p>
          </div>
          <div>
            <button
              onClick={() => {
                setTotalNoti(0);
              }}
              className="bg-blue-500 text-white rounded-md p-1 ml-5"
            >
              Đánh dấu đã đọc
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notify;
