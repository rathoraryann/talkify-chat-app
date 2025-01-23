import { Box } from "@chakra-ui/react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/subComponents/Sidedrawer";

const Chatpage = () => {
  return (
    <div style={{ width: "100%" }}>
      <SideDrawer />
      <Box
        display={"flex"}
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        <MyChats />
        <Chatbox />
      </Box>
    </div>
  );
};

export default Chatpage;
