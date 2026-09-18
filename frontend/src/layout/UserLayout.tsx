import type { ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/sidebar";
import { Box, Flex } from "@chakra-ui/react";
interface UserLayoutProps {
  children: ReactNode;
}

export const UserLayOut = ({ children }: UserLayoutProps) => {
  return (
    <>
      <Header />
      <Flex minH="100vh">
        <Sidebar w="240px" flexShrink={0} />
        <Box flex="1" minW={0} overflowX="hidden" marginLeft={"240px"}>
          {children}
        </Box>
      </Flex>
    </>
  );
};
