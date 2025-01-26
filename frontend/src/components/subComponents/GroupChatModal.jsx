import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { unshiftChat } from "../../store/slice/chatSlice";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";

const GroupChatModal = ({ children }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = useSelector((state) => state.userSlice.userData);
  const [input, setInput] = useState({
    groupName: "",
    users: [],
  });
  const [query, setQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (!value) return;
    try {
      setQuery(true);
      const { data } = await axios.get(
        `${window.location.origin}/api/user?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSearchedUsers(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleAddUser = (user) => {
    if (input.users.includes(user)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setInput({ ...input, users: [...(input.users || []), user] });
  };
  const removeUser = (user) => {
    setInput((prevInp) => ({
      ...prevInp,
      users: prevInp.users.filter((User) => User._id != user._id),
    }));
  };
  const handleSubmit = async () => {
    if (!input.groupName || !input.users) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `${window.location.origin}/api/chat/group`,
        {
          name: input.groupName,
          users: JSON.stringify(input.users.map((u) => u._id)),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(unshiftChat({ chat: data }));
      onClose();
      setInput({
        groupName: "",
        users: [],
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                value={input.groupName}
                mb={3}
                onChange={(e) =>
                  setInput({ ...input, groupName: e.target.value })
                }
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Aryan, Prince, Ansh"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box width="100%" display="flex" flexWrap="wrap">
              {input.users &&
                input.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => removeUser(u)}
                  />
                ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchedUsers
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
