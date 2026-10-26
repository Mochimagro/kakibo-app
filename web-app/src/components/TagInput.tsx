import { getTransactions } from "@/services/transactions";
import { Field, Input, NativeSelect, Text } from "@chakra-ui/react";
import React from "react";

type TagInputProps = {
  value: string;
  onChange: (tag: string) => void;
};

export function TagInput({ value, onChange }: TagInputProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = React.useState(true);
  const [tagsError, setTagsError] = React.useState<Error | null>(null);
  const [isEnteringNewTag, setIsEnteringNewTag] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadTags = async () => {
      try {
        const data = await getTransactions("all");
        if (isMounted) {
          setTags([
            ...new Set(
              data.transactions
                .map((transaction) => transaction.tag)
                .filter((tag): tag is string => Boolean(tag)),
            ),
          ]);
        }
      } catch (err) {
        if (isMounted) {
          setTagsError(
            err instanceof Error
              ? err
              : new Error("タグの読み込みに失敗しました"),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingTags(false);
        }
      }
    };

    loadTags();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Field.Root>
      <Field.Label>タグ</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field
          value={isEnteringNewTag ? "__new__" : value ? `tag:${value}` : ""}
          onChange={(e) => {
            if (e.target.value === "__new__") {
              onChange("");
              setIsEnteringNewTag(true);
            } else {
              onChange(
                e.target.value.startsWith("tag:")
                  ? e.target.value.slice(4)
                  : "",
              );
              setIsEnteringNewTag(false);
            }
          }}
        >
          <option value="">
            {isLoadingTags ? "タグを読み込み中..." : "- タグなし -"}
          </option>
          {tags.map((tag) => (
            <option key={tag} value={`tag:${tag}`}>
              {tag}
            </option>
          ))}
          <option value="__new__"> + 新規で入力する</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {tagsError && (
        <Text color="red.500" fontSize="sm">
          タグ一覧を読み込めませんでした: {tagsError.message}
        </Text>
      )}
      {isEnteringNewTag && (
        <Input
          placeholder="新しいタグを入力してください"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          mt={2}
        />
      )}
    </Field.Root>
  );
}
