import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [displayTime, setDisplayTime] = useState(25*60);
  const [breakTime, setBreakTime] = useState(5*60);
  const [sessionTime, setSessionTime] = useState(25*60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  /*const useEffect = useEffect;
  const useRef = useRef;*/
  const audioSrc =
"https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

  let player = useRef(null);

  const breakSound = () => {
  player.currentTime = 0;
  player.play();
};

useEffect(() => {
  if (displayTime <= 0) {
    setOnBreak(true);
    setTimerOn(false)
    breakSound();
  } else if (!timerOn && displayTime === breakTime) {
    setOnBreak(false);
  }
  console.log("test");
}, [displayTime, onBreak, timerOn, breakTime, sessionTime]);

  const formatTimer = (time) => {
      let minutes = Math.floor(time/60);
      let seconds = time % 60;
      return (
          "" + minutes
      );
  };
  

  const formatTime = (time) => {
      let minutes = Math.floor(time/60);
      let seconds = time % 60;
      return (
          (minutes <10 ? "0" + minutes: minutes) +
           ":" +
      (seconds <10 ? "0" + seconds: seconds)
      );
  };

  const changeTime = (amount, type) =>{
      if(type == "break"){
          if((breakTime <= 60 && amount < 0) || (breakTime >= 60 * 60)){
              return;
          } else 
          setBreakTime(prev => prev + amount);
      } else {
          if((sessionTime <= 60 && amount < 0) || (sessionTime >= 60 * 60)){
              return;
          }
          setSessionTime((prev) => prev +amount);
          if(!timerOn){
              setDisplayTime(sessionTime +amount);
          }
      }
  };

  const controlTime = () =>{
      let second = 1000;
      let date = new Date().getTime();
      let nextDate = new Date().getTime() + second;
      let onBreakVariable = onBreak;
      if(!timerOn){
          let interval = setInterval(() => {
              date = new Date().getTime();
              if(date > nextDate){
                  setDisplayTime((prev) => {
                      if(prev <= 0 && !onBreakVariable){
                          onBreakVariable=true;
                          setOnBreak(true)
                          return breakTime;
                      }else if(prev <= 0 && onBreakVariable){
                          onBreakVariable=false;
                          setOnBreak(false);
                          return sessionTime;
                      }
                      return prev - 1;
                  });
                  nextDate += second;
              }
          }, 30);
          localStorage.clear();
          localStorage.setItem("interval-id", interval)
      }
      if(timerOn){
          clearInterval(localStorage.getItem("interval-id"));
      }
      setTimerOn(!timerOn)
  };

  const resetTime = () => {
  clearInterval(localStorage.getItem("interval-id")); 
  setDisplayTime(25 * 60);
  setBreakTime(5 * 60);
  setSessionTime(25 * 60);
  player.pause();
  player.currentTime = 0;
  setTimerOn(false);
  setOnBreak(false); 
};

return (
  <div className="container">
    <h1	className="title-heading" id="main-heading">Pomodoro Clock🍅</h1>
    <div className="action-container">
    <Length
      title={"Break length"} 
      changeTime={changeTime} 
      type={"break"} 
      time={breakTime} 
      formatTime={formatTime}
      formatTimer={formatTimer}
      />
              <Length 
      title={"Session length"} 
      changeTime={changeTime} 
      type={"session"} 
      time={sessionTime} 
      formatTime={formatTime}
      formatTimer={formatTimer}
      />
    </div>
    <div className="time-container">
      <div>
      <audio ref={(t) => (player = t)} src={audioSrc} id="beep" />
  <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
  <hr className="horizontal-rule"/>
       <h1 id="time-left">{formatTime(displayTime)}</h1>
       <button  id="start_stop" className="btn" onClick={controlTime}>
          {timerOn ? (
              <i className="material-icons">pause_circle_filled</i>
          ): (
              <i className="material-icons">play_circle_filled</i>
          )}
      </button>
      <button id="reset" className="btn" onClick={resetTime}>
          <i className="material-icons">autorenew</i>
      </button>
      </div>
    </div>
  </div>
);
}
function Length({title, changeTime, type, time, formatTime, formatTimer}){
return (
    <div class="container">
        <h3 className="text-center" id={type === "break" ? "break-label" : "session-label"}>
    {title}
    </h3>
    <hr class="horizontal-rule" />
        <div className="time-sets">
        <button id={type === "break" ? "break-decrement" : "session-decrement"} className="btn counter-btn time-btn"
                onClick={() => changeTime(-60, type)}>
                &uarr;
                </button>
                <h3 id={type === "break" ? "break-length" : "session-length"}>{formatTimer(time)}</h3>
            <button id="break-increment" className="btn counter-btn time-btn"
            onClick={() => changeTime(60, type)} >
                <i id={type === "break" ? "break-increment" : "session-increment"}>&darr;</i>
            </button>
        </div>
    </div>
);
}

export default App
