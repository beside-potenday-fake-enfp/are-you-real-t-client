"use client";

import { DEFAULT_OG_IMAGE } from "@/utils/constants/metaData.const";
import { BASE_URL } from "@/utils/constants/url.const";
import Kakao from "./icon/Kakao";

const KakaoShareButton = ({
  resultId,
  description,
}: {
  resultId: string;
  description: string;
}) => {
  const handleKakaoShareButtonClick = () => {
    const shareUrl = `${BASE_URL}/result/${resultId}`;

    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "[검증 결과]",
          description,
          imageWidth: 800,
          imageHeight: 400,
          imageUrl: DEFAULT_OG_IMAGE,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      });
    }
  };

  return (
    <button
      className="text-label-sb-16 flex w-full justify-center rounded-[0.8rem] bg-[#FAE100] p-[1.6rem] text-[#391B1B]"
      onClick={handleKakaoShareButtonClick}
    >
      <Kakao className="mr-[0.8rem]" />
      카카오톡 공유하기
    </button>
  );
};

export default KakaoShareButton;
