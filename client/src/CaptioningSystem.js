import React, { useEffect } from 'react';
import SpeechRecognition,{ useSpeechRecognition } from 'react-speech-recognition';
import './CaptioningSystem.css';
const CaptioningSystem = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const max = 75;

  if(transcript.length > max){
    resetTranscript();
  }

  return (
    <div>
       <p style={{color: 'black'}} class='captions-text'>{transcript}</p>
    </div>
  );
};

export default CaptioningSystem;