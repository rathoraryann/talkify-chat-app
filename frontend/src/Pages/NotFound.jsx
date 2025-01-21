import React from "react";
import { Flex, Text, Link } from "@chakra-ui/react";

const NotFound = () => {
  return (
    <Flex
      sx={{
        w: "100vw",
        h: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDir: "column",
      }}
    >
      <Text sx={{ fontSize: "25px", fontWeight: "600" }}>404 !</Text>
      <Text sx={{ fontSize: "19px", fontWeight: "400" }}>Page not found</Text>
      <Text sx={{ fontWeight: "200" }}>
        Sorry, the page you are looking for could not be found
      </Text>
      <Link
        href={"/"}
        sx={{
          bgColor: "white",
          color: "black",
          px: "3px",
          borderRadius: "3px",
          m: "2px",
        }}
      >
        Return Back
      </Link>
    </Flex>
  );
};

export default NotFound;
