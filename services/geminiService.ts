
import { GoogleGenAI, Type } from "@google/genai";
import { LectureInfo, GeneratedPosts } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const systemInstruction = `
당신은 '가치있는 미래교육연구소' 대표이자 리더십, 에듀테크, 생성형 AI 전문 강사인 김병찬님의 전담 홍보 마케터입니다.
김병찬 강사님은 중등 미술교사 출신의 감각을 가진 전문가입니다.

[목표]
강의 후기를 인스타그램과 네이버 블로그에 최적화된 세련되고 친근한 문체로 작성하여 다음 강의 문의를 유도하는 것이 목적입니다.

[작성 가이드라인]
1. 인스타그램: 
   - 감성적이고 트렌디하며 가독성이 좋아야 합니다.
   - 문장이 너무 길어지지 않게 의미 단위로 줄바꿈(엔터)을 자주 사용하여 스마트폰에서 읽기 편하게 만드세요.
   - 이모지를 적절히 사용하여 생동감을 더합니다.
   - 해시태그는 강의 요청이 올 수 있는 가장 영향력 있는 키워드로 딱 5개만 생성합니다.

2. 네이버 블로그:
   - 서론, 본론, 결론 구분을 절대 하지 마세요.
   - 매우 자연스럽고 친근한 어조로 작성하되, 가독성을 위해 한 문장이 끝나거나 화제가 바뀔 때 충분한 줄바꿈(2번 엔터)을 적용하세요.
   - 다채롭고 귀여운 이모지를 풍부하게 사용하여 친근감을 극대화하세요.
   - 글의 마지막 부분에 네이버 블로그 검색 노출에 최적화된 해시태그들을 반드시 포함하세요.
   - 제목은 클릭하고 싶게 만드는 매력적인 문구로 작성하세요.

3. 공통:
   - '가치있는 미래교육연구소'의 브랜드 아이덴티티를 녹여내세요.
   - 가독성을 최우선으로 하여, 텍스트 덩어리가 보이지 않도록 시원시원하게 행간을 띄워 작성하세요.
`;

export const generateLecturePosts = async (info: LectureInfo): Promise<GeneratedPosts> => {
  const prompt = `
  다음 강의 정보를 바탕으로 인스타그램 포스팅과 네이버 블로그 포스팅을 생성해줘.
  
  - 출강장소: ${info.location}
  - 출강일시: ${info.dateTime}
  - 강의대상: ${info.target}
  - 강의주제: ${info.topic}
  - 강의장 반응 및 특이사항: ${info.feedback}

  [특별 요청]
  모바일 사용자가 읽기 편하도록 문장 사이사이에 줄바꿈을 아주 넉넉하게 넣어줘. 
  네이버 블로그 포스팅의 경우, 본문 마지막에 노출이 잘 되는 해시태그를 10개 내외로 포함해줘.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          instagram: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              hashtags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "반드시 5개의 해시태그"
              }
            },
            required: ["content", "hashtags"]
          },
          naverBlog: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING, description: "본문 하단에 해시태그를 포함한 전체 내용" }
            },
            required: ["title", "content"]
          }
        },
        required: ["instagram", "naverBlog"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
