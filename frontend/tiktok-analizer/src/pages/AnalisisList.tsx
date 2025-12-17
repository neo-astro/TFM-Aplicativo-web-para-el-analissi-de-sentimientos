// /src/pages/AnalisisList.tsx
import type { Variants } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "../context/AuthContext";
import { useAnalisis } from "../hooks/useAnalisis";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import { motion } from "framer-motion";

/* Tipado */
type AnalisisRow = {
  id: string;
  nombreAnalisis: string;
  fecha: string;
  total_comentarios: number;
  sentimiento_predominante: string;
  dominio_principal: string;
};
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1], // easing numérico
    },
  }),
};
export const AnalisisList: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { listar } = useAnalisis();
  const [rows, setRows] = useState<AnalisisRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listar(user.uid);
        const data = Array.isArray(res) ? res : res?.data ?? [];
        setRows(data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? err?.message ?? "Error al cargar análisis");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    return rows.filter((r) => r.nombreAnalisis.toLowerCase().includes(query.toLowerCase()));
  }, [rows, query]);

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Mis análisis
      </Typography>

      <Paper sx={{ p: 2, mb: 3, boxShadow: "0 6px 18px rgba(20,60,120,0.04)" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
          <TextField
            placeholder="Buscar por nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: 360 },
              "& .MuiInputBase-root": { background: theme.palette.mode === "light" ? "#fff" : undefined },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={1}>
            <Chip label={`Total: ${rows.length}`} color="primary" />
            {error && <Chip label="Error al cargar" color="error" />}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 30px rgba(20,60,120,0.06)" }}>
        {loading ? (
          <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
            <Typography>Cargando análisis...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" color="error" sx={{ mb: 1 }}>
              No se pudieron cargar los análisis
            </Typography>
            <Typography color="text.secondary">{error}</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No hay análisis aún
            </Typography>
            <Typography color="text.secondary">Crea tu primer análisis desde "Realizar análisis".</Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(90deg, rgba(25,118,210,0.06), rgba(99,164,255,0.03))" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Dominio</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Sentimiento</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                    <motion.tr
                      key={row.id}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      variants={rowVariants}
                      style={{ display: "table-row" }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <TableCell sx={{ py: 2 }}>{row.nombreAnalisis}</TableCell>
                      <TableCell sx={{ py: 2 }}>{new Date(row.fecha).toLocaleString()}</TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        {row.total_comentarios}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>{row.dominio_principal}</TableCell>
                      <TableCell sx={{ py: 2 }}>{row.sentimiento_predominante}</TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <IconButton size="small" onClick={() => navigate(`/dashboard/analisis/${row.id}`)} aria-label={`Ver ${row.nombreAnalisis}`}>
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 8, 12, 20]}
            />
          </>
        )}
      </Paper>

      <LoadingOverlay open={loading} message="Cargando análisis..." />
    </Box>
  );
};

export default AnalisisList;
