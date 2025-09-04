import GalaryCategory from "../models/GalleryCategory.js";
import PhotoGallery from '../models/PhotoGallery.js';
import path from 'path';
import fs from 'fs';
import VideoGallery from "../models/VideoGallery.js";
import { Op } from 'sequelize';
import sequelize from "../../config/db.js";



// Register single category (with thumbnail upload)
export const registerSingleCategory = async (req, res) => {
  try {
    const { category_en, category_od, category_type, status } = req.body;
    let thumbnail = null;

    if (req.file && req.file.path) {
      thumbnail = path.basename(req.file.path); // Store only filename
    }

    const category = await GalaryCategory.create({
      category_en,
      category_od,
      category_type,
      status: status !== undefined ? status : true,
      thumbnail,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// Register multiple categories (bulk create, no thumbnails)
export const registerMultipleCategories = async (req, res) => {
  try {
    const categories = req.body.categories; // Expect array of categories in req.body.categories

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ success: false, message: 'categories must be a non-empty array' });
    }

    // Bulk create
    const createdCategories = await GalaryCategory.bulkCreate(categories);

    res.status(201).json({ success: true, categories: createdCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get all categories
// export const getAllCategories = async (req, res) => {
//   try {
//     const categories = await GalaryCategory.findAll();

//     const categoriesWithUrls = categories.map((cat) => {
//       const data = cat.toJSON();
//       const filename = (data.thumbnail || "").replace(/\\/g, "/");

//       const imageUrl = filename
//         ? `${req.protocol}://${req.get('host')}/uploads/categories/${filename}`
//         : null;

//       return {
//         ...data,
//         thumbnail_url: imageUrl,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Categories fetched successfully',
//       categories: categoriesWithUrls,
//     });
//   } catch (error) {
//     console.error('Get Categories Error:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

export const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const sortBy = req.query.sort || "createdAt";
    const sortOrder = req.query.order || "DESC";

    const allowedSortColumns = ["category_en", "category_od", "category_type", "status", "createdAt"];
    if (!allowedSortColumns.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sort column" });
    }

    const offset = (page - 1) * limit;

    const whereClause = {
      ...(search && {
        [Op.or]: [
          { category_en: { [Op.like]: `%${search}%` } },
          { category_od: { [Op.like]: `%${search}%` } },
          { category_type: { [Op.like]: `%${search}%` } },
        ],
      })
    };

    const { count, rows } = await GalaryCategory.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
    });

    // Process rows to add full thumbnail URLs
    const categoriesWithUrls = rows.map((cat) => {
      const data = cat.toJSON();
      const filename = (data.thumbnail || "").replace(/\\/g, "/");
      const imageUrl = filename ? `${req.protocol}://${req.get('host')}/uploads/categories/${filename}` : null;
      return { ...data, thumbnail_url: imageUrl };
    });

    // Return data in the standard format for our hook
    res.status(200).json({
      total: count,
      data: categoriesWithUrls,
    });

  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSingleCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await GalaryCategory.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Handle new thumbnail file upload
    if (req.file) {
      const newFilename = path.basename(req.file.path);

      // Delete old thumbnail if exists
      if (category.thumbnail) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          "uploads",
          "categories",
          category.thumbnail
        );

        fs.access(oldPath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldPath, (unlinkErr) => {
              if (unlinkErr) console.error("Failed to delete old thumbnail:", unlinkErr);
            });
          }
        });
      }

      category.thumbnail = newFilename;
    } else if (req.body.thumbnail === "") {
      // If thumbnail is sent as empty string, delete old thumbnail file and clear field
      if (category.thumbnail) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          "uploads",
          "categories",
          category.thumbnail
        );

        fs.access(oldPath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldPath, (unlinkErr) => {
              if (unlinkErr) console.error("Failed to delete old thumbnail:", unlinkErr);
            });
          }
        });
      }

      category.thumbnail = null; // Clear thumbnail in DB
    }
    // else: no change to thumbnail if no file and no empty string

    // Update other fields
    const { category_en, category_od, category_type, status } = req.body;

    if (category_en !== undefined) category.category_en = category_en;
    if (category_od !== undefined) category.category_od = category_od;
    if (category_type !== undefined) category.category_type = category_type;
    if (status !== undefined) category.status = status === "true" || status === true;

    category.updated_at = new Date();

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await GalaryCategory.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const categoryData = category.toJSON();
    const filename = (categoryData.thumbnail || '').replace(/\\/g, '/');

    const imageUrl = filename
      ? `${req.protocol}://${req.get('host')}/uploads/categories/${filename}`
      : null;

    return res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      category: {
        ...categoryData,
        thumbnail_url: imageUrl,
      },
    });
  } catch (error) {
    console.error('Get Category by ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
export const toggleGalaryCategoryStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await GalaryCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Gallery category not found' });
    }

    category.status = !category.status; // Toggle the status
    await category.save();

    res.status(200).json({
      message: `Gallery category status changed to ${category.status ? 'Active' : 'Inactive'}`,
      category,
    });
  } catch (error) {
    console.error('Error toggling gallery category status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// //FOR-PHOTO GALARY


// Register single photo (with photo upload and with url)
export const registerSinglePhoto = async (req, res) => {
  try {
    const { category_id, title_en, title_od, photo_url } = req.body;
    let photo = null;

    if (req.file && req.file.path) {
      // File uploaded
      photo = path.basename(req.file.path); // save filename only
    } else if (photo_url && photo_url.trim() !== "") {
      // URL provided instead of file upload
      photo = photo_url.trim();
    } else {
      return res.status(400).json({ success: false, message: "Photo file or URL is required" });
    }

    // Validate category exists
    const category = await GalaryCategory.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Create new photo entry
    const photoEntry = await PhotoGallery.create({
      category_id,
      title_en,
      title_od,
      photo,
    });

    res.status(201).json({
      success: true,
      message: "Photo registered successfully",
      photo: photoEntry,
    });
  } catch (error) {
    console.error("Create Photo Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
export const getAllPhotos = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const sortBy = req.query.sort || "createdAt";
    const sortOrder = req.query.order || "DESC";

    // --- THIS IS THE FIX ---
    // Add the default sort key "createdAt" to the whitelist of allowed columns.
    const allowedSortColumns = ["title_en", "title_od", "status", "category_name", "createdAt"];
    if (!allowedSortColumns.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sort column" });
    }

    const offset = (page - 1) * limit;

    const whereClause = {
      ...(search && {
        [Op.or]: [
          { title_en: { [Op.like]: `%${search}%` } },
          { title_od: { [Op.like]: `%${search}%` } },
          { '$category.category_en$': { [Op.like]: `%${search}%` } },
        ],
      })
    };

    const order = sortBy === 'category_name'
        ? [[{ model: GalaryCategory, as: 'category' }, 'category_en', sortOrder.toUpperCase()]]
        : [[sortBy, sortOrder.toUpperCase()]];

    const { count, rows } = await PhotoGallery.findAndCountAll({
      where: whereClause,
      include: [{
        model: GalaryCategory,
        as: 'category',
        attributes: [],
      }],
      attributes: {
        include: [
            [sequelize.col('category.category_en'), 'category_name']
        ]
      },
      order,
      limit,
      offset,
      distinct: true,
    });

    const photosWithUrls = rows.map((p) => {
      const data = p.toJSON();
      const filename = (data.photo || '').replace(/\\/g, '/');
      const photoUrl = filename ? `${req.protocol}://${req.get('host')}/uploads/photos/${filename}` : null;
      return { ...data, photo_url: photoUrl };
    });

    res.status(200).json({
      total: count,
      data: photosWithUrls,
    });

  } catch (error) {
    console.error('Get Photos Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Get photo by ID
export const getPhotoById = async (req, res) => {
  const photoId = req.params.id;

  try {
    const photo = await PhotoGallery.findByPk(photoId, {
      include: [{ model: GalaryCategory, as: 'category' }],
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    const photoData = photo.toJSON();
    const filename = (photoData.photo || '').replace(/\\/g, '/');

    const photoUrl = filename
      ? `${req.protocol}://${req.get('host')}/uploads/photos/${filename}`
      : null;

    return res.status(200).json({
      success: true,
      message: 'Photo fetched successfully',
      photo: {
        ...photoData,
        photo_url: photoUrl,
      },
    });
  } catch (error) {
    console.error('Get Photo by ID Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// Update single photo (with optional photo replacement)
export const updateSinglePhoto = async (req, res) => {
  const photoId = req.params.id;

  try {
    const photo = await PhotoGallery.findByPk(photoId);

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    // Handle new photo file upload
    if (req.file) {
      const newFilename = path.basename(req.file.path);

      // Delete old uploaded photo file if exists
      if (photo.photo) {
        const oldFilePath = path.join(
          process.cwd(),
          'public',
          'uploads',
          'photos',
          photo.photo
        );

        fs.access(oldFilePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldFilePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Failed to delete old photo:', unlinkErr);
              }
            });
          }
        });
      }

      // Set new photo filename
      photo.photo = newFilename;
      photo.photo_url = null; // Clear link if switching to upload
    }

    // Handle removal of existing photo if frontend explicitly sends an empty string
    if (req.body.photo !== undefined && req.body.photo === "") {
      if (photo.photo) {
        const oldFilePath = path.join(
          process.cwd(),
          'public',
          'uploads',
          'photos',
          photo.photo
        );

        fs.access(oldFilePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldFilePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Failed to delete old photo:', unlinkErr);
              }
            });
          }
        });
      }

      // Clear the photo file reference in DB
      photo.photo = null;
    }

    // Handle link photo if provided
    if (req.body.photo_url !== undefined) {
      photo.photo_url = req.body.photo_url;
      photo.photo = null; // Clear uploaded photo if switching to link
    }

    // Handle category update
    const { category_id, title_en, title_od } = req.body;

    if (category_id !== undefined) {
      const category = await GalaryCategory.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      photo.category_id = category_id;
    }

    if (title_en !== undefined) photo.title_en = title_en;
    if (title_od !== undefined) photo.title_od = title_od;

    photo.updatedAt = new Date();

    await photo.save();

    return res.status(200).json({
      success: true,
      message: 'Photo updated successfully',
      photo,
    });
  } catch (error) {
    console.error('Update Photo Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// Optional: Toggle photo status (if you have a status field for photos)
export const togglePhotoStatus = async (req, res) => {
  const photoId = req.params.id;

  try {
    const photo = await PhotoGallery.findByPk(photoId);

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    if (photo.status === undefined) {
      return res.status(400).json({ success: false, message: 'Photo does not have a status field' });
    }

    photo.status = !photo.status;
    await photo.save();

    res.status(200).json({
      success: true,
      message: `Photo status changed to ${photo.status ? 'Active' : 'Inactive'}`,
      photo,
    });
  } catch (error) {
    console.error('Toggle Photo Status Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//For Video Galary
// Register single video (with video upload or video URL)
export const registerSingleVideo = async (req, res) => {
  try {
    const { category_id, title_en, title_od, videotype, videolink } = req.body;

    // Validate required fields
    if (!category_id || !title_en || !title_od || !videotype) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: category_id, title_en, title_od, videotype",
      });
    }

    // Validate videotype value
    if (!['file', 'link'].includes(videotype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid videotype. Must be either 'file' or 'link'.",
      });
    }

    // Check if category exists
    const category = await GalaryCategory.findByPk(category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Prepare video file or link based on videotype
    let videofile = null;
    let finalVideoLink = null;

    if (videotype === 'file') {
      if (!req.file || !req.file.path) {
        return res.status(400).json({
          success: false,
          message: "Video file is required for videotype 'file'.",
        });
      }
      videofile = path.basename(req.file.path);
    }

    if (videotype === 'link') {
      if (!videolink || videolink.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Video link is required for videotype 'link'.",
        });
      }
      finalVideoLink = videolink.trim();
    }

    // Create the new video record
    const video = await VideoGallery.create({
      category_id,
      title_en,
      title_od,
      videotype,
      videofile,
      videolink: finalVideoLink,
    });

    return res.status(201).json({
      success: true,
      message: "Video registered successfully.",
      video,
    });

  } catch (error) {
    console.error("Error creating video:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// Get all videos with pagination, search, sorting
export const getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const sortBy = req.query.sort || "createdAt";
    const sortOrder = req.query.order || "DESC";

    const allowedSortColumns = ["title_en", "title_od", "status", "category_name", "createdAt"];
    if (!allowedSortColumns.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sort column" });
    }

    const offset = (page - 1) * limit;

    const whereClause = {
      ...(search && {
        [Op.or]: [
          { title_en: { [Op.like]: `%${search}%` } },
          { title_od: { [Op.like]: `%${search}%` } },
          { '$category.category_en$': { [Op.like]: `%${search}%` } },
        ],
      }),
    };

    const order = sortBy === 'category_name'
      ? [[{ model: GalaryCategory, as: 'category' }, 'category_en', sortOrder.toUpperCase()]]
      : [[sortBy, sortOrder.toUpperCase()]];

    const { count, rows } = await VideoGallery.findAndCountAll({
      where: whereClause,
      include: [{
        model: GalaryCategory,
        as: 'category',
        attributes: [],
      }],
      attributes: {
        include: [
          [VideoGallery.sequelize.col('category.category_en'), 'category_name']
        ]
      },
      order,
      limit,
      offset,
      distinct: true,
    });

    const videosWithUrls = rows.map((video) => {
      const data = video.toJSON();

      let video_url = null;
      if (data.videotype === 'file' && data.videofile) {
        const filename = data.videofile.replace(/\\/g, '/');
        video_url = `${req.protocol}://${req.get('host')}/uploads/videos/${filename}`;
      } else if (data.videotype === 'link' && data.videolink) {
        video_url = data.videolink;
      }

      return { ...data, video_url };
    });

    res.status(200).json({
      total: count,
      data: videosWithUrls,
    });
  } catch (error) {
    console.error('Get Videos Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get video by ID
export const getVideoById = async (req, res) => {
  const videoId = req.params.id;

  try {
    const video = await VideoGallery.findByPk(videoId, {
      include: [{ model: GalaryCategory, as: 'category' }],
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    const videoData = video.toJSON();

    let video_url = null;
    if (videoData.videotype === 'file' && videoData.videofile) {
      const filename = videoData.videofile.replace(/\\/g, '/');
      video_url = `${req.protocol}://${req.get('host')}/uploads/videos/${filename}`;
    } else if (videoData.videotype === 'link' && videoData.videolink) {
      video_url = videoData.videolink;
    }

    return res.status(200).json({
      success: true,
      message: 'Video fetched successfully',
      video: {
        ...videoData,
        video_url,
      },
    });
  } catch (error) {
    console.error('Get Video by ID Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update single video (with optional video replacement)


export const updateSingleVideo = async (req, res) => {
  const videoId = req.params.id;

  try {
    const video = await VideoGallery.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const { category_id, title_en, title_od, videotype, videolink } = req.body;

    // Update category if provided
    if (category_id !== undefined) {
      const category = await GalaryCategory.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      video.category_id = category_id;
    }

    // Update titles
    if (title_en !== undefined) video.title_en = title_en;
    if (title_od !== undefined) video.title_od = title_od;

    // Handle video source logic
    if (videotype !== undefined) {
      video.videotype = videotype;

      // --- FILE Upload Type ---
      if (videotype === 'file') {
        if (req.file) {
          const newFilename = path.basename(req.file.path);

          // Delete old file if it exists
          if (video.videofile) {
            const oldPath = path.join(process.cwd(), 'public', 'uploads', 'videos', video.videofile);
            fs.access(oldPath, fs.constants.F_OK, (err) => {
              if (!err) {
                fs.unlink(oldPath, (unlinkErr) => {
                  if (unlinkErr) console.error('Failed to delete old video:', unlinkErr);
                });
              }
            });
          }

          video.videofile = newFilename;
          video.videolink = null;
        } else if (req.body.video === "") {
          // Frontend sent empty video field => remove old file
          if (video.videofile) {
            const oldPath = path.join(process.cwd(), 'public', 'uploads', 'videos', video.videofile);
            fs.access(oldPath, fs.constants.F_OK, (err) => {
              if (!err) {
                fs.unlink(oldPath, (unlinkErr) => {
                  if (unlinkErr) console.error('Failed to delete old video:', unlinkErr);
                });
              }
            });
          }

          video.videofile = null;
        }

      // --- LINK Type ---
      } else if (videotype === 'link') {
        const trimmedLink = (videolink || '').trim();
        if (trimmedLink === '') {
          video.videolink = null;
        } else {
          video.videolink = trimmedLink;
        }

        // Remove existing uploaded file if any
        if (video.videofile) {
          const oldPath = path.join(process.cwd(), 'public', 'uploads', 'videos', video.videofile);
          fs.access(oldPath, fs.constants.F_OK, (err) => {
            if (!err) {
              fs.unlink(oldPath, (unlinkErr) => {
                if (unlinkErr) console.error('Failed to delete old video:', unlinkErr);
              });
            }
          });
        }

        video.videofile = null;
      }
    }

    await video.save();

    return res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      video,
    });
  } catch (error) {
    console.error('Update Video Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};








// Optional: Toggle video status
export const toggleVideoStatus = async (req, res) => {
  const videoId = req.params.id;

  try {
    const video = await VideoGallery.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (video.status === undefined) {
      return res.status(400).json({ success: false, message: 'Video does not have a status field' });
    }

    video.status = !video.status;
    await video.save();

    res.status(200).json({
      success: true,
      message: `Video status changed to ${video.status ? 'Active' : 'Inactive'}`,
      video,
    });
  } catch (error) {
    console.error('Toggle Video Status Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


