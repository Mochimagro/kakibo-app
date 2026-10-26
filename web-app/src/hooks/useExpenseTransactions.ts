import { useState, useEffect } from "react";
import type { TransactionListInfo, TransactionsHooks } from "./transactions";
import { getTransactions } from "@/services/transactions";

export const useExpenseTransactions = (): TransactionsHooks => {
  // stateの定義
  const [expenseList, setExpenseList] = useState<TransactionListInfo>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchExpenseTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setExpenseList(await getTransactions("expense"));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("不明なエラーが発生しました"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseTransactions();
  }, []);

  return {
    transactionList: expenseList,
    isLoading,
    error,
    refetch: fetchExpenseTransactions,
  };
};
