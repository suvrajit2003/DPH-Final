import ImportantLink from '../../models/ImportantLink.js';
import { Op } from 'sequelize';

// Get all active important links with optional search and pagination
export const getAllLinks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Filter for active links
    let whereCondition = {
      is_active: true
    };

    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { url: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const { count, rows } = await ImportantLink.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    const transformed = rows.map(link => {
      const obj = link.toJSON();
      obj.imageUrl = obj.image ? `/uploads/important-links/${obj.image}` : null;
      return obj;
    });

    res.json({
      success: true,
      links: transformed,
      totalLinks: count,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching active links:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active links',
      error: error.message
    });
  }
};

// Get a single active link by ID
export const getLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await ImportantLink.findOne({
      where: {
        id,
        is_active: true
      }
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found or inactive'
      });
    }

    const obj = link.toJSON();
    obj.imageUrl = obj.image ? `/uploads/important-links/${obj.image}` : null;

    res.json({
      success: true,
      link: obj
    });
  } catch (error) {
    console.error('Error fetching active link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active link',
      error: error.message
    });
  }
};
