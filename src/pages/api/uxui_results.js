// pages/api/quiz.js
export default function handler(req, res) {
    if (req.method === "POST") {
      try {
        const { answers } = req.body;
        let score = 0;
        let bonus = 0;
  
        // Example scoring logic; adjust as necessary
        answers.forEach((answer) => {
          if (answer === 1) {
            score += 1;
            bonus += 1; // Assuming each correct answer gets a bonus point
          }
        });
  
        res.status(200).json({ score, bonus });
      } catch (error) {
        console.error("Error processing answers:", error);
        res.status(500).json({ error: "Server error" });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }
  