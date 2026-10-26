import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Transaction, TransactionListInfo } from "@/hooks/transactions";
import {
  Card,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DatePage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/transactions?type=all`);
        if (!response.ok) {
          throw new Error("取引データの取得に失敗しました");
        }
        const data = (await response.json()) as TransactionListInfo;
        setTransactions(data.transactions);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("不明なエラーが発生しました"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return (
    <Flex minH="100vh" direction="column">
      <Header />
      <Container as="main" maxW="4xl" width="full" flex="1" py={8}>
        <Heading size="lg" mb={4}>
          日付順
        </Heading>
        {isLoading ? (
          <Text>データ読み込み中...</Text>
        ) : error ? (
          <Text>取引データを読み込めませんでした: {error.message}</Text>
        ) : transactions?.length ? (
          <Stack gap={4}>
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </Stack>
        ) : (
          <Text>取引データがありません</Text>
        )}
      </Container>
      <Footer />
    </Flex>
  );
}

const TransactionCard: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => (
  <Card.Root variant="elevated">
    <Card.Body>
      <Text color="gray.500" fontSize="sm">
        {formatDate(transaction.date)}
      </Text>
      {transaction.tag && (
        <Text color="gray.500" fontSize="xs">
          {transaction.tag}
        </Text>
      )}
      <Text>{transaction.item}</Text>
      <Text
        color={transaction.amount >= 0 ? "green.500" : "red.500"}
        fontWeight="bold"
      >
        {transaction.amount >= 0 ? "+" : ""}
        {transaction.amount.toLocaleString()}円
      </Text>
    </Card.Body>
  </Card.Root>
);

const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${year}年${month}月${day}日`;
};

export default DatePage;
