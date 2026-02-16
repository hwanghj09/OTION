// src/lib/recommendations.ts

export const getFashionAdvice = (
  temp: number, 
  dust: number, 
  gender: string, 
  bmi: number
) => {
  let clothes = "";
  let colors = "";
  let dustAdvice = "";

  // 1. 미세먼지 단계별 조언
  if (dust <= 30) dustAdvice = "🌳 미세먼지 최고! 가벼운 외출을 즐기세요.";
  else if (dust <= 80) dustAdvice = "☁️ 미세먼지 보통. 무난한 날씨입니다.";
  else if (dust <= 150) dustAdvice = "😷 미세먼지 나쁨! 마스크를 착용하고 매끄러운 소재의 겉옷을 추천해요.";
  else dustAdvice = "🚨 미세먼지 매우 나쁨! 가급적 외출을 자제하고 방진 마스크를 꼭 쓰세요.";

  // 2. 기온별 옷차림
  if (temp <= 4) clothes = "두꺼운 패딩, 기모 코트, 목도리, 장갑, 히트텍";
  else if (temp <= 8) clothes = "울 코트, 가죽 자켓, 니트, 기모 바지";
  else if (temp <= 11) clothes = "트렌치 코트, 야상, 자켓, 셔츠 레이어드, 청바지";
  else if (temp <= 16) clothes = "가디건, 자켓, 맨투맨, 후드티, 면바지";
  else if (temp <= 19) clothes = "얇은 가디건, 니트, 긴팔 티셔츠, 슬랙스";
  else if (temp <= 22) clothes = "셔츠, 긴팔 티셔츠, 면바지, 슬랙스";
  else if (temp <= 27) clothes = "반팔 티셔츠, 얇은 셔츠, 반바지, 면바지";
  else clothes = "민소매, 반팔, 린넨 소재 옷, 반바지";

  // 3. 체형(BMI) 및 성별에 따른 스타일 제안
  let style = "";
  if (bmi < 18.5) {
    style = `${gender === '남성' ? '남성미' : '여성미'}를 살려주는 레이어드 스타일을 추천해요. 밝은 톤의 옷이 체형을 보완해줍니다.`;
    colors = "Ivory, Beige, Light Blue";
  } else if (bmi >= 25) {
    style = "수축색(어두운 톤) 위주의 코디로 슬림한 느낌을 줄 수 있어요. 세로 스트라이프 패턴을 활용해 보세요.";
    colors = "Navy, Black, Charcoal";
  } else {
    style = "균형 잡힌 체형이시네요! 미니멀한 룩부터 화려한 스타일까지 자유롭게 시도해 보세요.";
    colors = "Gray, Sky Blue, Khaki";
  }

  return { clothes, style, colors, dustAdvice };
};