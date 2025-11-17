import React, { useState, useEffect } from 'react';
import './DialogueBox.css';

const DialogueBox = ({ dialogue, onComplete, viewpoint }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!dialogue) return;

    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;
    const text = dialogue.text;
    const speed = dialogue.type === 'distorted' ? 100 : 50;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [dialogue]);

  if (!dialogue) return null;

  const handleClick = () => {
    if (isComplete && onComplete) {
      onComplete();
    } else if (!isComplete) {
      setDisplayedText(dialogue.text);
      setIsComplete(true);
    }
  };

  const getSpeakerName = (speaker) => {
    const names = {
      mother: '어머니',
      byeol: '별이',
      system: '시스템',
    };
    return names[speaker] || speaker;
  };

  return (
    <div
      className={`dialogue-box ${dialogue.type || ''} viewpoint-${viewpoint} speaker-${dialogue.speaker}`}
      onClick={handleClick}
    >
      {dialogue.speaker !== 'narration' && (
        <div className="dialogue-speaker">
          {getSpeakerName(dialogue.speaker)}
        </div>
      )}
      <div className={`dialogue-text ${dialogue.type === 'distorted' ? 'distorted' : ''}`}>
        {displayedText}
        {isComplete && <span className="dialogue-continue">▼</span>}
      </div>
    </div>
  );
};

export default DialogueBox;
