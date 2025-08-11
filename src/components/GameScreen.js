import { useEffect, useRef, useState } from "react";
import { dictionaty } from "../api/dictionaty.js";

const GameScreen = ({ startWord }) => {
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [words, setWords] = useState([startWord]);
  const wordsRef = useRef([startWord]); // 최신 단어 저장
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // 사용자 첫 입력 전까지 AI 대답 X

  // 상태와 ref 동기화
  const addWord = (text) => {
    setWords((prev) => {
      const newWords = [...prev, text];
      wordsRef.current = newWords;
      return newWords;
    });
  };

  const isDuplicate = (word) => {
    return wordsRef.current.includes(word);
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [words]);

  const addAIWord = async (lastChar) => {
    let word = await dictionaty(lastChar, wordsRef.current);
    let tryCount = 0;

    while (word && isDuplicate(word) && tryCount < 10) {
      word = await dictionaty(lastChar, wordsRef.current);
      tryCount++;
    }

    if (word && !isDuplicate(word)) {
      addWord(word);
    } else {
      alert("여울이가 단어를 찾지 못했습니다. 당신이 입력해주세요.");
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const userWord = input.trim();
  if (!userWord) return;

  if (isDuplicate(userWord)) {
    alert("이미 사용된 단어입니다.");
    setInput("");
    return;
  }

  const lastWord = wordsRef.current[wordsRef.current.length - 1];
  if (userWord[0] !== lastWord[lastWord.length - 1]) {
    alert(`${lastWord[lastWord.length - 1]} 로 시작해야 합니다`);
    setInput("");
    return;
  }

  addWord(userWord);
  setInput("");

  // 첫 입력일 때만 게임 시작 상태 변경
  if (!gameStarted) setGameStarted(true);

  setLoading(true);
  setTimeout(async () => {
    const lastChar = userWord[userWord.length - 1];
    await addAIWord(lastChar);
    setLoading(false);
    inputRef.current?.focus();
  }, 1000);
};

  const divStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "bottom",
  };

  return (
    <div className="game-screen" style={divStyle}>
      <img
        src={`${process.env.PUBLIC_URL}/images/title.png`}
        className="logo"
        alt="게임 로고"
      />
      <ul className="word-list">
        {words.map((item, idx) => (
          <li key={idx}>
            <span>◐</span>
            <span>{item}</span>
          </li>
        ))}
        <li ref={bottomRef}></li>
      </ul>
      {loading && <p className="loading">여울이가 단어를 고민중입니다....</p>}
      <form className="game-form" onSubmit={handleSubmit}>
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="단어입력"
        />
        <button type="submit">▶</button>
      </form>
    </div>
  );
};

export default GameScreen;
