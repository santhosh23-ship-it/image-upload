"use client";

import { useEffect, useState } from "react";

type ImageType = {
  id: string;
  url: string;
  createdAt: string;
  tags: string[];
};

export default function GalleryPage() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/user/images");

        if (!res.ok) throw new Error("Failed to fetch images");

        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`/api/user/images/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      // Remove from UI
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Image Gallery</h2>

      {images.length === 0 ? (
        <p>No Images Uploaded</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={img.url}
                alt="Uploaded"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <p style={{ marginTop: "10px", fontSize: "14px" }}>
                {new Date(img.createdAt).toLocaleDateString()}
              </p>

              {img.tags?.length > 0 && (
                <div style={{ marginTop: "5px" }}>
                  {img.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#eee",
                        padding: "4px 8px",
                        borderRadius: "5px",
                        marginRight: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 🔥 DELETE BUTTON */}
              <button
                onClick={() => handleDelete(img.id)}
                disabled={deletingId === img.id}
                style={{
                  marginTop: "10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
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
