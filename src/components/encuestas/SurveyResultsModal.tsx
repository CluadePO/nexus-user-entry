import React from 'react';
import { Modal, Card, Tag, Progress, Table, Tooltip } from 'antd';
import { BarChart3, Users, CheckCircle, TrendingUp, Award, Star } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type SurveyType = 'satisfaccion' | 'transferencia';

interface SurveyResultsModalProps {
  open: boolean;
  onClose: () => void;
  survey: {
    id: string;
    type: SurveyType;
    name: string;
    courseName: string;
    totalParticipants: number;
    responses: number;
    responseRate: number;
  } | null;
}

// Datos simulados de resultados por sección
const getSectionResults = (type: SurveyType) => {
  if (type === 'satisfaccion') {
    return [
      { section: 'Relator', average: 4.6, responses: 22, icon: '👨‍🏫' },
      { section: 'Contenido', average: 4.3, responses: 22, icon: '📚' },
      { section: 'Recursos', average: 4.1, responses: 22, icon: '🖥️' },
      { section: 'Aplicabilidad', average: 4.5, responses: 22, icon: '💼' },
      { section: 'Evaluación General', average: 4.4, responses: 22, icon: '⭐' },
    ];
  }
  return [
    { section: 'Aplicación', average: 4.2, responses: 8, icon: '🎯' },
    { section: 'Retroalimentación', average: 3.9, responses: 8, icon: '💬' },
    { section: 'Evaluación General', average: 4.1, responses: 8, icon: '⭐' },
  ];
};

// Datos para gráfico de radar
const getRadarData = (type: SurveyType) => {
  if (type === 'satisfaccion') {
    return [
      { subject: 'Relator', A: 4.6, fullMark: 5 },
      { subject: 'Contenido', A: 4.3, fullMark: 5 },
      { subject: 'Recursos', A: 4.1, fullMark: 5 },
      { subject: 'Aplicabilidad', A: 4.5, fullMark: 5 },
      { subject: 'Evaluación', A: 4.4, fullMark: 5 },
    ];
  }
  return [
    { subject: 'Aplicación', A: 4.2, fullMark: 5 },
    { subject: 'Retroalimentación', A: 3.9, fullMark: 5 },
    { subject: 'Evaluación', A: 4.1, fullMark: 5 },
  ];
};

// Distribución de respuestas por calificación
const getDistributionData = () => [
  { rating: '5 - Muy Bueno', count: 45, percentage: 41 },
  { rating: '4 - Bueno', count: 35, percentage: 32 },
  { rating: '3 - Regular', count: 18, percentage: 16 },
  { rating: '2 - Insatisfecho', count: 8, percentage: 7 },
  { rating: '1 - Muy Insatisfecho', count: 4, percentage: 4 },
];

// Datos de preguntas mejor y peor evaluadas
const getQuestionRankings = (type: SurveyType) => {
  if (type === 'satisfaccion') {
    return {
      best: [
        { question: 'El relator demostró dominio y conocimiento de los temas', score: 4.8 },
        { question: 'Mostró disposición para aclarar dudas y responder consultas', score: 4.7 },
        { question: 'Los conocimientos adquiridos son aplicables en mi trabajo', score: 4.6 },
      ],
      worst: [
        { question: 'El espacio físico fue adecuado', score: 3.6 },
        { question: 'La duración del curso fue apropiada', score: 3.8 },
        { question: 'Existió un balance adecuado entre teoría y práctica', score: 3.9 },
      ],
    };
  }
  return {
    best: [
      { question: '¿Ha podido aplicar los conocimientos adquiridos?', score: 4.5 },
      { question: '¿Los contenidos son relevantes para sus funciones?', score: 4.3 },
    ],
    worst: [
      { question: '¿Su jefatura ha notado mejoras en su desempeño?', score: 3.5 },
      { question: '¿Ha compartido los conocimientos con sus compañeros?', score: 3.7 },
    ],
  };
};

const COLORS = ['#65BFB1', '#4EA89A', '#1e4a5a', '#faad14', '#ff4d4f'];

const SurveyResultsModal: React.FC<SurveyResultsModalProps> = ({ open, onClose, survey }) => {
  if (!survey) return null;

  const sectionResults = getSectionResults(survey.type);
  const radarData = getRadarData(survey.type);
  const distributionData = getDistributionData();
  const rankings = getQuestionRankings(survey.type);

  const overallAverage = (sectionResults.reduce((acc, s) => acc + s.average, 0) / sectionResults.length).toFixed(1);

  const pieData = distributionData.map((d, i) => ({
    name: d.rating,
    value: d.count,
    color: COLORS[i],
  }));

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#65BFB1]" />
          <span>Resultados de Encuesta</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div className="space-y-6 mt-4">
        {/* Header Info */}
        <div className="bg-gradient-to-r from-[#1e4a5a] to-[#65BFB1] rounded-lg p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{survey.name}</h3>
              <p className="text-white/80 text-sm">{survey.courseName}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{overallAverage}</div>
              <div className="text-sm text-white/80">Promedio General</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="text-center bg-[#65BFB1]/10 border-[#65BFB1]">
            <Users className="w-6 h-6 text-[#65BFB1] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1e4a5a]">{survey.totalParticipants}</div>
            <div className="text-xs text-muted-foreground">Total Participantes</div>
          </Card>
          <Card className="text-center bg-[#65BFB1]/10 border-[#65BFB1]">
            <CheckCircle className="w-6 h-6 text-[#65BFB1] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1e4a5a]">{survey.responses}</div>
            <div className="text-xs text-muted-foreground">Respuestas</div>
          </Card>
          <Card className="text-center bg-[#65BFB1]/10 border-[#65BFB1]">
            <TrendingUp className="w-6 h-6 text-[#65BFB1] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1e4a5a]">{survey.responseRate}%</div>
            <div className="text-xs text-muted-foreground">Tasa de Respuesta</div>
          </Card>
          <Card className="text-center bg-[#65BFB1]/10 border-[#65BFB1]">
            <Star className="w-6 h-6 text-[#65BFB1] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1e4a5a]">{overallAverage}/5</div>
            <div className="text-xs text-muted-foreground">Satisfacción</div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Radar Chart */}
          <Card>
            <div className="text-sm font-medium text-[#1e4a5a] mb-4">Evaluación por Sección</div>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#1e4a5a', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Radar
                  name="Promedio"
                  dataKey="A"
                  stroke="#65BFB1"
                  fill="#65BFB1"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Distribution Pie Chart */}
          <Card>
            <div className="text-sm font-medium text-[#1e4a5a] mb-4">Distribución de Calificaciones</div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-[#1e4a5a]">{value}</span>}
                />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Section Scores Bar Chart */}
        <Card>
          <div className="text-sm font-medium text-[#1e4a5a] mb-4">Promedio por Sección</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectionResults} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis 
                dataKey="section" 
                type="category" 
                width={100} 
                tick={{ fill: '#1e4a5a', fontSize: 11 }}
              />
              <RechartsTooltip
                formatter={(value: number) => [`${value.toFixed(1)} / 5`, 'Promedio']}
              />
              <Bar 
                dataKey="average" 
                fill="#65BFB1" 
                radius={[0, 4, 4, 0]}
                label={{ position: 'right', fill: '#1e4a5a', fontSize: 12, formatter: (v: number) => v.toFixed(1) }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Best and Worst Questions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-[#65BFB1]">
            <div className="text-sm font-medium text-[#1e4a5a] mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#65BFB1]" />
              Preguntas Mejor Evaluadas
            </div>
            <div className="space-y-3">
              {rankings.best.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Tag color="success" className="shrink-0">{item.score.toFixed(1)}</Tag>
                  <span className="text-sm text-[#1e4a5a]">{item.question}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-l-4 border-l-orange-400">
            <div className="text-sm font-medium text-[#1e4a5a] mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              Áreas de Mejora
            </div>
            <div className="space-y-3">
              {rankings.worst.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Tag color="warning" className="shrink-0">{item.score.toFixed(1)}</Tag>
                  <span className="text-sm text-[#1e4a5a]">{item.question}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Section Details Table */}
        <Card>
          <div className="text-sm font-medium text-[#1e4a5a] mb-4">Detalle por Sección</div>
          <Table
            dataSource={sectionResults}
            rowKey="section"
            size="small"
            pagination={false}
            columns={[
              {
                title: 'Sección',
                dataIndex: 'section',
                key: 'section',
                render: (text: string, record) => (
                  <span className="font-medium text-[#1e4a5a]">
                    {record.icon} {text}
                  </span>
                ),
              },
              {
                title: 'Promedio',
                dataIndex: 'average',
                key: 'average',
                width: 120,
                render: (avg: number) => (
                  <div className="flex items-center gap-2">
                    <Progress
                      percent={(avg / 5) * 100}
                      size="small"
                      showInfo={false}
                      strokeColor="#65BFB1"
                      style={{ width: 60 }}
                    />
                    <span className="font-semibold text-[#1e4a5a]">{avg.toFixed(1)}</span>
                  </div>
                ),
              },
              {
                title: 'Calificación',
                key: 'rating',
                dataIndex: 'average',
                width: 120,
                render: (average: number) => {
                  if (average >= 4.5) return <Tag color="success">Excelente</Tag>;
                  if (average >= 4.0) return <Tag color="processing">Bueno</Tag>;
                  if (average >= 3.5) return <Tag color="warning">Regular</Tag>;
                  return <Tag color="error">Necesita Mejora</Tag>;
                },
              },
              {
                title: 'Respuestas',
                dataIndex: 'responses',
                key: 'responses',
                width: 100,
                render: (count: number) => (
                  <span className="text-muted-foreground">{count}</span>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </Modal>
  );
};

export default SurveyResultsModal;
