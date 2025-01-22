import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../store/slice/userSlice";
import { isValidPass, isValidEmail } from "../miscellaneous/Regx";

const SignUp = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [picLoading, setPicLoading] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  });

  const handleClick1 = () => {
    setShow1(!show1);
  };

  const handleClick2 = () => {
    setShow2(!show2);
  };

  const postDetails = (pic) => {
    setPicLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chatApp");
      data.append("cloud_name", "dzb8zbosi");
      fetch("https://api.cloudinary.com/v1_1/dzb8zbosi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setInputs({ ...inputs, pic: data.url.toString() });
          setPicLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setPicLoading(true);
    if (
      !inputs.name ||
      !inputs.email ||
      !inputs.password ||
      !inputs.confirmPassword
    ) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (inputs.confirmPassword != inputs.password) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    if (!isValidEmail(inputs.email)) {
      toast({
        title: "invalid email",
        description: "format of the email should be correct",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setPicLoading(false);
      return;
    }
    if (!isValidPass(inputs.password)) {
      toast({
        title: "invalid password format",
        description:
          "At least 8 characters in length, At least one uppercase letter (A-Z), At least one lowercase letter (a-z), At least one digit (0-9), At least one special character (like @, $, !, %, *, ?, &, etc.)",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setPicLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/signup",
        inputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.msg == "user exists") {
        toast({
          title: "Email exists",
          description: "email exists, create account using another email",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setPicLoading(false);
        return;
      }
      toast({
        title: "Account created",
        description: "account created succesfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(login({ data: response.data }));
      setPicLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <VStack spacing="5px" sx={{ color: "black" }}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          value={inputs.name}
          placeholder="Enter Your Name"
          onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
          sx={{
            border: "1px solid black",
            _placeholder: { color: "gray.500" },
            _hover: { borderColor: "blue.500" },
            _focus: { borderColor: "blue.600" },
          }}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          id="signUpEmail"
          type="email"
          value={inputs.email}
          placeholder="Enter Your Email Address"
          onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
          sx={{
            border: "1px solid black",
            _placeholder: { color: "gray.500" },
            _hover: { borderColor: "blue.500" },
            _focus: { borderColor: "blue.600" },
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            id="signUpPassword"
            value={inputs.password}
            type={show1 ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            sx={{
              border: "1px solid black",
              _placeholder: { color: "gray.500" },
              _hover: { borderColor: "blue.500" },
              _focus: { borderColor: "blue.600" },
            }}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick1}
              color={"black"}
            >
              {show1 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            id="signUpConfirmPassword"
            type={show2 ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) =>
              setInputs({ ...inputs, confirmPassword: e.target.value })
            }
            sx={{
              border: "1px solid black",
              _placeholder: { color: "gray.500" },
              _hover: { borderColor: "blue.500" },
              _focus: { borderColor: "blue.600" },
            }}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick2}
              color={"black"}
            >
              {show2 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
          sx={{
            border: "1px solid black",
            _placeholder: { color: "gray.500" },
            _hover: { borderColor: "blue.500" },
            _focus: { borderColor: "blue.600" },
          }}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
