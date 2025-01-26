import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import SingleChat from "./SingleChat";

const Chatbox = () => {
  const selectedChat = useSelector((state) => state.chatSlice.selectedChat);
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="black"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat />
    </Box>
  );
};

export default Chatbox;
