const express = require('express');
const router = express.Router();
const Quiz = require('../Models/Quiz'); // Assuming you have a Quiz model
const QuizResult=require("../Models/QuizResult");
const uuid=require("uuid");
// Create quiz
router.post('/create', async (req, res) => {
  try {
    const { title, questions } = req.body;

    // Validate request body
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Title and questions are required' });
    }

    // Create new quiz object
    const newQuiz = new Quiz({
      title,
      questions,
      link: uuid.v4() // Generate a unique link for the quiz
    });

    // Save quiz to the database
    const savedQuiz = await newQuiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quiz: savedQuiz, link: savedQuiz.link });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//for accessing all quizzes in database
router.get("/quizzes",async(req,res)=>{
  const quiz = await Quiz.find();
  res.json(quiz);
})
// for student to access a quiz through link
router.get('/:link', async (req, res) => {
    try {
      const link = req.params.link;
      const quiz = await Quiz.findOne({ link });
  
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
  
      res.json( quiz );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  //for submission of quiz and calculation of result
  router.post('/submit-answers', async (req, res) => {
    try {
      const { quizId, answers } = req.body;

      // Fetch the quiz from the database
      const quiz = await Quiz.findById(quizId);
      
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      
      // Compare submitted answers with correct answers
      let score = 0;
      for (const questionIndex in answers) {
        const selectedOptionIndex = answers[questionIndex];
        const correctOptionIndex = quiz.questions[questionIndex].correctAnswerIndex;
        if (selectedOptionIndex === correctOptionIndex) {
          score++;
        }
      }
      
      // Calculate percentage score
      const totalQuestions = quiz.questions.length;
      const percentageScore = (score / totalQuestions) * 100;
      
      // Save quiz result to database
      // Here, you can store additional information like student ID, timestamp, etc.
      const quizResult = {
        score,
        totalQuestions,
        percentageScore,
        // Add additional information here
      };
      
      // You need to save this result to your database, for example using a QuizResult model
      const newResult = new QuizResult(quizResult);
      await newResult.save();
      
      res.json({ message: 'Quiz submitted successfully', score, percentageScore });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// Route to get quiz results for a specific quiz
router.get('/quiz-results/:quizId', async (req, res) => {
    try {
      const quizId = req.params.quizId;
  
      // Fetch all quiz results for the specified quiz ID
      const quizResults = await QuizResult.find({ quiz: quizId }).populate('student', 'firstName lastName');
  
      // Return the quiz results to the teacher
      res.json(quizResults);
    } catch (error) {
      console.error('Error getting quiz results:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;