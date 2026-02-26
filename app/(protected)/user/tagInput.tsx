"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/lib/firebaseClient";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type User = { id: string; name: string };

type Props = {
  currentUserName: string; // logged-in user
  onTagSelect?: (user: User) => void;
};

// Function to send Firestore notification
async function sendTagNotification(taggedUserId: string, message: string) {
  await addDoc(collection(firestore, "notifications"), {
    receiverId: taggedUserId,
    message,
    isRead: false,
    createdAt: serverTimestamp(),
  });
}

export default function TagInput({ currentUserName, onTagSelect }: Props) {
  const [text, setText] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch all users
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);

    const lastWord = value.split(" ").pop();
    if (lastWord?.startsWith("@")) {
      const queryStr = lastWord.slice(1).toLowerCase();
      setSuggestions(
        users.filter((u) => u.name.toLowerCase().includes(queryStr))
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = async (user: User) => {
    const words = text.split(" ");
    words[words.length - 1] = `@${user.name}`;
    setText(words.join(" ") + " ");
    setShowSuggestions(false);

    // optional callback
    if (onTagSelect) onTagSelect(user);

    // send Firestore notification
    await sendTagNotification(
      user.id,
      `${currentUserName} tagged you!`
    );
  };

  return (
    <div style={{ position: "relative" }}>
      {/* INPUT */}
      <input
        type="text"
        placeholder="Type @ to tag someone"
        value={text}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #c4a484",
          outline: "none",
        }}
      />

      {/* SUGGESTIONS */}
      {showSuggestions && (
        <div
          style={{
            position: "absolute",
            background: "#fffaf3",
            border: "1px solid #c4a484",
            width: "100%",
            marginTop: "6px",
            borderRadius: "6px",
            maxHeight: "160px",
            overflowY: "auto",
            zIndex: 50,
          }}
        >
          {suggestions.map((u) => (
            <div
              key={u.id}
              onClick={() => handleSelect(u)}
              style={{
                padding: "8px 10px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLDivElement).style.background = "#f3e5d8")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLDivElement).style.background = "transparent")
              }
            >
              {u.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}