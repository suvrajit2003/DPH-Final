import express from 'express';
const router = express.Router();

// Import only GET controller functions
import {
  getAnswers,
  getAnswer,
  getAnswersByCategory,
  getAnswersByQuestion,
  getQuestionsByCategory as getAnswerRelatedQuestions
} from '../../controllers/ChatbotAnswerController.js';

import {
  getCategories,
  getCategory
} from '../../controllers/ChatbotCategoryController.js';

import {
  getQuestions,
  getQuestion,
  getQuestionsByCategory
} from '../../controllers/ChatbotQuestionController.js';

// ✅ ANSWERS ROUTES (GET only)
router.get('/answers', getAnswers);                         // List answers
router.get('/answers/:id', getAnswer);                      // Get single answer
router.get('/answers/category/:category_id', getAnswersByCategory);  // Answers by category
router.get('/answers/question/:question_id', getAnswersByQuestion);  // Answers by question
router.get('/answers/questions/:category_id', getAnswerRelatedQuestions); // Dropdown questions (for answers)

// ✅ CATEGORIES ROUTES (GET only)
router.get('/categories', getCategories);                   // List categories
router.get('/categories/:id', getCategory);                 // Get single category

// ✅ QUESTIONS ROUTES (GET only)
router.get('/questions', getQuestions);                     // List questions
router.get('/questions/:id', getQuestion);                  // Get single question
router.get('/questions/category/:category_id', getQuestionsByCategory); // Questions by category

export default router;
