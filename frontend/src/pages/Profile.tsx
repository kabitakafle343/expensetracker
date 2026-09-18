import {
  Avatar,
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMail, FiUser } from "react-icons/fi";

import TokenService from "../api/tokenservice";

const Profile = () => {
  const tokenDetails = TokenService.getTokenDetails();
  const username = TokenService.getUsername();

  const name = tokenDetails?.name || "Not available";
  const email = tokenDetails?.email || "Not available";

  const cardBg = useColorModeValue("white", "gray.800");
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex minH="100vh" bg={pageBg} align="center" justify="center" px={4}>
      <Card
        w="full"
        maxW="500px"
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        shadow="lg"
        overflow="hidden"
      >
        <Box h="100px" bgGradient="linear(to-r, blue.500, purple.500)" />

        <CardBody pt={0}>
          <Flex justify="center" mt="-50px" mb={5}>
            <Avatar
              size="xl"
              name={name}
              bg="blue.500"
              color="white"
              border="5px solid"
              borderColor={cardBg}
              fontSize="2xl"
            />
          </Flex>

          {/* Heading */}
          <Box textAlign="center" mb={8}>
            <Heading size="lg">{name}</Heading>

            <Text color={mutedColor} fontSize="sm" mt={1}>
              Personal Information
            </Text>
          </Box>

          <Stack spacing={0}>
            <Flex align="center" gap={4} py={4}>
              <Flex
                w="42px"
                h="42px"
                flexShrink={0}
                align="center"
                justify="center"
                borderRadius="lg"
                bg="purple.50"
                color="purple.500"
              >
                <Icon as={FiUser} boxSize={5} />
              </Flex>

              <Box>
                <Text fontSize="xs" color={mutedColor} mb={1}>
                  Username
                </Text>

                <Text fontWeight="600">{username || "Not available"}</Text>
              </Box>
            </Flex>

            <Divider />

            <Flex align="center" gap={4} py={4}>
              <Flex
                w="42px"
                h="42px"
                flexShrink={0}
                align="center"
                justify="center"
                borderRadius="lg"
                bg="green.50"
                color="green.500"
              >
                <Icon as={FiMail} boxSize={5} />
              </Flex>

              <Box minW={0}>
                <Text fontSize="xs" color={mutedColor} mb={1}>
                  Email Address
                </Text>

                <Text fontWeight="600" wordBreak="break-word">
                  {email}
                </Text>
              </Box>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default Profile;
