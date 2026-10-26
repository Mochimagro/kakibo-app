import type { Transaction, TransactionListInfo } from "@/hooks/transactions";

type TransactionType = "income" | "expense" | "all";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STORAGE_KEY = "kakibo-transactions";
const USE_LOCAL_STORAGE =
  import.meta.env.DEV ||
  import.meta.env.MODE === "localdev" ||
  import.meta.env.VITE_USE_LOCAL_STORAGE === "true";

export async function getTransactions(
  type: TransactionType,
): Promise<TransactionListInfo> {
  if (USE_LOCAL_STORAGE) {
    const transactions = readLocalTransactions()
      .filter((transaction) => {
        if (type === "income") return transaction.amount > 0;
        if (type === "expense") return transaction.amount < 0;
        return true;
      })
      .sort((first, second) => second.date.localeCompare(first.date));

    return {
      transactions,
      totalCount: transactions.length,
      totalAmount: transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0,
      ),
    };
  }

  const response = await fetch(`${BASE_URL}/transactions?type=${type}`);
  if (!response.ok) {
    throw new Error("取引データの取得に失敗しました");
  }
  return (await response.json()) as TransactionListInfo;
}

export async function addTransaction(
  transaction: Omit<Transaction, "id">,
): Promise<void> {
  if (USE_LOCAL_STORAGE) {
    const transactions = readLocalTransactions();
    const nextId =
      transactions.reduce((maxId, current) => Math.max(maxId, current.id), 0) +
      1;
    transactions.push({ ...transaction, id: nextId });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return;
  }

  const response = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
  if (!response.ok) {
    throw new Error("取引の追加に失敗しました");
  }
}

function readLocalTransactions(): Transaction[] {
  const storedTransactions = window.localStorage.getItem(STORAGE_KEY);
  if (storedTransactions === null) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedTransactions);
  } catch {
    throw new Error("ローカルストレージの取引データを解析できません");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("ローカルストレージの取引データの形式が正しくありません");
  }

  return parsed.map((transaction: unknown) => {
    if (
      typeof transaction !== "object" ||
      transaction === null ||
      !("id" in transaction) ||
      typeof transaction.id !== "number" ||
      !Number.isFinite(transaction.id) ||
      !("item" in transaction) ||
      typeof transaction.item !== "string" ||
      !("amount" in transaction) ||
      typeof transaction.amount !== "number" ||
      !Number.isFinite(transaction.amount) ||
      !("date" in transaction) ||
      typeof transaction.date !== "string"
    ) {
      throw new Error("ローカルストレージの取引データの形式が正しくありません");
    }

    const storedTag = "tag" in transaction ? transaction.tag : null;
    if (storedTag !== null && typeof storedTag !== "string") {
      throw new Error("ローカルストレージの取引データの形式が正しくありません");
    }

    return {
      id: transaction.id,
      item: transaction.item,
      tag: storedTag,
      amount: transaction.amount,
      date: transaction.date,
    };
  });
}
