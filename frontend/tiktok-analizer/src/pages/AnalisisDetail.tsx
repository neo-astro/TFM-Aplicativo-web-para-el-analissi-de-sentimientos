// /src/pages/AnalisisList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heading, SimpleGrid, Box, Text } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import * as apiDatos from "../services/apiDatos";

interface AnalisisItem {
  id: string;
  nombreanalisis: string;
  fecha?: string;
  total_comentarios?: number;
  dominio_principal?: string;
  sentimiento_predominante?: string;
}

export default function AnalisisList() {
  const { user } = useAuth();
  const userEmail = user?.email ?? "";
  const [items, setItems] = useState<AnalisisItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!userEmail) return;
      setLoading(true);
      setError(null);
      try {
        const res = await apiDatos.listarPorEmail(userEmail);
        setItems(res.success ? res.documentos : []);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? err.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userEmail]);

  return (
    <div>
      <Heading size="lg" color="brand.800" mb={4}>Tus análisis</Heading>
      {loading && <div>Cargando...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {items.map((it) => (
          <Box key={it.id} bg="white" p={4} rounded="md" boxShadow="sm">
            <Text fontWeight="semibold" color="brand.900">{it.nombreanalisis}</Text>
            {it.fecha && <Text fontSize="sm" color="brand.700">Fecha: {it.fecha}</Text>}
            {typeof it.total_comentarios === "number" && (
              <Text fontSize="sm">Total de comentarios: {it.total_comentarios}</Text>
            )}
            {it.dominio_principal && (
              <Text fontSize="sm">Dominio predominante: {it.dominio_principal}</Text>
            )}
            {it.sentimiento_predominante && (
              <Text fontSize="sm">Sentimiento predominante: {it.sentimiento_predominante}</Text>
            )}
            <Link to={`/analisis/${it.id}`} style={{ color: "#1863ad", marginTop: 8, display: "inline-block" }}>
              Ver detalles
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    </div>
  );
}
