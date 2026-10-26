import { Flex, Text } from "@chakra-ui/react";
import type { Transaction } from "@/hooks/transactions";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

type PieChartGraphProps = {
  title: string;
  transactionsList: Transaction[];
};

export default function PieChartGraph({
  title,
  transactionsList,
}: PieChartGraphProps) {
  const incomeTotal = transactionsList.reduce(
    (total, transaction) =>
      transaction.amount > 0 ? total + transaction.amount : total,
    0,
  );
  const expenseTotal = transactionsList.reduce(
    (total, transaction) =>
      transaction.amount < 0 ? total + Math.abs(transaction.amount) : total,
    0,
  );
  const chartData = [
    { name: "収入", value: incomeTotal, color: "#38A169" },
    { name: "支出", value: expenseTotal, color: "#E53E3E" },
  ].filter((entry) => entry.value > 0);

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={4}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      role="group"
      aria-label={`${title}の収支グラフ`}
    >
      <Text fontSize="xl" fontWeight="bold">
        {title}
      </Text>
      <Flex
        width={{ base: "180px", sm: "220px" }}
        height={{ base: "180px", sm: "220px" }}
        flexShrink={0}
        role="img"
        aria-label={`収入 ${incomeTotal.toLocaleString()}円、支出 ${expenseTotal.toLocaleString()}円`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={
                chartData.length > 0
                  ? chartData
                  : [{ name: "データなし", value: 1, color: "#E2E8F0" }]
              }
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="92%"
              stroke="none"
            >
              {(chartData.length > 0
                ? chartData
                : [{ name: "データなし", value: 1, color: "#E2E8F0" }]
              ).map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
              <Label
                position="center"
                content={() => (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="currentColor"
                    fontSize={16}
                    fontWeight="bold"
                  >
                    {(incomeTotal - expenseTotal).toLocaleString()}円
                  </text>
                )}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Flex>
    </Flex>
  );
}
