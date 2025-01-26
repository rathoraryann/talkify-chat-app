import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../miscellaneous/chatLogic";

const ScrollableChats = ({ messages }) => {
  const user = useSelector((state) => state.userSlice.userData);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt={"7px"}
                  mr={1}
                  size={"sm"}
                  cursor={"pointer"}
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#4DA6FF" : "#6AFF4D"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                margin: "1px 2px",
                maxWidth: "75%",
                color: "black",
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChats;
