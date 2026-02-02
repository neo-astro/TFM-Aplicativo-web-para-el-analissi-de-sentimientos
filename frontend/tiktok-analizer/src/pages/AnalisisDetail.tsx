// src/pages/AnalisisDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from "@chakra-ui/react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import * as apiDatos from "../services/apiDatos";

const COLORS = {
  neutral: "#3182CE",
  positivo: "#38A169",
  negativo: "#E53E3E",
};

export default function AnalisisDetail() {
  const { id } = useParams<{ id: string }>();

  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sentimientoActivo, setSentimientoActivo] = useState<string>("todos");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      const res = await apiDatos.obtenerAnalisisId(id);
      setResultado(res.documento.resultado);
      setLoading(false);
    };

    load();
  }, [id]);

  /** =======================
   *  FILTRADO CENTRAL (CLAVE)
   ======================= */
  const comentariosFiltrados = useMemo(() => {
    if (!resultado) return [];

    if (sentimientoActivo === "todos") {
      return resultado.resultados_detallados;
    }

    return resultado.resultados_detallados.filter(
      (c: any) => c.sentimiento_final === sentimientoActivo
    );
  }, [resultado, sentimientoActivo]);

  /** =======================
   *  DATOS PARA GRÁFICAS
   ======================= */
  const barrasSentimiento = useMemo(() => {
    if (!resultado) return [];

    const base = {
      neutral: 0,
      positivo: 0,
      negativo: 0,
    };

    comentariosFiltrados.forEach((c: any) => {
      base[c.sentimiento_final]++;
    });

    return Object.entries(base).map(([k, v]) => ({
      name: k,
      value: v,
    }));
  }, [comentariosFiltrados]);

  const dominiosData = useMemo(() => {
    const dominioCount: any = {};

    comentariosFiltrados.forEach((c: any) => {
      Object.entries(c.scores_por_dominio).forEach(
        ([dominio, valor]: any) => {
          if (valor > 0) {
            dominioCount[dominio] = (dominioCount[dominio] || 0) + 1;
          }
        }
      );
    });

    return Object.entries(dominioCount).map(([k, v]) => ({
      dominio: k,
      total: v,
    }));
  }, [comentariosFiltrados]);

  if (loading || !resultado) return <Spinner size="xl" />;

  return (
    <Box p={6}>
      <Heading mb={6}>{resultado.nombreanalisis}</Heading>

      {/* =======================
          KPIs SUPERIORES
         ======================= */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        <Stat>
          <StatLabel>Total comentarios</StatLabel>
          <StatNumber>{comentariosFiltrados.length}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Neutros</StatLabel>
          <StatNumber>
            {comentariosFiltrados.filter(
              (c: any) => c.sentimiento_final === "neutral"
            ).length}
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Positivos</StatLabel>
          <StatNumber>
            {comentariosFiltrados.filter(
              (c: any) => c.sentimiento_final === "positivo"
            ).length}
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Negativos</StatLabel>
          <StatNumber>
            {comentariosFiltrados.filter(
              (c: any) => c.sentimiento_final === "negativo"
            ).length}
          </StatNumber>
        </Stat>
      </SimpleGrid>

      {/* =======================
          FILTRO GLOBAL
         ======================= */}
      <Select
        mb={6}
        maxW="300px"
        value={sentimientoActivo}
        onChange={(e) => setSentimientoActivo(e.target.value)}
      >
        <option value="todos">Todos los sentimientos</option>
        <option value="neutral">Neutral</option>
        <option value="positivo">Positivo</option>
        <option value="negativo">Negativo</option>
      </Select>

      {/* =======================
          DASHBOARD DE GRÁFICAS
         ======================= */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={10}>
        {/* BARRAS SENTIMIENTO */}
        <Box h={300}>
          <Heading size="sm" mb={2}>
            Distribución de sentimientos
          </Heading>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barrasSentimiento}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {barrasSentimiento.map((d: any, i: number) => (
                  <Cell key={i} fill={COLORS[d.name as keyof typeof COLORS]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* PIE SENTIMIENTO */}
        <Box h={300}>
          <Heading size="sm" mb={2}>
            Proporción de sentimientos
          </Heading>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={barrasSentimiento} dataKey="value" label>
                {barrasSentimiento.map((d: any, i: number) => (
                  <Cell key={i} fill={COLORS[d.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* BARRAS DOMINIOS */}
        <Box h={300} gridColumn={{ md: "span 2" }}>
          <Heading size="sm" mb={2}>
            Actividad por dominio
          </Heading>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dominiosData}>
              <XAxis dataKey="dominio" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#805AD5" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>

      {/* =======================
          TABLA DETALLADA
         ======================= */}
      <Heading size="md" mb={3}>
        Comentarios analizados
      </Heading>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Comentario</Th>
            <Th>Sentimiento</Th>
            <Th>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {comentariosFiltrados.map((c: any, i: number) => (
            <Tr key={i}>
              <Td>{c.comentario}</Td>
              <Td>{c.sentimiento_final}</Td>
              <Td>{c.score_modelo}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
