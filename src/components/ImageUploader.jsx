import React, { useState } from "react";

const ImageUploader = ({ onUpload, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "SouScript"); // Make sure this preset exists in Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcegmkp1b/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        console.log("Uploaded Image URL:", data.secure_url);
        setImageUrl(data.secure_url);  // Update UI
        onUpload(data.secure_url);  // 🔹 Pass URL back to MessageForm
      } else {
        console.error("Cloudinary response error:", data);
        alert("Upload failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <label>{label}</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {imageUrl && (
        <p>
          ✅ Uploaded: <a href={imageUrl} target="_blank" rel="noopener noreferrer">View Image</a>
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
