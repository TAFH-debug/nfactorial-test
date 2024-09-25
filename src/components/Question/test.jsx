import { useState } from 'react';
import styles from './Question.module.css';

export default function Question({ question, onAnswer, onNext }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChoiceClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onAnswer(selectedCategory);
      onNext(); // Call onNext to proceed to the next question
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: '35px',
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px',
    }}>
      <h2 style={{
        alignSelf: 'stretch',
        textAlign: 'center',
        color: 'black',
        fontSize: '25px',
        fontFamily: 'Inter',
        fontWeight: 600,
        lineHeight: '27.75px',
        wordWrap: 'break-word',
      }}>
        {question.question}
      </h2>
      <ul style={{
        width: '100%',
        padding: 0,
        listStyleType: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      }}>
        {Object.entries(question.choices).map(([category, choice], index) => (
          <li
            key={index}
            style={{
              padding: '10px',
              borderRadius: '10px',
              cursor: 'pointer',
              background: selectedCategory === category ? '#ddd' : '#fff',
              border: '1px solid #ccc',
              transition: 'background 0.3s',
            }}
            onClick={() => handleChoiceClick(category)}
          >
            <div style={{
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <div style={{
                width: '15px',
                height: '15px',
                background: selectedCategory === category ? 'black' : '#C9C9C9',
              }} />
              <div style={{
                color: '#222222',
                fontSize: '17px',
                fontFamily: 'Inter',
                fontWeight: 400,
                lineHeight: '18.87px',
                wordWrap: 'break-word',
              }}>
                {choice}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '20px',
      }}>
        <button 
          style={{
            width: '203px',
            height: '43px',
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.10)',
            borderRadius: '34px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '17px',
            fontFamily: 'Inter',
            fontWeight: 700,
            color: '#007BFF',
            cursor: 'pointer',
            border: 'none',
            transition: 'background 0.3s',
          }}
          onClick={() => console.log('Back clicked')}
        >
          Назад
        </button>
        <button 
          style={{
            width: '203px',
            height: '43px',
            padding: '15px',
            background: 'white',
            borderRadius: '34px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '17px',
            fontFamily: 'Inter',
            fontWeight: 700,
            color: '#222222',
            cursor: 'pointer',
            border: 'none',
            transition: 'background 0.3s',
          }}
          onClick={handleSubmit}
        >
          Дальше
        </button>
      </div>
    </div>
  );
}
