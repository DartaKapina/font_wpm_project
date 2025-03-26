import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "2rem",
      }}
    >
      <h1>Typing Speed Test</h1>
      <Link
        to="/session"
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#4CAF50",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontSize: "1.2rem",
        }}
      >
        Start Test
      </Link>
    </div>
  );
};

export default Home;
