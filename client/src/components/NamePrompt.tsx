import React, { useState, KeyboardEvent } from "react";

interface NamePromptProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const NamePrompt: React.FC<NamePromptProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim()) {
      onSubmit(name.trim());
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#2d2d2d",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#fff",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
          }}
        >
          Enter Your Name
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Your name"
          autoFocus
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: "#1a1a1a",
            border: "1px solid #4CAF50",
            borderRadius: "4px",
            color: "#fff",
            marginBottom: "1rem",
          }}
        />
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={() => name.trim() && onSubmit(name.trim())}
            disabled={!name.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: name.trim() ? "#4CAF50" : "#666",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: name.trim() ? "pointer" : "not-allowed",
              fontSize: "1rem",
            }}
          >
            Submit
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#666",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Cancel
          </button>
        </div>
        <p
          style={{
            color: "#999",
            fontSize: "0.875rem",
            marginTop: "1rem",
          }}
        >
          Press Enter to submit or Escape to cancel
        </p>
      </div>
    </div>
  );
};

export default NamePrompt;
