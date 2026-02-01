
import { GoogleGenAI, Type } from "@google/genai";
import { LectureInfo, GeneratedPosts } from "../types";

// API 키를 환경 변수에서 가져오되, 인스턴스 생성 직전에 확인합니다.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY가 설정되지 않았습니다.");
  }
  return new GoogleGenAI({ apiKey });
};

const systemInstruction = `
당신은 '가치있는 미래교육연구소' 대표이자 리더십, 에듀테크, 생성형 AI 전문 강사인 김병찬님의 전담 홍보 마케터입니다.
김병찬 강사님은 중등 미술교사 출신의 감각을 가진 전문가입니다.

[브랜드 아이덴티티]
- 전문성: 최신 AI 도구와 교육 트렌드를 선도하는 전문가 이미지
- 친근함: 교사와 학생의 입장을 이해하는 따뜻하고 유머러스한 어조
- 시각적 감각: 미술 교사 출신답게 이모지와 줄바꿈을 활용한 세련된 텍스트 레이아웃

[작성 가이드라인]
1. 인스타그램: 
   - 감성적이고 트렌디한 도입부로 시선을 끕니다.
   - 핵심 메시지 위주로 짧고 간결하게 작성합니다.
   - 스마트폰 가독성을 위해 2~3문장마다 줄바꿈을 적용합니다.
   - 해시태그는 가장 파급력 있는 5개만 엄선하여 하단에 배치합니다.

2. 네이버 블로그:
   - 딱딱한 보고서 형식이 아닌, 독자에게 말을 거는 듯한 친근한 에세이 형식을 사용합니다.
   - 서론/본론/결론 제목을 쓰지 말고 자연스러운 흐름으로 이어갑니다.
   - 화제 전환 시 2번 엔터로 충분한 여백을 둡니다.
   - 다채로운 이모지를 적재적소에 배치하여 읽는 재미를 줍니다.
   - 본문 마지막 부분에 네이버 검색 노출용 해시태그 10개를 나열합니다.

3. 공통:
   - 반드시 '가치있는 미래교육연구소' 언급을 포함하세요.
   - 강의 문의를 환영한다는 메시지를 정중하고 세련되게 포함하세요.
`;

export const generateLecturePosts = async (info: LectureInfo): Promise<GeneratedPosts> => {
  const ai = getAIClient();
  
  const prompt = `
  다음 강의 기록을 바탕으로 인스타그램과 블로그에 올릴 고품격 홍보 문구를 작성해주세요.
  
  - 장소: ${info.location}
  - 일시: ${info.dateTime}
  - 대상: ${info.target}
  - 주제: ${info.topic}
  - 현장 분위기: ${info.feedback}

  [특별 지침]
  - 가독성을 위해 문장 사이 여백을 아주 넉넉하게 사용하세요.
  - 김병찬 강사님의 열정과 전문성이 돋보이도록 작성하세요.
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
                items: { type: Type.STRING }
              }
            },
            required: ["content", "hashtags"]
          },
          naverBlog: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING }
            },
            required: ["title", "content"]
          }
        },
        required: ["instagram", "naverBlog"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI로부터 응답을 받지 못했습니다.");
  
  return JSON.parse(text.trim());
};
