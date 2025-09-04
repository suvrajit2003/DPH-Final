import FilePreview from "./FilePreview";

const ImageUploader = ({ onChange, file, isLoading }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10240 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, JPEG, and WebP files are allowed");
      return;
    }

    const image = new Image();
    image.onload = () => onChange(file, false);
    image.onerror = () => onChange(null, false);
    image.src = URL.createObjectURL(file);
    onChange(file, true);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ଛବି ଅପଲୋଡ୍‌ କରନ୍ତୁ / Upload Image{" "}
        <span className="text-xs text-gray-500">(JPG, PNG, WEBP, max: 10MB)</span>
      </label>
      <input
        type="file"
        onChange={handleFileUpload}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="w-full border border-gray-300 px-3 py-[7px] rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <FilePreview file={file} isLoading={isLoading} />
    </div>
  );
};

export default ImageUploader;
