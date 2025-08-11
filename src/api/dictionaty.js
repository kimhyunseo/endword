export const dictionaty = async (startChar, usedWords = []) => {
  const API_KEY = "F4510F0D74A68595566A9B7D58595149";
  const base = "https://opendict.korean.go.kr/api/search";
  const params = new URLSearchParams({
    key: API_KEY,
    q: startChar,
    req_type: "json",
    part: "word",
    advanced: "y",
    sort: "popular",
    num: "20",
    pos: "1",
    method: "start",
    target: "1",
    type1: "word",
  });

  const originURL = `${base}?${params.toString()}`;
  const proxyURL = `https://corsproxy.io/?${encodeURIComponent(originURL)}`;

  try {
    const res = await fetch(proxyURL);
    if (!res.ok) {
      throw new Error("API응답오류", res.status);
    }
    const data = await res.json();

    // 조건: 하이픈 없고 2글자 이상, 그리고 usedWords에 없는 단어만 필터링
    const filterData = data.channel.item.filter(
      (item) =>
        !item.word.includes("-") &&
        item.word.length >= 2 &&
        !usedWords.includes(item.word)
    );

    if (filterData.length === 0) return null;

    // 랜덤으로 한 단어 선택
    const randomIndex = Math.floor(Math.random() * filterData.length);
    return filterData[randomIndex].word;
  } catch (err) {
    console.log("API오류", err);
    return null;
  }
};
