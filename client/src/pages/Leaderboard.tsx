import React, { useState } from "react";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { TypingResultResponse } from "../interfaces/TypingResult";
import LeaderboardTable from "../components/LeaderboardTable";

const Leaderboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("all");
  const [limit, setLimit] = useState<number>(10);
  const [results, setResults] = useState<TypingResultResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:5000/api/leaderboard?timeRange=${timeRange}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const handleLimitChange = (event: SelectChangeEvent) => {
    setLimit(Number(event.target.value));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Typing Test Leaderboard
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="day">Last 24 Hours</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Limit</InputLabel>
            <Select
              value={limit.toString()}
              label="Limit"
              onChange={handleLimitChange}
            >
              <MenuItem value={5}>Top 5</MenuItem>
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={25}>Top 25</MenuItem>
              <MenuItem value={50}>Top 50</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={fetchLeaderboard}
            sx={{ height: "fit-content", alignSelf: "center" }}
          >
            Update Results
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <LeaderboardTable results={results} />
        )}
      </Box>
    </Container>
  );
};

export default Leaderboard;
