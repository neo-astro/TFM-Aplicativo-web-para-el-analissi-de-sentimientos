// src/components/AnalisisTabs.tsx
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ResumenGeneral from "./ResumenGeneral.tsx";
import GraficoSentimientos from "./GraficoSentimientos.tsx";
import TablaComentarios from "./TablaComentarios.tsx";

interface Props {
  resultado: any;
}

export default function AnalisisTabs({ resultado }: Props) {
  return (
    <Tabs variant="enclosed" isFitted>
      <TabList>
        <Tab>Resumen</Tab>
        <Tab>Sentimientos</Tab>
        <Tab>Comentarios</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <ResumenGeneral resultado={resultado} />
        </TabPanel>

        <TabPanel>
          <GraficoSentimientos resumen={resultado.resumen_final} />
        </TabPanel>

        <TabPanel>
          <TablaComentarios comentarios={resultado.resultados_detallados} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
