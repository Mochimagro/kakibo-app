import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAddTransactions } from "@/hooks/useAddTransactions";
import {
  Button,
  Center,
  Container,
  Field,
  Flex,
  HStack,
  Input,
  RadioGroup,
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
  const [date, setDate] = React.useState("");
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
            {/* 支出・収入の選択ボタン */}
            <RadioGroup.Root
              defaultValue="expense"
              onValueChange={(e) =>
                setTransactionType(e.value as TransactionType)
              }
            >
              <HStack gap={4}>
                <RadioGroup.Item value="expense">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>支出</RadioGroup.ItemText>
                </RadioGroup.Item>
                <RadioGroup.Item value="income">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>収入</RadioGroup.ItemText>
                </RadioGroup.Item>
              </HStack>
            </RadioGroup.Root>

            {/* フォーム部分 */}
            <Field.Root>
              <Field.Label>タグ</Field.Label>
              <Input
                placeholder="タグを入力してください（任意）"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>項目</Field.Label>
              <Input
                placeholder="項目を入力してください"
                value={item}
                maxLength={20}
                onChange={(e) => setItem(e.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>金額</Field.Label>
              <Input
                type="number"
                placeholder="金額を入力してください"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
              />
            </Field.Root>

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
