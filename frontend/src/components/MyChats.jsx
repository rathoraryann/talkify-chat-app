import { useDispatch, useSelector } from "react-redux";
import { setChats, setSelectedChat } from "../store/slice/chatSlice";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import ChatLoading from "./subComponents/ChatLoading";
import GroupChatModal from "./subComponents/GroupChatModal";
import axios from "axios";
import { getSender } from "./miscellaneous/chatLogic";
import { IoMdAdd } from "react-icons/io";

const MyChats = () => {
  const user = useSelector((state) => state.userSlice.userData);
  const chats = useSelector((state) => state.chatSlice.chats);
  const selectedChat = useSelector((state) => state.chatSlice.selectedChat);
  const toast = useToast();
  const dispatch = useDispatch();

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/api/chat`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatch(setChats({ chats: response.data }));
    } catch (error) {
      toast({
        title: "error",
        description: "error",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={"3px"}
      w={{ base: "100%", md: "30%" }}
      borderRadius={"10px"}
      borderWidth={{ sm: "1px" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "27px", md: "31px" }}
        fontFamily={"sans-serif"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My chat
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "12px", md: "7px", lg: "13px" }}
            rightIcon={<IoMdAdd fontSize={"19px"} />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        p={"3px"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack
            overflowY={"scroll"}
            width={"100%"}
            height={"100%"}
            padding={0}
          >
            {chats.map((chat) => (
              <Box
                onClick={() => dispatch(setSelectedChat({ chat: chat }))}
                cursor={"pointer"}
                bgColor={selectedChat === chat ? "white" : "black"}
                color={selectedChat === chat ? "black" : "lightgray"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
                paddingX={"1px"}
              >
                <Text px={"12px"} fontSize={{ base: "15px", sm: "19px" }}>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
