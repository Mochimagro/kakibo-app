import { Card, Heading, Text } from "@chakra-ui/react";
import { useExpenseTransactions } from "./hooks/useExpenseTransactions";
import { useIncomeTransactions } from "./hooks/useIncomeTransactions";

export const TotalTransactions: React.FC = () => {
  const {
    transactionList: incomeList,
    isLoading: isIncomeLoading,
    error: incomeError,
  } = useIncomeTransactions();
  const {
    transactionList: expenseList,
    isLoading: isExpenseLoading,
    error: expenseError,
  } = useExpenseTransactions();

  const isLoading = isIncomeLoading || isExpenseLoading;
  const error = incomeError || expenseError;

  return (
    <Card.Root variant="elevated">
      <Card.Header>
        <Heading size="md">総資産</Heading>
      </Card.Header>
      <Card.Body>
        {isLoading ? (
          <Text>読み込み中...</Text>
        ) : error ? (
          <Text>収入・支出データに異常があります</Text>
        ) : (
          <Text fontSize="2xl" fontWeight="bold">
            {(
              (incomeList?.totalAmount ?? 0) + (expenseList?.totalAmount ?? 0)
            ).toLocaleString()}
            円
          </Text>
        )}
      </Card.Body>
    </Card.Root>
  );
};
