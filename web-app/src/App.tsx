import {
  Box,
  Button,
  Container,
  Text,
  Flex,
  Card,
  Heading,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { Route, Routes, useNavigate } from "react-router";
import InputPage from "./pases/Input";
import DatePage from "./pases/Date";
import {
  RecentExpenseTransactionList,
  RecentIncomeTransactionList,
} from "./TransactionList";
import { TotalTransactions } from "./TotalTransactions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/input" element={<InputPage />} />
      <Route path="/date" element={<DatePage />} />
    </Routes>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Box
        as="header"
        bg="teal.500"
        color="white"
        py={4}
        textAlign="center"
        boxShadow="md"
      >
        <Text fontSize="xl" fontWeight="bold">
          シンプル家計簿
        </Text>
      </Box>
      <Container
        as="main"
        maxW="4xl"
        py={8}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <TotalTransactions />
        <Flex justify="flex-end" gap={2}>
          <Button
            variant="outline"
            fontWeight="bold"
            onClick={() => navigate("/date")}
          >
            日付順
          </Button>
          <Button
            colorPalette="teal"
            fontWeight="bold"
            onClick={() => navigate("/input")}
          >
            <FaPlus />
            登録
          </Button>
        </Flex>
        <Flex width="full" align="stretch" gap={4}>
          <SummaryCard title="収入履歴">
            <RecentIncomeTransactionList maxTransactions={3} />
          </SummaryCard>
          <SummaryCard title="支出履歴">
            <RecentExpenseTransactionList maxTransactions={3} />
          </SummaryCard>
        </Flex>
      </Container>
    </>
  );
}

const SummaryCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Card.Root variant="elevated" flex={1} minW={0}>
      <Card.Header>
        <Heading size="md">{title}</Heading>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card.Root>
  );
};

export default App;
