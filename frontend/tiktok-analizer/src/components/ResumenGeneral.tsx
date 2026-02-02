// src/components/ResumenGeneral.tsx
import { SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

export default function ResumenGeneral({ resultado }: any) {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <Stat>
        <StatLabel>Total comentarios</StatLabel>
        <StatNumber>{resultado.total_comentarios}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>Neutros</StatLabel>
        <StatNumber>{resultado.resumen_final.neutros}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>Positivos</StatLabel>
        <StatNumber>{resultado.resumen_final.positivos}</StatNumber>
      </Stat>
    </SimpleGrid>
  );
}
