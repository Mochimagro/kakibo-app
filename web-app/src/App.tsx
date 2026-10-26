import { Button, Container, Flex, Card, Heading } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { Route, Routes, useNavigate } from "react-router";
import InputPage from "./pases/Input";
import DatePage from "./pases/Date";
import {
  RecentExpenseTransactionList,
  RecentIncomeTransactionList,
} from "./TransactionList";
import { TotalTransactions } from "./TotalTransactions";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

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
    <Flex minH="100vh" direction="column">
      <Header />
      <Container
        as="main"
        maxW="4xl"
        width="full"
        flex="1"
        py={8}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <TotalTransactions />
        <Flex width="full" align="stretch" gap={4}>
          <SummaryCard title="収入履歴">
            <RecentIncomeTransactionList maxTransactions={3} />
          </SummaryCard>
          <SummaryCard title="支出履歴">
            <RecentExpenseTransactionList maxTransactions={3} />
          </SummaryCard>
        </Flex>
        <Flex justify="flex-end" gap={2}>
          <Button
            colorPalette="teal"
            fontWeight="bold"
            onClick={() => navigate("/input")}
          >
            <FaPlus />
            登録
          </Button>
        </Flex>
      </Container>

      <Footer />
    </Flex>
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
