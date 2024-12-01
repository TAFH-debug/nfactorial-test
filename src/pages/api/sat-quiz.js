export default function handler(req, res) {
  const testDetails = {
    title:
      "Готовы ли вы к поступлению зарубеж? Сможете ли набрать 1600 на SAT?",
    description:
      "Проверь свои знания и получи консультацию от экспертов! Вам будут даны 8 вопросов разной сложности по математике и английскому языку. В конце получите результат и наши рекомендации. Вперед!",
    questions: [
      // {
      //   id: 1,
      //   question: "If 2x + 3 = 9, what is the value of 6x − 16x − 1?",
      //   choices: [
      //     { text: "17", correct: true },
      //     { text: "3", correct: false },
      //     { text: "4", correct: false },
      //     { text: "14", correct: false },
      //   ],
      //   correctExplanation:
      //   `
      //     Правильно! Вот объяснение:

      //     The correct answer is 17. It's given that 2x+3=92x+3=9. Multiplying each side of this equation by 3 yields 3(2x+3) = 3(9)3(2x+3) = 3(9), or 6x+9 = 276x+9=27.

      //     Subtracting 10 from each side of this equation yields 6x+9−10=27−106x+9−10=27−10, or 6x−1=176x−1=17. Therefore, the value of 6x−16x−1 is 17.
      //     `,
      //   incorrectExplanation:
      //   `
      //   Неправильно! Вот объяснение:

      //   The correct answer is 17. It's given that 2x+3=92x+3=9. Multiplying each side of this equation by 3 yields 3(2x+3) = 3(9)3(2x+3) = 3(9), or 6x+9 = 276x+9=27.

      //   Subtracting 10 from each side of this equation yields 6x+9−10=27−106x+9−10=27−10, or 6x−1=176x−1=17. Therefore, the value of 6x−16x−1 is
      //   `,
      // },
      {
        id: 1,
        question:
          "If \\(2x + 3 = 9\\), what is the value of \\(6x − 16x − 1\\)?",
        choices: [
          { text: "17", correct: true },
          { text: "3", correct: false },
          { text: "4", correct: false },
          { text: "14", correct: false },
        ],
        correctExplanation: `
\\[
\\begin{align*}
&\\text{The correct answer is 17. It's given that } 2x + 3 = 9. \\\\
&\\text{Multiply each sides by 3 yields 3(2x + 3) = 3, \ } 6x + 9 = 27. \\\\
&\\text{Subtract 10 from each side 6x + 9 + 10 = 27 - 10:\ } 6x - 1 = 17.
\\end{align*}
\\]
        `,
        incorrectExplanation: `
\\[
\\begin{align*}
&\\text{The correct answer is 17. It's given that } 2x + 3 = 9. \\\\
&\\text{Multiply each sides by 3 yields 3(2x + 3) = 3, \ } 6x + 9 = 27. \\\\
&\\text{Subtract 10 from each side 6x + 9 + 10 = 27 - 10:\ } 6x - 1 = 17.
\\end{align*}
\\]
        `,
      },
      {
        id: 2,
        question:
          "A rectangle has a length that is 15 times its width. The function y=(15w)(w) represents this situation, where y is the area, in square feet, of the rectangle and y > 0. Which of the following is the best interpretation of 15w in this context?",
        choices: [
          { text: "The length of the rectangle, in feet", correct: true },
          { text: "The area of the rectangle, in square feet", correct: false },
          {
            text: "The difference between the length and the width of the rectangle, in feet",
            correct: false,
          },
          { text: "The width of the rectangle, in feet", correct: false },
        ],
        correctExplanation: `
          Правильно! Вот объяснение: 
It's given that a rectangle has a length that is 15 times its width. It's also given that the function y=(15w)(w)y=(15w)(w)represents this situation, where yy is the area, in square feet, of the rectangle. The area of a rectangle can be calculated by multiplying the rectangle's length by its width. Since the rectangle has a length that is 15 times its width, it follows that ww represents the width of the rectangle, in feet, and 15w15w represents the length of the rectangle, in feet. Therefore, the best interpretation of 15w15w in this context is that it's the length of the rectangle, in feet.

          `,
        incorrectExplanation: `
        Неправильно! Вот объяснение: 

It's given that a rectangle has a length that is 15 times its width. It's also given that the function y=(15w)(w)y=(15w)(w)represents this situation, where yy is the area, in square feet, of the rectangle. The area of a rectangle can be calculated by multiplying the rectangle's length by its width. Since the rectangle has a length that is 15 times its width, it follows that ww represents the width of the rectangle, in feet, and 15w15w represents the length of the rectangle, in feet. Therefore, the best interpretation of 15w15w in this context is that it's the length of the rectangle, in feet.

          `,
      },
      {
        id: 3,
        question:
          "A sample of oak has a density of 807 kilograms per cubic meter. The sample is in the shape of a cube, where each edge has a length of 0.90 meters. To the nearest whole number, what is the mass, in kilograms, of this sample?",
        choices: [
          { text: "588", correct: true },
          { text: "726", correct: false },
          { text: "897", correct: false },
          { text: "1,107", correct: false },
        ],
        correctExplanation: `
          Правильный ответ! Вот объяснение: 
Choice A is correct. It’s given that the sample is in the shape of a cube with edge lengths of 0.9 meters. Therefore, the volume of the sample is 0.930.93, or 0.729 cubic meters. It’s also given that the sample has a density of 807 kilograms per 1 cubic meter. Therefore, the mass of this sample is 0.729 cubic meters× (807 kilograms / 1 cubic meter), or 588.303 kilograms.

          `,
        incorrectExplanation: `
        Вы ошиблись :( Вот объяснение: 
Choice A is correct. It’s given that the sample is in the shape of a cube with edge lengths of 0.9 meters. Therefore, the volume of the sample is 0.930.93, or 0.729 cubic meters. It’s also given that the sample has a density of 807 kilograms per 1 cubic meter. Therefore, the mass of this sample is 0.729 cubic meters× (807 kilograms / 1 cubic meter), or 588.303 kilograms.

          `,
      },
      {
        id: 4,
        question:
          "According to the text from Jane Austen’s novel Sense and Sensibility, what is true about Elinor?",
        choices: [
          {
            text: "Elinor often argues with her mother but fails to change her mind.",
            correct: false,
          },
          {
            text: "Elinor can be overly sensitive with regard to family matters.",
            correct: false,
          },
          {
            text: "Elinor thinks her mother is a bad role model.",
            correct: false,
          },
          { text: "Elinor is remarkably mature for her age.", correct: true },
        ],
        correctExplanation: `
          Ура, правильный ответ! Вот объяснение:
Choice D is the best answer because it provides a detail about Elinor that is established in the text. The text indicates that although Elinor is “only nineteen,” she gives good advice and exhibits such a high level of understanding and judgment that she serves as “the counsellor of her mother.” Thus, Elinor is mature beyond her years.

          `,
        incorrectExplanation: `
        Неправильно! Вот объяснение
Choice D is the best answer because it provides a detail about Elinor that is established in the text. The text indicates that although Elinor is “only nineteen,” she gives good advice and exhibits such a high level of understanding and judgment that she serves as “the counsellor of her mother.” Thus, Elinor is mature beyond her years.

          `,
      },
      {
        id: 5,
        question:
          "Ease of decision making may be linked to communication between the prefrontal cortex and the parietal cortex. Individuals tend to be more decisive if the information flow between the regions is intensified, whereas they make choices more slowly when information flow is ______.",
        choices: [
          { text: "reduced", correct: true },
          { text: "evaluated", correct: false },
          { text: "determined", correct: false },
          { text: "acquired", correct: false },
        ],
        correctExplanation: `
          Молодец, это правильный ответ! 
Choice A is the best answer because it most logically completes the text’s discussion of how the flow of information between two regions of the brain may affect the ease of people’s decision making. In this context, "reduced" means decreased. The text presents the finding from a team of neuroeconomists that decision making may be connected to communication between the prefrontal cortex and the parietal cortex. In presenting this finding, the text suggests a contrast between people who tend to be more decisive and people who make decisions more slowly. According to the text, people tend to be more decisive when the flow of information between the two brain regions is intensified, or strengthened. On the other hand, this context suggests that people make choices more slowly when the flow of information between the two brain regions is decreased.

          `,
        incorrectExplanation: `
        К сожалению, ответ неверный. Вот объяснение: 
Choice A is the best answer because it most logically completes the text’s discussion of how the flow of information between two regions of the brain may affect the ease of people’s decision making. In this context, "reduced" means decreased. The text presents the finding from a team of neuroeconomists that decision making may be connected to communication between the prefrontal cortex and the parietal cortex. In presenting this finding, the text suggests a contrast between people who tend to be more decisive and people who make decisions more slowly. According to the text, people tend to be more decisive when the flow of information between the two brain regions is intensified, or strengthened. On the other hand, this context suggests that people make choices more slowly when the flow of information between the two brain regions is decreased.

          `,
      },
      {
        id: 6,
        question:
          "While researching a topic, a student has taken the following notes... Which choice most effectively uses relevant information to introduce Cathryn Halverson’s book?",
        choices: [
          {
            text: "Cathryn Halverson’s Faraway Women and the 'Atlantic Monthly' discusses female authors whose autobiographies appeared in the magazine in the early 1900s.",
            correct: true,
          },
          {
            text: "A magazine called the Atlantic Monthly, referred to in Cathryn Halverson’s book title, was first published in 1857.",
            correct: false,
          },
          {
            text: "Faraway Women and the 'Atlantic Monthly' features contributors to the Atlantic Monthly, first published in 1857 as a magazine focusing on politics, art, and literature.",
            correct: false,
          },
          {
            text: "An author discussed by Cathryn Halverson is Juanita Harrison, whose autobiography appeared in the Atlantic Monthly in the early 1900s.",
            correct: false,
          },
        ],
        correctExplanation: `
          Правильно! 
The sentence effectively introduces Cathryn Halverson’s book to an audience already familiar with the Atlantic Monthly, noting the title of Halverson’s book and describing its content without providing background information about the Atlantic Monthly.
          `,
        incorrectExplanation: `
        Неверно :(
The sentence effectively introduces Cathryn Halverson’s book to an audience already familiar with the Atlantic Monthly, noting the title of Halverson’s book and describing its content without providing background information about the Atlantic Monthly.
          `,
      },
    ],
  };

  if (req.method === "GET") {
    return res.status(200).json(testDetails);
  }

  if (req.method === "POST") {
    try {
      const { answers } = req.body;

      if (answers.length !== testDetails.questions.length) {
        return res.status(400).json({ error: "Incomplete answers submitted" });
      }

      let score = 0;
      const feedbackArray = [];

      // Calculate score and feedback
      answers.forEach((selectedChoiceIndex, index) => {
        const question = testDetails.questions[index];
        const selectedChoice = question.choices[selectedChoiceIndex];

        if (selectedChoice) {
          const feedback = selectedChoice.correct
            ? question.explanation
            : "Incorrect. " + question.explanation;
          feedbackArray.push(feedback);

          if (selectedChoice.correct) {
            score += 1;
          }
        }
      });

      return res.status(200).json({ score, feedback: feedbackArray });
    } catch (error) {
      return res.status(500).json({ error: "Error processing answers" });
    }
  }

  return res.status(405).json({ message: "Method not supported" });
}
