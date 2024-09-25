.QuestionPart {
  display: flex;
  width: auto;
  padding: 35px;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  border-radius: 20px;
  background: #fff;
  max-width: 1200px;
}

.AllComponent {
  display: grid;
  align-items: center;
  justify-items: center;
}

.Answer {
  display: flex;
  flex-direction: column; /* Варианты ответов будут расположены в столбик */
}

.AnswerVariants {
  font-family: 'SF Pro', sans-serif;
  display: flex;
  padding: 5px;
  align-items: center;
  gap: 15px;
  border-radius: 10px;
  width: 300px; /* Фиксированная ширина */
  max-width: 100%; /* Ограничивает ширину до 100% родительского контейнера */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Не переносить текст на новую строку */
}



.QuestionText {
  width: 800px;
  max-width: 800px;
  font-family: Sf pro, sans-serif;
  color: black;
  font-size: 25px;
  font-weight: 800;
  line-height: 27.75px;
  word-wrap: break-word;
}

/* Новый стиль для обертки кнопок и статус бара */
.buttonStatusContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px; /* Ограничение ширины для лучшей структуры */
  gap: 20px; /* Расстояние между кнопками и статусом */
  margin-top: 20px;
}
