import { useState } from "react";
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
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/slice/userSlice";
import axios from "axios";
import { isValidEmail } from "../miscellaneous/Regx";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleClick = () => {
    setShow(!show);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!inputs.email || !inputs.password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
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
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${window.location.origin / api / user / login}`,
        inputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      dispatch(login({ data: response.data }));
      localStorage.setItem("user", JSON.stringify(response.data));
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error Occured! invalid credentials",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px" sx={{ color: "black" }}>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          id="loginEmail"
          value={inputs.email}
          type="email"
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
            id="loginPassword"
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            type={show ? "text" : "password"}
            placeholder="Enter password"
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
              onClick={handleClick}
              sx={{ color: "black" }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() =>
          setInputs({ email: "example@gmail.com", password: "Abc@12345" })
        }
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
