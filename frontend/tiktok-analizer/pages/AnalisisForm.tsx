import { useState } from "react"
import { useAuth } from "../src//context/AuthContext"
import { toast } from "sonner"
import {LoadingOverlay} from "../src/components/LoadingOverlay"
import { isValidTikTokUrl } from "../src/utils/url"
import { useNavigate } from "react-router-dom"
import { Box, Button, Heading, Input, FormControl, FormLabel, Text } from "@chakra-ui/react"

export default function AnalisisForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [nombreAnalisis, setNombreAnalisis] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombreAnalisis || !videoUrl) {
      toast.error("Todos los campos son obligatorios")
      return
    }
    if (!isValidTikTokUrl(videoUrl)) {
      toast.error("La URL debe ser un link válido de TikTok")
      return
    }
    setLoading(true)
    try {
      const res = await crearAnalisis({
        userId: user!.uid,
        nombreAnalisis,
        videoUrl,
        commentsPerPost: 5,
      })
      if (res.success) {
        toast.success("Análisis creado exitosamente")
        navigate("/analisis")
      } else {
        toast.error(res.message ?? "Error en el backend")
      }
    } catch (err: any) {
      toast.error(err.message ?? "Error al crear análisis")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="xl">
    <LoadingOverlay open={loading} message="Ejecutando análisis..." />
      <Heading size="lg" color="brand.800" mb={4}>Realizar análisis</Heading>
      <Box as="form" onSubmit={onSubmit} bg="white" p={6} rounded="md" boxShadow="sm" display="grid" gap={4}>
        <FormControl>
          <FormLabel>Nombre del análisis</FormLabel>
          <Input value={nombreAnalisis} onChange={e=>setNombreAnalisis(e.target.value)} required />
        </FormControl>
        <FormControl>
          <FormLabel>URL del video de TikTok</FormLabel>
          <Input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://www.tiktok.com/@usuario/video/1234567890" required />
        </FormControl>
        <Text fontSize="sm" color="brand.700">commentsPerPost = 5</Text>
        <Button type="submit" colorScheme="blue">Enviar</Button>
      </Box>
    </Box>
  )
}
