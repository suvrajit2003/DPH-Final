import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../Components/Admin/Add/Header";
import axios from "axios";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VideoGalleryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title_en: "",
    title_od: "",
    category_id: "",
    videoSourceType: "upload", // upload | link
    videoFile: null,
    videoLink: "",
  });

  const [existingVideoUrl, setExistingVideoUrl] = useState(""); // for preview
  const [existingVideoRemoved, setExistingVideoRemoved] = useState(false); // flag for removal
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/image-setup/all-categories`, {
          withCredentials: true,
        });
        if (res.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/image-setup/video/${id}`, {
          withCredentials: true,
        });

        if (res.data.success && res.data.video) {
          const video = res.data.video;

          setFormData({
            title_en: video.title_en || "",
            title_od: video.title_od || "",
            category_id: video.category_id?.toString() || "",
            videoSourceType: video.videotype === "link" ? "link" : "upload",
            videoFile: null,
            videoLink: video.videotype === "link" ? video.videolink || "" : "",
          });

          setExistingVideoUrl(video.video_url || "");
          setExistingVideoRemoved(false);
        } else {
          alert("Failed to load video data");
          navigate("/admin/image-setup/video-galary");
        }
      } catch (error) {
        console.error("Failed to fetch video:", error);
        alert("Error loading video data");
        navigate("/admin/image-setup/video-galary");
      }
    };

    fetchVideo();
  }, [id, navigate]);

  const handleCancel = () => {
    navigate("/admin/image-setup/video-galary");
  };

  const handleVideoFileChange = (file, errorMessage) => {
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, videoFile: errorMessage }));
      setFormData((prev) => ({ ...prev, videoFile: null }));
    } else {
      setErrors((prev) => ({ ...prev, videoFile: "" }));
      setFormData((prev) => ({ ...prev, videoFile: file }));
      setExistingVideoRemoved(false);
    }
  };

  const handleRemoveExistingVideo = () => {
    setExistingVideoUrl("");
    setFormData((prev) => ({ ...prev, videoFile: null, videoLink: "" }));
    setExistingVideoRemoved(true);
    setErrors((prev) => ({ ...prev, videoFile: "", videoLink: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "videoSourceType") {
      setFormData((prev) => ({
        ...prev,
        videoSourceType: value,
        videoFile: null,
        videoLink: "",
      }));
      setExistingVideoRemoved(false);
      setErrors({});
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    setFormData({
      title_en: "",
      title_od: "",
      category_id: "",
      videoSourceType: "upload",
      videoFile: null,
      videoLink: "",
    });
    setErrors({});
    setExistingVideoUrl("");
    setExistingVideoRemoved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title_en.trim()) newErrors.title_en = "Title (EN) is required";
    if (!formData.title_od.trim()) newErrors.title_od = "Title (OD) is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";

    if (id) {
      // Edit mode
      // It's okay to send empty videoFile and empty videoLink to remove existing video

      // But if videoSourceType is upload AND no new file AND existing video is not removed => no error
      // If videoSourceType is link AND videoLink can be empty (means remove)
      // So no need to add error here for missing video input on edit mode
    } else {
      // Create mode: must provide video file or link
      if (formData.videoSourceType === "upload") {
        if (!formData.videoFile) {
          newErrors.videoFile = "Please upload a video file";
        }
      } else if (formData.videoSourceType === "link") {
        if (!formData.videoLink.trim()) {
          newErrors.videoLink = "Please enter a video link";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const form = new FormData();
      form.append("title_en", formData.title_en);
      form.append("title_od", formData.title_od);
      form.append("category_id", formData.category_id);
      form.append("videotype", formData.videoSourceType === "upload" ? "file" : "link");

      if (formData.videoSourceType === "upload") {
        if (formData.videoFile) {
          form.append("video", formData.videoFile);
        } else if (id && existingVideoRemoved) {
          form.append("video", ""); // tell backend to remove old file
        } else if (id && !existingVideoRemoved) {
          // Do nothing, keep old video
        }
      } else if (formData.videoSourceType === "link") {
        // In edit mode, allow empty videolink to remove old link
        form.append("videolink", formData.videoLink.trim());
      }

      let res;
      if (id) {
        res = await axios.put(`${API_BASE_URL}/image-setup/update-video/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${API_BASE_URL}/image-setup/register-video`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        alert(id ? "Video updated successfully!" : "Video registered successfully!");
        navigate("/admin/image-setup/video-galary");
      } else {
        alert("Something went wrong: " + res.data.message);
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      alert("An error occurred while submitting the video.");
    }
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header title={id ? "Edit Video Gallery Item" : "Add Video Gallery Item"} onGoBack={handleCancel} />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title (EN) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title (In English)</label>
            <input
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.title_en && <p className="text-red-600 text-sm">{errors.title_en}</p>}
          </div>

          {/* Title (OD) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title (In Odia)</label>
            <input
              type="text"
              name="title_od"
              value={formData.title_od}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.title_od && <p className="text-red-600 text-sm">{errors.title_od}</p>}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            >
              <option value="">-- Select Category --</option>
              {categories
                .filter((cat) => cat.category_type === "video")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_en}
                  </option>
                ))}
            </select>
            {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id}</p>}
          </div>

          {/* Source Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Source Type</label>
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                name="videoSourceType"
                value="upload"
                checked={formData.videoSourceType === "upload"}
                onChange={handleChange}
              />
              <span className="ml-2">Upload File</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="videoSourceType"
                value="link"
                checked={formData.videoSourceType === "link"}
                onChange={handleChange}
              />
              <span className="ml-2">Paste Link</span>
            </label>
          </div>

          {/* Upload Field */}
          {formData.videoSourceType === "upload" ? (
            <div className="mb-6">
              <DocumentUploader
                label="Upload Video"
                file={formData.videoFile}
                onFileChange={handleVideoFileChange}
                allowedTypes={["video/mp4", "video/webm", "video/ogg", "video/mov", "video/avi", "video/mkv"]}
                maxSizeMB={100}
                error={errors.videoFile}
              />
              {id && existingVideoUrl && !existingVideoRemoved && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700">Current Video:</p>
                  <video src={existingVideoUrl} controls className="max-w-xs mt-2 rounded" />
                  <button
                    type="button"
                    onClick={handleRemoveExistingVideo}
                    className="mt-2 text-sm text-red-600 underline"
                  >
                    Remove Video
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Paste Video Link</label>
              <input
                type="text"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                placeholder="https://example.com/video.mp4"
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              {errors.videoLink && <p className="text-red-600 text-sm">{errors.videoLink}</p>}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoGalleryForm;
