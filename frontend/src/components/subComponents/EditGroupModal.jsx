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
import UserBadgeItem from "../subComponents/UserBadgeItem";
import UserListItem from "../subComponents/UserListItem";
import { useDispatch, useSelector } from "react-redux";
import {
  removeChat,
  setSelectedChat,
  updateGroupName,
  setSelectedChatGroupName,
} from "../../store/slice/chatSlice";
import axios from "axios";

const EditGroupModal = ({ edit, fetchMessages }) => {
  const selectedChat = useSelector((state) => state.chatSlice.selectedChat);
  const toast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState();
  const [searchedUsers, setSearchedUsers] = useState();
  const [groupChatState, setGroupChatState] = useState({
    groupName: selectedChat.chatName,
    users: selectedChat.users,
  });
  const user = useSelector((state) => state.userSlice.userData);
  const handleSearch = async (value) => {
    if (!value) return;
    const response = await axios.get(
      `${window.location.origin}/api/user?search=${value}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    setSearchedUsers(response.data);
  };

  const handleAddUser = async (userToAdd) => {
    if (user._id !== selectedChat.groupAdmin._id) {
      toast({
        title: "you are not admin",
        description: "only admin can add the user",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (groupChatState.users.includes(userToAdd)) {
      toast({
        title: "User exist",
        description: "user exist or already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const res = await axios.put(
        `${window.location.origin}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setGroupChatState((prev) => ({
        ...prev,
        users: [...(prev.users || []), userToAdd],
      }));
      toast({
        title: "User added",
        description: "User added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleRename = async () => {
    if (user._id !== selectedChat.groupAdmin._id) {
      toast({
        title: "You are not admin",
        description: "Only group admin can rename the group chat name",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (!groupChatState.groupName) {
      toast({
        title: "Value can not be enter",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const res = await axios.put(
        `${window.location.origin}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatState.groupName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(setSelectedChatGroupName({ chatName: res.data.chatName }));
      dispatch(
        updateGroupName({
          chatId: selectedChat._id,
          newChatGroupName: res.data.chatName,
        })
      );
      toast({
        title: "Rename successfull",
        description: "Group chat name is changed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      onClose;
    }
  };
  const removeUser = async (User) => {
    if (user._id !== selectedChat.groupAdmin._id) {
      toast({
        title: "Cannot remove User",
        description: "Only admins are allowed to remove user from group chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (user._id == User._id) return;
    try {
      const res = await axios.put(
        `${window.location.origin}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: User._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setGroupChatState((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user !== User),
      }));
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <Box>
      <Button onClick={onOpen}>{edit}</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="40px" display="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap" pb={3} width={"100%"}>
              {groupChatState &&
                groupChatState.users.map((User) => (
                  <UserBadgeItem
                    key={User._id}
                    user={User}
                    handleFunction={() => removeUser(User)}
                  />
                ))}
            </Box>
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              gap={"9px"}
            >
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  value={groupChatState.groupName}
                  mb={3}
                  onChange={(e) =>
                    setGroupChatState({
                      ...groupChatState,
                      groupName: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Box>
            <Box my={"9px"}>
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              {searchedUsers &&
                searchedUsers.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Box
              display={"flex"}
              width={"100%"}
              justifyContent={"space-between"}
            >
              <Button colorScheme="blue" onClick={handleRename}>
                Update Name
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EditGroupModal;
