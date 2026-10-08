import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./env.js";
import { Client } from "pg";
import { date, string } from "zod";

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

  // 履歴取得クエリの共通部分
  let historyQuery = `SELECT id, item, amount, date FROM transactions`;
  // 履歴カウントクエリの共通部分
  let countQuery = `SELECT COUNT(*) as total FROM transactions`;
  // パラメータの配列
  const params: string[] = [];

  if (type === "income" || type === "expense") {
    // typeがincomeの場合はamount > 0,
    // expenseの場合はamount < 0の条件をクエリに追加する
    const addTypeQuery =
      type === "income" ? ` WHERE amount > 0` : ` WHERE amount < 0`;
    historyQuery += addTypeQuery;
    countQuery += addTypeQuery;
  }

  // 取得順は日付の降順とする
  historyQuery += ` ORDER BY date DESC`;

  // クエリ実行
  const historyResult = await client.query(historyQuery, params);
  const countResult = await client.query(countQuery, params);

  // 取得履歴を作成
  const transactions = historyResult.rows.map((row) => ({
    id: parseInt(row.id),
    item: row.item,
    amount: parseFloat(row.amount),
    date: toYMD(new Date(row.date)),
  }));

  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  // -- 本処理 --
  const result = {
    transactions,
    totalCount: parseInt(countResult.rows[0].total),
    totalAmount,
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

  // データベースへの登録処理を実行(追加)
  const result = await client.query(
    `INSERT INTO transactions (item, amount, date) VALUES ($1, $2, $3) RETURNING id, item, amount, date`,
    [item, amount, date],
  );

  const newTransaction = {
    id: parseInt(result.rows[0].id),
    item: result.rows[0].item,
    amount: parseFloat(result.rows[0].amount),
    date: toYMD(new Date(result.rows[0].date)),
  };

  // ステータスコード201返却
  return c.json(newTransaction, 201);
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

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "kakeibo_db",
  user: "postgres",
  password: "mysecretpassword",
});

await client.connect();

const toYMD = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
