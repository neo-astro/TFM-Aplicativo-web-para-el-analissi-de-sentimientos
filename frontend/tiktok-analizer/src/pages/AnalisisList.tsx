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
  Button,
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
        const res = await listar(user.email!);
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

  const sentimentColor = (value: string) => {
    if (value === "positivo") return "success";
    if (value === "negativo") return "error";
    return "default";
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, rgba(30,102,245,0.12), rgba(255,255,255,0.9))",
          border: "1px solid rgba(30,102,245,0.12)",
          boxShadow: "0 12px 30px rgba(20,60,120,0.08)",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Mis analisis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Consulta tus reportes guardados y explora resultados.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <TextField
              placeholder="Buscar por nombre..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="small"
              sx={{
                width: { xs: "100%", sm: 280 },
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
            <Chip label={`Total: ${rows.length}`} color="primary" />
            {error && <Chip label="Error al cargar" color="error" />}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid rgba(15,26,43,0.08)" }}>
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
              No hay analisis aun
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Crea tu primer analisis para ver resultados aqui.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/dashboard/realizar")}>
              Crear analisis
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, bgcolor: "#F6F8FC" }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: "#F6F8FC" }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "center", bgcolor: "#F6F8FC" }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: "#F6F8FC" }}>Dominio</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: "#F6F8FC" }}>Sentimiento</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: "center", bgcolor: "#F6F8FC" }}>Acciones</TableCell>
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
                      whileHover={{ scale: 1.005 }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {row.nombreAnalisis}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {row.id.slice(0, 6)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography variant="body2">{new Date(row.fecha).toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        <Chip label={row.total_comentarios} color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Chip label={row.dominio_principal} color="info" variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Chip label={row.sentimiento_predominante} color={sentimentColor(row.sentimiento_predominante)} />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => navigate(`/dashboard/analisis/${row.id}`)}
                          startIcon={<VisibilityIcon />}
                        >
                          Ver
                        </Button>
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
