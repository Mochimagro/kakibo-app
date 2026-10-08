import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./env.js";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: [env.FRONTEND_URL],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// GET /transactions - 取引履歴一覧の取得
app.get("/transactions", async (c) => {
  const type = c.req.query("type");

  // -- クエリパラメータのバリデーション --

  // typeがセットされていない、値が入っていない
  // typeが"income","expense","all"のいずれでもない
  // 上記の場合はエラーを返す
  if (!type || !["income", "expense", "all"].includes(type)) {
    return c.json({ error: "Invalid type parameter" }, 400);
  } // エラーを返却

  // TODO: 取引履歴を取得するために、DBへ接続し、データを取得する
  // 以下はモックデータ
  const transactionList = [
    { id: 1, item: "給料", amount: 300000, date: "2025-01-01" },
    { id: 2, item: "食費", amount: -15000, date: "2025-01-02" },
  ];

  // -- 本処理 --
  const result = {
    transactions: transactionList,
    totalCount: transactionList.length,
    totalAmount: transactionList.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    ), // 合計金額
  };

  return c.json(result, 200);
});

// POST /transactions - 取引情報の登録
app.post("/transactions", async (c) => {
  const body = await c.req.json();
  // リクエストボディ抽出
  const { item, amount, date } = body;

  // - バリデーション -

  // 必須項目チェック
  if (!item || amount === undefined || !date) {
    return c.json({ message: "必須項目が不足しています" }, 400);
  }

  // 金額チェック
  if (typeof amount !== "number" || amount === 0) {
    return c.json({ message: "金額は0以外の数値である必要があります" }, 400);
  }

  // 日付の型式チェック
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return c.json({ message: "日付はYYYY-MM-DD形式で入力してください" }, 400);
  }

  // TODO: 登録処理を行うために、データベースへ接続し、データを登録する。
  // ボディ・ステータスコード返却
  return c.json(body, 201);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
