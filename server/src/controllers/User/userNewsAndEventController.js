import NewsAndEvent from '../../models/NewsAndEvent.js';
import { Op } from 'sequelize';

// ✅ USER: Public GET function for fetching only active news/events
export const getAllActiveEvents = async (req, res) => {
  try {
    console.log('👤 USER API Called: getAllActiveEvents - ONLY ACTIVE EVENTS');
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // USER KE LIYE: STRICT FILTER - ONLY ACTIVE EVENTS
    const whereClause = {
      status: 'Active' // ✅ YAHAN PAR STATUS FILTER LAGANA IMPORTANT HAI
    };

    if (search) {
      whereClause[Op.or] = [
        { titleEnglish: { [Op.like]: `%${search}%` } },
        { titleOdia: { [Op.like]: `%${search}%` } }
      ];
    }

    console.log('🎯 USER Database Query Filter:', whereClause);

    // ✅ SCOPE USE KARNA IMPORTANT HAI
    const { count, rows } = await NewsAndEvent.findAndCountAll({
      where: whereClause, // ✅ YAHAN PAR whereClause USE KARNA HAI
      limit,
      offset,
      order: [['eventDate', 'DESC']],
    });

    console.log(`✅ USER Found ${count} ACTIVE events`);

    // Debugging ke liye har event ka status check karein
    rows.forEach(event => {
      console.log(`Event ID: ${event.id}, Title: ${event.titleEnglish}, Status: ${event.status}`);
    });

    const totalPages = Math.ceil(count / limit);

    const transformed = rows.map(event => {
      const obj = event.toJSON();
      obj.documentUrl = obj.document
        ? `/uploads/events/${obj.document}`
        : null;
      return obj;
    });

    // Frontend compatible response format
    res.status(200).json({
      success: true,
      data: transformed,
      total: count,
      totalPages,
      currentPage: page
    });

  } catch (error) {
    console.error("❌ Error fetching active news/events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active events",
      error: error.message
    });
  }
};