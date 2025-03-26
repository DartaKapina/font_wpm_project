import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import StatisticsContainer from "../components/StatisticsContainer";
import GraphStatistic from "../components/GraphStatistic";
import { TypingResultResponse } from "../interfaces/TypingResult";

const Results = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<TypingResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!id) {
        setError("No result ID provided");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/typing-result/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !result) {
    return (
      <div>
        <p>Error: {error || "Result not found"}</p>
        <Link to="/session">Try Again</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1a1a1a, #2d2d2d)",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          margin: "2rem 0",
          background: "linear-gradient(45deg, #4CAF50, #45a049)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Your Results
      </h1>

      <StatisticsContainer direction="row">
        <div style={statItemStyle}>
          <h2 style={statNumberStyle}>{result.wpm.toFixed(1)}</h2>
          <p style={statLabelStyle}>Words per minute</p>
        </div>

        <div style={statItemStyle}>
          <h2 style={statNumberStyle}>{result.accuracy.toFixed(1)}%</h2>
          <p style={statLabelStyle}>Accuracy</p>
        </div>
      </StatisticsContainer>

      <div style={{ width: "100%", padding: "2rem" }}>
        <GraphStatistic
          data={result.key_data}
          expected_value={100}
          time_limit={result.time_limit}
          color="#4CAF50"
          label="WPM over time"
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", margin: "2rem 0" }}>
        <Link
          to="/session"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#4CAF50",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Try Again
        </Link>

        <Link
          to="/leaderboard"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#666",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
};

const statItemStyle = {
  textAlign: "center" as const,
  padding: "1rem",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  minWidth: "200px",
};

const statNumberStyle = {
  fontSize: "2.5rem",
  margin: "0",
  color: "#4CAF50",
};

const statLabelStyle = {
  fontSize: "1rem",
  margin: "0.5rem 0 0 0",
  opacity: 0.8,
};

export default Results;
