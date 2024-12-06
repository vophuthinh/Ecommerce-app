import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { backend_url, server } from "../server";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { BsArrow90DegLeft } from "react-icons/bs";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";
import useSocket, { socket } from "./useSocket";

const ENDPOINT = "https://socket-ecommerce-tu68.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = () => {
  const { response, triggerEvent } = useSocket();
  const { user } = useSelector((state) => state.user);
  console.log(response, "response");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const crve = searchParams.get("crve");
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const handleSend = () => {
    triggerEvent(1);
  };
  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  const getConversation = async () => {
    try {
      const resonse = await axios.get(
        `${server}/conversation/get-all-conversation-user/${user?.id}`,
        {
          withCredentials: true,
        }
      );

      setConversations(resonse.data.conversations);
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    getConversation();
  }, [user, messages,user?.id,currentChat]);

  useEffect(() => {
    if (user) {
      const sellerId = user?.id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    console.log(chat, "chatchatchat");
    const chatMembers = chat?.members?.find((member) => member != user?.id);
    const online = onlineUsers?.find((user) => user?.userId == chatMembers);
    return online ? true : false;
  };
  console.log(currentChat, "currentChatcurrentChat");
  // get messages
  const getMessage = async () => {
    try {
      const response = await axios.get(
        `${server}/message/get-all-messages/${crve}`
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getConversation();
    getMessage();
  }, [currentChat]);
  useEffect(() => {
    socket.connect();
    socket.on("newMsg", (data) => {
        getConversation();
        getMessage();
    });
    return () => {
      socket.off("newMsg");
      socket.disconnect();
    };
  }, []);
  // create new message
  handleSend(1);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user.id,
      text: newMessage,
      conversationId: currentChat.id,
    };
    const receiverId = currentChat.members.find((member) => member != user?.id);

    socketId.emit("sendMessage", {
      senderId: user?.id,
      receiverId,
      text: newMessage,
    });
    handleSend(1);
    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user.id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat.id}`, {
        lastMessage: newMessage,
        lastMessageId: user.id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImages(file);
    imageSendingHandler(file);
  };

  const imageSendingHandler = async (e) => {
    const formData = new FormData();

    formData.append("images", e);
    formData.append("sender", user.id);
    formData.append("text", newMessage);
    formData.append("conversationId", currentChat.id);

    const receiverId = currentChat.members.find((member) => member != user.id);

    socketId.emit("sendMessage", {
      senderId: user.id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat.id}`,
      {
        lastMessage: "Photo",
        lastMessageId: user.id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="w-full">
      {!open && (
        <>
          <div className="flex justify-between items-center px-4 py-3">
            <h1 className="text-center text-[30px] py-3 font-Poppins">
              All messages
            </h1>
            <button
              onClick={() => navigate("/profile")}
              className="bg-[#232f3e] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#febd69] hover:text-[#232f3e]"
            >
              Go to Profile
            </button>
          </div>
          {/* All messages list */}
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user?.id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
              />
            ))}
        </>
      )}

      {/* {open && (
        
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user.id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
        />
      )} */}
      {open && (
        <div className="flex items-start ">
          <div className="w-[80px] 800px:w-[330px]">
            {conversations &&
              conversations.map((item, index) => (
                <MessageList
                  data={item}
                  key={index}
                  index={index}
                  setOpen={setOpen}
                  setCurrentChat={setCurrentChat}
                  me={user?.id}
                  setUserData={setUserData}
                  userData={userData}
                  online={onlineCheck(item)}
                  setActiveStatus={setActiveStatus}
                />
              ))}
          </div>
          <div className="w-full bg-[#dadadaee] rounded-md">
            <SellerInbox
              setOpen={setOpen}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessageHandler={sendMessageHandler}
              messages={messages}
              sellerId={user.id}
              userData={userData}
              activeStatus={activeStatus}
              scrollRef={scrollRef}
              handleImageUpload={handleImageUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}&crve=${id}`);

    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user != me);
    console.log(data, "userIduserId");
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data, online, setActiveStatus]);

  return (
    <div
      className={`w-full flex p-3 px-3 border-b-2 border-slate-400 rounded-md ${
        active === index ? "bg-[#30303005]" : "bg-transparent"
      }  cursor-pointer`}
      onClick={(e) =>
      {
        
        setActive(index) ||
        handleClick(data.id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
      }
    >
      <div className="relative">
        <img
          src={`${backend_url}${user?.avatar}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#030303cc]">
          {data?.lastMessageId != userData?.id
            ? "Bạn:"
            : userData?.name.split(" ")[0] + ": "}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="w-[full] min-h-full flex flex-col justify-between p-5">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-400 rounded">
        <div className="flex">
          <img
            src={`${backend_url}${userData?.avatar}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Đang hoạt động" : ""}</h1>
          </div>
        </div>
        <BsArrow90DegLeft
          size={25}
          className="cursor-pointer mr-6"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[57vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${
                item.sender == sellerId ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              {item.sender != sellerId && (
                <img
                  src={`${backend_url}${userData?.avatar}`}
                  className="w-[40px] h-[40px] rounded-full mr-3"
                  alt=""
                />
              )}
              {item.images && (
                <img
                  src={`${backend_url}${item.images}`}
                  className="w-[300px] h-[300px] object-cover rounded-[15px] ml-2 mb-2"
                />
              )}
              {item.text != "" && (
                <div>
                  <div
                    className={`w-max p-2 rounded-[12px] ${
                      item.sender === sellerId ? "bg-[#0b2a52]" : "bg-[#38c776]"
                    } text-[#fff] h-min`}
                  >
                    <p>{item.text}</p>
                  </div>

                  <p className="text-[12px] text-[#000000d3] pt-1">
                    {format(item.createdAt)}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* send message input */}
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input} pb-4`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInbox;
