import React from "react";
import { Box, Stack, Separator, Text, Flex } from "@chakra-ui/react";
import { useIncomeTransactions } from "./hooks/useIncomeTransactions";
import { useExpenseTransactions } from "./hooks/useExpenseTransactions";
import type { Transaction } from "./hooks/transactions";

export const RecentIncomeTransactionList: React.FC<{
  maxTransactions: number;
  month?: string;
}> = ({ maxTransactions, month }) => {
  const { transactionList, isLoading } = useIncomeTransactions();

  if (isLoading) {
    return <Text>データ読み込み中...</Text>;
  }
  if (!transactionList) {
    return <Text>収入データがありません</Text>;
  }

  const recentTransactions = transactionList.transactions
    .filter((transaction) => !month || transaction.date.startsWith(month))
    .slice(0, maxTransactions);

  return recentTransactions.length ? (
    <TransactionList transactions={recentTransactions} />
  ) : (
    <Text>当月の収入データがありません</Text>
  );
};

export const RecentExpenseTransactionList: React.FC<{
  maxTransactions: number;
  month?: string;
}> = ({ maxTransactions, month }) => {
  const { transactionList, isLoading } = useExpenseTransactions();

  if (isLoading) {
    return <Text>データ読み込み中...</Text>;
  }
  if (!transactionList) {
    return <Text>支出データがありません</Text>;
  }

  const recentTransactions = transactionList.transactions
    .filter((transaction) => !month || transaction.date.startsWith(month))
    .slice(0, maxTransactions);
  return recentTransactions.length ? (
    <TransactionList transactions={recentTransactions} />
  ) : (
    <Text>当月の支出データがありません</Text>
  );
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
        {transaction.tag && (
          <Text color="gray.500" fontSize="xs">
            {transaction.tag}
          </Text>
        )}
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
