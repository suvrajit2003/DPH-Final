import models from '../models/index.js';
import { Op } from 'sequelize';

const {
  ChatbotAnswer,
  ChatbotCategory,
  ChatbotQuestion
} = models;

// Get all chatbot answers (with pagination, search, filter)
export const getChatbotAnswers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category_id = req.query.category_id || '';
    const question_id = req.query.question_id || '';
    const offset = (page - 1) * limit;

    let whereCondition = {};
    if (search) {
      whereCondition = {
        [Op.or]: [
          { en: { [Op.like]: `%${search}%` } },
          { od: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    if (category_id) whereCondition.category_id = category_id;
    if (question_id) whereCondition.question_id = question_id;

    const { count, rows: answers } = await ChatbotAnswer.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ChatbotCategory,
          as: 'category',
          attributes: ['id', 'en', 'od']
        },
        {
          model: ChatbotQuestion,
          as: 'question',
          attributes: ['id', 'en', 'od']
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      answers,
      totalAnswers: count,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching chatbot answers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chatbot answers',
      error: error.message
    });
  }
};

// Get all chatbot categories (with pagination and search)
export const getChatbotCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let whereCondition = {};
    if (search) {
      whereCondition = {
        [Op.or]: [
          { en: { [Op.like]: `%${search}%` } },
          { od: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const { count, rows: categories } = await ChatbotCategory.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['order', 'ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      categories,
      totalCategories: count,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching chatbot categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chatbot categories',
      error: error.message
    });
  }
};

// Get all chatbot questions (with pagination + search)
export const getChatbotQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let whereCondition = {};
    if (search) {
      whereCondition = {
        [Op.or]: [
          { en: { [Op.like]: `%${search}%` } },
          { od: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const { count, rows: questions } = await ChatbotQuestion.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["order", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      questions,
      totalQuestions: count,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching chatbot questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching chatbot questions",
      error: error.message,
    });
  }
};
