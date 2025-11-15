import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Home,
  TrendingUp,
  FileText,
  Settings,
  Moon,
  Sun,
  LogOut,
  Download,
  Calendar,
  User,
} from "lucide-react";

const MOCK_DATA = {
  posts: [
    {
      id: "p1",
      title: "Por qué la IA cambiará el mundo",
      author: "techguru",
      subreddit: "AI",
      created_at: "2025-01-15",
      text: "La inteligencia artificial está evolucionando rápidamente...",
      score: 1200,
      num_comments: 54,
      sentiment: { polarity: "positivo", confidence: 0.82 },
      emotion: "alegría",
    },
    {
      id: "p2",
      title: "Estoy cansado del mal servicio",
      author: "angry_user",
      subreddit: "rant",
      created_at: "2025-01-18",
      text: "Las empresas ya no se preocupan...",
      score: 230,
      num_comments: 31,
      sentiment: { polarity: "negativo", confidence: 0.92 },
      emotion: "enojo",
    },
    {
      id: "p3",
      title: "Nueva actualización disponible",
      author: "dev_team",
      subreddit: "technology",
      created_at: "2025-01-20",
      text: "Hemos lanzado la versión 2.0...",
      score: 450,
      num_comments: 12,
      sentiment: { polarity: "neutral", confidence: 0.65 },
      emotion: "sorpresa",
    },
    {
      id: "p4",
      title: "Perdí mi trabajo hoy",
      author: "sadperson",
      subreddit: "offmychest",
      created_at: "2025-01-22",
      text: "Después de 5 años, me despidieron...",
      score: 890,
      num_comments: 67,
      sentiment: { polarity: "negativo", confidence: 0.95 },
      emotion: "tristeza",
    },
    {
      id: "p5",
      title: "Increíble descubrimiento científico",
      author: "scientist99",
      subreddit: "science",
      created_at: "2025-01-25",
      text: "Los investigadores han encontrado...",
      score: 2100,
      num_comments: 143,
      sentiment: { polarity: "positivo", confidence: 0.88 },
      emotion: "sorpresa",
    },
    {
      id: "p6",
      title: "Preocupado por el futuro",
      author: "worried_citizen",
      subreddit: "anxiety",
      created_at: "2025-01-28",
      text: "No sé qué va a pasar...",
      score: 340,
      num_comments: 28,
      sentiment: { polarity: "negativo", confidence: 0.78 },
      emotion: "miedo",
    },
    {
      id: "p7",
      title: "Gané la lotería",
      author: "lucky_one",
      subreddit: "happy",
      created_at: "2025-02-01",
      text: "No puedo creer mi suerte...",
      score: 3400,
      num_comments: 234,
      sentiment: { polarity: "positivo", confidence: 0.96 },
      emotion: "alegría",
    },
    {
      id: "p8",
      title: "Análisis del mercado",
      author: "market_analyst",
      subreddit: "stocks",
      created_at: "2025-02-03",
      text: "Las acciones muestran estabilidad...",
      score: 567,
      num_comments: 45,
      sentiment: { polarity: "neutral", confidence: 0.71 },
      emotion: "neutral",
    },
  ],
};

const COLORS = {
  positivo: "#10b981",
  negativo: "#ef4444",
  neutral: "#6b7280",
  alegría: "#fbbf24",
  miedo: "#8b5cf6",
  enojo: "#dc2626",
  tristeza: "#3b82f6",
  sorpresa: "#ec4899",
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubreddit, setFilterSubreddit] = useState("all");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  };

  const filteredPosts = useMemo(() => {
    return MOCK_DATA.posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubreddit =
        filterSubreddit === "all" || post.subreddit === filterSubreddit;
      const matchesSentiment =
        filterSentiment === "all" ||
        post.sentiment.polarity === filterSentiment;
      return matchesSearch && matchesSubreddit && matchesSentiment;
    });
  }, [searchTerm, filterSubreddit, filterSentiment]);

  const stats = useMemo(() => {
    const total = filteredPosts.length;
    const sentimentCounts = filteredPosts.reduce((acc, post) => {
      acc[post.sentiment.polarity] = (acc[post.sentiment.polarity] || 0) + 1;
      return acc;
    }, {});
    const emotionCounts = filteredPosts.reduce((acc, post) => {
      acc[post.emotion] = (acc[post.emotion] || 0) + 1;
      return acc;
    }, {});
    const subredditCounts = filteredPosts.reduce((acc, post) => {
      acc[post.subreddit] = (acc[post.subreddit] || 0) + 1;
      return acc;
    }, {});
    const topSubreddit = Object.entries(subredditCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const topEmotion = Object.entries(emotionCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    return {
      total,
      sentimentCounts,
      emotionCounts,
      topSubreddit: topSubreddit ? topSubreddit[0] : "N/A",
      topEmotion: topEmotion ? topEmotion[0] : "N/A",
    };
  }, [filteredPosts]);

  const sentimentChartData = Object.entries(stats.sentimentCounts).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })
  );
  const emotionChartData = Object.entries(stats.emotionCounts).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })
  );
  const timelineData = filteredPosts
    .map((post) => ({
      date: post.created_at,
      sentiment:
        post.sentiment.polarity === "positivo"
          ? 1
          : post.sentiment.polarity === "negativo"
          ? -1
          : 0,
      name: post.created_at,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const radarData = [
    { emotion: "Alegría", value: stats.emotionCounts.alegría || 0 },
    { emotion: "Miedo", value: stats.emotionCounts.miedo || 0 },
    { emotion: "Enojo", value: stats.emotionCounts.enojo || 0 },
    { emotion: "Tristeza", value: stats.emotionCounts.tristeza || 0 },
    { emotion: "Sorpresa", value: stats.emotionCounts.sorpresa || 0 },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Reddit Sentiment
            </h1>
            <p className="text-gray-600 mt-2">Análisis de sentimientos</p>
          </div>
          <div className="space-y-4">
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Iniciar Sesión
            </button>
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Credenciales de prueba:</p>
              <p className="font-mono mt-1">
                Usuario: <strong>admin</strong> | Contraseña:{" "}
                <strong>admin</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <header
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-md sticky top-0 z-50`}
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Reddit Sentiment</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`w-64 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } min-h-screen shadow-lg`}
        >
          <nav className="p-4 space-y-2">
            {[
              { id: "dashboard", icon: Home, label: "Dashboard" },
              { id: "posts", icon: FileText, label: "Publicaciones" },
              { id: "trends", icon: TrendingUp, label: "Tendencias" },
              { id: "reports", icon: Download, label: "Reportes" },
              { id: "settings", icon: Settings, label: "Configuración" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  currentView === item.id
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {currentView === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-xl shadow-md`}
                >
                  <div className="text-sm text-gray-500">Total Posts</div>
                  <div className="text-3xl font-bold mt-2">{stats.total}</div>
                </div>
                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-xl shadow-md`}
                >
                  <div className="text-sm text-gray-500">Positivos</div>
                  <div className="text-3xl font-bold mt-2 text-green-500">
                    {stats.sentimentCounts.positivo || 0}
                  </div>
                </div>
                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-xl shadow-md`}
                >
                  <div className="text-sm text-gray-500">Emoción Top</div>
                  <div className="text-2xl font-bold mt-2 capitalize">
                    {stats.topEmotion}
                  </div>
                </div>
                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-xl shadow-md`}
                >
                  <div className="text-sm text-gray-500">Subreddit Top</div>
                  <div className="text-2xl font-bold mt-2">
                    r/{stats.topSubreddit}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-xl shadow-md`}
                >
                  <h3 className="text-lg font-bold mb-4">Sentimientos</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sentimentChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-xl shadow-md`}
                >
                  <h3 className="text-lg font-bold mb-4">Emociones</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={emotionChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {emotionChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name.toLowerCase()] || "#6b7280"}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-xl shadow-md`}
                >
                  <h3 className="text-lg font-bold mb-4">Timeline</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="sentiment"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-xl shadow-md`}
                >
                  <h3 className="text-lg font-bold mb-4">Radar</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="emotion" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Emociones"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {currentView === "posts" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Publicaciones</h2>
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-4 rounded-xl shadow-md flex flex-wrap gap-4`}
              >
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
                <select
                  value={filterSubreddit}
                  onChange={(e) => setFilterSubreddit(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="all">Todos</option>
                  {[...new Set(MOCK_DATA.posts.map((p) => p.subreddit))].map(
                    (sr) => (
                      <option key={sr} value={sr}>
                        {sr}
                      </option>
                    )
                  )}
                </select>
                <select
                  value={filterSentiment}
                  onChange={(e) => setFilterSentiment(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="all">Todos</option>
                  <option value="positivo">Positivo</option>
                  <option value="negativo">Negativo</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-md overflow-hidden`}
              >
                <table className="w-full">
                  <thead
                    className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                  >
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Autor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Subreddit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Sentimiento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Emoción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPosts.map((post) => (
                      <tr
                        key={post.id}
                        className={`${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 max-w-xs truncate">
                          {post.title}
                        </td>
                        <td className="px-6 py-4">{post.author}</td>
                        <td className="px-6 py-4">r/{post.subreddit}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              post.sentiment.polarity === "positivo"
                                ? "bg-green-100 text-green-800"
                                : post.sentiment.polarity === "negativo"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {post.sentiment.polarity}
                          </span>
                        </td>
                        <td className="px-6 py-4 capitalize">{post.emotion}</td>
                        <td className="px-6 py-4">{post.created_at}</td>
                        <td className="px-6 py-4">{post.score}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setCurrentView("detail");
                            }}
                            className="text-blue-500 hover:text-blue-700 font-semibold"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === "detail" && selectedPost && (
            <div className="space-y-6">
              <button
                onClick={() => setCurrentView("posts")}
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                ← Volver
              </button>
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-8 rounded-xl shadow-md`}
              >
                <h2 className="text-3xl font-bold mb-4">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    u/{selectedPost.author}
                  </span>
                  <span>r/{selectedPost.subreddit}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedPost.created_at}
                  </span>
                </div>
                <p className="mb-6">{selectedPost.text}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div
                    className={`${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <div className="text-sm text-gray-500">Sentimiento</div>
                    <div
                      className="text-2xl font-bold capitalize"
                      style={{ color: COLORS[selectedPost.sentiment.polarity] }}
                    >
                      {selectedPost.sentiment.polarity}
                    </div>
                    <div className="text-sm mt-1">
                      Confianza:{" "}
                      {(selectedPost.sentiment.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div
                    className={`${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <div className="text-sm text-gray-500">Emoción</div>
                    <div
                      className="text-2xl font-bold capitalize"
                      style={{ color: COLORS[selectedPost.emotion] }}
                    >
                      {selectedPost.emotion}
                    </div>
                  </div>
                  <div
                    className={`${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <div className="text-sm text-gray-500">Interacción</div>
                    <div className="text-2xl font-bold">
                      {selectedPost.score}
                    </div>
                    <div className="text-sm mt-1">
                      {selectedPost.num_comments} comentarios
                    </div>
                  </div>
                </div>
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Exportar
                </button>
              </div>
            </div>
          )}

          {currentView === "trends" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Tendencias</h2>
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-6 rounded-xl shadow-md`}
              >
                <h3 className="text-lg font-bold mb-4">Evolución Temporal</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {currentView === "reports" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Reportes</h2>
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-8 rounded-xl shadow-md`}
              >
                <h3 className="text-xl font-bold mb-6">Exportar Datos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="bg-red-500 text-white py-4 rounded-lg font-semibold hover:bg-red-600 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    PDF
                  </button>
                  <button className="bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    CSV
                  </button>
                </div>
                <div
                  className={`mt-8 p-6 ${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  } rounded-lg`}
                >
                  <h4 className="font-bold mb-4">Resumen</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Total:</strong> {stats.total}
                    </p>
                    <p>
                      <strong>Positivos:</strong>{" "}
                      {stats.sentimentCounts.positivo || 0}
                    </p>
                    <p>
                      <strong>Negativos:</strong>{" "}
                      {stats.sentimentCounts.negativo || 0}
                    </p>
                    <p>
                      <strong>Neutrales:</strong>{" "}
                      {stats.sentimentCounts.neutral || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === "settings" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Configuración</h2>
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-8 rounded-xl shadow-md`}
              >
                <h3 className="text-xl font-bold mb-6">Preferencias</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tema
                    </label>
                    <select
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <option>Claro</option>
                      <option>Oscuro</option>
                    </select>
                  </div>
                  <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600">
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
