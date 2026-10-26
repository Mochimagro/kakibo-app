import { Flex, Text } from "@chakra-ui/react";

export function Footer() {
  return (
    <Flex
      as="footer"
      justify="center"
      py={4}
      mt={8}
      color="gray.600"
      borderTopWidth="1px"
      borderColor="gray.200"
    >
      <Text fontSize="sm">© {new Date().getFullYear()} シンプル家計簿</Text>
    </Flex>
  );
}
