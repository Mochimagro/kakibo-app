import { useState, useEffect } from "react";
import type { TransactionListInfo, TransactionsHooks } from "./transactions";
import { getTransactions } from "@/services/transactions";

export const useIncomeTransactions = (): TransactionsHooks => {
  // stateの定義
  const [incomeList, setIncomeList] = useState<TransactionListInfo>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIncomeTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setIncomeList(await getTransactions("income"));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("不明なエラーが発生しました"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeTransactions();
  }, []);

  // 変数・関数を返す
  return {
    transactionList: incomeList,
    isLoading,
    error,
    refetch: fetchIncomeTransactions,
  };
};
