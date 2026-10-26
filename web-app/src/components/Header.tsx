import { Flex, Text, VStack } from "@chakra-ui/react";
import { SideMenu } from "./SideMenu";

type HeaderProps = {
  pageName: string;
};

export function Header({ pageName }: HeaderProps) {
  return (
    <Flex
      as="header"
      position="relative"
      justify="space-between"
      align="center"
      bg="teal.500"
      color="white"
      py={4}
      px={4}
      boxShadow="md"
    >
      <VStack align="flex-start" gap={0}>
        <Text fontSize="xl" fontWeight="bold">
          シンプル家計簿
        </Text>
        <Text>{pageName}</Text>
      </VStack>
      <SideMenu />
    </Flex>
  );
}
