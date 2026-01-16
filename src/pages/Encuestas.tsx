import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Tag, 
  Tabs, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Switch, 
  Space, 
  Tooltip, 
  Badge,
  message,
  Checkbox,
  InputNumber,
  Divider,
  Popconfirm
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  Plus, 
  Send, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  Users, 
  FileText,
  CheckCircle,
  Calendar,
  Bell,
  BarChart3,
  ClipboardList,
  BookOpen,
  Link as LinkIcon
} from 'lucide-react';

const { TextArea } = Input;

// Tipos de encuesta
type SurveyType = 'satisfaccion' | 'transferencia';

interface Survey {
  id: string;
  type: SurveyType;
  name: string;
  courseId: string;
  courseName: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  createdAt: string;
  scheduledDate?: string;
  reminderEnabled: boolean;
  reminderDays?: number;
  totalParticipants: number;
  responses: number;
  responseRate: number;
}

interface CompletedCourse {
  id: string;
  name: string;
  code: string;
  endDate: string;
  participants: number;
  otec: string;
}

// Datos de ejemplo de cursos finalizados
const completedCoursesData: CompletedCourse[] = [
  { id: '1', name: 'Excel Avanzado para Análisis de Datos', code: 'EXC-2024-001', endDate: '2024-01-10', participants: 25, otec: 'Capacitaciones CCC' },
  { id: '2', name: 'Liderazgo y Gestión de Equipos', code: 'LID-2024-002', endDate: '2024-01-05', participants: 18, otec: 'Instituto de Liderazgo' },
  { id: '3', name: 'Seguridad Industrial Básica', code: 'SEG-2024-003', endDate: '2023-12-20', participants: 30, otec: 'Safety Training Chile' },
  { id: '4', name: 'Comunicación Efectiva', code: 'COM-2024-004', endDate: '2023-12-15', participants: 22, otec: 'Capacitaciones CCC' },
  { id: '5', name: 'Gestión del Tiempo y Productividad', code: 'GTP-2024-005', endDate: '2023-12-10', participants: 15, otec: 'Productividad Chile' },
  { id: '6', name: 'Marketing Digital Básico', code: 'MKT-2024-006', endDate: '2023-12-05', participants: 20, otec: 'Digital Academy' },
  { id: '7', name: 'Finanzas para No Financieros', code: 'FIN-2024-007', endDate: '2023-11-30', participants: 28, otec: 'Instituto Financiero' },
];

// Preguntas estándar por tipo de encuesta
const standardQuestions = {
  satisfaccion: [
    { id: 1, text: '¿Cómo calificaría la calidad general del curso?', type: 'rating' },
    { id: 2, text: '¿El contenido del curso cumplió con sus expectativas?', type: 'rating' },
    { id: 3, text: '¿Cómo evaluaría el desempeño del relator/instructor?', type: 'rating' },
    { id: 4, text: '¿El material didáctico fue útil y de calidad?', type: 'rating' },
    { id: 5, text: '¿Las instalaciones/plataforma fueron adecuadas?', type: 'rating' },
    { id: 6, text: '¿La duración del curso fue apropiada?', type: 'rating' },
    { id: 7, text: '¿Recomendaría este curso a otros compañeros?', type: 'yesno' },
    { id: 8, text: '¿Qué aspectos del curso destacaría positivamente?', type: 'text' },
    { id: 9, text: '¿Qué aspectos del curso mejoraría?', type: 'text' },
    { id: 10, text: 'Comentarios adicionales', type: 'text' },
  ],
  transferencia: [
    { id: 1, text: '¿Ha podido aplicar los conocimientos adquiridos en su puesto de trabajo?', type: 'rating' },
    { id: 2, text: '¿Los contenidos del curso son relevantes para sus funciones actuales?', type: 'rating' },
    { id: 3, text: '¿Ha mejorado su desempeño laboral después del curso?', type: 'rating' },
    { id: 4, text: '¿Ha compartido los conocimientos adquiridos con sus compañeros?', type: 'yesno' },
    { id: 5, text: '¿Su jefatura ha notado mejoras en su desempeño?', type: 'rating' },
    { id: 6, text: '¿Qué conocimientos específicos ha aplicado en su trabajo?', type: 'text' },
    { id: 7, text: '¿Qué barreras ha encontrado para aplicar lo aprendido?', type: 'text' },
    { id: 8, text: '¿Qué apoyo adicional necesitaría para mejorar la transferencia?', type: 'text' },
    { id: 9, text: '¿El curso le ha ayudado a resolver problemas específicos de su trabajo?', type: 'rating' },
    { id: 10, text: 'Sugerencias para mejorar la aplicabilidad del curso', type: 'text' },
  ],
};

// Datos de ejemplo de encuestas
const initialSurveys: Survey[] = [
  {
    id: '1',
    type: 'satisfaccion',
    name: 'Encuesta Satisfacción - Excel Avanzado',
    courseId: '1',
    courseName: 'Excel Avanzado para Análisis de Datos',
    status: 'completed',
    createdAt: '2024-01-11',
    scheduledDate: '2024-01-11',
    reminderEnabled: true,
    reminderDays: 3,
    totalParticipants: 25,
    responses: 22,
    responseRate: 88,
  },
  {
    id: '2',
    type: 'transferencia',
    name: 'Encuesta Transferencia - Liderazgo',
    courseId: '2',
    courseName: 'Liderazgo y Gestión de Equipos',
    status: 'active',
    createdAt: '2024-01-06',
    scheduledDate: '2024-02-05',
    reminderEnabled: true,
    reminderDays: 5,
    totalParticipants: 18,
    responses: 8,
    responseRate: 44,
  },
  {
    id: '3',
    type: 'satisfaccion',
    name: 'Encuesta Satisfacción - Seguridad Industrial',
    courseId: '3',
    courseName: 'Seguridad Industrial Básica',
    status: 'scheduled',
    createdAt: '2023-12-21',
    scheduledDate: '2024-01-20',
    reminderEnabled: false,
    totalParticipants: 30,
    responses: 0,
    responseRate: 0,
  },
];

const Encuestas: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
  const [mainTab, setMainTab] = useState<string>('encuestas');
  const [surveyFilterTab, setSurveyFilterTab] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [surveyType, setSurveyType] = useState<SurveyType>('satisfaccion');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [form] = Form.useForm();

  // Para crear encuesta desde la pestaña de cursos
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [courseToAssign, setCourseToAssign] = useState<CompletedCourse | null>(null);

  const getStatusTag = (status: Survey['status']) => {
    const config = {
      draft: { color: 'default', label: 'Borrador', icon: <FileText className="w-3 h-3" /> },
      scheduled: { color: 'blue', label: 'Programada', icon: <Clock className="w-3 h-3" /> },
      active: { color: 'green', label: 'Activa', icon: <CheckCircle className="w-3 h-3" /> },
      completed: { color: 'purple', label: 'Completada', icon: <CheckCircle className="w-3 h-3" /> },
    };
    const { color, label, icon } = config[status];
    return (
      <Tag color={color} className="flex items-center gap-1 px-2 py-0.5">
        {icon} {label}
      </Tag>
    );
  };

  const getTypeTag = (type: SurveyType) => {
    const config = {
      satisfaccion: { color: '#65BFB1', label: 'Satisfacción' },
      transferencia: { color: '#1e4a5a', label: 'Transferencia' },
    };
    return <Tag color={config[type].color}>{config[type].label}</Tag>;
  };

  // Obtener encuestas asociadas a un curso
  const getSurveysForCourse = (courseId: string) => {
    return surveys.filter(s => s.courseId === courseId);
  };

  // Columnas para la tabla de encuestas (mantenedor)
  const surveyColumns: ColumnsType<Survey> = [
    {
      title: 'Encuesta',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div className="font-medium text-[#1e4a5a]">{name}</div>
          <div className="text-xs text-muted-foreground">{record.courseName}</div>
        </div>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type) => getTypeTag(type),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Programación',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (date, record) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{date || 'Sin programar'}</span>
          {record.reminderEnabled && (
            <Tooltip title={`Recordatorio: ${record.reminderDays} días después`}>
              <Bell className="w-4 h-4 text-[#65BFB1]" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Respuestas',
      key: 'responses',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{record.responses}/{record.totalParticipants}</span>
          <Badge 
            count={`${record.responseRate}%`} 
            style={{ 
              backgroundColor: record.responseRate >= 70 ? '#65BFB1' : record.responseRate >= 40 ? '#faad14' : '#ff4d4f' 
            }} 
          />
        </div>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver encuesta">
            <Button 
              type="text" 
              icon={<Eye className="w-4 h-4" />} 
              onClick={() => handleViewSurvey(record)}
            />
          </Tooltip>
          {record.status === 'draft' && (
            <Tooltip title="Editar">
              <Button type="text" icon={<Edit className="w-4 h-4" />} />
            </Tooltip>
          )}
          <Tooltip title="Eliminar">
            <Popconfirm
              title="¿Eliminar encuesta?"
              description="Esta acción no se puede deshacer."
              onConfirm={() => handleDeleteSurvey(record.id)}
              okText="Eliminar"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button 
                type="text" 
                danger 
                icon={<Trash2 className="w-4 h-4" />} 
              />
            </Popconfirm>
          </Tooltip>
          {record.status === 'scheduled' && (
            <Tooltip title="Enviar ahora">
              <Button 
                type="text" 
                icon={<Send className="w-4 h-4 text-[#65BFB1]" />} 
                onClick={() => handleSendNow(record.id)}
              />
            </Tooltip>
          )}
          {(record.status === 'active' || record.status === 'completed') && (
            <Tooltip title="Ver resultados">
              <Button type="text" icon={<BarChart3 className="w-4 h-4 text-[#65BFB1]" />} />
            </Tooltip>
          )}
          {record.status === 'active' && (
            <Tooltip title="Enviar recordatorio">
              <Button 
                type="text" 
                icon={<Bell className="w-4 h-4 text-orange-500" />} 
                onClick={() => handleSendReminder(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Columnas para la tabla de cursos
  const courseColumns: ColumnsType<CompletedCourse> = [
    {
      title: 'Curso',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div className="font-medium text-[#1e4a5a]">{name}</div>
          <div className="text-xs text-muted-foreground">{record.code}</div>
        </div>
      ),
    },
    {
      title: 'OTEC',
      dataIndex: 'otec',
      key: 'otec',
    },
    {
      title: 'Fecha Término',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{date}</span>
        </div>
      ),
    },
    {
      title: 'Participantes',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{participants}</span>
        </div>
      ),
    },
    {
      title: 'Encuestas Asignadas',
      key: 'surveys',
      render: (_, record) => {
        const courseSurveys = getSurveysForCourse(record.id);
        if (courseSurveys.length === 0) {
          return <Tag color="default">Sin encuestas</Tag>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {courseSurveys.map(s => (
              <Tag key={s.id} color={s.type === 'satisfaccion' ? '#65BFB1' : '#1e4a5a'}>
                {s.type === 'satisfaccion' ? 'Satisfacción' : 'Transferencia'}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => {
        const courseSurveys = getSurveysForCourse(record.id);
        return (
          <Space>
            <Tooltip title="Asignar encuesta">
              <Button 
                type="text" 
                icon={<Plus className="w-4 h-4 text-[#65BFB1]" />} 
                onClick={() => handleOpenAssignModal(record)}
              />
            </Tooltip>
            {courseSurveys.length > 0 && (
              <Tooltip title="Eliminar encuestas del curso">
                <Popconfirm
                  title="¿Eliminar todas las encuestas de este curso?"
                  description={`Se eliminarán ${courseSurveys.length} encuesta(s) asociadas.`}
                  onConfirm={() => handleDeleteCourseSurveys(record.id)}
                  okText="Eliminar"
                  cancelText="Cancelar"
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<Trash2 className="w-4 h-4" />} 
                  />
                </Popconfirm>
              </Tooltip>
            )}
            <Tooltip title="Ver encuestas">
              <Button 
                type="text" 
                icon={<Eye className="w-4 h-4" />} 
                onClick={() => handleViewCourseSurveys(record)}
                disabled={courseSurveys.length === 0}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleViewSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setIsViewModalOpen(true);
  };

  const handleDeleteSurvey = (id: string) => {
    setSurveys(surveys.filter(s => s.id !== id));
    message.success('Encuesta eliminada correctamente');
  };

  const handleDeleteCourseSurveys = (courseId: string) => {
    const count = surveys.filter(s => s.courseId === courseId).length;
    setSurveys(surveys.filter(s => s.courseId !== courseId));
    message.success(`Se eliminaron ${count} encuesta(s) del curso`);
  };

  const handleViewCourseSurveys = (course: CompletedCourse) => {
    const courseSurveys = getSurveysForCourse(course.id);
    if (courseSurveys.length > 0) {
      setSelectedSurvey(courseSurveys[0]);
      setIsViewModalOpen(true);
    }
  };

  const handleOpenAssignModal = (course: CompletedCourse) => {
    setCourseToAssign(course);
    setSelectedCourse(course.id);
    setIsAssignModalOpen(true);
  };

  const handleSendNow = (id: string) => {
    Modal.confirm({
      title: '¿Enviar encuesta ahora?',
      content: 'Se enviará la encuesta a todos los participantes del curso.',
      okText: 'Enviar',
      cancelText: 'Cancelar',
      onOk: () => {
        setSurveys(surveys.map(s => 
          s.id === id ? { ...s, status: 'active' as const } : s
        ));
        message.success('Encuesta enviada a los participantes');
      },
    });
  };

  const handleSendReminder = (id: string) => {
    message.success('Recordatorio enviado a participantes pendientes');
  };

  const handleCreateSurvey = () => {
    form.validateFields().then((values) => {
      const course = completedCoursesData.find(c => c.id === selectedCourse);
      const newSurvey: Survey = {
        id: String(Date.now()),
        type: surveyType,
        name: values.name,
        courseId: selectedCourse,
        courseName: course?.name || '',
        status: values.sendImmediately ? 'active' : 'scheduled',
        createdAt: new Date().toISOString().split('T')[0],
        scheduledDate: values.scheduledDate?.format('YYYY-MM-DD'),
        reminderEnabled: reminderEnabled,
        reminderDays: values.reminderDays,
        totalParticipants: course?.participants || 0,
        responses: 0,
        responseRate: 0,
      };
      setSurveys([newSurvey, ...surveys]);
      setIsCreateModalOpen(false);
      setIsAssignModalOpen(false);
      setCourseToAssign(null);
      form.resetFields();
      setReminderEnabled(false);
      setSelectedCourse('');
      message.success(
        values.sendImmediately 
          ? 'Encuesta creada y enviada a los participantes' 
          : 'Encuesta creada y programada correctamente'
      );
    });
  };

  const filteredSurveys = surveys.filter(s => {
    if (surveyFilterTab === 'all') return true;
    if (surveyFilterTab === 'satisfaccion') return s.type === 'satisfaccion';
    if (surveyFilterTab === 'transferencia') return s.type === 'transferencia';
    return true;
  });

  const surveyStats = {
    total: surveys.length,
    active: surveys.filter(s => s.status === 'active').length,
    scheduled: surveys.filter(s => s.status === 'scheduled').length,
    completed: surveys.filter(s => s.status === 'completed').length,
    avgResponseRate: surveys.length > 0 
      ? Math.round(surveys.reduce((acc, s) => acc + s.responseRate, 0) / surveys.length) 
      : 0,
  };

  // Render del formulario de creación (compartido entre ambos modales)
  const renderSurveyForm = (showCourseSelect: boolean = true) => (
    <Form form={form} layout="vertical" className="mt-4">
      {/* Tipo de Encuesta */}
      <Form.Item label="Tipo de Encuesta" required>
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${surveyType === 'satisfaccion' ? 'border-2 border-[#65BFB1] bg-[#65BFB1]/5' : 'hover:border-[#65BFB1]/50'}`}
            onClick={() => setSurveyType('satisfaccion')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#65BFB1]/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#65BFB1]" />
              </div>
              <div>
                <div className="font-semibold text-[#1e4a5a]">Encuesta de Satisfacción</div>
                <div className="text-xs text-muted-foreground">Evalúa la experiencia del curso</div>
              </div>
            </div>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${surveyType === 'transferencia' ? 'border-2 border-[#1e4a5a] bg-[#1e4a5a]/5' : 'hover:border-[#1e4a5a]/50'}`}
            onClick={() => setSurveyType('transferencia')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1e4a5a]/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#1e4a5a]" />
              </div>
              <div>
                <div className="font-semibold text-[#1e4a5a]">Encuesta de Transferencia</div>
                <div className="text-xs text-muted-foreground">Evalúa la aplicación en el trabajo</div>
              </div>
            </div>
          </Card>
        </div>
      </Form.Item>

      {/* Nombre de la Encuesta */}
      <Form.Item 
        name="name" 
        label="Nombre de la Encuesta" 
        rules={[{ required: true, message: 'Ingrese un nombre' }]}
      >
        <Input placeholder="Ej: Encuesta de satisfacción - Excel Avanzado Enero 2024" />
      </Form.Item>

      {/* Curso Asociado */}
      {showCourseSelect ? (
        <Form.Item label="Curso Finalizado Asociado" required>
          <Select
            placeholder="Seleccione un curso finalizado"
            value={selectedCourse}
            onChange={setSelectedCourse}
            options={completedCoursesData.map(c => ({
              value: c.id,
              label: (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.code} • {c.otec}</div>
                  </div>
                  <Tag color="blue">{c.participants} participantes</Tag>
                </div>
              ),
            }))}
          />
        </Form.Item>
      ) : courseToAssign && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="text-sm font-medium text-[#1e4a5a] mb-1">Curso seleccionado:</div>
          <div className="font-semibold text-[#1e4a5a]">{courseToAssign.name}</div>
          <div className="text-xs text-muted-foreground">{courseToAssign.code} • {courseToAssign.otec} • {courseToAssign.participants} participantes</div>
        </div>
      )}

      {selectedCourse && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="text-sm font-medium text-[#1e4a5a] mb-2">Preguntas estándar incluidas:</div>
          <div className="space-y-1">
            {standardQuestions[surveyType].slice(0, 5).map((q, idx) => (
              <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-[#65BFB1]" />
                {q.text}
              </div>
            ))}
            <div className="text-xs text-[#65BFB1] font-medium mt-2">
              + {standardQuestions[surveyType].length - 5} preguntas más
            </div>
          </div>
        </div>
      )}

      <Divider />

      {/* Programación */}
      <div className="text-sm font-medium text-[#1e4a5a] mb-3">Programación de Envío</div>
      
      <Form.Item name="sendImmediately" valuePropName="checked">
        <Checkbox>Enviar inmediatamente</Checkbox>
      </Form.Item>

      <Form.Item 
        name="scheduledDate" 
        label="Fecha de Envío Programado"
      >
        <DatePicker 
          className="w-full" 
          placeholder="Seleccione fecha"
          format="DD/MM/YYYY"
        />
      </Form.Item>

      {/* Recordatorios */}
      <div className="flex items-center gap-3 mb-3">
        <Switch 
          checked={reminderEnabled} 
          onChange={setReminderEnabled}
        />
        <span className="text-sm">Habilitar recordatorios automáticos</span>
      </div>

      {reminderEnabled && (
        <Form.Item 
          name="reminderDays" 
          label="Enviar recordatorio después de (días)"
        >
          <InputNumber min={1} max={30} defaultValue={3} className="w-full" />
        </Form.Item>
      )}

      <Divider />

      <div className="flex justify-end gap-3">
        <Button onClick={() => {
          setIsCreateModalOpen(false);
          setIsAssignModalOpen(false);
          setCourseToAssign(null);
          form.resetFields();
          setReminderEnabled(false);
          setSelectedCourse('');
        }}>
          Cancelar
        </Button>
        <Button
          type="primary"
          onClick={handleCreateSurvey}
          style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
        >
          Crear Encuesta
        </Button>
      </div>
    </Form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1e4a5a]">Encuestas</h1>
          <p className="text-muted-foreground">
            Gestiona encuestas de satisfacción y transferencia de puesto de trabajo
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
          style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
          size="large"
        >
          Nueva Encuesta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-[#1e4a5a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1e4a5a]/10 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-[#1e4a5a]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1e4a5a]">{surveyStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Encuestas</div>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{surveyStats.active}</div>
              <div className="text-xs text-muted-foreground">Activas</div>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{surveyStats.scheduled}</div>
              <div className="text-xs text-muted-foreground">Programadas</div>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{surveyStats.completed}</div>
              <div className="text-xs text-muted-foreground">Completadas</div>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-[#65BFB1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#65BFB1]/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#65BFB1]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#65BFB1]">{surveyStats.avgResponseRate}%</div>
              <div className="text-xs text-muted-foreground">Tasa Respuesta Prom.</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Card>
        <Tabs
          activeKey={mainTab}
          onChange={setMainTab}
          items={[
            { 
              key: 'encuestas', 
              label: (
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Encuestas Creadas
                </span>
              ),
              children: (
                <div className="space-y-4">
                  <Tabs
                    activeKey={surveyFilterTab}
                    onChange={setSurveyFilterTab}
                    size="small"
                    items={[
                      { key: 'all', label: 'Todas' },
                      { key: 'satisfaccion', label: 'Satisfacción' },
                      { key: 'transferencia', label: 'Transferencia' },
                    ]}
                  />
                  <Table
                    columns={surveyColumns}
                    dataSource={filteredSurveys}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No hay encuestas registradas' }}
                  />
                </div>
              )
            },
            { 
              key: 'cursos', 
              label: (
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Cursos Finalizados
                </span>
              ),
              children: (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Seleccione un curso para asignar o eliminar encuestas asociadas.
                  </div>
                  <Table
                    columns={courseColumns}
                    dataSource={completedCoursesData}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No hay cursos finalizados' }}
                  />
                </div>
              )
            },
          ]}
        />
      </Card>

      {/* Create Survey Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#65BFB1]" />
            <span>Crear Nueva Encuesta</span>
          </div>
        }
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
          setReminderEnabled(false);
          setSelectedCourse('');
        }}
        footer={null}
        width={700}
      >
        {renderSurveyForm(true)}
      </Modal>

      {/* Assign Survey Modal (desde pestaña de cursos) */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#65BFB1]" />
            <span>Asignar Encuesta al Curso</span>
          </div>
        }
        open={isAssignModalOpen}
        onCancel={() => {
          setIsAssignModalOpen(false);
          setCourseToAssign(null);
          form.resetFields();
          setReminderEnabled(false);
          setSelectedCourse('');
        }}
        footer={null}
        width={700}
      >
        {renderSurveyForm(false)}
      </Modal>

      {/* View Survey Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#65BFB1]" />
            <span>Detalle de Encuesta</span>
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedSurvey && (
          <div className="space-y-6 mt-4">
            {/* Survey Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-50">
                <div className="text-xs text-muted-foreground">Nombre</div>
                <div className="font-semibold text-[#1e4a5a]">{selectedSurvey.name}</div>
              </Card>
              <Card className="bg-gray-50">
                <div className="text-xs text-muted-foreground">Tipo</div>
                <div className="mt-1">{getTypeTag(selectedSurvey.type)}</div>
              </Card>
              <Card className="bg-gray-50">
                <div className="text-xs text-muted-foreground">Curso Asociado</div>
                <div className="font-semibold text-[#1e4a5a]">{selectedSurvey.courseName}</div>
              </Card>
              <Card className="bg-gray-50">
                <div className="text-xs text-muted-foreground">Estado</div>
                <div className="mt-1">{getStatusTag(selectedSurvey.status)}</div>
              </Card>
            </div>

            {/* Response Stats */}
            <Card>
              <div className="text-sm font-medium text-[#1e4a5a] mb-4">Estadísticas de Respuesta</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1e4a5a]">{selectedSurvey.totalParticipants}</div>
                  <div className="text-xs text-muted-foreground">Total Participantes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#65BFB1]">{selectedSurvey.responses}</div>
                  <div className="text-xs text-muted-foreground">Respuestas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{selectedSurvey.responseRate}%</div>
                  <div className="text-xs text-muted-foreground">Tasa de Respuesta</div>
                </div>
              </div>
            </Card>

            {/* Questions Preview */}
            <Card>
              <div className="text-sm font-medium text-[#1e4a5a] mb-4">Preguntas de la Encuesta</div>
              <div className="space-y-3">
                {standardQuestions[selectedSurvey.type].map((q, idx) => (
                  <div key={q.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-[#65BFB1] text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-[#1e4a5a]">{q.text}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Tipo: {q.type === 'rating' ? 'Escala 1-5' : q.type === 'yesno' ? 'Sí/No' : 'Respuesta abierta'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button onClick={() => setIsViewModalOpen(false)}>
                Cerrar
              </Button>
              {selectedSurvey.status === 'active' && (
                <Button
                  icon={<Bell className="w-4 h-4" />}
                  onClick={() => {
                    handleSendReminder(selectedSurvey.id);
                    setIsViewModalOpen(false);
                  }}
                >
                  Enviar Recordatorio
                </Button>
              )}
              {(selectedSurvey.status === 'active' || selectedSurvey.status === 'completed') && (
                <Button
                  type="primary"
                  icon={<BarChart3 className="w-4 h-4" />}
                  style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
                >
                  Ver Resultados
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Encuestas;
