import { useState } from 'react';

export default function Question({ question, onAnswer }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChoiceClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onAnswer(selectedCategory);
    }
  };

  return (
    <div>
      <h2>{question.question}</h2>
      <ul>
        {Object.entries(question.choices).map(([category, choice], index) => (
          <li key={index} 
              style={{ 
                margin: '10px 0', 
                cursor: 'pointer',
                backgroundColor: selectedCategory === category ? '#ddd' : '#fff',
                padding: '10px', 
                border: '1px solid #ccc' 
              }}
              onClick={() => handleChoiceClick(category)}>
            {choice}
          </li>
        ))}
      </ul>
      <button 
        onClick={handleSubmit} 
        style={{ marginTop: '20px', padding: '10px 20px' }}>
        Submit Answer
      </button>
    </div>
  );
}
