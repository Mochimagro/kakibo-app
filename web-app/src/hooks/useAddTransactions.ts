import { useState } from "react";
import type { Transaction } from "./transactions";
import { addTransaction as saveTransaction } from "@/services/transactions";

export const useAddTransactions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      setIsLoading(true);
      setError(null);
      await saveTransaction(transaction);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("取引の追加中にエラーが発生しました"),
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 取引データを作成するヘルパー関数
  const createTransactionData = (
    type: "income" | "expense",
    item: string,
    amount: number,
    date: string,
    tag: string,
  ): Omit<Transaction, "id"> => {
    // typeがincomeの場合はamountをそのまま、expenseの場合はふの数にする
    const adjustedAmount =
      type === "income" ? Math.abs(amount) : -Math.abs(amount);
    return {
      item,
      tag: tag || null,
      amount: adjustedAmount,
      date,
    };
  };

  return {
    isLoading,
    error,
    addTransaction,
    createTransactionData,
  };
};
