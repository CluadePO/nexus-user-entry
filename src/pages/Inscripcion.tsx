import React, { useState } from 'react';
import { Card, Steps, Button, Select, Radio, Input, DatePicker, Upload, Table, Checkbox, message, Tag, Divider, InputNumber, Space, Typography, Alert, Progress } from 'antd';
import { UploadOutlined, FileExcelOutlined, FilePdfOutlined, CheckCircleOutlined, InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock data for companies
const mockCompanies = [
  { id: '1', name: 'Empresa ABC', rut: '76.123.456-7' },
  { id: '2', name: 'Empresa XYZ', rut: '77.234.567-8' },
  { id: '3', name: 'Empresa DEF', rut: '78.345.678-9' },
];

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
  maxParticipants: 25,
  maxImputValue: 180000,
  effectiveValuePerParticipant: 150000,
  totalHours: 40,
  franchiseType: 'Franquicia Tributaria',
};

const Inscripcion: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
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
  const [scheduledHours, setScheduledHours] = useState(0);
  const [participants, setParticipants] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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

  const calculateRemainingHours = () => {
    return Math.max(0, mockSenceValidation.totalHours - scheduledHours);
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

  const renderStep2 = () => (
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
              <Text className="text-muted-foreground block text-xs">Horas Totales</Text>
              <Title level={4} className="!mb-0 !mt-1">{calculateTotalHours()}</Title>
            </div>
            <div className="text-center">
              <Text className="text-muted-foreground block text-xs">Horas Ingresadas</Text>
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
            <Text className="text-muted-foreground block mb-2">Configurar jornadas</Text>
            <Button icon={<CalendarOutlined />} onClick={() => {
              setScheduledHours(mockSenceValidation.totalHours);
              message.info('Jornadas configuradas automáticamente');
            }}>
              Configurar Calendario de Jornadas
            </Button>
          </div>
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
    </div>
  );

  const renderComplete = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircleOutlined className="text-4xl text-green-600" />
      </div>
      <Title level={2}>¡Inscripción Completada!</Title>
      <Text className="text-muted-foreground block mb-6">
        El curso ha sido inscrito exitosamente. Se ha generado la solicitud de compra.
      </Text>
      
      <Card className="max-w-md mx-auto text-left">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Text className="text-muted-foreground">Empresa:</Text>
            <Text strong>{mockCompanies.find(c => c.id === selectedCompany)?.name}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-muted-foreground">Curso:</Text>
            <Text strong>{mockSenceValidation.courseName}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-muted-foreground">Participantes:</Text>
            <Text strong>{participants.length}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-muted-foreground">Valor Total:</Text>
            <Text strong className="text-primary">{formatCurrency(calculateFranchiseValue())}</Text>
          </div>
          <Divider />
          <Button type="primary" icon={<FilePdfOutlined />} block size="large">
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
          setScheduledHours(0);
          setParticipants([]);
          setSelectedAccount(null);
        }}
      >
        Inscribir otro curso
      </Button>
    </div>
  );

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
