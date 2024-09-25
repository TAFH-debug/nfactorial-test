import React from 'react';
import styles from './StatusButton.module.css';

export default function StatusButton({ type, onClick, isDisabled }) {
  return (
    <button
      className={`${styles.button} ${styles[type]}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {type === 'back' && 'Назад'}
      {type === 'next' && 'Вперед'}
      {type === 'submit' && 'Отправить'}
    </button>
  );
}
