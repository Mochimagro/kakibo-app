import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Transaction } from "@/hooks/transactions";
import { getTransactions } from "@/services/transactions";
import {
  Card,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

function DatePage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions("all");
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
            {groupTransactionsByDate(transactions).map((group) => (
              <Stack key={group.date} gap={2}>
                <Text fontWeight="bold">
                  {group.incomeTotal !== 0 && group.expenseTotal !== 0
                    ? `${formatAmount(group.incomeTotal)} + ${formatAmount(group.expenseTotal)} = ${formatAmount(group.total)}`
                    : `小計: ${formatAmount(group.total)}`}
                </Text>
                {group.transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </Stack>
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

const formatAmount = (amount: number): string =>
  `${amount.toLocaleString()}円`;

const groupTransactionsByDate = (transactions: Transaction[]) => {
  const groups = new Map<
    string,
    {
      date: string;
      transactions: Transaction[];
      incomeTotal: number;
      expenseTotal: number;
      total: number;
    }
  >();

  for (const transaction of transactions) {
    let group = groups.get(transaction.date);
    if (!group) {
      group = {
        date: transaction.date,
        transactions: [],
        incomeTotal: 0,
        expenseTotal: 0,
        total: 0,
      };
      groups.set(transaction.date, group);
    }

    group.transactions.push(transaction);
    if (transaction.amount > 0) {
      group.incomeTotal += transaction.amount;
    } else if (transaction.amount < 0) {
      group.expenseTotal += transaction.amount;
    }
    group.total += transaction.amount;
  }

  return [...groups.values()];
};

export default DatePage;
