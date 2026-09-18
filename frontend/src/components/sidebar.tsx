import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Avatar,
} from "@chakra-ui/react";

import { NavLink, useNavigate } from "react-router-dom";
import TokenService from "../api/tokenservice";
import { routesName } from "../route/route.constant";

const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9.5L12 3l9 6.5" />
    <path d="M5 8v12h14V8" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

const ExpenseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 15h3" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

const WalletIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 7H5a3 3 0 0 1 0-6h14v4" />
    <path d="M4 5h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    <path d="M16 13h.01" />
  </svg>
);

const Sidebar = ({ w }: any) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    TokenService.clearToken();
    navigate(routesName.login, { replace: true });
  };
  const username = TokenService.getUsername();
  const menuItems = [
    {
      label: "Dashboard",
      icon: <HomeIcon />,
      path: "/dashboard",
    },
    {
      label: "Expenses",
      icon: <ExpenseIcon />,
      path: "/user",
    },
  ];

  return (
    <Box
      w={w}
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      position="fixed"
      left="0"
      top="0"
      display="flex"
      flexDirection="column"
    >
      {/* Logo */}
      <Flex
        h="80px"
        px="6"
        align="center"
        gap="3"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Flex
          w="42px"
          h="42px"
          bg="blue.600"
          color="white"
          borderRadius="xl"
          align="center"
          justify="center"
        >
          <WalletIcon />
        </Flex>

        <Box>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            Expense
            <Text as="span" color="blue.600">
              Track
            </Text>
          </Text>

          <Text fontSize="xs" color="gray.500">
            Manage your money
          </Text>
        </Box>
      </Flex>

      {/* Navigation */}
      <Box flex="1" px="4" py="6">
        <Text
          px="3"
          mb="3"
          fontSize="xs"
          fontWeight="bold"
          color="gray.400"
          textTransform="uppercase"
        >
          Menu
        </Text>

        <VStack align="stretch" gap="2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <HStack
                  px="4"
                  py="3"
                  borderRadius="xl"
                  gap="3"
                  bg={isActive ? "blue.50" : "transparent"}
                  color={isActive ? "blue.600" : "gray.600"}
                  fontWeight={isActive ? "semibold" : "medium"}
                  transition="all 0.2s"
                  _hover={{
                    bg: "gray.50",
                    color: "blue.600",
                  }}
                >
                  {item.icon}

                  <Text fontSize="sm">{item.label}</Text>
                </HStack>
              )}
            </NavLink>
          ))}
        </VStack>

        {/* Account */}
        <Text
          px="3"
          mt="8"
          mb="3"
          fontSize="xs"
          fontWeight="bold"
          color="gray.400"
          textTransform="uppercase"
        >
          Account
        </Text>

        <NavLink to="/profile" style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <HStack
              px="4"
              py="3"
              borderRadius="xl"
              gap="3"
              bg={isActive ? "blue.50" : "transparent"}
              color={isActive ? "blue.600" : "gray.600"}
              fontWeight={isActive ? "semibold" : "medium"}
              _hover={{
                bg: "gray.50",
                color: "blue.600",
              }}
            >
              <UserIcon />

              <Text fontSize="sm">Profile</Text>
            </HStack>
          )}
        </NavLink>
      </Box>

      <Box px="4" pb="4">
        <Flex
          align="center"
          gap={3}
          p={3}
          mb={2}
          bg="gray.50"
          borderRadius="xl"
        >
          <Avatar size="sm" name={username} />

          <Box flex="1" minW={0}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.800"
              isTruncated
            >
              {username.split("@")[0]}
            </Text>

            <Text fontSize="xs" color="gray.500" isTruncated>
              {username}
            </Text>
          </Box>
        </Flex>

        <Button
          w="100%"
          variant="ghost"
          justifyContent="flex-start"
          gap="3"
          color="gray.500"
          borderRadius="xl"
          _hover={{
            bg: "red.50",
            color: "red.500",
          }}
          onClick={handleLogout}
        >
          <LogoutIcon />
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
