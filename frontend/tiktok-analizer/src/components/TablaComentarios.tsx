// src/components/TablaComentarios.tsx
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";

export default function TablaComentarios({ comentarios }: any) {
  const [filtro, setFiltro] = useState("todos");

  const filtrados =
    filtro === "todos"
      ? comentarios
      : comentarios.filter(
          (c: any) => c.sentimiento_final === filtro
        );

  return (
    <>
      <Select mb={4} onChange={(e) => setFiltro(e.target.value)}>
        <option value="todos">Todos</option>
        <option value="neutral">Neutral</option>
        <option value="positivo">Positivo</option>
        <option value="negativo">Negativo</option>
      </Select>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Comentario</Th>
            <Th>Sentimiento</Th>
            <Th>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtrados.map((c: any, i: number) => (
            <Tr key={i}>
              <Td>{c.comentario}</Td>
              <Td>{c.sentimiento_final}</Td>
              <Td>{c.score_modelo}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
