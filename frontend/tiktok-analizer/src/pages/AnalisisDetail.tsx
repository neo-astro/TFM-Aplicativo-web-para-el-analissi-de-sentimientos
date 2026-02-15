import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Text,
  Tag,
  TagLabel,
  TagLeftIcon,
  Progress,
  HStack,
  VStack,
  Badge,
  Tooltip,
  IconButton,
  useColorModeValue,
  Grid,
  GridItem,
  Center,
  Avatar,
  AvatarGroup,
  Button,
  ButtonGroup,
  Divider,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  Container,
  Wrap,
  WrapItem,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
} from "recharts";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiAward,
  FiAlertTriangle,
  FiFilter,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiMessageSquare,
  FiDownload,
  FiShare2,
  FiRefreshCw,
  FiStar,
  FiThumbsUp,
  FiThumbsDown,
  FiZap,
  FiUsers,
  FiTarget,
  FiGlobe,
  FiHash,
  FiPercent,
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiMinus,
  FiCode,
  FiFileText,
  FiFile,
  FiChevronDown,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from 'file-saver';
import * as apiDatos from "../services/apiDatos";

// Paleta de colores premium
const COLOR_THEME = {
  primary: {
    50: "#E6F6FF",
    100: "#BAE3FF",
    200: "#7CC4FA",
    300: "#47A3F3",
    400: "#2186EB",
    500: "#0967D2",
    600: "#0552B5",
    700: "#03449E",
    800: "#01337D",
    900: "#002159",
  },
  positive: {
    50: "#E3F9E5",
    100: "#C1F2C7",
    200: "#91E697",
    300: "#51CA58",
    400: "#31B237",
    500: "#18981D",
    600: "#0F8613",
    700: "#0E7817",
    800: "#07600E",
    900: "#014807",
  },
  negative: {
    50: "#FFE3E3",
    100: "#FFBDBD",
    200: "#FF9B9B",
    300: "#F86A6A",
    400: "#EF4444",
    500: "#E63535",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
  },
  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  accent: {
    purple: "#8B5CF6",
    pink: "#EC4899",
    orange: "#F59E0B",
    cyan: "#06B6D4",
    emerald: "#10B981",
  },
};

const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Componente para comentarios destacados
const HighlightComment = ({ 
  comment, 
  score, 
  sentiment, 
  type,
  onSelect 
}: { 
  comment: string; 
  score: number; 
  sentiment: string;
  type: 'positive' | 'negative';
  onSelect: () => void;
}) => {
  const isNeutral = score === 0;
  const bgColor = isNeutral
    ? COLOR_THEME.neutral[50]
    : type === 'positive'
      ? COLOR_THEME.positive[50]
      : COLOR_THEME.negative[50];
  const borderColor = isNeutral
    ? COLOR_THEME.neutral[200]
    : type === 'positive'
      ? COLOR_THEME.positive[200]
      : COLOR_THEME.negative[200];
  const textColor = isNeutral
    ? COLOR_THEME.neutral[700]
    : type === 'positive'
      ? COLOR_THEME.positive[700]
      : COLOR_THEME.negative[700];
  const label = isNeutral ? 'Neutral' : type === 'positive' ? 'Más Positivo' : 'Más Negativo';
  
  return (
    <MotionBox
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      cursor="pointer"
    >
      <Card
        bg={bgColor}
        border="2px solid"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{
          shadow: "lg",
          transform: "translateY(-2px)",
        }}
      >
        <CardBody>
          <Flex align="center" mb={3}>
            <Icon
              as={isNeutral ? FiMinus : type === 'positive' ? FiThumbsUp : FiThumbsDown}
              color={textColor}
              mr={2}
              fontSize="lg"
            />
            <Badge
              bg={isNeutral ? COLOR_THEME.neutral[100] : type === 'positive' ? COLOR_THEME.positive[100] : COLOR_THEME.negative[100]}
              color={textColor}
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
            >
              {label}
            </Badge>
          </Flex>
          
          <Text
            fontSize="sm"
            color={COLOR_THEME.neutral[700]}
            noOfLines={3}
            mb={3}
          >
            "{comment}"
          </Text>
          
          <Flex justify="space-between" align="center">
            <HStack>
              <Badge
                colorScheme={sentiment === 'positivo' ? 'green' : sentiment === 'negativo' ? 'red' : 'blue'}
                variant="subtle"
                fontSize="xs"
              >
                {sentiment}
              </Badge>
              <Text fontSize="xs" color={COLOR_THEME.neutral[500]}>
                Score: {score.toFixed(3)}
              </Text>
            </HStack>
            <Icon
              as={FiChevronRight}
              color={COLOR_THEME.neutral[400]}
            />
          </Flex>
        </CardBody>
      </Card>
    </MotionBox>
  );
};

// Componente de filtro con chips
const FilterChip = ({
  label,
  icon,
  isActive,
  onClick,
  colorScheme,
  showClose = false,
  onClose,
}: {
  label: string;
  icon: any;
  isActive: boolean;
  onClick: () => void;
  colorScheme: string;
  showClose?: boolean;
  onClose?: () => void;
}) => {
  const activeBg = {
    all: COLOR_THEME.primary[100],
    neutral: COLOR_THEME.neutral[100],
    positivo: COLOR_THEME.positive[100],
    negativo: COLOR_THEME.negative[100],
    politica: COLOR_THEME.accent.purple + '20',
    ventas: COLOR_THEME.accent.cyan + '20',
    reseñas: COLOR_THEME.accent.emerald + '20',
  }[colorScheme];

  const activeColor = {
    all: COLOR_THEME.primary[700],
    neutral: COLOR_THEME.neutral[700],
    positivo: COLOR_THEME.positive[700],
    negativo: COLOR_THEME.negative[700],
    politica: COLOR_THEME.accent.purple,
    ventas: COLOR_THEME.accent.cyan,
    reseñas: COLOR_THEME.accent.emerald,
  }[colorScheme];

  const IconComponent = icon;

  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        leftIcon={<IconComponent />}
        rightIcon={showClose && isActive ? <FiX /> : undefined}
        onClick={showClose && isActive ? onClose : onClick}
        bg={isActive ? activeBg : "white"}
        color={isActive ? activeColor : COLOR_THEME.neutral[600]}
        border="2px solid"
        borderColor={isActive ? activeColor : COLOR_THEME.neutral[200]}
        borderRadius="full"
        px={4}
        py={2}
        height="auto"
        fontSize="sm"
        fontWeight={isActive ? "bold" : "normal"}
        _hover={{
          bg: isActive ? activeBg : COLOR_THEME.neutral[50],
          transform: "translateY(-1px)",
          shadow: "sm",
        }}
        _active={{
          transform: "translateY(0)",
        }}
        transition="all 0.2s"
        boxShadow={isActive ? "md" : "none"}
      >
        {label}
        {isActive && (
          <Badge
            ml={2}
            bg={activeColor}
            color="white"
            borderRadius="full"
            px={2}
            py={0.5}
            fontSize="xs"
          >
            ✓
          </Badge>
        )}
      </Button>
    </MotionBox>
  );
};

// Componente KPI mejorado
const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color,
  onClick,
  isActive 
}: { 
  title: string; 
  value: number | string; 
  change?: string; 
  icon: any; 
  color: string;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const IconComponent = icon;
  
  return (
    <MotionBox
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
    >
      <Card
        bg="white"
        border="2px solid"
        borderColor={isActive ? color : COLOR_THEME.neutral[200]}
        borderRadius="2xl"
        overflow="hidden"
        position="relative"
        transition="all 0.3s"
        _hover={{
          shadow: "xl",
          borderColor: color,
          transform: "translateY(-4px)",
        }}
        sx={{
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
            borderRadius: '2xl 2xl 0 0',
          }
        }}
      >
        <CardBody>
          <Flex justify="space-between" align="start" mb={4}>
            <Box>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color={COLOR_THEME.neutral[500]}
                letterSpacing="wide"
                textTransform="uppercase"
              >
                {title}
              </Text>
              <Heading
                size="xl"
                color={COLOR_THEME.neutral[800]}
                mt={2}
                fontWeight="bold"
              >
                {value}
              </Heading>
            </Box>
            <Box
              p={2}
              bg={`${color}15`}
              borderRadius="lg"
            >
              <IconComponent
                size={24}
                color={color}
              />
            </Box>
          </Flex>
          
          {change && (
            <HStack>
              <Badge
                bg={`${color}20`}
                color={color}
                px={2}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
              >
                {change}
              </Badge>
              <Text fontSize="xs" color={COLOR_THEME.neutral[500]}>
                vs. total
              </Text>
            </HStack>
          )}
        </CardBody>
      </Card>
    </MotionBox>
  );
};

// Componente para mostrar notificación de exportación
const ExportNotification = ({ isVisible, message, type }: { isVisible: boolean; message: string; type: 'success' | 'error' }) => {
  if (!isVisible) return null;

  const bgColor = type === 'success' ? COLOR_THEME.positive[500] : COLOR_THEME.negative[500];
  const icon = type === 'success' ? FiCheckCircle : FiAlertCircle;

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      position="fixed"
      top={4}
      right={4}
      zIndex={9999}
    >
      <Card
        bg={bgColor}
        color="white"
        shadow="2xl"
        borderRadius="lg"
        border="none"
        minW="300px"
      >
        <CardBody>
          <Flex align="center" gap={3}>
            <Icon as={icon} boxSize={5} />
            <Text fontWeight="medium">{message}</Text>
          </Flex>
        </CardBody>
      </Card>
    </MotionBox>
  );
};

export default function AnalisisDetail() {
  const { id } = useParams<{ id: string }>();
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para filtros con chips
  const [activeSentiment, setActiveSentiment] = useState<string>("all");
  const [activeDomain, setActiveDomain] = useState<string>("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Estados para comentarios destacados
  const [mostPositive, setMostPositive] = useState<any>(null);
  const [mostNegative, setMostNegative] = useState<any>(null);

  // Estado para exportación
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue(COLOR_THEME.neutral[200], "gray.700");

  // Función para mostrar notificación
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ isVisible: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  // Función para exportar datos
  const handleExport = async (format: 'csv' | 'json' | 'excel') => {
    if (!resultado) {
      showNotification('No hay datos para exportar', 'error');
      return;
    }

    setIsExporting(true);

    try {
      switch (format) {
        case 'csv':
          await exportToCSV();
          showNotification('Datos exportados a CSV exitosamente');
          break;
        case 'json':
          await exportToJSON();
          showNotification('Datos exportados a JSON exitosamente');
          break;
        case 'excel':
          await exportToExcel();
          showNotification('Datos exportados a Excel exitosamente');
          break;
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      showNotification('Error al exportar los datos', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Función para exportar a CSV
  const exportToCSV = () => {
    const headers = [
      'Comentario',
      'Sentimiento Final',
      'Score Modelo',
      'Sentimiento Modelo',
      'Dominio Política',
      'Dominio Ventas',
      'Dominio Reseñas'
    ];
    
    const csvData = comentariosFiltrados.map((c: any) => [
      `"${c.comentario.replace(/"/g, '""')}"`,
      c.sentimiento_final,
      c.score_modelo,
      c.sentimiento_modelo,
      c.scores_por_dominio.politica,
      c.scores_por_dominio.ventas,
      c.scores_por_dominio.reseñas
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `analisis-sentimientos-${resultado.nombreanalisis || 'datos'}-${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
  };

  // Función para exportar a JSON
  const exportToJSON = () => {
    const exportData = {
      metadata: {
        nombreAnalisis: resultado.nombreanalisis,
        totalComentarios: resultado.total_comentarios,
        totalComentariosFiltrados: comentariosFiltrados.length,
        fechaAnalisis: resultado.fecha_analisis || new Date().toISOString(),
        fechaExportacion: new Date().toISOString(),
        filtrosAplicados: {
          sentimiento: activeSentiment,
          dominio: activeDomain,
          filtrosActivos: activeFilters
        }
      },
      resumen: {
        positivos: kpis.positivos,
        negativos: kpis.negativos,
        neutros: kpis.neutros,
        total: kpis.total,
        engagementRate: kpis.engagementRate,
        polaridad: kpis.polaridad
      },
      comentarios: comentariosFiltrados.map((c: any) => ({
        comentario: c.comentario,
        sentimiento_final: c.sentimiento_final,
        score_modelo: c.score_modelo,
        sentimiento_modelo: c.sentimiento_modelo,
        scores_por_dominio: c.scores_por_dominio,
        afiliacion: c.afiliacion
      })),
      distribucionSentimientos,
      dominioAnalysis
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json;charset=utf-8;' 
    });
    
    const fileName = `analisis-sentimientos-${resultado.nombreanalisis || 'datos'}-${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, fileName);
  };

  // Función para exportar a Excel (formato CSV mejorado)
  const exportToExcel = () => {
    const headers = [
      'Comentario',
      'Sentimiento Final',
      'Score Modelo',
      'Sentimiento Modelo',
      'Dominio Política',
      'Dominio Ventas',
      'Dominio Reseñas',
      'Afiliación'
    ];
    
    const csvData = comentariosFiltrados.map((c: any) => [
      `"${c.comentario.replace(/"/g, '""')}"`,
      c.sentimiento_final,
      c.score_modelo,
      c.sentimiento_modelo,
      c.scores_por_dominio.politica,
      c.scores_por_dominio.ventas,
      c.scores_por_dominio.reseñas,
      c.afiliacion.join(', ')
    ]);
    
    // Agregar metadatos al inicio
    const metadata = [
      ['Análisis de Sentimientos'],
      [`Nombre del análisis: ${resultado.nombreanalisis}`],
      [`Total comentarios: ${resultado.total_comentarios}`],
      [`Comentarios filtrados: ${comentariosFiltrados.length}`],
      [`Fecha de análisis: ${resultado.fecha_analisis || 'N/A'}`],
      [`Fecha de exportación: ${new Date().toLocaleDateString()}`],
      [''],
      ['RESUMEN'],
      [`Positivos: ${kpis.positivos}`],
      [`Negativos: ${kpis.negativos}`],
      [`Neutrales: ${kpis.neutros}`],
      [`Engagement Rate: ${kpis.engagementRate}%`],
      [`Polaridad: ${kpis.polaridad}`],
      [''],
      ['DATOS DETALLADOS'],
      headers
    ];
    
    const csvContent = [
      ...metadata.map(row => row.join(',')),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `reporte-completo-${resultado.nombreanalisis || 'analisis'}-${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
  };

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await apiDatos.obtenerAnalisisId(id);
        setResultado(res.documento.resultado);
        
        // Encontrar comentarios más positivos y negativos
        const comments = res.documento.resultado.resultados_detallados;
        if (comments.length > 0) {
          const positive = [...comments].sort((a, b) => b.score_modelo - a.score_modelo)[0];
          const negative = [...comments].sort((a, b) => a.score_modelo - b.score_modelo)[0];
          setMostPositive(positive);
          setMostNegative(negative);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // Manejar filtros
  const handleSentimentFilter = (sentiment: string) => {
    if (sentiment === activeSentiment) {
      setActiveSentiment("all");
      setActiveFilters(activeFilters.filter(f => !f.startsWith('sentiment:')));
    } else {
      setActiveSentiment(sentiment);
      setActiveFilters([
        ...activeFilters.filter(f => !f.startsWith('sentiment:')),
        `sentiment:${sentiment}`
      ]);
    }
  };

  const handleDomainFilter = (domain: string) => {
    if (domain === activeDomain) {
      setActiveDomain("all");
      setActiveFilters(activeFilters.filter(f => !f.startsWith('domain:')));
    } else {
      setActiveDomain(domain);
      setActiveFilters([
        ...activeFilters.filter(f => !f.startsWith('domain:')),
        `domain:${domain}`
      ]);
    }
  };

  const removeFilter = (filter: string) => {
    const [type, value] = filter.split(':');
    if (type === 'sentiment') {
      setActiveSentiment("all");
    } else if (type === 'domain') {
      setActiveDomain("all");
    }
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveSentiment("all");
    setActiveDomain("all");
    setActiveFilters([]);
  };

  // Filtrar comentarios
  const comentariosFiltrados = useMemo(() => {
    if (!resultado) return [];

    let filtered = resultado.resultados_detallados;

    // Filtrar por sentimiento
    if (activeSentiment !== "all") {
      filtered = filtered.filter((c: any) => c.sentimiento_final === activeSentiment);
    }

    // Filtrar por dominio
    if (activeDomain !== "all") {
      filtered = filtered.filter((c: any) => {
        const dominioScores = c.scores_por_dominio;
        return dominioScores[activeDomain] > 0;
      });
    }

    return filtered;
  }, [resultado, activeSentiment, activeDomain]);

  // Datos para visualizaciones
  const distribucionSentimientos = useMemo(() => {
    if (!resultado) return [];

    const counts = {
      neutral: 0,
      positivo: 0,
      negativo: 0,
    };

    comentariosFiltrados.forEach((c: any) => {
      counts[c.sentimiento_final]++;
    });

    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        color: 
          key === 'positivo' ? COLOR_THEME.positive[500] :
          key === 'negativo' ? COLOR_THEME.negative[500] :
          COLOR_THEME.neutral[500],
        fill: 
          key === 'positivo' ? `url(#gradient-positive)` :
          key === 'negativo' ? `url(#gradient-negative)` :
          `url(#gradient-neutral)`,
    }));
  }, [comentariosFiltrados]);

  // KPIs principales
  const kpis = useMemo(() => {
    const total = comentariosFiltrados.length;
    const positivos = comentariosFiltrados.filter((c: any) => c.sentimiento_final === "positivo").length;
    const negativos = comentariosFiltrados.filter((c: any) => c.sentimiento_final === "negativo").length;
    const neutros = comentariosFiltrados.filter((c: any) => c.sentimiento_final === "neutral").length;
    
    const engagementRate = total > 0 ? ((positivos + negativos) / total) * 100 : 0;
    const polaridad = total > 0 ? (positivos - negativos) / total : 0;

    return {
      total,
      positivos,
      negativos,
      neutros,
      engagementRate: engagementRate.toFixed(1),
      polaridad: polaridad.toFixed(2),
    };
  }, [comentariosFiltrados]);

  // Datos para gráficos avanzados
  const scoreDistribution = useMemo(() => {
    const data = comentariosFiltrados.map((c: any, index: number) => ({
      index,
      score: c.score_modelo,
      sentiment: c.sentimiento_final,
      comment: c.comentario.substring(0, 20) + '...',
    }));

    return data.slice(0, 20);
  }, [comentariosFiltrados]);

  const dominioAnalysis = useMemo(() => {
    const domains = ['politica', 'ventas', 'reseñas'];
    return domains.map(domain => {
      const domainComments = comentariosFiltrados.filter((c: any) => 
        c.scores_por_dominio[domain] > 0
      );
      
      const avgScore = domainComments.length > 0 
        ? domainComments.reduce((sum: number, c: any) => sum + c.score_modelo, 0) / domainComments.length
        : 0;

      return {
        domain: domain.charAt(0).toUpperCase() + domain.slice(1),
        count: domainComments.length,
        avgScore,
        color: 
          domain === 'politica' ? COLOR_THEME.accent.purple :
          domain === 'ventas' ? COLOR_THEME.accent.cyan :
          COLOR_THEME.accent.emerald,
      };
    }).filter(d => d.count > 0);
  }, [comentariosFiltrados]);

  if (loading) {
    return (
      <Center minH="100vh" bg={COLOR_THEME.neutral[50]}>
        <VStack spacing={8}>
          <VStack spacing={4}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            <Text color="gray.600" fontSize="lg" fontWeight="medium">
              Analizando sentimientos...
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  if (!resultado) {
    return (
      <Center minH="100vh" bg={COLOR_THEME.neutral[50]}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="2xl"
          maxW="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No se encontraron datos
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            No pudimos cargar el análisis solicitado. Por favor, intenta nuevamente.
          </AlertDescription>
        </Alert>
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg={COLOR_THEME.neutral[50]} py={8}>
      <Container maxW="container.xl">
        {/* Notificación de exportación */}
        <ExportNotification 
          isVisible={notification.isVisible}
          message={notification.message}
          type={notification.type}
        />

        {/* Header con título y acciones */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Flex justify="space-between" align="center" mb={8}>
            <VStack align="start" spacing={3}>
              <Flex align="center" gap={3}>
                <Box
                  p={3}
                  bg={`${COLOR_THEME.primary[500]}15`}
                  borderRadius="xl"
                >
                  <Icon as={FiTarget} color={COLOR_THEME.primary[500]} boxSize={6} />
                </Box>
                <Box>
                  <Heading size="lg" color={COLOR_THEME.neutral[900]}>
                    {resultado.nombreanalisis}
                  </Heading>
                  <Text color={COLOR_THEME.neutral[500]} fontSize="sm">
                    Análisis de sentimientos • {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                </Box>
              </Flex>
            </VStack>
            
            <HStack spacing={3}>
              <Button
                leftIcon={<FiRefreshCw />}
                variant="outline"
                colorScheme="gray"
                onClick={clearAllFilters}
                isDisabled={activeFilters.length === 0}
                borderRadius="full"
                fontWeight="medium"
                _hover={{
                  bg: COLOR_THEME.neutral[100],
                  transform: 'translateY(-1px)',
                }}
              >
                Limpiar filtros
              </Button>
              
              {/* Menú de exportación */}
              <Menu>
                <MenuButton
                  as={Button}
                  leftIcon={<FiDownload />}
                  rightIcon={<FiChevronDown />}
                  colorScheme="primary"
                  bg={COLOR_THEME.primary[500]}
                  color="white"
                  _hover={{ 
                    bg: COLOR_THEME.primary[600],
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)'
                  }}
                  _active={{ 
                    bg: COLOR_THEME.primary[700],
                    transform: 'translateY(0)'
                  }}
                  borderRadius="full"
                  fontWeight="bold"
                  isLoading={isExporting}
                  loadingText="Exportando..."
                  transition="all 0.2s"
                >
                  Exportar
                </MenuButton>
                <MenuList 
                  border="1px solid" 
                  borderColor={COLOR_THEME.neutral[200]}
                  shadow="xl"
                  borderRadius="xl"
                  py={2}
                  minW="200px"
                >
                  <MenuGroup title="Formato de exportación">
                    <MenuItem 
                      icon={<FiFile />}
                      onClick={() => handleExport('csv')}
                      _hover={{ bg: COLOR_THEME.neutral[100] }}
                      py={3}
                    >
                      <Box>
                        <Text fontWeight="medium">CSV</Text>
                        <Text fontSize="xs" color={COLOR_THEME.neutral[500]}>
                          Datos tabulares
                        </Text>
                      </Box>
                    </MenuItem>
                    <MenuItem 
                      icon={<FiCode />}
                      onClick={() => handleExport('json')}
                      _hover={{ bg: COLOR_THEME.neutral[100] }}
                      py={3}
                    >
                      <Box>
                        <Text fontWeight="medium">JSON</Text>
                        <Text fontSize="xs" color={COLOR_THEME.neutral[500]}>
                          Datos estructurados
                        </Text>
                      </Box>
                    </MenuItem>
                    <MenuItem 
                      icon={<FiFileText />}
                      onClick={() => handleExport('excel')}
                      _hover={{ bg: COLOR_THEME.neutral[100] }}
                      py={3}
                    >
                      <Box>
                        <Text fontWeight="medium">Excel (CSV)</Text>
                        <Text fontSize="xs" color={COLOR_THEME.neutral[500]}>
                          Reporte completo
                        </Text>
                      </Box>
                    </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuItem 
                    icon={<FiShare2 />}
                    isDisabled
                    _hover={{ bg: COLOR_THEME.neutral[100] }}
                    py={3}
                  >
                    <Box>
                      <Text fontWeight="medium" color={COLOR_THEME.neutral[400]}>
                        Compartir enlace
                      </Text>
                      <Text fontSize="xs" color={COLOR_THEME.neutral[400]}>
                        Próximamente
                      </Text>
                    </Box>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          {/* Filtros activos */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                mb={6}
              >
                <Card bg="white" shadow="sm" borderRadius="xl" border="1px solid" borderColor={borderColor}>
                  <CardBody py={3}>
                    <Flex align="center" justify="space-between">
                      <HStack spacing={2}>
                        <Icon as={FiFilter} color={COLOR_THEME.primary[500]} />
                        <Text fontSize="sm" fontWeight="medium" color={COLOR_THEME.neutral[600]}>
                          Filtros activos:
                        </Text>
                        <Wrap>
                          {activeFilters.map((filter, index) => {
                            const [type, value] = filter.split(':');
                            return (
                              <WrapItem key={index}>
                                <Badge
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  bg={`${COLOR_THEME.primary[100]}`}
                                  color={COLOR_THEME.primary[700]}
                                  fontWeight="medium"
                                  fontSize="xs"
                                  display="flex"
                                  alignItems="center"
                                  gap={2}
                                >
                                  {type}: {value}
                                  <Icon
                                    as={FiX}
                                    boxSize={2}
                                    cursor="pointer"
                                    onClick={() => removeFilter(filter)}
                                  />
                                </Badge>
                              </WrapItem>
                            );
                          })}
                        </Wrap>
                      </HStack>
                      <Button
                        size="sm"
                        variant="ghost"
                        color={COLOR_THEME.neutral[500]}
                        onClick={clearAllFilters}
                        rightIcon={<FiX />}
                      >
                        Limpiar todos
                      </Button>
                    </Flex>
                  </CardBody>
                </Card>
              </MotionBox>
            )}
          </AnimatePresence>
        </MotionBox>

        {/* KPIs principales */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          mb={8}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <MetricCard
              title="Total Comentarios"
              value={kpis.total}
              change={`${((kpis.total / resultado.total_comentarios) * 100).toFixed(0)}%`}
              icon={FiMessageSquare}
              color={COLOR_THEME.primary[500]}
              onClick={() => handleSentimentFilter("all")}
              isActive={activeSentiment === "all"}
            />
            
            <MetricCard
              title="Positivos"
              value={kpis.positivos}
              change={`${resultado.total_comentarios > 0 ? ((kpis.positivos / resultado.total_comentarios) * 100).toFixed(0) : 0}%`}
              icon={FiTrendingUp}
              color={COLOR_THEME.positive[500]}
              onClick={() => handleSentimentFilter("positivo")}
              isActive={activeSentiment === "positivo"}
            />
            
            <MetricCard
              title="Negativos"
              value={kpis.negativos}
              change={`${resultado.total_comentarios > 0 ? ((kpis.negativos / resultado.total_comentarios) * 100).toFixed(0) : 0}%`}
              icon={FiTrendingDown}
              color={COLOR_THEME.negative[500]}
              onClick={() => handleSentimentFilter("negativo")}
              isActive={activeSentiment === "negativo"}
            />
            
            <MetricCard
              title="Engagement"
              value={`${kpis.engagementRate}%`}
              change={`${kpis.polaridad > 0 ? '+' : ''}${kpis.polaridad}`}
              icon={FiActivity}
              color={COLOR_THEME.accent.orange}
            />
          </SimpleGrid>
        </MotionBox>

        {/* Filtros con chips */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          mb={8}
        >
          <Card bg="white" shadow="md" borderRadius="2xl" border="1px solid" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="sm" mb={4} color={COLOR_THEME.neutral[800]}>
                    Filtrar por Sentimiento
                  </Heading>
                  <Wrap spacing={3}>
                    <FilterChip
                      label="Todos"
                      icon={FiHash}
                      isActive={activeSentiment === "all"}
                      onClick={() => handleSentimentFilter("all")}
                      colorScheme="all"
                      showClose={activeSentiment === "all"}
                      onClose={() => handleSentimentFilter("all")}
                    />
                    <FilterChip
                      label="Positivos"
                      icon={FiTrendingUp}
                      isActive={activeSentiment === "positivo"}
                      onClick={() => handleSentimentFilter("positivo")}
                      colorScheme="positivo"
                      showClose={activeSentiment === "positivo"}
                      onClose={() => handleSentimentFilter("positivo")}
                    />
                    <FilterChip
                      label="Negativos"
                      icon={FiTrendingDown}
                      isActive={activeSentiment === "negativo"}
                      onClick={() => handleSentimentFilter("negativo")}
                      colorScheme="negativo"
                      showClose={activeSentiment === "negativo"}
                      onClose={() => handleSentimentFilter("negativo")}
                    />
                    <FilterChip
                      label="Neutrales"
                      icon={FiMinus}
                      isActive={activeSentiment === "neutral"}
                      onClick={() => handleSentimentFilter("neutral")}
                      colorScheme="neutral"
                      showClose={activeSentiment === "neutral"}
                      onClose={() => handleSentimentFilter("neutral")}
                    />
                  </Wrap>
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={4} color={COLOR_THEME.neutral[800]}>
                    Filtrar por Dominio
                  </Heading>
                  <Wrap spacing={3}>
                    <FilterChip
                      label="Todos los dominios"
                      icon={FiGlobe}
                      isActive={activeDomain === "all"}
                      onClick={() => handleDomainFilter("all")}
                      colorScheme="all"
                      showClose={activeDomain === "all"}
                      onClose={() => handleDomainFilter("all")}
                    />
                    <FilterChip
                      label="Política"
                      icon={FiTarget}
                      isActive={activeDomain === "politica"}
                      onClick={() => handleDomainFilter("politica")}
                      colorScheme="politica"
                      showClose={activeDomain === "politica"}
                      onClose={() => handleDomainFilter("politica")}
                    />
                    <FilterChip
                      label="Ventas"
                      icon={FiTrendingUp}
                      isActive={activeDomain === "ventas"}
                      onClick={() => handleDomainFilter("ventas")}
                      colorScheme="ventas"
                      showClose={activeDomain === "ventas"}
                      onClose={() => handleDomainFilter("ventas")}
                    />
                    <FilterChip
                      label="Reseñas"
                      icon={FiStar}
                      isActive={activeDomain === "reseñas"}
                      onClick={() => handleDomainFilter("reseñas")}
                      colorScheme="reseñas"
                      showClose={activeDomain === "reseñas"}
                      onClose={() => handleDomainFilter("reseñas")}
                    />
                  </Wrap>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Comentarios destacados */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          mb={8}
        >
          <Heading size="lg" mb={6} color={COLOR_THEME.neutral[900]}>
            Comentarios Destacados
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {mostPositive && (
              <HighlightComment
                comment={mostPositive.comentario}
                score={mostPositive.score_modelo}
                sentiment={mostPositive.sentimiento_final}
                type="positive"
                onSelect={() => handleSentimentFilter("positivo")}
              />
            )}
            
            {mostNegative && (
              <HighlightComment
                comment={mostNegative.comentario}
                score={mostNegative.score_modelo}
                sentiment={mostNegative.sentimiento_final}
                type="negative"
                onSelect={() => handleSentimentFilter("negativo")}
              />
            )}
          </SimpleGrid>
        </MotionBox>

        {/* Gráficos principales */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          mb={8}
        >
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={6}>
            {/* Gráfico de distribución */}
            <GridItem>
              <MotionCard
                whileHover={{ scale: 1.01 }}
                bg="white"
                shadow="lg"
                borderRadius="2xl"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
              >
                <CardHeader bg={COLOR_THEME.neutral[50]} borderBottom="1px solid" borderColor={borderColor}>
                  <Flex align="center" justify="space-between">
                    <HStack>
                      <Icon as={FiBarChart2} color={COLOR_THEME.primary[500]} />
                      <Heading size="md" color={COLOR_THEME.neutral[800]}>
                        Distribución de Sentimientos
                      </Heading>
                    </HStack>
                    <Badge colorScheme="primary" variant="subtle" fontSize="xs">
                      {comentariosFiltrados.length} comentarios
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={distribucionSentimientos}>
                        <defs>
                          <linearGradient id="gradient-positive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLOR_THEME.positive[400]} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={COLOR_THEME.positive[400]} stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="gradient-negative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLOR_THEME.negative[400]} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={COLOR_THEME.negative[400]} stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="gradient-neutral" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLOR_THEME.neutral[400]} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={COLOR_THEME.neutral[400]} stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLOR_THEME.neutral[200]} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: COLOR_THEME.neutral[600] }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: COLOR_THEME.neutral[600] }}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            borderRadius: '12px',
                            border: `1px solid ${COLOR_THEME.neutral[200]}`,
                            background: 'white',
                          }}
                          formatter={(value) => [value, 'Comentarios']}
                          labelFormatter={(label) => `Sentimiento: ${label}`}
                        />
                        <Bar 
                          dataKey="value" 
                          radius={[8, 8, 0, 0]}
                          barSize={40}
                        >
                          {distribucionSentimientos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </MotionCard>
            </GridItem>

            {/* Gráfico de dominios */}
            <GridItem>
              <MotionCard
                whileHover={{ scale: 1.01 }}
                bg="white"
                shadow="lg"
                borderRadius="2xl"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
              >
                <CardHeader bg={COLOR_THEME.neutral[50]} borderBottom="1px solid" borderColor={borderColor}>
                  <Flex align="center" justify="space-between">
                    <HStack>
                      <Icon as={FiPieChart} color={COLOR_THEME.accent.purple} />
                      <Heading size="md" color={COLOR_THEME.neutral[800]}>
                        Análisis por Dominio
                      </Heading>
                    </HStack>
                    <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                      {dominioAnalysis.reduce((sum, d) => sum + d.count, 0)} menciones
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dominioAnalysis}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ domain, percent }) => `${domain}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="count"
                          paddingAngle={2}
                        >
                          {dominioAnalysis.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ 
                            borderRadius: '12px',
                            border: `1px solid ${COLOR_THEME.neutral[200]}`,
                            background: 'white',
                          }}
                          formatter={(value, name, props) => [
                            `${value} comentarios`,
                            `Score promedio: ${props.payload.avgScore.toFixed(2)}`
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </MotionCard>
            </GridItem>
          </Grid>

          {/* Gráfico de evolución */}
          <MotionCard
            whileHover={{ scale: 1.01 }}
            bg="white"
            shadow="lg"
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            overflow="hidden"
          >
            <CardHeader bg={COLOR_THEME.neutral[50]} borderBottom="1px solid" borderColor={borderColor}>
              <Flex align="center" justify="space-between">
                <HStack>
                  <Icon as={FiActivity} color={COLOR_THEME.accent.orange} />
                  <Heading size="md" color={COLOR_THEME.neutral[800]}>
                    Evolución de Sentimientos
                  </Heading>
                </HStack>
                <Badge colorScheme="orange" variant="subtle" fontSize="xs">
                  {scoreDistribution.length} puntos
                </Badge>
              </Flex>
            </CardHeader>
            <CardBody>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLOR_THEME.neutral[200]} />
                    <XAxis 
                      dataKey="index" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: COLOR_THEME.neutral[600] }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: COLOR_THEME.neutral[600] }}
                      domain={[-1, 1]}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        borderRadius: '12px',
                        border: `1px solid ${COLOR_THEME.neutral[200]}`,
                        background: 'white',
                      }}
                      formatter={(value) => [`Score: ${Number(value).toFixed(3)}`, 'Valor']}
                      labelFormatter={(label) => `Comentario #${label + 1}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke={COLOR_THEME.primary[500]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8, fill: COLOR_THEME.primary[500] }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </MotionCard>
        </MotionBox>

        {/* Tabla de comentarios */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card bg="white" shadow="xl" borderRadius="2xl" border="1px solid" borderColor={borderColor} overflow="hidden">
            <CardHeader bg={COLOR_THEME.neutral[50]} borderBottom="1px solid" borderColor={borderColor}>
              <Flex align="center" justify="space-between">
                <HStack>
                  <Icon as={FiMessageSquare} color={COLOR_THEME.primary[500]} />
                  <Heading size="md" color={COLOR_THEME.neutral[800]}>
                    Comentarios Analizados
                  </Heading>
                </HStack>
                <Badge 
                  colorScheme="primary" 
                  variant="subtle" 
                  fontSize="sm" 
                  px={3} 
                  py={1}
                  borderRadius="full"
                >
                  {comentariosFiltrados.length} encontrados
                </Badge>
              </Flex>
            </CardHeader>
            <CardBody p={0}>
              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead bg={COLOR_THEME.neutral[100]}>
                    <Tr>
                      <Th borderColor={borderColor} color={COLOR_THEME.neutral[600]}>Comentario</Th>
                      <Th borderColor={borderColor} color={COLOR_THEME.neutral[600]}>Sentimiento</Th>
                      <Th borderColor={borderColor} color={COLOR_THEME.neutral[600]}>Score</Th>
                      <Th borderColor={borderColor} color={COLOR_THEME.neutral[600]}>Dominios</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {comentariosFiltrados.slice(0, 10).map((c: any, i: number) => {
                      const dominiosActivos = Object.entries(c.scores_por_dominio)
                        .filter(([_, score]: any) => score > 0)
                        .map(([dominio]) => dominio);

                      return (
                        <Tr 
                          key={i} 
                          _hover={{ bg: COLOR_THEME.neutral[50] }}
                          transition="background 0.2s"
                        >
                          <Td borderColor={borderColor} maxW="400px">
                            <Text noOfLines={2} color={COLOR_THEME.neutral[700]}>
                              {c.comentario}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Badge
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                              fontWeight="bold"
                              bg={
                                c.sentimiento_final === 'positivo' ? `${COLOR_THEME.positive[100]}` :
                                c.sentimiento_final === 'negativo' ? `${COLOR_THEME.negative[100]}` :
                                `${COLOR_THEME.neutral[100]}`
                              }
                              color={
                                c.sentimiento_final === 'positivo' ? COLOR_THEME.positive[700] :
                                c.sentimiento_final === 'negativo' ? COLOR_THEME.negative[700] :
                                COLOR_THEME.neutral[700]
                              }
                            >
                              {c.sentimiento_final}
                            </Badge>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex align="center" gap={2}>
                              <Box 
                                w="60px" 
                                h="8px" 
                                bg={COLOR_THEME.neutral[200]}
                                borderRadius="full"
                                overflow="hidden"
                              >
                                <Box 
                                  h="100%"
                                  w={`${((c.score_modelo + 1) / 2) * 100}%`}
                                  bg={
                                    c.score_modelo > 0.3 ? COLOR_THEME.positive[500] :
                                    c.score_modelo < -0.3 ? COLOR_THEME.negative[500] :
                                    COLOR_THEME.neutral[500]
                                  }
                                  borderRadius="full"
                                />
                              </Box>
                              <Text fontSize="sm" color={COLOR_THEME.neutral[600]}>
                                {c.score_modelo.toFixed(3)}
                              </Text>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Wrap spacing={1}>
                              {dominiosActivos.map((dominio, idx) => (
                                <WrapItem key={idx}>
                                  <Badge
                                    fontSize="xs"
                                    px={2}
                                    py={0.5}
                                    borderRadius="full"
                                    bg={
                                      dominio === 'politica' ? `${COLOR_THEME.accent.purple}20` :
                                      dominio === 'ventas' ? `${COLOR_THEME.accent.cyan}20` :
                                      `${COLOR_THEME.accent.emerald}20`
                                    }
                                    color={
                                      dominio === 'politica' ? COLOR_THEME.accent.purple :
                                      dominio === 'ventas' ? COLOR_THEME.accent.cyan :
                                      COLOR_THEME.accent.emerald
                                    }
                                  >
                                    {dominio}
                                  </Badge>
                                </WrapItem>
                              ))}
                              {dominiosActivos.length === 0 && (
                                <Text fontSize="xs" color={COLOR_THEME.neutral[400]}>
                                  Sin dominio
                                </Text>
                              )}
                            </Wrap>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
              
              {comentariosFiltrados.length > 10 && (
                <Box p={4} borderTop="1px solid" borderColor={borderColor} textAlign="center">
                  <Text color={COLOR_THEME.neutral[500]} fontSize="sm">
                    Mostrando 10 de {comentariosFiltrados.length} comentarios
                  </Text>
                </Box>
              )}
            </CardBody>
          </Card>
        </MotionBox>
      </Container>
    </Box>
  );
}