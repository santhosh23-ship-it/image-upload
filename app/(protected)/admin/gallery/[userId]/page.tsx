"use client";

import { useEffect, useState } from "react";

type ImageType = {
  id: string;
  url: string;
  createdAt: string;
  tags: string[];
};

export default function AdminGallery() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await fetch("/api/admin/images");
    const data = await res.json();
    setImages(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    setDeletingId(id);

    await fetch(`/api/admin/images/${id}`, {
      method: "DELETE",
    });

    // remove from UI instantly
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDeletingId(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Image Gallery</h2>

      {images.length === 0 ? (
        <p>No Images Uploaded</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={img.url}
                alt="uploaded"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <p style={{ marginTop: "10px", fontSize: "12px" }}>
                Uploaded: {new Date(img.createdAt).toLocaleString()}
              </p>

              <button
                onClick={() => handleDelete(img.id)}
                disabled={deletingId === img.id}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {deletingId === img.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
