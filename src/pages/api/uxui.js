export default function handler(req, res) {
    const questions = [
      {
        id: 1,
        options: [
          { id: 1, image: "/images/uxui/quiz_1_1.png", isGoodDesign: true },
          { id: 2, image: "/images/uxui/quiz_1_2.png", isGoodDesign: false },
        ],
      },
      {
        id: 2,
        options: [
          { id: 1, image: "/images/uxui/quiz_2_1.png", isGoodDesign: true },
          { id: 2, image: "/images/uxui/quiz_2_2.png", isGoodDesign: false },
        ],
      },
      {
        id: 3,
        options: [
          { id: 1, image: "/images/uxui/quiz_3_1.png", isGoodDesign: true },
          { id: 2, image: "/images/uxui/quiz_3_2.png", isGoodDesign: false },
        ],
      },
      {
        id: 4,
        options: [
          { id: 1, image: "/images/uxui/quiz_4_1.png", isGoodDesign: true },
          { id: 2, image: "/images/uxui/quiz_4_2.png", isGoodDesign: false },
        ],
      },
      {
        id: 5,
        options: [
          { id: 1, image: "/images/uxui/quiz_5_1.png", isGoodDesign: true },
          { id: 2, image: "/images/uxui/quiz_5_2.png", isGoodDesign: false },
        ],
      },
      {
        id: 6,
        options: [
          { id: 1, image: "/images/uxui/quiz_6_1.png", isGoodDesign: true },
          { id: 2, image: "/images/uxui/quiz_6_2.png", isGoodDesign: false },
        ],
      },
    ];
  
    if (req.method === "GET") {
      // Send JSON response for GET requests
      return res.status(200).json(questions);
    }
  
    if (req.method === "POST") {
      try {
        const { answers } = req.body;
        let score = 0;
  
        // Score calculation logic
        answers.forEach((selectedOptionId, index) => {
          const question = questions[index];
          const selectedOption = question.options.find(
            (option) => option.id === selectedOptionId
          );
          if (selectedOption && selectedOption.isGoodDesign) {
            score += 1;
          }
        });
  
        // Send JSON response for POST requests
        return res.status(200).json({ score });
      } catch (error) {
        console.error("Error processing answers:", error);
        return res.status(500).json({ error: "Error processing answers" });
      }
    }
  
    return res.status(405).json({ message: "Method not supported" });
  }
  