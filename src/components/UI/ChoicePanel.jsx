import React from 'react';
import './ChoicePanel.css';

const ChoicePanel = ({ choices, onChoice }) => {
  if (!choices || choices.length === 0) return null;

  return (
    <div className="choice-panel">
      <div className="choice-container">
        {choices.map((choice) => (
          <button
            key={choice.id}
            className={`choice-button ${choice.disabled ? 'disabled' : ''}`}
            onClick={() => !choice.disabled && onChoice(choice)}
            disabled={choice.disabled}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoicePanel;
