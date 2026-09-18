import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { routesName } from "../route/route.constant";
import TokenService from "../api/tokenservice";

const Header = () => {
  const navigate = useNavigate();
  const username = TokenService.getUsername();

  const handleLogout = () => {
    TokenService.clearToken();
    navigate(routesName.login, { replace: true });
  };

  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      py={"19px"}
      boxShadow="sm"
    >
      <Flex align="center" justify="space-between">
        <Heading size="md">Expense Tracker</Heading>

        <HStack spacing={4}>
          <HStack spacing={2}>
            <Avatar size="sm" name={username} />
            <Text fontWeight="medium" color="gray.700">
              {username}
            </Text>
          </HStack>

          <Button colorScheme="red" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
