"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages")
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Messages</Typography>

      <TableContainer component={Paper} sx={{ bgcolor: "#1e293b", color: "#fff", border: "1px solid #334155", borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#0f172a" }}>
            <TableRow>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Sender</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Subject</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 700 }}>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((m) => (
              <TableRow key={m._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155", whiteSpace: "nowrap" }}>
                  {new Date(m.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{m.name}</Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>{m.email}</Typography>
                </TableCell>
                <TableCell sx={{ color: "#e2e8f0", borderBottom: "1px solid #334155" }}>
                  <Chip label={m.subject} size="small" sx={{ bgcolor: "#0f172a", color: "#f97316" }} />
                </TableCell>
                <TableCell sx={{ color: "#94a3b8", borderBottom: "1px solid #334155", maxWidth: 300 }}>
                  <Typography variant="body2" noWrap title={m.message}>{m.message}</Typography>
                </TableCell>
              </TableRow>
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "#94a3b8", py: 4, borderBottom: "none" }}>No messages found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
