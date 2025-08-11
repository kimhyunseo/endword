import { useState } from "react";

const StartScreen = ({onStart}) => {
  const [input,setInput] = useState('');
  const handleSubmit = (event)=>{
    event.preventDefault();
    if( input.trim() ){
      onStart(input.trim());
    } else {
      alert("시작 단어를 입력하세요");
    }
  }
  return (
    <div className="start-screen">
      <img src={`${process.env.PUBLIC_URL}/images/title.png`}/>
      <div class="pop">
        <p>저와 같이 <br/><span>끝말잇기</span>를 해봐요!</p>
        <img src={`${process.env.PUBLIC_URL}/images/isa.png`} alt="여울"/>
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <input 
          type="text"
          value={input}
          placeholder="시작 단어를 입력해주세요"
          onChange={(e)=>{setInput(e.target.value)}}
        />
        <button type="submit">시작하기</button>
      </form>
    </div>
  );
};

export default StartScreen;