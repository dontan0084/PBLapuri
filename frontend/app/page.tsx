"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Spinner,
  Flex,
} from "@chakra-ui/react";

import DiaryCard from "../components/DiaryCard";

import { fetchDiaries } from "../lib/api";

import type { Diary } from "../types/diary";

export default function HomePage() {
  // 日記一覧
  const [diaries, setDiaries] = useState<Diary[]>([]);

  // 読み込み状態
  const [loading, setLoading] = useState(true);

  // エラー内容
  const [error, setError] = useState("");

  // ページが表示されたときにAPIから日記を取得
  useEffect(() => {
    let active = true;

    async function loadDiaries() {
      try {
        const data = await fetchDiaries();

        if (active) {
          setDiaries(data);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "日記の取得に失敗しました"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDiaries();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Container
      maxW="800px"
      py={10}
    >
      {/* ページタイトル */}
      <Box mb={8}>
        <Heading
          size="2xl"
          color="#48392b"
          mb={2}
        >
          日記一覧
        </Heading>

        <Text color="#8a7968">
          毎日の思い出を、ひとつずつ。
        </Text>
      </Box>

      {/* 読み込み中 */}
      {loading && (
        <Flex
          justify="center"
          align="center"
          gap={3}
          py={12}
        >
          <Spinner color="#806448" />

          <Text color="#70563d">
            日記を読み込んでいます...
          </Text>
        </Flex>
      )}

      {/* エラー表示 */}
      {!loading && error && (
        <Box
          role="alert"
          bg="red.50"
          color="red.700"
          p={5}
          borderRadius="lg"
        >
          <Text fontWeight="bold" mb={2}>
            日記を取得できませんでした
          </Text>

          <Text whiteSpace="pre-wrap">
            {error}
          </Text>

          <Button
            mt={4}
            colorPalette="red"
            variant="outline"
            onClick={() =>
              window.location.reload()
            }
          >
            再読み込み
          </Button>
        </Box>
      )}

      {/* 日記が0件の場合 */}
      {!loading &&
        !error &&
        diaries.length === 0 && (
          <Box
            bg="white"
            p={{ base: 6, md: 10 }}
            borderRadius="xl"
            border="1px solid"
            borderColor="#e5dccd"
            textAlign="center"
            boxShadow="sm"
          >
            <Text fontSize="5xl" mb={4}>
              📔
            </Text>

            <Heading
              size="lg"
              color="#70563d"
              mb={3}
            >
              まだ日記がありません
            </Heading>

            <Text color="#8a7968" mb={6}>
              最初の絵日記を書いてみましょう。
            </Text>

            <Button
              asChild
              bg="#806448"
              color="white"
              size="lg"
              _hover={{ bg: "#694f38" }}
            >
              <Link href="/diaries/new">
                最初の日記を書く
              </Link>
            </Button>
          </Box>
        )}

      {/* 日記一覧 */}
      {!loading &&
        !error &&
        diaries.length > 0 && (
          <>
            <Text
              color="#8a7968"
              fontSize="sm"
              mb={4}
            >
              {diaries.length}件の日記
            </Text>

            <Stack gap={5}>
              {diaries.map((diary) => (
                <DiaryCard
                  key={diary.id}
                  diary={diary}
                />
              ))}
            </Stack>
          </>
        )}
    </Container>
  );
}