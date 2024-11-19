export default function handler(req, res) {
    const questions = [
      {
        id: 1,
        options: [
          { id: 1, isGoodDesign: true },
          { id: 2, isGoodDesign: false },
        ],
        feedback: {
          correct:
            "Верно! При больших объемах текста лучше использовать выравнивание по левому краю.",
          incorrect:
            "Не угадали! При больших объемах текста лучше использовать выравнивание по левому краю.",
        },
      },
            {
        id: 2,
        options: [
          { id: 1, isGoodDesign: true },
          { id: 2, isGoodDesign: false},
        ],
        feedback: {
          correct:
            "Верно! Межбуквенные и межстрочные отступы слишком большие.",
          incorrect:
            "Не угадали! ЗДесь нет проблем с межбуквенными и межстрочными отступами. ",
        },
      },
      {
        id: 3,
        options: [
          { id: 1, isGoodDesign: true },
          { id: 2, isGoodDesign: false },
        ],
        feedback: {
          correct:
          "Верно! Лучше избегать чистого черного цвета, так как он очень контарстный и может вызывать  напряжение глаз и усталость.",
          incorrect:
          "Не угадали! Лучше избегать чистого черного цвета, так как он очень контарстный и может вызывать  напряжение глаз и усталость.",
        },
      },
      {
        id: 4,
        options: [
          { id: 1, isGoodDesign: false },
          { id: 2, isGoodDesign: true },
        ],
        feedback: {
          correct:
            "Верно! Обратите внимание на размер иконки камеры. ",
          incorrect:
            "Не угадали! Обратите внимание на размер иконки камеры.",
        },
      },
      {
        id: 5,
        options: [
          { id: 1, isGoodDesign: false},
          { id: 2, isGoodDesign: true },
        ],
        feedback: {
          correct:
            "Верно! Тут соблюдается контраст в цветах.",
          incorrect:
            "Не угадали! Лучше сделать цвет фона и текста более контрастными.",
        },
      },
      {
        id: 6,
        options: [
          { id: 1, isGoodDesign: false },
          { id: 2, isGoodDesign: true },
        ],
        feedback: {
          correct:
            "Верно! Тут соблюдается единство стилей иконок.",
          incorrect:
            "Не угадали! Тут не соблюдается единство стилей иконок.",
        },
      },
      {
        id: 7,
        options: [
          { id: 1, isGoodDesign: true },
          { id: 2, isGoodDesign: false },
        ],
        feedback: {
          correct:
            "Верно! При наборе цифр, например, номера карты или телефона, лучше использовать маску.",
          incorrect:
            "Не верно! При наборе цифр, например, номера карты или телефона, лучше использовать маску.",
        },
      },
      {
        id: 8,
        options: [
          { id: 1, isGoodDesign: true },
          { id: 2, isGoodDesign: false },
        ],
        feedback: {
          correct:
            "Верно! Похожие элементы лучше объединять в группы.",
          incorrect:
            "А вот и нет! Похожие элементы лучше объединять в группы.",
        },
      },
      {
        id: 9,
        options: [
          { id: 1, isGoodDesign: false },
          { id: 2, isGoodDesign: true },
        ],
        feedback: {
          correct:
            "Верно! Отображайте визуально статус системы",
          incorrect:
            "Почти) В интерфейсах удобных для пользователей нужно отображать статус системы.",
        },
      },
      {
        id: 10,
        options: [
          { id: 1, isGoodDesign: false },
          { id: 2, isGoodDesign: true },
        ],
        feedback: {
          correct:
            "Верно! Тут акцент на кнопке, которая нужна пользователю, чтобы ему было легче сориентироваться. ",
          incorrect:
            "Не совсем! Тут акцент лучше сделать на кнопке, которая нужна пользователю, чтобы ему было легче сориентироваться.",
        },
      },
      {
        id: 11,
        options: [
          { id: 1, isGoodDesign: true },
          { id: 2, isGoodDesign: false },
        ],
        feedback: {
          correct:
            "У вас глаз-алмаз! Вы заметели разницу в размере диалогового облака. ",
          incorrect:
            "Не угадали! Обратите внимание на разницу в размере диалогового облака. ",
        },
      },
      {
        id: 12,
        options: [
          { id: 1, isGoodDesign: true },
          { id: 2, isGoodDesign: false },
        ],
        feedback: {
          correct:
            "Верно! Тут проблема в соотнешениях сторон картинки товара.",
          incorrect:
            "А вот и нет! Обратите внимание в соотнешениях сторон картинки товара",
        },
      },
    ];
  
    if (req.method === "GET") {
      return res.status(200).json(questions);
    }
  
    if (req.method === "POST") {
      try {
        const { answers } = req.body;
        console.log("Submitted answers:", answers); // Debug log
  
        if (answers.length !== questions.length) {
          console.warn(
            "Incomplete answers submitted. Please answer all questions."
          );
          return res.status(400).json({ error: "Incomplete answers submitted" });
        }
  
        let score = 0;
        const feedbackArray = [];
  
        // Calculate score and feedback
        answers.forEach((selectedOptionId, index) => {
          const question = questions[index];
          const selectedOption = question.options.find(
            (option) => option.id === selectedOptionId
          );
  
          if (selectedOption) {
            const feedback = selectedOption.isGoodDesign
              ? question.feedback.correct
              : question.feedback.incorrect;
            feedbackArray.push(feedback);
  
            if (selectedOption.isGoodDesign) {
              score += 1;
            }
          }
        });
  
        console.log("Calculated score:", score); // Debug log
        return res.status(200).json({ score, feedback: feedbackArray });
      } catch (error) {
        console.error("Error processing answers:", error);
        return res.status(500).json({ error: "Error processing answers" });
      }
    }
  
    return res.status(405).json({ message: "Method not supported" });
  }
  