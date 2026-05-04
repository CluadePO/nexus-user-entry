import React, { useMemo, useState } from 'react';
import { Button, Tabs, Select, Input, Table, Tooltip, Popconfirm, Pagination, message } from 'antd';
import {
  Plus,
  ClipboardText,
  Note,
  UserPlus,
  Buildings,
  BuildingOffice,
  X,
  MagnifyingGlass,
  Trash,
  Warning,
} from '@phosphor-icons/react';

interface EvalRow {
  inscripcion: number;
  sc: number | null;
  sencenet: number | null;
  curso: string;
  encuesta: string;
  tipologia: 'Satisfacción' | 'Transferencia';
  tipoCarga: 'On-line' | 'Presencial';
  participantes: number;
  contestadas: number;
}

const HOLDINGS = [
  { value: 'inacap', label: 'INACAP' },
  { value: 'iansa', label: 'IANSA' },
  { value: 'cnorte', label: 'Constructora Norte' },
];

const EMPRESAS_BY_HOLDING: Record<string, { value: string; label: string }[]> = {
  inacap: [
    { value: '87152900-0', label: '87152900-0 | Corporación Instituto Profesional INACAP' },
    { value: '60711000-K', label: '60711000-K | Instituto Nacional de Capacitación Profesional' },
    { value: '72012000-3', label: '72012000-3 | Universidad Tecnológica de Chile INACAP' },
  ],
  iansa: [
    { value: '70200800-K', label: '70200800-K | IANSA S.A.' },
    { value: '76543210-5', label: '76543210-5 | IANSA Procesados Ltda.' },
  ],
  cnorte: [
    { value: '88123456-7', label: '88123456-7 | Constructora Norte S.A.' },
    { value: '76111222-3', label: '76111222-3 | Constructora Norte Filial Ltda.' },
  ],
};

const DATA_BY_EMPRESA: Record<string, EvalRow[]> = {
  '87152900-0': [
    { inscripcion: 999425, sc: null, sencenet: null, curso: 'PRIMEROS AUXILIOS PSICOLÓGICOS', encuesta: 'Encuesta de Satisfacción Presencial, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 0 },
    { inscripcion: 1002086, sc: null, sencenet: null, curso: 'PRIMEROS AUXILIOS PSICOLÓGICOS', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 0 },
    { inscripcion: 1053537, sc: null, sencenet: null, curso: 'INDUCCIÓN ONLINE A NUEVOS DOCENTES INACAP', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 0 },
    { inscripcion: 1312841, sc: 6126028, sencenet: null, curso: 'TECNICAS DE FORMACION SCRUM PRODUCT OWNER', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 6, contestadas: 0 },
    { inscripcion: 1313657, sc: 6126666, sencenet: null, curso: 'TÉCNICAS DE FORMACIÓN DE SCRUM MASTER', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 12, contestadas: 0 },
    { inscripcion: 1313660, sc: 6126668, sencenet: null, curso: 'TÉCNICAS DE FORMACIÓN DE SCRUM MASTER', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 11, contestadas: 0 },
    { inscripcion: 1314255, sc: 6126745, sencenet: null, curso: 'TÉCNICAS DE FORMACIÓN DE SCRUM MASTER', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 0 },
    { inscripcion: 1315174, sc: 6128556, sencenet: null, curso: 'GESTIÓN DEL CAMBIO ORGANIZACIONAL', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 5, contestadas: 0 },
    { inscripcion: 1351083, sc: 6141927, sencenet: null, curso: 'TÉCNICAS DEL ACCOUNTABILITY PARA PLANIFICAR LA GESTIÓN LABORAL', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 9, contestadas: 1 },
    { inscripcion: 1362961, sc: 6153142, sencenet: null, curso: 'APLICACIÓN DE TECNICAS DE COMUNICACION', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 15, contestadas: 0 },
    { inscripcion: 1397770, sc: null, sencenet: null, curso: 'CONOCIENDO INACAP: NUESTRA INSTITUCIÓN', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 465, contestadas: 1 },
    { inscripcion: 1397794, sc: null, sencenet: null, curso: 'CONOCIENDO INACAP: MODELO EDUCATIVO', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 210, contestadas: 2 },
    { inscripcion: 1397797, sc: null, sencenet: null, curso: 'CONOCIENDO INACAP: FOCO EN EL ESTUDIANTE', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 503, contestadas: 7 },
    { inscripcion: 1397920, sc: 6276769, sencenet: null, curso: 'CLAVES DE TRABAJO EN EQUIPOS DE ALTO DESEMPEÑO', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 1 },
    { inscripcion: 1397927, sc: 6294577, sencenet: null, curso: 'TÉCNICAS DE COACHING', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 1, contestadas: 1 },
  ],
  '60711000-K': [
    { inscripcion: 1401234, sc: 6300001, sencenet: null, curso: 'LIDERAZGO Y GESTIÓN DE EQUIPOS', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 20, contestadas: 15 },
    { inscripcion: 1401235, sc: 6300002, sencenet: null, curso: 'COMUNICACIÓN EFECTIVA EN EL TRABAJO', encuesta: 'Encuesta de Transferencia, INACAP', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 18, contestadas: 10 },
    { inscripcion: 1401236, sc: null, sencenet: null, curso: 'GESTIÓN DEL TIEMPO', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 30, contestadas: 25 },
    { inscripcion: 1401237, sc: 6300004, sencenet: null, curso: 'TRABAJO EN EQUIPO', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 12, contestadas: 0 },
    { inscripcion: 1401238, sc: null, sencenet: null, curso: 'RESOLUCIÓN DE CONFLICTOS', encuesta: 'Encuesta de Transferencia, INACAP', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 8, contestadas: 4 },
  ],
  '72012000-3': [
    { inscripcion: 1501001, sc: null, sencenet: null, curso: 'FUNDAMENTOS DE PROGRAMACIÓN', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 45, contestadas: 40 },
    { inscripcion: 1501002, sc: 6400001, sencenet: null, curso: 'BASE DE DATOS RELACIONALES', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 32, contestadas: 16 },
    { inscripcion: 1501003, sc: null, sencenet: null, curso: 'DESARROLLO WEB FRONTEND', encuesta: 'Encuesta de Transferencia, INACAP', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 28, contestadas: 0 },
    { inscripcion: 1501004, sc: 6400003, sencenet: null, curso: 'SEGURIDAD INFORMÁTICA BÁSICA', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 15, contestadas: 3 },
    { inscripcion: 1501005, sc: null, sencenet: null, curso: 'INTRODUCCIÓN A LA INTELIGENCIA ARTIFICIAL', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 50, contestadas: 48 },
  ],
  '70200800-K': [
    { inscripcion: 2001001, sc: 7100001, sencenet: null, curso: 'SEGURIDAD INDUSTRIAL BÁSICA', encuesta: 'Encuesta de Satisfacción Sincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 25, contestadas: 20 },
    { inscripcion: 2001002, sc: null, sencenet: null, curso: 'MANEJO DE MAQUINARIA PESADA', encuesta: 'Encuesta de Transferencia, IANSA', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 10, contestadas: 5 },
    { inscripcion: 2001003, sc: 7100003, sencenet: null, curso: 'PRIMEROS AUXILIOS INDUSTRIAL', encuesta: 'Encuesta de Satisfacción Asincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 40, contestadas: 0 },
    { inscripcion: 2001004, sc: null, sencenet: null, curso: 'TRABAJO EN ALTURA', encuesta: 'Encuesta de Satisfacción Sincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 15, contestadas: 8 },
    { inscripcion: 2001005, sc: 7100005, sencenet: null, curso: 'GESTIÓN AMBIENTAL BÁSICA', encuesta: 'Encuesta de Transferencia, IANSA', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 20, contestadas: 18 },
  ],
  '76543210-5': [
    { inscripcion: 2101001, sc: null, sencenet: null, curso: 'BUENAS PRÁCTICAS DE MANUFACTURA', encuesta: 'Encuesta de Satisfacción Sincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 30, contestadas: 28 },
    { inscripcion: 2101002, sc: 7200002, sencenet: null, curso: 'CONTROL DE CALIDAD EN PROCESOS', encuesta: 'Encuesta de Transferencia, IANSA', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 12, contestadas: 6 },
    { inscripcion: 2101003, sc: null, sencenet: null, curso: 'SEGURIDAD ALIMENTARIA', encuesta: 'Encuesta de Satisfacción Asincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 22, contestadas: 0 },
    { inscripcion: 2101004, sc: 7200004, sencenet: null, curso: 'HIGIENE INDUSTRIAL', encuesta: 'Encuesta de Satisfacción Sincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 18, contestadas: 9 },
    { inscripcion: 2101005, sc: null, sencenet: null, curso: 'MANEJO DE RESIDUOS INDUSTRIALES', encuesta: 'Encuesta de Transferencia, IANSA', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 8, contestadas: 7 },
  ],
  '88123456-7': [
    { inscripcion: 3001001, sc: 8100001, sencenet: null, curso: 'SEGURIDAD EN OBRAS DE CONSTRUCCIÓN', encuesta: 'Encuesta de Satisfacción Sincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 35, contestadas: 30 },
    { inscripcion: 3001002, sc: null, sencenet: null, curso: 'LECTURA DE PLANOS', encuesta: 'Encuesta de Transferencia, C. Norte', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 15, contestadas: 0 },
    { inscripcion: 3001003, sc: 8100003, sencenet: null, curso: 'PREVENCIÓN DE RIESGOS EN FAENA', encuesta: 'Encuesta de Satisfacción Asincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 28, contestadas: 14 },
    { inscripcion: 3001004, sc: null, sencenet: null, curso: 'USO DE EPP', encuesta: 'Encuesta de Satisfacción Sincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 40, contestadas: 38 },
    { inscripcion: 3001005, sc: 8100005, sencenet: null, curso: 'GESTIÓN DE OBRAS', encuesta: 'Encuesta de Transferencia, C. Norte', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 10, contestadas: 5 },
  ],
  '76111222-3': [
    { inscripcion: 3101001, sc: null, sencenet: null, curso: 'INSTALACIONES ELÉCTRICAS BÁSICAS', encuesta: 'Encuesta de Satisfacción Asincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 20, contestadas: 20 },
    { inscripcion: 3101002, sc: 8200002, sencenet: null, curso: 'SOLDADURA BÁSICA', encuesta: 'Encuesta de Satisfacción Sincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 12, contestadas: 0 },
    { inscripcion: 3101003, sc: null, sencenet: null, curso: 'ALBAÑILERÍA BÁSICA', encuesta: 'Encuesta de Transferencia, C. Norte', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 8, contestadas: 4 },
    { inscripcion: 3101004, sc: 8200004, sencenet: null, curso: 'GASFITERÍA BÁSICA', encuesta: 'Encuesta de Satisfacción Asincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 16, contestadas: 8 },
    { inscripcion: 3101005, sc: null, sencenet: null, curso: 'PINTURA Y REVESTIMIENTOS', encuesta: 'Encuesta de Transferencia, C. Norte', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 6, contestadas: 3 },
  ],
};

const Encuestas: React.FC = () => {
  const [activeTab, setActiveTab] = useState('evaluaciones');
  const [holding, setHolding] = useState<string | null>(null);
  const [empresa, setEmpresa] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [deletedKeys, setDeletedKeys] = useState<Set<number>>(new Set());

  const baseRows = empresa ? (DATA_BY_EMPRESA[empresa] || []) : [];
  const rows = baseRows.filter((r) => !deletedKeys.has(r.inscripcion));

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      [r.inscripcion, r.sc, r.sencenet, r.curso, r.encuesta, r.tipologia, r.tipoCarga, r.participantes, r.contestadas]
        .map((v) => (v == null ? '' : String(v).toLowerCase()))
        .some((s) => s.includes(q))
    );
  }, [rows, search]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const handleHoldingChange = (val: string | null) => {
    setHolding(val);
    setEmpresa(null);
    setPage(1);
  };

  const handleEmpresaChange = (val: string | null) => {
    setEmpresa(val);
    setPage(1);
  };

  const handleClear = () => {
    setHolding(null);
    setEmpresa(null);
    setSearch('');
    setPage(1);
  };

  const handleDelete = (inscripcion: number) => {
    setDeletedKeys((prev) => new Set(prev).add(inscripcion));
    message.error({ content: 'Evaluación eliminada correctamente', style: { fontFamily: 'Poppins, sans-serif' } });
  };

  const getContestadasColor = (contestadas: number, total: number) => {
    if (contestadas === 0) return '#EF4444';
    if (contestadas / total <= 0.5) return '#F59E0B';
    return '#10B981';
  };

  const columns = [
    {
      title: 'N° Inscripción',
      dataIndex: 'inscripcion',
      width: 120,
      render: (v: number) => <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 500, color: '#111827' }}>{v}</span>,
    },
    {
      title: 'SC',
      dataIndex: 'sc',
      width: 100,
      render: (v: number | null) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>{v ?? '—'}</span>,
    },
    {
      title: 'Sencenet',
      dataIndex: 'sencenet',
      width: 100,
      render: (v: number | null) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>{v ?? '—'}</span>,
    },
    {
      title: 'Nombre Curso',
      dataIndex: 'curso',
      ellipsis: true,
      render: (v: string) => (
        <Tooltip title={v}>
          <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Nombre Encuesta',
      dataIndex: 'encuesta',
      ellipsis: true,
      render: (v: string) => (
        <Tooltip title={v}>
          <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Tipología',
      dataIndex: 'tipologia',
      width: 130,
      render: (v: 'Satisfacción' | 'Transferencia') => {
        const styles = v === 'Satisfacción'
          ? { background: '#EFF6FF', color: '#1D4ED8' }
          : { background: '#F0FDF4', color: '#15803D' };
        return (
          <span style={{ ...styles, fontFamily: 'Poppins', fontSize: 12, fontWeight: 500, padding: '2px 10px', borderRadius: 999 }}>
            {v}
          </span>
        );
      },
    },
    {
      title: 'Tipo Carga',
      dataIndex: 'tipoCarga',
      width: 110,
      render: (v: string) => (
        <span style={{ background: '#F3F4F6', color: '#374151', fontFamily: 'Poppins', fontSize: 12, padding: '2px 10px', borderRadius: 999 }}>
          {v}
        </span>
      ),
    },
    {
      title: 'N° Participantes',
      dataIndex: 'participantes',
      width: 110,
      align: 'center' as const,
      render: (v: number) => <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#111827' }}>{v}</span>,
    },
    {
      title: 'N° Contestadas',
      dataIndex: 'contestadas',
      width: 120,
      align: 'center' as const,
      render: (v: number, row: EvalRow) => {
        const color = getContestadasColor(v, row.participantes);
        const pct = row.participantes ? Math.round((v / row.participantes) * 100) : 0;
        return (
          <Tooltip title={`${v} de ${row.participantes} participantes han contestado (${pct}%)`}>
            <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color }}>{v}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Acciones',
      width: 80,
      align: 'center' as const,
      render: (_: any, row: EvalRow) => (
        <Popconfirm
          title={<span style={{ fontFamily: 'Poppins', fontWeight: 500 }}>¿Estás seguro de eliminar esta evaluación?</span>}
          description={<span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B7280' }}>Esta acción no se puede deshacer.</span>}
          onConfirm={() => handleDelete(row.inscripcion)}
          okText="Sí, eliminar"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
          icon={<Warning size={16} weight="fill" color="#F59E0B" />}
        >
          <Tooltip title="Eliminar evaluación">
            <button className="p-1 rounded hover:bg-red-50 transition-colors">
              <Trash size={16} color="#EF4444" />
            </button>
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  const empresaOptions = holding ? EMPRESAS_BY_HOLDING[holding] || [] : [];
  const hasFilter = !!holding || !!empresa;

  const renderEmptyTab = (Icon: React.ComponentType<any>, label: string) => (
    <div className="flex flex-col items-center justify-center py-24">
      <Icon size={64} color="#D1D5DB" weight="regular" />
      <p className="mt-4 mb-1" style={{ fontFamily: 'Poppins', fontSize: 16, color: '#9CA3AF' }}>Próximamente</p>
      <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>{label}</p>
    </div>
  );

  const renderEvaluacionesTab = () => (
    <div>
      {/* Filters card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: '16px 24px',
          marginBottom: 24,
        }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <Select
            placeholder="Selecciona un Holding"
            value={holding}
            onChange={handleHoldingChange}
            allowClear
            style={{ width: 280 }}
            suffixIcon={<Buildings size={16} color="#6B7280" />}
            options={HOLDINGS}
          />
          <Select
            placeholder="Selecciona una Empresa"
            value={empresa}
            onChange={handleEmpresaChange}
            allowClear
            disabled={!holding}
            style={{ width: 360 }}
            suffixIcon={<BuildingOffice size={16} color="#6B7280" />}
            options={empresaOptions}
          />
          {hasFilter && (
            <Button
              type="text"
              icon={<X size={14} />}
              onClick={handleClear}
              style={{ fontFamily: 'Poppins', color: '#6B7280' }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {!empresa ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-[#E5E7EB]">
          <ClipboardText size={56} color="#D1D5DB" weight="regular" />
          <p className="mt-4 mb-1" style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 500, color: '#6B7280' }}>
            Selecciona un Holding y Empresa
          </p>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>
            Los registros de evaluaciones aparecerán aquí una vez que apliques los filtros.
          </p>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>
              {filteredRows.length} evaluaciones encontradas
            </span>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Buscar..."
                prefix={<MagnifyingGlass size={14} color="#9CA3AF" />}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ width: 220, fontFamily: 'Poppins' }}
                allowClear
              />
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>Mostrar</span>
                <Select
                  value={pageSize}
                  onChange={(v) => { setPageSize(v); setPage(1); }}
                  style={{ width: 80 }}
                  options={[
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
            <Table
              rowKey="inscripcion"
              dataSource={pagedRows}
              columns={columns as any}
              pagination={false}
              locale={{
                emptyText: (
                  <div className="flex flex-col items-center justify-center py-12">
                    <MagnifyingGlass size={48} color="#D1D5DB" weight="regular" />
                    <p className="mt-3 mb-1" style={{ fontFamily: 'Poppins', fontSize: 14, color: '#6B7280' }}>
                      No se encontraron evaluaciones
                    </p>
                    <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>
                      Intenta con otro término de búsqueda
                    </p>
                  </div>
                ),
              }}
            />
          </div>

          {/* Pagination */}
          {filteredRows.length > 0 && (
            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>
                Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredRows.length)} de {filteredRows.length} evaluaciones
              </span>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={filteredRows.length}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );

  const tabItems = [
    {
      key: 'evaluaciones',
      label: (
        <span className="flex items-center gap-2" style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 500 }}>
          <ClipboardText size={16} weight="regular" />
          Administrar Evaluaciones
        </span>
      ),
      children: renderEvaluacionesTab(),
    },
    {
      key: 'encuestas',
      label: (
        <span className="flex items-center gap-2" style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 500 }}>
          <Note size={16} weight="regular" />
          Administrar Encuestas
        </span>
      ),
      children: renderEmptyTab(Note, 'Administrar Encuestas'),
    },
    {
      key: 'asignar',
      label: (
        <span className="flex items-center gap-2" style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 500 }}>
          <UserPlus size={16} weight="regular" />
          Asignar Encuestas
        </span>
      ),
      children: renderEmptyTab(UserPlus, 'Asignar Encuestas'),
    },
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontSize: 28, fontWeight: 700, color: '#111827', margin: 0 }}>
            Encuestas
          </h1>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
            Gestiona evaluaciones, encuestas y cursos finalizados
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} weight="bold" />}
          style={{ background: '#65BFB1', borderColor: '#65BFB1', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          Nueva Encuesta
        </Button>
      </div>

      <Tabs
        type="line"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </div>
  );
};

export default Encuestas;
