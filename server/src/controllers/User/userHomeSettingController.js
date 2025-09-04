// controllers/homeSettingController.js

import models from '../../models/index.js';

const { HomeSetting } = models;
const SETTINGS_ID = 1;
const UPLOAD_SUB_DIR = 'uploads/settings';

// Helper function to construct the full absolute URL for a file
const getFullFileUrl = (req, fileName) => {
  if (!fileName) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/${UPLOAD_SUB_DIR}/${fileName}`;
};

// Get homepage settings for public/header use (READ ONLY)
export const getPublicSettings = async (req, res) => { // Renamed from getSettings to getPublicSettings for clarity
  try {
    // Find the settings row with ID = 1
    const settings = await HomeSetting.findByPk(SETTINGS_ID);
    
    if (!settings) {
      return res.status(404).json({ message: "Home settings not found" });
    }

    // Convert to plain object
    const settingsJSON = settings.toJSON();

    // Build response with ONLY the fields needed for the header
    const response = {
      organizationName: settingsJSON.orgName_en || null,
      personName: settingsJSON.personName_en || null,
      personDesignation: settingsJSON.personDesignation_en || null,
      odishaLogoUrl: getFullFileUrl(req, settingsJSON.odishaLogo),
      cmPhotoUrl: getFullFileUrl(req, settingsJSON.cmPhoto)
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return res.status(500).json({ 
      message: "Failed to get homepage settings", 
      error: error.message 
    });
  }
};