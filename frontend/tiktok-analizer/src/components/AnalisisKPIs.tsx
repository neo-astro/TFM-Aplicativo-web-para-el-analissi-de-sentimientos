import { SimpleGrid, Stat, StatLabel, StatNumber, Box } from "@chakra-ui/react";

export function AnalisisKPIs({ resumen }: any) {
  return (
    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
      <Box bg="white" p={4} rounded="md" boxShadow="sm">
        <Stat>
          <StatLabel>Total comentarios</StatLabel>
          <StatNumber>{resumen.total_comentarios}</StatNumber>
        </Stat>
      </Box>

      <Box bg="green.50" p={4} rounded="md">
        <Stat>
          <StatLabel>Positivos</StatLabel>
          <StatNumber>{resumen.resumen_final.positivos}</StatNumber>
        </Stat>
      </Box>

      <Box bg="red.50" p={4} rounded="md">
        <Stat>
          <StatLabel>Negativos</StatLabel>
          <StatNumber>{resumen.resumen_final.negativos}</StatNumber>
        </Stat>
      </Box>

      <Box bg="gray.50" p={4} rounded="md">
        <Stat>
          <StatLabel>Neutros</StatLabel>
          <StatNumber>{resumen.resumen_final.neutros}</StatNumber>
        </Stat>
      </Box>
    </SimpleGrid>
  );
}
