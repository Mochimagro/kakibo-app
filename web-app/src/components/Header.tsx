import { Flex, Text } from "@chakra-ui/react";
import { SideMenu } from "./SideMenu";

export function Header() {
  return (
    <Flex
      as="header"
      position="relative"
      justify="center"
      align="center"
      bg="teal.500"
      color="white"
      py={4}
      boxShadow="md"
    >
      <Text fontSize="xl" fontWeight="bold">
        シンプル家計簿
      </Text>
      <SideMenu />
    </Flex>
  );
}
