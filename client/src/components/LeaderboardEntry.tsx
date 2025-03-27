import React, { useState } from "react";
import { TypingResultResponse } from "../interfaces/TypingResult";
import GraphStatistic from "./GraphStatistic";
import {
  TableRow,
  TableCell,
  Collapse,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

interface LeaderboardEntryProps {
  entry: TypingResultResponse;
  rank: number;
}

export const columnStyles = {
  rank: { width: "5%", minWidth: "50px" },
  user: { width: "20%", minWidth: "150px" },
  stats: { width: "75%" },
};

const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ entry, rank }) => {
  const [expanded, setExpanded] = useState(false);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchSessionStats = async () => {
    if (!expanded && !sessionStats) {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/session-stats/${entry.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch session stats");
        }
        const data = await response.json();
        setSessionStats(data);
      } catch (error) {
        console.error("Error fetching session stats:", error);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <>
      <TableRow
        onClick={fetchSessionStats}
        sx={{
          cursor: "pointer",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
          width: "100%",
        }}
      >
        <TableCell sx={columnStyles.rank}>{rank}</TableCell>
        <TableCell sx={columnStyles.user}>{entry.user_id}</TableCell>
        <TableCell sx={columnStyles.stats}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 6, flex: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  WPM
                </Typography>
                <Typography>{entry.wpm.toFixed(1)}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Accuracy
                </Typography>
                <Typography>{entry.accuracy.toFixed(1)}%</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Length
                </Typography>
                <Typography>{entry.text_length} words</Typography>
              </Box>
            </Box>
            <Typography color="text.secondary" sx={{ width: "120px" }}>
              {new Date(entry.timestamp).toLocaleDateString()}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              {loading ? (
                <CircularProgress size={24} />
              ) : sessionStats ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                      flex: "0 0 auto",
                    }}
                  >
                    <StatBox label="Username" value={sessionStats.user_id} />
                    <StatBox label="WPM" value={sessionStats.wpm.toFixed(1)} />
                    <StatBox
                      label="Accuracy"
                      value={`${sessionStats.accuracy.toFixed(1)}%`}
                    />
                    <StatBox
                      label="Time Taken"
                      value={`${sessionStats.time_taken}s`}
                    />
                  </Box>
                  <Box sx={{ flex: "1 1 auto", minWidth: "300px" }}>
                    <GraphStatistic
                      data={sessionStats.key_data}
                      expected_value={100}
                      time_limit={sessionStats.time_taken}
                      color="#4CAF50"
                      label="WPM over time"
                    />
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const StatBox: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <Box
    sx={{
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      padding: 2,
      borderRadius: 1,
      minWidth: 150,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6">{value}</Typography>
  </Box>
);

export default LeaderboardEntry;
