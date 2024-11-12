export default function handler(req, res) {
  const questions = [
    {
      id: 1,
      options: [
        { id: 1, image: "/images/uxui/quiz_1_1.png", isGoodDesign: true },
        { id: 2, image: "/images/uxui/quiz_1_2.png", isGoodDesign: false },
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
        { id: 1, image: "/images/uxui/quiz_2_1.png", isGoodDesign: true },
        { id: 2, image: "/images/uxui/quiz_2_2.png", isGoodDesign: false },
      ],
      feedback: {
        correct:
          "Верно! Межбуквенные и межстрочные отступы слишком большие.",
        incorrect:
          "Не угадали! Здесь нет проблем с межбуквенными и межстрочными отступами. ",
      },
    },
    {
      id: 3,
      options: [
        { id: 1, image: "/images/uxui/quiz_3_1.png", isGoodDesign: true },
        { id: 2, image: "/images/uxui/quiz_3_2.png", isGoodDesign: false },
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
        { id: 1, image: "/images/uxui/quiz_4_1.png", isGoodDesign: false },
        { id: 2, image: "/images/uxui/quiz_4_2.png", isGoodDesign: true },
      ],
      feedback: {
        correct:
          "Верно! Обратите внимание на размер иконки камеры.",
        incorrect:
          "Не угадали! Обратите внимание на размер иконки камеры.",
      },
    },
    {
      id: 5,
      options: [
        { id: 1, image: "/images/uxui/quiz_5_1.png", isGoodDesign: false },
        { id: 2, image: "/images/uxui/quiz_5_2.png", isGoodDesign: true },
      ],
      feedback: {
        correct:
          "Верно! Тут соблюдается контраст в цветах. ",
        incorrect:
          "Не угадали! Лучше сделать цвет фона и текста более контрастными.",
      },
    },
    {
      id: 6,
      options: [
        { id: 1, image: "/images/uxui/quiz_6_1.png", isGoodDesign: false },
        { id: 2, image: "/images/uxui/quiz_6_2.png", isGoodDesign: true },
      ],
      feedback: {
        correct:
          "Верно! Тут соблюдается единство стилей иконок. ",
        incorrect:
          "Не угадали! Тут не соблюдается единство стилей иконок.",
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
