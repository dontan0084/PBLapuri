"use client";

import {
  Box,
  Heading,
  Text,
  Flex,
  HStack,
} from "@chakra-ui/react";

import type { Diary } from "../types/diary";

// 天気に対応する絵文字
const weatherIcons: Record<string, string> = {
  晴れ: "☀️",
  曇り: "☁️",
  雨: "☔",
  雪: "❄️",
};

// 気分に対応する絵文字
const moodIcons: Record<string, string> = {
  楽しい: "😊",
  普通: "😌",
  悲しい: "😢",
  疲れた: "😫",
  怒り: "😠",
};

// 日付の表示形式を変更
function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  return `${year}年${Number(month)}月${Number(day)}日`;
}

export default function DiaryCard({
  diary,
}: {
  diary: Diary;
}) {
  return (
    <Box
      as="article"
      bg="white"
      p={{ base: 5, md: 6 }}
      borderRadius="xl"
      border="1px solid"
      borderColor="#e5dccd"
      boxShadow="sm"
    >
      {/* 日付・天気・気分 */}
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={3}
        mb={4}
      >
        <Text
          fontSize="sm"
          color="#8a7968"
        >
          {formatDate(diary.diary_date)}
        </Text>

        <HStack gap={3} flexWrap="wrap">
          {diary.weather && (
            <Text
              fontSize="sm"
              color="#70563d"
            >
              {weatherIcons[diary.weather] || ""}
              {" "}
              {diary.weather}
            </Text>
          )}

          {diary.mood && (
            <Text
              fontSize="sm"
              color="#70563d"
            >
              {moodIcons[diary.mood] || ""}
              {" "}
              {diary.mood}
            </Text>
          )}
        </HStack>
      </Flex>

      {/* タイトル */}
      <Heading
        as="h2"
        size="xl"
        color="#48392b"
        mb={4}
        overflowWrap="anywhere"
      >
        {diary.title}
      </Heading>

      {/* 本文 */}
      <Text
        color="#625444"
        lineHeight="1.9"
        whiteSpace="pre-wrap"
        overflowWrap="anywhere"
      >
        {diary.content}
      </Text>
    </Box>
  );
}