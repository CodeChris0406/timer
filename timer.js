import ReactDOM from "https://esm.sh/react-dom";
import React, { useState, useEffect } from "https://esm.sh/react";

function Clock() {
    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [timerLabel, setTimerLabel] = useState('Session');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [isReset, setIsReset] = useState(true);

    useEffect(() => {
        if (isRunning) {
            const id = setInterval(() => {
                setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
            }, 1000);
            setIntervalId(id);
        } else if (!isRunning && intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning]);

    useEffect(() => {
        if (timeLeft === 0) {
            document.getElementById('beep').play();
            const newLabel = timerLabel === 'Session' ? 'Break' : 'Session';
            setTimerLabel(newLabel);
            setTimeLeft((newLabel === 'Session' ? sessionLength : breakLength) * 60);
        }
    }, [timeLeft, timerLabel, breakLength, sessionLength]);

 const toggleStartStop = () => {
    setIsRunning(!isRunning);
    setIsReset(false); // Timer is no longer in its initial reset state
};
useEffect(() => {
    if (!isRunning && isReset && timerLabel === 'Session') {
        setTimeLeft(sessionLength * 60);
    }
}, [sessionLength, isRunning, timerLabel, isReset]);
const reset = () => {
        setBreakLength(5);
        setSessionLength(25);
        setTimeLeft(25 * 60);
        setTimerLabel('Session');
        setIsRunning(false);
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        const beep = document.getElementById('beep');
        if (beep) {
            beep.pause();
            beep.currentTime = 0;
        }
      setIsReset(true); // Timer is now reset to its initial state

    };

    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <div className="clock-container">
            <h1>25 + 5 Clock</h1>
            <div id="break-label">Break Length</div>
            <button className="button" id="break-decrement" onClick={() => setBreakLength(prev => Math.max(prev - 1, 1))}>-</button>
            <span id="break-length">{breakLength}</span>
            <button className="button" id="break-increment" onClick={() => setBreakLength(prev => Math.min(prev + 1, 60))}>+</button>
            <div id="session-label">Session Length</div>
            <button className="button" id="session-decrement" onClick={() => setSessionLength(prev => Math.max(prev - 1, 1))}>-</button>
            <span id="session-length">{sessionLength}</span>
            <button className="button" id="session-increment" onClick={() => setSessionLength(prev => Math.min(prev + 1, 60))}>+</button>
            <div className="timer-frame">
                <div id="timer-label">{timerLabel}</div>
                <div id="time-left" className="timer">{formatTime(timeLeft)}</div>
            </div>
            <button className="button" id="start_stop" onClick={toggleStartStop}>{isRunning ? 'Pause' : 'Start'}</button>
            <button className="button" id="reset" onClick={reset}>Reset</button>
            <audio id="beep" src="https://drive.google.com/uc?export=download&id=17VEC66sfkPOad17-AYkb_qwpvO0cXJTW"></audio>
        </div>
    );
}

ReactDOM.render(<Clock />, document.getElementById('root'));
