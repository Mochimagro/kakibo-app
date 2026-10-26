import { Button, Card, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import type { Transaction } from "../hooks/transactions";

import PieChartGraph from "./PieChartGraph";
import {
  RecentExpenseTransactionList,
  RecentIncomeTransactionList,
} from "../TransactionList";
import { TotalTransactions } from "../TotalTransactions";
import { getTransactions } from "../services/transactions";

export default function MonthPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [transactionsError, setTransactionsError] = useState<Error | null>(
    null,
  );
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;
  const currentMonthTransactions = transactions?.filter((transaction) =>
    transaction.date.startsWith(currentMonth),
  );

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions("all");
        setTransactions(data.transactions);
      } catch (err) {
        setTransactionsError(
          err instanceof Error
            ? err
            : new Error("取引データの取得に失敗しました"),
        );
      }
    };

    loadTransactions();
  }, []);

  return (
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
      {transactionsError ? (
        <Text>
          収支データを読み込めませんでした: {transactionsError.message}
        </Text>
      ) : transactions ? (
        <>
          <TotalTransactions />
          <PieChartGraph
            title={`${now.getMonth() + 1}月の総支出`}
            transactionsList={currentMonthTransactions ?? []}
          />
        </>
      ) : (
        <Text>収支データ読み込み中...</Text>
      )}

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
      <Flex width="full" align="stretch" gap={4}>
        <SummaryCard title="収入履歴">
          <RecentIncomeTransactionList
            maxTransactions={15}
            month={currentMonth}
          />
        </SummaryCard>
        <SummaryCard title="支出履歴">
          <RecentExpenseTransactionList
            maxTransactions={15}
            month={currentMonth}
          />
        </SummaryCard>
      </Flex>
    </Container>
  );
}

function SummaryCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card.Root variant="elevated" flex={1} minW={0}>
      <Card.Header>
        <Heading size="md">{title}</Heading>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card.Root>
  );
}
