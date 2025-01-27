import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { setSelectedChat } from "../store/slice/chatSlice";
import { getFullSender, getSender } from "./miscellaneous/chatLogic";
import ProfileModal from "./subComponents/ProfileModal";
import EditGroupModal from "./subComponents/EditGroupModal";
import { useEffect, useState } from "react";
import ScrollableChat from "./subComponents/ScrollableChat";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = `${window.location.origin}`;
var socket, selectedChatCompare;

const SingleChat = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chatSlice.selectedChat);
  const chats = useSelector((state) => state.chatSlice.chats);
  const user = useSelector((state) => state.userSlice.userData);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (e) => {
    if (e.key == "Enter" && newMessage) {
      setNewMessage("");
      socket.emit("stop typing", selectedChat._id);
      try {
        const response = await axios.post(
          `${window.location.origin}/api/message`,
          {
            chatId: selectedChat._id,
            message: newMessage,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        socket.emit("new message", response.data);
        setMessages([...messages, response.data]);
      } catch (error) {
        toast({
          title: "error",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.location.origin}/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessages(response.data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "error",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  const sendMessageButton = async () => {
    socket.emit("stop typing", selectedChat._id);
    try {
      const response = await axios.post(
        `${window.location.origin}/api/message`,
        {
          chatId: selectedChat._id,
          message: newMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      socket.emit("new message", response.data);
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "error",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var timeDiff = timenow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("msgRecieved", (newMessageRecieved) => {
      setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
    });
    return () => {
      socket.off("msgRecieved");
    };
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              fontSize={"24px"}
              icon={<IoMdArrowRoundBack />}
              onClick={() => {
                dispatch(setSelectedChat({ chat: null }));
              }}
            />
            <Text fontSize={"24"}>
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName}
            </Text>
            {!selectedChat.isGroupChat ? (
              <ProfileModal user={getFullSender(user, selectedChat.users)} />
            ) : (
              <EditGroupModal edit={"Edit"} fetchMessages={fetchMessages} />
            )}
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="gray"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping ? (
              <div
                style={{
                  backgroundColor: "white",
                  color: "black",
                  marginLeft: "15px",
                  margin: "4px",
                  padding: "4px",
                  width: "80px",
                  borderRadius: "10px",
                }}
              >
                ...typing
              </div>
            ) : (
              <></>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              display={"flex"}
            >
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                color={"black"}
                sx={{
                  border: "1px solid black",
                  _placeholder: { color: "gray.500" },
                  _hover: { borderColor: "blue.500" },
                  _focus: {
                    borderColor: "gray.600",
                    bg: "white",
                    color: "black",
                  },
                }}
              />
              <Button
                bgColor={"black"}
                onClick={sendMessageButton}
                marginLeft={"4px"}
              >
                Send
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
