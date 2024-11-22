export default function handler(req, res) {
    const testDetails = {
      title: "Готовы ли вы к поступлению зарубеж? Сможете ли набрать 1600 на SAT?",
      description:
        "Проверь свои знания и получи консультацию от экспертов! Вам будут даны 8 вопросов разной сложности по математике и английскому языку. В конце получите результат и наши рекомендации. Вперед!",
      questions: [
        {
          id: 1,
          question: "If 2x + 3 = 9, what is the value of 6x − 16x − 1?",
          choices: [
            { text: "17", correct: true },
            { text: "3", correct: false },
            { text: "4", correct: false },
            { text: "14", correct: false },
          ],
          explanation:
            "The correct answer is 17. It's given that 2x+3=9. Multiplying each side of this equation by 3 yields 3(2x+3)=3(9), or 6x+9=27. Subtracting 10 from each side yields 6x−1=17. Therefore, the value of 6x−16x−1 is 17.",
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
          explanation:
            "It's given that the rectangle's length is 15 times its width. The area is calculated by multiplying the length (15w) by the width (w). Thus, 15w represents the length of the rectangle, in feet.",
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
          explanation:
            "Choice A is correct. The volume of the cube is 0.9³ = 0.729 cubic meters. With a density of 807 kg/m³, the mass is 0.729 × 807 = 588.303 kg, rounded to 588 kg.",
        },
        {
          id: 4,
          question:
            "According to the text from Jane Austen’s novel Sense and Sensibility, what is true about Elinor?",
          choices: [
            { text: "Elinor often argues with her mother but fails to change her mind.", correct: false },
            { text: "Elinor can be overly sensitive with regard to family matters.", correct: false },
            { text: "Elinor thinks her mother is a bad role model.", correct: false },
            { text: "Elinor is remarkably mature for her age.", correct: true },
          ],
          explanation:
            "Choice D is correct. The text highlights Elinor's maturity, showcasing her as a counsellor to her mother and her ability to govern her emotions at just 19 years old.",
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
          explanation:
            "Choice A is correct. 'Reduced' contrasts with 'intensified,' aligning with the context of slower decision-making due to decreased information flow.",
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
          explanation:
            "Choice A is correct. This option succinctly introduces the book and its content to an audience familiar with the Atlantic Monthly, focusing on its relevance without extraneous details.",
        },
        {
          id: 7,
          question:
            "A car travels at a speed of 60 miles per hour for 2 hours, then 50 miles per hour for 1.5 hours. What is the total distance traveled?",
          choices: [
            { text: "175 miles", correct: true },
            { text: "180 miles", correct: false },
            { text: "165 miles", correct: false },
            { text: "185 miles", correct: false },
          ],
          explanation:
            "The correct answer is 175 miles. The car travels 60 × 2 = 120 miles in the first segment and 50 × 1.5 = 75 miles in the second. Adding these gives a total of 175 miles.",
        },
        {
          id: 8,
          question:
            "Which of the following sentences uses proper grammar and punctuation?",
          choices: [
            { text: "Its raining, so I brought my umbrella.", correct: false },
            { text: "It's raining, so I brought my umbrella.", correct: true },
            { text: "Its raining; so I brought my umbrella.", correct: false },
            { text: "It's raining so I brought my umbrella.", correct: false },
          ],
          explanation:
            "The correct answer is 'It's raining, so I brought my umbrella.' The contraction 'it's' correctly means 'it is,' and the comma appropriately separates the clauses.",
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
  