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
import { columnStyles } from "./LeaderboardEntry";

interface LeaderboardTableProps {
  results: TypingResultResponse[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ results }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%", tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={columnStyles.rank}>#</TableCell>
            <TableCell sx={columnStyles.user}>User</TableCell>
            <TableCell sx={columnStyles.stats}>Stats</TableCell>
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
