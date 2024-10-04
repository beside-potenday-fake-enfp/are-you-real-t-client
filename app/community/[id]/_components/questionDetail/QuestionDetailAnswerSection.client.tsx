"use client";

import { Button } from "@/components/ui/button";
import { IAnswerDetail } from "@/hooks/api/questions/useQuestionsId.client";
import { postVote } from "@/hooks/api/vote/useVote";
import { useAuthenticationStore } from "@/store/useAuthenticationStore";
import { TMbtiType } from "@/utils/constants/meta.const";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import QuestionDetailAnswerProgress from "./QuestionDetailAnswerProgress";

const QuestionDetailAnswerSection = ({
  questionId,
  type,
  votedAnswerId,
  answerList,
}: {
  questionId: string;
  type: TMbtiType;
  votedAnswerId: string | null;
  answerList: IAnswerDetail[];
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const testerId = useAuthenticationStore((state) => state.testerId);

  const [isPending, startTransition] = useTransition();

  const handleAnswerClick = (answerId: string) => {
    if (!testerId) {
      router.push(
        `/login?redirectURI=${encodeURIComponent(`/community/${questionId}`)}`
      );
      return;
    }

    if (isPending || !answerId) {
      return;
    }

    startTransition(async () => {
      const response = await postVote({
        questionId,
        testerId,
        answerId: answerId.toString(),
      });
      const { isSuccess, isError } = response ?? {};

      console.log("## response", response);

      if (isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["getQuestionsIdApi"] });
      }
      if (isError) {
        // toast.error(
        //   "댓글 작성에 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.",
        // );
      }
    });
  };

  return (
    <div className="space-y-[3rem]">
      {answerList.map(({ id: answerId, content, countMeta }) => {
        const { total, tag1, tag2 } = countMeta;
        const isSelected = votedAnswerId === answerId;

        const { tag: tag1Name, count: tag1Count } = tag1;
        const { tag: tag2Name, count: tag2Count } = tag2;

        return (
          <div
            key={`question_detail_answer_${answerId}`}
            className="text-label"
          >
            <div className="text-detail-sb-16 mb-[0.8rem] flex items-center gap-x-[0.5rem]">
              <p>{content}</p>
              {votedAnswerId && <p>({total}명)</p>}
            </div>

            {votedAnswerId ? (
              <QuestionDetailAnswerProgress
                isSelected={isSelected}
                type={type}
                tagPercentageMap={{
                  [tag1Name]: (tag1Count / total) * 100,
                  [tag2Name]: (tag2Count / total) * 100,
                }}
              />
            ) : (
              <Button
                variant="gray"
                size="md"
                className="text-detail-sb-16 h-[4.8rem] w-full"
                onClick={() => {
                  handleAnswerClick(answerId);
                }}
              >
                선택하기
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionDetailAnswerSection;
