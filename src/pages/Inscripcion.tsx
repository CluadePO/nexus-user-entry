import React, { useState, useRef } from 'react';
import { Card, Steps, Button, Select, Radio, Input, DatePicker, Upload, Table, Checkbox, message, Tag, Divider, InputNumber, Space, Typography, Alert, Progress, TimePicker, Modal } from 'antd';
import { UploadOutlined, FileExcelOutlined, FilePdfOutlined, CheckCircleOutlined, InfoCircleOutlined, CalendarOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock data for companies
const mockCompanies = [
  { id: '1', name: 'Empresa ABC', rut: '76.123.456-7', address: 'Av. Providencia 1234, Santiago', representante: 'Carlos Mendoza', email: 'contacto@empresaabc.cl' },
  { id: '2', name: 'Empresa XYZ', rut: '77.234.567-8', address: 'Calle Los Leones 567, Las Condes', representante: 'María González', email: 'info@empresaxyz.cl' },
  { id: '3', name: 'Empresa DEF', rut: '78.345.678-9', address: 'Av. Apoquindo 890, Vitacura', representante: 'Pedro Soto', email: 'admin@empresadef.cl' },
];

// Mock OTIC data
const mockOticData = {
  name: 'OTIC Capacitación Nacional',
  rut: '96.123.456-7',
  address: 'Av. Libertador Bernardo O\'Higgins 1234, Santiago',
  phone: '+56 2 2345 6789',
  email: 'contacto@oticcapacitacion.cl',
  representante: 'Roberto Fernández',
};

// Mock financing accounts
const mockFinancingAccounts = [
  { id: '1', name: 'Cuenta Principal', balance: 45000000 },
  { id: '2', name: 'Cuenta Secundaria', balance: 12000000 },
  { id: '3', name: 'Cuenta Proyecto Especial', balance: 8500000 },
];

// Mock SENCE course data
const mockSenceValidation = {
  courseName: 'Técnicas de Gestión Empresarial',
  otecName: 'OTEC Formación Continua Ltda.',
  otecRut: '76.987.654-3',
  otecAddress: 'Av. Providencia 2345, Providencia',
  maxParticipants: 25,
  maxImputValue: 180000,
  effectiveValuePerParticipant: 150000,
  totalHours: 40,
  franchiseType: 'Franquicia Tributaria',
  modalidad: 'Presencial',
  senceCode: '12345678',
};

// Days of week configuration
interface DaySchedule {
  enabled: boolean;
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
}

interface WeekSchedule {
  lunes: DaySchedule;
  martes: DaySchedule;
  miercoles: DaySchedule;
  jueves: DaySchedule;
  viernes: DaySchedule;
  sabado: DaySchedule;
  domingo: DaySchedule;
}

const initialWeekSchedule: WeekSchedule = {
  lunes: { enabled: false, startTime: null, endTime: null },
  martes: { enabled: false, startTime: null, endTime: null },
  miercoles: { enabled: false, startTime: null, endTime: null },
  jueves: { enabled: false, startTime: null, endTime: null },
  viernes: { enabled: false, startTime: null, endTime: null },
  sabado: { enabled: false, startTime: null, endTime: null },
  domingo: { enabled: false, startTime: null, endTime: null },
};

const dayLabels: Record<keyof WeekSchedule, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

const Inscripcion: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const pdfRef = useRef<HTMLDivElement>(null);
  
  // Step 1 states
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [franchiseType, setFranchiseType] = useState<'franquicia' | 'no_franquicia' | null>(null);
  const [contractType, setContractType] = useState<string | null>(null);
  const [senceCode, setSenceCode] = useState('');
  const [senceValidated, setSenceValidated] = useState(false);
  const [agreedValue, setAgreedValue] = useState<number | null>(null);
  const [bipartiteCommittee, setBipartiteCommittee] = useState(false);
  
  // Step 2 states
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>(initialWeekSchedule);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const validateSenceCode = () => {
    if (senceCode.length >= 8) {
      setSenceValidated(true);
      message.success('Código SENCE validado correctamente');
    } else {
      message.error('El código SENCE debe tener al menos 8 caracteres');
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xlsx,.xls',
    beforeUpload: (file) => {
      // Simulate Excel file processing
      const mockParticipants = [
        { key: '1', rut: '12.345.678-9', name: 'Juan Pérez', email: 'juan@email.com', position: 'Analista' },
        { key: '2', rut: '13.456.789-0', name: 'María García', email: 'maria@email.com', position: 'Supervisor' },
        { key: '3', rut: '14.567.890-1', name: 'Carlos López', email: 'carlos@email.com', position: 'Coordinador' },
        { key: '4', rut: '15.678.901-2', name: 'Ana Martínez', email: 'ana@email.com', position: 'Ejecutivo' },
        { key: '5', rut: '16.789.012-3', name: 'Pedro Sánchez', email: 'pedro@email.com', position: 'Asistente' },
      ];
      setParticipants(mockParticipants);
      message.success(`${file.name} cargado exitosamente - 5 participantes encontrados`);
      return false;
    },
  };

  const participantColumns = [
    { title: 'RUT', dataIndex: 'rut', key: 'rut' },
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Cargo', dataIndex: 'position', key: 'position' },
  ];

  const calculateFranchiseValue = () => {
    if (!senceValidated || participants.length === 0) return 0;
    return participants.length * (agreedValue || mockSenceValidation.effectiveValuePerParticipant);
  };

  const calculateTotalHours = () => {
    return mockSenceValidation.totalHours;
  };

  const calculateScheduledHours = () => {
    let totalMinutes = 0;
    Object.values(weekSchedule).forEach(day => {
      if (day.enabled && day.startTime && day.endTime) {
        const start = day.startTime;
        const end = day.endTime;
        const diff = end.diff(start, 'minute');
        if (diff > 0) totalMinutes += diff;
      }
    });
    
    // Calculate weeks in range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const weeks = Math.ceil(dateRange[1].diff(dateRange[0], 'day') / 7);
      return Math.round((totalMinutes * weeks) / 60);
    }
    return Math.round(totalMinutes / 60);
  };

  const calculateRemainingHours = () => {
    return Math.max(0, mockSenceValidation.totalHours - calculateScheduledHours());
  };

  const updateDaySchedule = (day: keyof WeekSchedule, field: keyof DaySchedule, value: any) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      }
    }));
  };

  const getEnabledDays = () => {
    return Object.entries(weekSchedule)
      .filter(([_, schedule]) => schedule.enabled && schedule.startTime && schedule.endTime)
      .map(([day, schedule]) => ({
        day: dayLabels[day as keyof WeekSchedule],
        startTime: schedule.startTime?.format('HH:mm'),
        endTime: schedule.endTime?.format('HH:mm'),
        hours: schedule.endTime && schedule.startTime 
          ? Math.round(schedule.endTime.diff(schedule.startTime, 'minute') / 60 * 10) / 10
          : 0,
      }));
  };

  const generatePDF = () => {
    const company = mockCompanies.find(c => c.id === selectedCompany);
    const account = mockFinancingAccounts.find(a => a.id === selectedAccount);
    const enabledDays = getEnabledDays();
    
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Solicitud de Compra - ${mockSenceValidation.courseName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; font-size: 12px; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1890ff; padding-bottom: 20px; }
    .header h1 { color: #1890ff; margin: 0; font-size: 24px; }
    .header p { color: #666; margin: 5px 0 0; }
    .section { margin-bottom: 25px; }
    .section-title { background: #f0f5ff; padding: 10px 15px; font-weight: bold; color: #1890ff; margin-bottom: 15px; border-left: 4px solid #1890ff; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 15px; }
    .info-item { margin-bottom: 8px; }
    .info-label { color: #666; font-size: 11px; }
    .info-value { font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 10px; border-top: 1px solid #eee; padding-top: 20px; }
    .total-row { background: #e6f7ff; font-weight: bold; }
    .schedule-table { margin-top: 10px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 60px; }
    .signature-box { text-align: center; width: 200px; }
    .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>SOLICITUD DE COMPRA</h1>
    <p>Inscripción de Curso SENCE</p>
    <p style="margin-top: 10px;">Folio: SC-${Date.now().toString().slice(-8)} | Fecha: ${dayjs().format('DD/MM/YYYY HH:mm')}</p>
  </div>

  <div class="section">
    <div class="section-title">DATOS DEL OTIC</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Razón Social:</span><br><span class="info-value">${mockOticData.name}</span></div>
      <div class="info-item"><span class="info-label">RUT:</span><br><span class="info-value">${mockOticData.rut}</span></div>
      <div class="info-item"><span class="info-label">Dirección:</span><br><span class="info-value">${mockOticData.address}</span></div>
      <div class="info-item"><span class="info-label">Email:</span><br><span class="info-value">${mockOticData.email}</span></div>
      <div class="info-item"><span class="info-label">Representante Legal:</span><br><span class="info-value">${mockOticData.representante}</span></div>
      <div class="info-item"><span class="info-label">Teléfono:</span><br><span class="info-value">${mockOticData.phone}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">DATOS DE LA EMPRESA</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Razón Social:</span><br><span class="info-value">${company?.name}</span></div>
      <div class="info-item"><span class="info-label">RUT:</span><br><span class="info-value">${company?.rut}</span></div>
      <div class="info-item"><span class="info-label">Dirección:</span><br><span class="info-value">${company?.address}</span></div>
      <div class="info-item"><span class="info-label">Email:</span><br><span class="info-value">${company?.email}</span></div>
      <div class="info-item"><span class="info-label">Representante:</span><br><span class="info-value">${company?.representante}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">DATOS DEL OTEC</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Razón Social:</span><br><span class="info-value">${mockSenceValidation.otecName}</span></div>
      <div class="info-item"><span class="info-label">RUT:</span><br><span class="info-value">${mockSenceValidation.otecRut}</span></div>
      <div class="info-item"><span class="info-label">Dirección:</span><br><span class="info-value">${mockSenceValidation.otecAddress}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">DATOS DEL CURSO</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Nombre del Curso:</span><br><span class="info-value">${mockSenceValidation.courseName}</span></div>
      <div class="info-item"><span class="info-label">Código SENCE:</span><br><span class="info-value">${senceCode}</span></div>
      <div class="info-item"><span class="info-label">Tipo de Franquicia:</span><br><span class="info-value">${franchiseType === 'franquicia' ? 'Franquicia Tributaria' : 'Sin Franquicia'}</span></div>
      <div class="info-item"><span class="info-label">Tipo de Contrato:</span><br><span class="info-value">${contractType ? contractType.charAt(0).toUpperCase() + contractType.slice(1) : 'N/A'}</span></div>
      <div class="info-item"><span class="info-label">Modalidad:</span><br><span class="info-value">${mockSenceValidation.modalidad}</span></div>
      <div class="info-item"><span class="info-label">Horas Totales:</span><br><span class="info-value">${mockSenceValidation.totalHours} horas</span></div>
      <div class="info-item"><span class="info-label">Fecha Inicio:</span><br><span class="info-value">${dateRange?.[0]?.format('DD/MM/YYYY')}</span></div>
      <div class="info-item"><span class="info-label">Fecha Término:</span><br><span class="info-value">${dateRange?.[1]?.format('DD/MM/YYYY')}</span></div>
      <div class="info-item"><span class="info-label">Comité Bipartito:</span><br><span class="info-value">${bipartiteCommittee ? 'Sí' : 'No'}</span></div>
    </div>
    
    ${enabledDays.length > 0 ? `
    <div style="padding: 0 15px; margin-top: 15px;">
      <strong>Jornadas Programadas:</strong>
      <table class="schedule-table">
        <thead>
          <tr><th>Día</th><th>Hora Inicio</th><th>Hora Término</th><th>Horas</th></tr>
        </thead>
        <tbody>
          ${enabledDays.map(d => `<tr><td>${d.day}</td><td>${d.startTime}</td><td>${d.endTime}</td><td>${d.hours} hrs</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}
  </div>

  <div class="section">
    <div class="section-title">PARTICIPANTES (${participants.length})</div>
    <table>
      <thead>
        <tr><th>#</th><th>RUT</th><th>Nombre</th><th>Email</th><th>Cargo</th></tr>
      </thead>
      <tbody>
        ${participants.map((p, i) => `<tr><td>${i + 1}</td><td>${p.rut}</td><td>${p.name}</td><td>${p.email}</td><td>${p.position}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">RESUMEN FINANCIERO</div>
    <table>
      <thead>
        <tr><th>Concepto</th><th>Valor</th></tr>
      </thead>
      <tbody>
        <tr><td>Valor acordado por participante</td><td>${formatCurrency(agreedValue || 0)}</td></tr>
        <tr><td>Cantidad de participantes</td><td>${participants.length}</td></tr>
        <tr class="total-row"><td>VALOR TOTAL FRANQUICIA</td><td>${formatCurrency(calculateFranchiseValue())}</td></tr>
        <tr><td>Cuenta de Financiamiento</td><td>${account?.name}</td></tr>
        <tr><td>Saldo Disponible</td><td>${formatCurrency(account?.balance || 0)}</td></tr>
        <tr><td>Saldo Posterior</td><td>${formatCurrency((account?.balance || 0) - calculateFranchiseValue())}</td></tr>
      </tbody>
    </table>
  </div>

  <div class="signatures">
    <div class="signature-box">
      <div class="signature-line">Representante Empresa</div>
      <p>${company?.representante}</p>
    </div>
    <div class="signature-box">
      <div class="signature-line">Representante OTIC</div>
      <p>${mockOticData.representante}</p>
    </div>
  </div>

  <div class="footer">
    <p>Documento generado automáticamente por Sistema de Gestión OTIC</p>
    <p>${dayjs().format('DD/MM/YYYY HH:mm:ss')} | ${mockOticData.name}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const canProceedStep1 = () => {
    if (!selectedCompany) return false;
    if (!franchiseType) return false;
    if (franchiseType === 'franquicia' && !contractType) return false;
    if (!senceValidated) return false;
    if (!agreedValue || agreedValue <= 0) return false;
    return true;
  };

  const canProceedStep2 = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return false;
    if (participants.length === 0) return false;
    if (!selectedAccount) return false;
    return true;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      message.success('¡Curso inscrito exitosamente! Generando PDF...');
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Company Selection */}
      <Card title="Selección de Empresa" size="small" className="shadow-sm">
        <div className="mb-4">
          <Text className="text-muted-foreground mb-2 block">Seleccione la empresa para la inscripción del curso</Text>
          <Select
            placeholder="Seleccionar empresa"
            className="w-full"
            size="large"
            value={selectedCompany}
            onChange={setSelectedCompany}
            options={mockCompanies.map(c => ({
              value: c.id,
              label: (
                <div className="flex justify-between items-center">
                  <span>{c.name}</span>
                  <Tag color="blue">{c.rut}</Tag>
                </div>
              ),
            }))}
          />
        </div>
      </Card>

      {/* Franchise Type */}
      {selectedCompany && (
        <Card title="Tipo de Franquicia" size="small" className="shadow-sm">
          <Radio.Group 
            value={franchiseType} 
            onChange={(e) => {
              setFranchiseType(e.target.value);
              setContractType(null);
            }}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              <Radio value="franquicia" className="p-3 border rounded-lg w-full hover:bg-muted/50">
                <div>
                  <Text strong>Franquicia Tributaria</Text>
                  <Text className="text-muted-foreground block text-sm">Curso con beneficio tributario SENCE</Text>
                </div>
              </Radio>
              <Radio value="no_franquicia" className="p-3 border rounded-lg w-full hover:bg-muted/50">
                <div>
                  <Text strong>Sin Franquicia</Text>
                  <Text className="text-muted-foreground block text-sm">Curso sin beneficio tributario</Text>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Card>
      )}

      {/* Contract Type - Only if Franchise */}
      {franchiseType === 'franquicia' && (
        <Card title="Tipo de Contrato" size="small" className="shadow-sm">
          <Radio.Group 
            value={contractType} 
            onChange={(e) => setContractType(e.target.value)}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              <Radio value="normal" className="p-3 border rounded-lg w-full hover:bg-muted/50">
                <div>
                  <Text strong>Normal</Text>
                  <Text className="text-muted-foreground block text-sm">Contrato estándar de capacitación</Text>
                </div>
              </Radio>
              <Radio value="precontrato" className="p-3 border rounded-lg w-full hover:bg-muted/50">
                <div>
                  <Text strong>Precontrato</Text>
                  <Text className="text-muted-foreground block text-sm">Capacitación previo al contrato laboral</Text>
                </div>
              </Radio>
              <Radio value="postcontrato" className="p-3 border rounded-lg w-full hover:bg-muted/50">
                <div>
                  <Text strong>Postcontrato</Text>
                  <Text className="text-muted-foreground block text-sm">Capacitación posterior al término del contrato</Text>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Card>
      )}

      {/* SENCE Code Validation */}
      {((franchiseType === 'franquicia' && contractType) || franchiseType === 'no_franquicia') && (
        <Card title="Validación Código SENCE" size="small" className="shadow-sm">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Ingrese código SENCE"
                size="large"
                value={senceCode}
                onChange={(e) => {
                  setSenceCode(e.target.value);
                  setSenceValidated(false);
                }}
                className="flex-1"
              />
              <Button 
                type="primary" 
                size="large" 
                onClick={validateSenceCode}
                disabled={senceCode.length < 8}
              >
                Validar
              </Button>
            </div>

            {senceValidated && (
              <Alert
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                message="Código SENCE Validado"
                description={
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <Text className="text-muted-foreground block text-xs">Nombre del Curso</Text>
                      <Text strong>{mockSenceValidation.courseName}</Text>
                    </div>
                    <div>
                      <Text className="text-muted-foreground block text-xs">OTEC</Text>
                      <Text strong>{mockSenceValidation.otecName}</Text>
                    </div>
                    <div>
                      <Text className="text-muted-foreground block text-xs">Máximo Participantes</Text>
                      <Text strong>{mockSenceValidation.maxParticipants}</Text>
                    </div>
                    <div>
                      <Text className="text-muted-foreground block text-xs">Valor Máximo Imputable</Text>
                      <Text strong>{formatCurrency(mockSenceValidation.maxImputValue)}</Text>
                    </div>
                    <div>
                      <Text className="text-muted-foreground block text-xs">Valor Efectivo x Participante</Text>
                      <Text strong>{formatCurrency(mockSenceValidation.effectiveValuePerParticipant)}</Text>
                    </div>
                    <div>
                      <Text className="text-muted-foreground block text-xs">Horas Totales</Text>
                      <Text strong>{mockSenceValidation.totalHours} hrs</Text>
                    </div>
                    <div>
                      <Text className="text-muted-foreground block text-xs">Tipo de Franquicia</Text>
                      <Text strong>{mockSenceValidation.franchiseType}</Text>
                    </div>
                  </div>
                }
              />
            )}
          </div>
        </Card>
      )}

      {/* Agreed Value & Bipartite Committee */}
      {senceValidated && (
        <Card title="Configuración del Curso" size="small" className="shadow-sm">
          <div className="space-y-4">
            <div>
              <Text className="text-muted-foreground block mb-2">Valor acordado por participante</Text>
              <InputNumber
                size="large"
                className="w-full"
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(value) => Number(value!.replace(/\$\s?|(\.*)/g, '')) || 0}
                value={agreedValue}
                onChange={(value) => setAgreedValue(value)}
                placeholder="Ingrese el valor acordado"
                max={mockSenceValidation.maxImputValue}
              />
              <Text className="text-xs text-muted-foreground mt-1">
                Valor máximo imputable: {formatCurrency(mockSenceValidation.maxImputValue)}
              </Text>
            </div>
            <Divider />
            <Checkbox 
              checked={bipartiteCommittee} 
              onChange={(e) => setBipartiteCommittee(e.target.checked)}
            >
              <div>
                <Text strong>Activar Comité Bipartito</Text>
                <Text className="text-muted-foreground block text-sm">
                  Habilitar la participación del comité bipartito para este curso
                </Text>
              </div>
            </Checkbox>
          </div>
        </Card>
      )}
    </div>
  );

  const renderScheduleModal = () => (
    <Modal
      title="Configurar Jornadas Semanales"
      open={showScheduleModal}
      onOk={() => setShowScheduleModal(false)}
      onCancel={() => setShowScheduleModal(false)}
      width={600}
      okText="Guardar Configuración"
      cancelText="Cancelar"
    >
      <div className="space-y-4 py-4">
        <Alert
          type="info"
          message="Seleccione los días y horarios en que se realizará el curso"
          className="mb-4"
        />
        
        {(Object.keys(weekSchedule) as Array<keyof WeekSchedule>).map(day => (
          <div key={day} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
            <Checkbox
              checked={weekSchedule[day].enabled}
              onChange={(e) => updateDaySchedule(day, 'enabled', e.target.checked)}
              className="min-w-[100px]"
            >
              <Text strong>{dayLabels[day]}</Text>
            </Checkbox>
            
            {weekSchedule[day].enabled && (
              <div className="flex items-center gap-2 flex-1">
                <TimePicker
                  value={weekSchedule[day].startTime}
                  onChange={(time) => updateDaySchedule(day, 'startTime', time)}
                  format="HH:mm"
                  placeholder="Inicio"
                  className="flex-1"
                />
                <Text className="text-muted-foreground">a</Text>
                <TimePicker
                  value={weekSchedule[day].endTime}
                  onChange={(time) => updateDaySchedule(day, 'endTime', time)}
                  format="HH:mm"
                  placeholder="Término"
                  className="flex-1"
                />
                {weekSchedule[day].startTime && weekSchedule[day].endTime && (
                  <Tag color="blue">
                    {Math.round(weekSchedule[day].endTime!.diff(weekSchedule[day].startTime!, 'minute') / 60 * 10) / 10} hrs
                  </Tag>
                )}
              </div>
            )}
          </div>
        ))}
        
        <Divider />
        
        <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
          <Text>Total horas semanales:</Text>
          <Text strong className="text-lg">
            {Object.values(weekSchedule).reduce((acc, day) => {
              if (day.enabled && day.startTime && day.endTime) {
                return acc + Math.round(day.endTime.diff(day.startTime, 'minute') / 60 * 10) / 10;
              }
              return acc;
            }, 0)} hrs
          </Text>
        </div>
      </div>
    </Modal>
  );

  const renderStep2 = () => {
    const enabledDays = getEnabledDays();
    const scheduledHours = calculateScheduledHours();
    
    return (
      <div className="space-y-6">
        {/* Course Schedule */}
        <Card title="Fechas y Horarios del Curso" size="small" className="shadow-sm">
          <div className="space-y-4">
            <div>
              <Text className="text-muted-foreground block mb-2">Fecha de inicio y fin del curso</Text>
              <RangePicker
                size="large"
                className="w-full"
                format="DD/MM/YYYY"
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                placeholder={['Fecha inicio', 'Fecha fin']}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <Text className="text-muted-foreground block text-xs">Horas Totales Requeridas</Text>
                <Title level={4} className="!mb-0 !mt-1">{calculateTotalHours()}</Title>
              </div>
              <div className="text-center">
                <Text className="text-muted-foreground block text-xs">Horas Programadas</Text>
                <Title level={4} className="!mb-0 !mt-1 !text-primary">{scheduledHours}</Title>
              </div>
              <div className="text-center">
                <Text className="text-muted-foreground block text-xs">Horas Faltantes</Text>
                <Title level={4} className={`!mb-0 !mt-1 ${calculateRemainingHours() > 0 ? '!text-orange-500' : '!text-green-500'}`}>
                  {calculateRemainingHours()}
                </Title>
              </div>
            </div>

            <div>
              <Text className="text-muted-foreground block mb-2">Configurar días y horarios de las jornadas</Text>
              <Button type="primary" ghost icon={<CalendarOutlined />} onClick={() => setShowScheduleModal(true)}>
                Configurar Jornadas Semanales
              </Button>
            </div>

            {/* Display configured schedule */}
            {enabledDays.length > 0 && (
              <div className="mt-4">
                <Text strong className="block mb-2">Jornadas Configuradas:</Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {enabledDays.map(dayInfo => (
                    <div key={dayInfo.day} className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <ClockCircleOutlined className="text-blue-500" />
                      <Text strong>{dayInfo.day}</Text>
                      <Text className="text-muted-foreground">
                        {dayInfo.startTime} - {dayInfo.endTime}
                      </Text>
                      <Tag color="blue" className="ml-auto">{dayInfo.hours} hrs</Tag>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

      {/* Participants Upload */}
      <Card title="Carga de Participantes" size="small" className="shadow-sm">
        <div className="space-y-4">
          <Upload {...uploadProps}>
            <Button icon={<FileExcelOutlined />} size="large">
              Cargar archivo Excel de participantes
            </Button>
          </Upload>
          <Text className="text-muted-foreground text-sm">
            Formato esperado: RUT, Nombre, Email, Cargo
          </Text>

          {participants.length > 0 && (
            <>
              <Divider />
              <div className="flex justify-between items-center mb-3">
                <Text strong>Participantes cargados: {participants.length}</Text>
                <Tag color="green" className="text-base px-3 py-1">
                  Valor Franquicia: {formatCurrency(calculateFranchiseValue())}
                </Tag>
              </div>
              <Table 
                dataSource={participants} 
                columns={participantColumns} 
                size="small"
                pagination={false}
              />
            </>
          )}
        </div>
      </Card>

      {/* Financing Account */}
      {participants.length > 0 && (
        <Card title="Cuenta de Financiamiento" size="small" className="shadow-sm">
          <div className="space-y-4">
            <Select
              placeholder="Seleccionar cuenta de financiamiento"
              className="w-full"
              size="large"
              value={selectedAccount}
              onChange={setSelectedAccount}
              options={mockFinancingAccounts.map(acc => ({
                value: acc.id,
                label: (
                  <div className="flex justify-between items-center">
                    <span>{acc.name}</span>
                    <Tag color={acc.balance >= calculateFranchiseValue() ? 'green' : 'red'}>
                      Saldo: {formatCurrency(acc.balance)}
                    </Tag>
                  </div>
                ),
              }))}
            />
            {selectedAccount && (
              <Alert
                type="info"
                showIcon
                message="Resumen de la transacción"
                description={
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Text>Valor total a imputar:</Text>
                    <Text strong>{formatCurrency(calculateFranchiseValue())}</Text>
                    <Text>Saldo disponible:</Text>
                    <Text strong>
                      {formatCurrency(mockFinancingAccounts.find(a => a.id === selectedAccount)?.balance || 0)}
                    </Text>
                    <Text>Saldo posterior:</Text>
                    <Text strong className="text-green-600">
                      {formatCurrency((mockFinancingAccounts.find(a => a.id === selectedAccount)?.balance || 0) - calculateFranchiseValue())}
                    </Text>
                  </div>
                }
              />
            )}
          </div>
        </Card>
      )}

      {renderScheduleModal()}
    </div>
  );
};

  const renderComplete = () => {
    const company = mockCompanies.find(c => c.id === selectedCompany);
    const account = mockFinancingAccounts.find(a => a.id === selectedAccount);
    const enabledDays = getEnabledDays();

    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircleOutlined className="text-4xl text-green-600" />
        </div>
        <Title level={2}>¡Inscripción Completada!</Title>
        <Text className="text-muted-foreground block mb-6">
          El curso ha sido inscrito exitosamente. Puede descargar la solicitud de compra en formato PDF.
        </Text>
        
        <Card className="max-w-2xl mx-auto text-left">
          <div className="space-y-4">
            {/* OTIC Info */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <Text strong className="text-blue-700 block mb-2">Datos del OTIC</Text>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><Text className="text-muted-foreground">Razón Social:</Text> <Text strong>{mockOticData.name}</Text></div>
                <div><Text className="text-muted-foreground">RUT:</Text> <Text strong>{mockOticData.rut}</Text></div>
              </div>
            </div>

            {/* Company Info */}
            <div className="p-3 bg-green-50 rounded-lg">
              <Text strong className="text-green-700 block mb-2">Datos de la Empresa</Text>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><Text className="text-muted-foreground">Razón Social:</Text> <Text strong>{company?.name}</Text></div>
                <div><Text className="text-muted-foreground">RUT:</Text> <Text strong>{company?.rut}</Text></div>
                <div><Text className="text-muted-foreground">Representante:</Text> <Text strong>{company?.representante}</Text></div>
              </div>
            </div>

            {/* Course Info */}
            <div className="p-3 bg-purple-50 rounded-lg">
              <Text strong className="text-purple-700 block mb-2">Datos del Curso</Text>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><Text className="text-muted-foreground">Curso:</Text> <Text strong>{mockSenceValidation.courseName}</Text></div>
                <div><Text className="text-muted-foreground">Código SENCE:</Text> <Text strong>{senceCode}</Text></div>
                <div><Text className="text-muted-foreground">OTEC:</Text> <Text strong>{mockSenceValidation.otecName}</Text></div>
                <div><Text className="text-muted-foreground">Horas:</Text> <Text strong>{mockSenceValidation.totalHours} hrs</Text></div>
                <div><Text className="text-muted-foreground">Fechas:</Text> <Text strong>{dateRange?.[0]?.format('DD/MM/YYYY')} - {dateRange?.[1]?.format('DD/MM/YYYY')}</Text></div>
                <div><Text className="text-muted-foreground">Participantes:</Text> <Text strong>{participants.length}</Text></div>
              </div>
              
              {enabledDays.length > 0 && (
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <Text className="text-muted-foreground text-sm">Jornadas: </Text>
                  {enabledDays.map(d => (
                    <Tag key={d.day} color="purple" className="mb-1">{d.day} {d.startTime}-{d.endTime}</Tag>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="p-3 bg-orange-50 rounded-lg">
              <Text strong className="text-orange-700 block mb-2">Resumen Financiero</Text>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><Text className="text-muted-foreground">Valor por participante:</Text> <Text strong>{formatCurrency(agreedValue || 0)}</Text></div>
                <div><Text className="text-muted-foreground">Valor Total:</Text> <Text strong className="text-primary">{formatCurrency(calculateFranchiseValue())}</Text></div>
                <div><Text className="text-muted-foreground">Cuenta:</Text> <Text strong>{account?.name}</Text></div>
                <div><Text className="text-muted-foreground">Saldo posterior:</Text> <Text strong>{formatCurrency((account?.balance || 0) - calculateFranchiseValue())}</Text></div>
              </div>
            </div>

            <Divider />
            
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              block 
              size="large"
              onClick={generatePDF}
            >
              Descargar Solicitud de Compra (PDF)
            </Button>
          </div>
        </Card>

        <Button 
          className="mt-6" 
          onClick={() => {
            setCurrentStep(0);
            setIsComplete(false);
            setSelectedCompany(null);
            setFranchiseType(null);
            setContractType(null);
            setSenceCode('');
            setSenceValidated(false);
            setAgreedValue(null);
            setBipartiteCommittee(false);
            setDateRange(null);
            setWeekSchedule(initialWeekSchedule);
            setParticipants([]);
            setSelectedAccount(null);
          }}
        >
          Inscribir otro curso
        </Button>
      </div>
    );
  };

  if (isComplete) {
    return (
      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          {renderComplete()}
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Title level={3} className="mb-6">Inscripción de Cursos</Title>
        
        <Steps
          current={currentStep}
          className="mb-8"
          items={[
            {
              title: 'Configuración',
              description: 'Empresa, franquicia y código SENCE',
            },
            {
              title: 'Ejecución y Financiamiento',
              description: 'Fechas, participantes y cuenta',
            },
          ]}
        />

        <Card>
          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && renderStep2()}

          <Divider />

          <div className="flex justify-between">
            <Button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(0)}
            >
              Anterior
            </Button>
            
            {currentStep === 0 ? (
              <Button 
                type="primary" 
                disabled={!canProceedStep1()}
                onClick={() => setCurrentStep(1)}
              >
                Siguiente
              </Button>
            ) : (
              <Button 
                type="primary" 
                disabled={!canProceedStep2()}
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Inscribir Curso y Generar PDF
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Inscripcion;
