import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TagInput } from "@/components/TagInput";
import { useAddTransactions } from "@/hooks/useAddTransactions";
import {
  Button,
  Center,
  Container,
  Field,
  Flex,
  HStack,
  Input,
  NativeSelect,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router";

type TransactionType = "income" | "expense";

function InputPage() {
  const [transactionType, setTransactionType] =
    React.useState<TransactionType>("expense");
  const [tag, setTag] = React.useState("");
  const [item, setItem] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [date, setDate] = React.useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isSubmittingRef = React.useRef(false);
  const { addTransaction, createTransactionData } = useAddTransactions();

  const navigate = useNavigate();

  // フォームのデータを登録する関数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    // amountを数値に変換
    const adjustedAmount = Number(amount);

    // 送信データを作成
    const transactionData = createTransactionData(
      transactionType,
      item,
      adjustedAmount,
      date,
      tag,
    );

    try {
      await addTransaction(transactionData);
      setIsSubmitting(false);
      // 登録成功後はトップページへ遷移
      navigate("/");
    } catch (err) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      alert("取引の追加に失敗しました");
      console.error(err);
    }
  };

  return (
    <Flex minH="100vh" direction="column">
      <Header />
      <Container as="main" maxW="4xl" width="full" flex="1" py={6}>
        <Center>
          <VStack
            maxW="xl"
            width="full"
            gap={4}
            as="form"
            onSubmit={handleSubmit}
          >
            {/* フォーム部分 */}
            <TagInput value={tag} onChange={setTag} />

            <Field.Root required>
              <Field.Label>項目</Field.Label>
              <Input
                placeholder="項目を入力してください"
                value={item}
                maxLength={20}
                onChange={(e) => setItem(e.target.value)}
              />
            </Field.Root>

            <HStack width="full" align="end" gap={3}>
              <Field.Root required flex={1}>
                <Field.Label>金額</Field.Label>
                <Input
                  type="number"
                  placeholder="金額を入力してください"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                />
              </Field.Root>

              <Field.Root required width="32">
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={transactionType}
                    background={
                      transactionType === "income" ? "green.200" : "red.200"
                    }
                    color={
                      transactionType === "income" ? "green.500" : "red.500"
                    }
                    onChange={(e) =>
                      setTransactionType(
                        e.target.value === "income" ? "income" : "expense",
                      )
                    }
                  >
                    <option value="expense" style={{ color: "initial" }}>
                      支出
                    </option>
                    <option value="income" style={{ color: "initial" }}>
                      収入
                    </option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </HStack>

            <Field.Root required>
              <Field.Label>日付</Field.Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field.Root>

            {/* 登録・キャンセルボタン */}
            <HStack width="sm" mt={4} gap={3}>
              <Button
                type="submit"
                color="gray.500"
                variant="outline"
                flex={1}
                fontWeight="bold"
                disabled={isSubmitting}
                opacity={isSubmitting ? 0.5 : 1}
              >
                {isSubmitting ? "追加中..." : "登録"}
              </Button>
            </HStack>
          </VStack>
        </Center>
      </Container>
      <Footer />
    </Flex>
  );
}

export default InputPage;
