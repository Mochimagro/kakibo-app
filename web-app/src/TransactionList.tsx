import React from "react";
import { Box, Stack, Separator, Text, Flex } from "@chakra-ui/react";

type Transaction = {
  id: number;
  item: string;
  amount: number;
  date: string;
};

export const RecentIncomeTransactionList: React.FC<{
  maxTransactions: number;
}> = ({ maxTransactions }) => {
  const transactionList: Transaction[] = [
    { id: 1, item: "個人収入", amount: 1400, date: "2024-06-01" },
    { id: 2, item: "収入", amount: 800, date: "2024-06-05" },
    { id: 3, item: "贈り物", amount: 500, date: "2024-06-10" },
    { id: 4, item: "投資収益", amount: 800, date: "2024-06-15" },
    { id: 5, item: "ボーナス", amount: 1500, date: "2024-06-20" },
  ];

  const recentTransactions = transactionList.slice(0, maxTransactions);

  return <TransactionList transactions={recentTransactions} />;
};

export const RecentExpenseTransactionList: React.FC<{
  maxTransactions: number;
}> = ({ maxTransactions }) => {
  const transactionList: Transaction[] = [
    { id: 1, item: "食費", amount: -200, date: "2024-06-02" },
    { id: 2, item: "交通費", amount: -100, date: "2024-06-06" },
    { id: 3, item: "娯楽費", amount: -150, date: "2024-06-11" },
    { id: 4, item: "光熱費", amount: -300, date: "2024-06-16" },
    { id: 5, item: "雑費", amount: -50, date: "2024-06-21" },
  ];
  const recentTransactions = transactionList.slice(0, maxTransactions);
  return <TransactionList transactions={recentTransactions} />;
};

const TransactionList: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}) => {
  return (
    <Stack separator={<Separator size="sm" />}>
      {transactions?.map((transaction) => (
        <TransactionListItem key={transaction.id} transaction={transaction} />
      ))}
    </Stack>
  );
};

const TransactionListItem: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => {
  return (
    <Flex justify="space-between" alignItems="center" py={2}>
      <Box>
        <Text>{transaction.item}</Text>
        <Text color="gray.400" fontSize="sm">
          {formatDate(transaction.date)}
        </Text>
      </Box>
      <Text
        color={transaction.amount >= 0 ? "green.500" : "red.500"}
        fontWeight="bold"
      >
        {transaction.amount >= 0 ? "+" : ""}
        {transaction.amount.toLocaleString()}円
      </Text>
    </Flex>
  );
};

const formatDate = (dateString: string): string => {
  const parts = dateString.split("-");
  return `${parts[0]}年${parts[1]}月${parts[2]}日`;
};
