import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { TypingResultResponse } from "../interfaces/TypingResult";
import LeaderboardEntry from "./LeaderboardEntry";

interface LeaderboardTableProps {
  results: TypingResultResponse[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ results }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>User</TableCell>
            <TableCell align="right">WPM</TableCell>
            <TableCell align="right">Accuracy</TableCell>
            <TableCell align="right">Text Length</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((entry, index) => (
            <LeaderboardEntry key={entry.id} entry={entry} rank={index + 1} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;
