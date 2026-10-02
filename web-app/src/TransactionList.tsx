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
    { id: 1, item: "Salary", amount: 5000, date: "2024-06-01" },
    { id: 2, item: "Freelance Project", amount: 1200, date: "2024-06-05" },
    { id: 3, item: "Gift", amount: 300, date: "2024-06-10" },
    { id: 4, item: "Investment Return", amount: 800, date: "2024-06-15" },
    { id: 5, item: "Bonus", amount: 1500, date: "2024-06-20" },
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
      <Text color="green.500" fontWeight="bold">
        ${transaction.amount.toLocaleString()}
      </Text>
    </Flex>
  );
};

const formatDate = (dateString: string): string => {
  const parts = dateString.split("-");
  return `${parts[0]}年${parts[1]}月${parts[2]}日`;
};
