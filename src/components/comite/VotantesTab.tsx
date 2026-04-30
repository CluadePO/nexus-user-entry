import React, { useMemo, useRef, useState } from 'react';
import {
  ConfigProvider,
  Input as AntInput,
  Button as AntButton,
  Table as AntTable,
  Pagination as AntPagination,
  Modal as AntModal,
  Select as AntSelect,
  Tooltip as AntTooltip,
  Form as AntForm,
  Popconfirm,
} from 'antd';
import type { InputRef } from 'antd';
import {
  Users,
  MagnifyingGlass,
  UserPlus,
  Eye,
  Trash,
  FileCsv,
  FileXls,
  FilePdf,
  UsersThree,
  Buildings,
  Warning,
  X,
  Info,
} from '@phosphor-icons/react';
import { toast as sonnerToast } from 'sonner';

const TEAL = '#65BFB1';

interface Votante {
  id: number;
  comite: number;
  rut: string;
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  rutNumero?: string;
  rutDv?: string;
  estado: 'Habilitado' | 'Inhabilitado';
  permisoInforme: 0 | 1;
  dobleRol: 0 | 1;
}

const buildNombreCompleto = (n: string, ap?: string, am?: string) =>
  [n, ap, am].filter((s) => s && s.trim()).join(' ').trim();

const INITIAL_VOTANTES: Votante[] = [
  { id: 1, comite: 644, rut: '10035838-7', nombre: 'Soraya Katherine Lagos Lagos', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
  { id: 2, comite: 644, rut: '10108875-8', nombre: 'Sandra Maritza Aravena Duguet', estado: 'Inhabilitado', permisoInforme: 1, dobleRol: 0 },
  { id: 3, comite: 644, rut: '10213203-3', nombre: 'Jaime Pascual Garcia Soto', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
  { id: 4, comite: 644, rut: '10461505-8', nombre: 'Gustavo Lehnebach Yovanovich', estado: 'Habilitado', permisoInforme: 1, dobleRol: 1 },
  { id: 5, comite: 644, rut: '10697688-0', nombre: 'Richard Raul Villalobos Vasquez', estado: 'Habilitado', permisoInforme: 0, dobleRol: 0 },
  { id: 6, comite: 645, rut: '12345678-9', nombre: 'Juan Pablo Morales Fuentes', estado: 'Habilitado', permisoInforme: 1, dobleRol: 1 },
  { id: 7, comite: 645, rut: '13456789-0', nombre: 'María José Contreras Pinto', estado: 'Habilitado', permisoInforme: 0, dobleRol: 0 },
  { id: 8, comite: 645, rut: '14567890-1', nombre: 'Carlos Andrés Muñoz Rojas', estado: 'Inhabilitado', permisoInforme: 1, dobleRol: 0 },
  { id: 9, comite: 645, rut: '15678901-2', nombre: 'Ana Belén Torres Soto', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
  { id: 10, comite: 645, rut: '16789012-3', nombre: 'Pedro Ignacio Vargas León', estado: 'Habilitado', permisoInforme: 1, dobleRol: 1 },
  { id: 11, comite: 646, rut: '17890123-4', nombre: 'Francisca Andrea Silva Araya', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
  { id: 12, comite: 646, rut: '18901234-5', nombre: 'Diego Sebastián Pérez Vega', estado: 'Habilitado', permisoInforme: 1, dobleRol: 0 },
  { id: 13, comite: 646, rut: '19012345-6', nombre: 'Valentina Paz Rojas Castro', estado: 'Inhabilitado', permisoInforme: 0, dobleRol: 0 },
  { id: 14, comite: 646, rut: '20123456-7', nombre: 'Rodrigo Alejandro Díaz Meza', estado: 'Habilitado', permisoInforme: 1, dobleRol: 1 },
  { id: 15, comite: 646, rut: '21234567-8', nombre: 'Camila Fernanda Núñez Reyes', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
  { id: 16, comite: 647, rut: '22345678-9', nombre: 'Felipe Antonio Castillo Mora', estado: 'Habilitado', permisoInforme: 1, dobleRol: 0 },
  { id: 17, comite: 647, rut: '23456789-0', nombre: 'Javiera Ignacia Herrera Pino', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
  { id: 18, comite: 647, rut: '24567890-1', nombre: 'Matías Esteban Godoy Rivas', estado: 'Inhabilitado', permisoInforme: 1, dobleRol: 1 },
  { id: 19, comite: 647, rut: '25678901-2', nombre: 'Isidora Belén Espinoza Tapia', estado: 'Habilitado', permisoInforme: 0, dobleRol: 0 },
  { id: 20, comite: 647, rut: '26789012-3', nombre: 'Benjamín Andrés Fuentes Ríos', estado: 'Habilitado', permisoInforme: 1, dobleRol: 1 },
];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
};

const ComiteIdBadge: React.FC<{ id: number }> = ({ id }) => (
  <span
    style={{
      display: 'inline-block',
      background: '#F3F4F6',
      color: '#374151',
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 500,
      padding: '2px 10px',
      borderRadius: 6,
    }}
  >
    {id}
  </span>
);

const EstadoBadge: React.FC<{ estado: Votante['estado']; onClick?: () => void; clickable?: boolean }> = ({
  estado,
  onClick,
  clickable,
}) => {
  const isOk = estado === 'Habilitado';
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: isOk ? '#D1FAE5' : '#FEE2E2',
        color: isOk ? '#065F46' : '#991B1B',
        fontFamily: 'Poppins',
        fontSize: 12,
        fontWeight: 500,
        padding: '3px 10px',
        borderRadius: 999,
        lineHeight: 1.4,
        cursor: clickable ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isOk ? '#10B981' : '#EF4444',
          display: 'inline-block',
        }}
      />
      {estado}
    </span>
  );
};

const FlagBadge: React.FC<{ value: 0 | 1 }> = ({ value }) => {
  const on = value === 1;
  return (
    <span
      style={{
        display: 'inline-block',
        background: on ? 'rgba(101,191,177,0.15)' : '#F3F4F6',
        color: on ? TEAL : '#6B7280',
        fontFamily: 'Poppins',
        fontSize: 12,
        fontWeight: 500,
        padding: '2px 10px',
        borderRadius: 999,
      }}
    >
      {on ? 'Sí' : 'No'}
    </span>
  );
};

const ComiteContextBadge: React.FC<{ id: string }> = ({ id }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'rgba(101,191,177,0.15)',
      color: TEAL,
      fontFamily: 'Poppins',
      fontSize: 12,
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: 999,
    }}
  >
    <Buildings size={14} weight="duotone" />
    Comité activo: {id}
  </span>
);

const VotantesTab: React.FC = () => {
  const [votantes, setVotantes] = useState<Votante[]>(INITIAL_VOTANTES);
  const [comiteFiltro, setComiteFiltro] = useState<string>(''); // active filter
  const [idComite, setIdComite] = useState('');
  const [idComiteError, setIdComiteError] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const idComiteRef = useRef<InputRef>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState<Votante | null>(null);

  const [form] = AntForm.useForm();

  // Apply committee filter first
  const baseFiltered = useMemo(() => {
    if (!comiteFiltro) return votantes;
    return votantes.filter((v) => String(v.comite) === comiteFiltro);
  }, [votantes, comiteFiltro]);

  // Then apply global search
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return baseFiltered;
    return baseFiltered.filter(
      (v) =>
        v.nombre.toLowerCase().includes(term) ||
        v.rut.toLowerCase().includes(term) ||
        String(v.comite).includes(term)
    );
  }, [baseFiltered, search]);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  const comiteExiste = (id: string) => votantes.some((v) => String(v.comite) === id);

  const handleConsultar = () => {
    if (!idComite) return;
    setIdComiteError('');
    if (comiteExiste(idComite)) {
      setComiteFiltro(idComite);
      setPage(1);
      sonnerToast.success(`Filtrando por comité ${idComite}`);
    } else {
      setComiteFiltro(idComite); // still set so empty state shows the ID
      setPage(1);
    }
  };

  const handleLimpiarFiltro = () => {
    setComiteFiltro('');
    setIdComite('');
    setIdComiteError('');
    setPage(1);
  };

  const handleExport = (formato: string) => {
    sonnerToast.success(`Exportando ${formato}...`);
  };

  const handleClickAgregar = () => {
    if (!comiteFiltro || !comiteExiste(comiteFiltro)) {
      setIdComiteError('Debes consultar un comité antes de agregar votantes');
      setTimeout(() => idComiteRef.current?.focus(), 0);
      return;
    }
    setShowAdd(true);
  };

  const handleAdd = () => {
    form
      .validateFields()
      .then((vals) => {
        const nombreCompleto = buildNombreCompleto(vals.nombre, vals.apellidoPaterno, vals.apellidoMaterno);
        const rutNumero = String(vals.rut || '').trim();
        const rutDv = String(vals.dv || '').trim().toUpperCase();
        const next: Votante = {
          id: Date.now(),
          comite: Number(comiteFiltro),
          rut: `${rutNumero}-${rutDv}`,
          rutNumero,
          rutDv,
          nombre: nombreCompleto,
          apellidoPaterno: vals.apellidoPaterno || '',
          apellidoMaterno: vals.apellidoMaterno || '',
          estado: vals.estado,
          permisoInforme: (vals.permisoInforme ?? 0) as 0 | 1,
          dobleRol: (vals.dobleRol ?? 0) as 0 | 1,
        };
        setVotantes((prev) => [next, ...prev]);
        sonnerToast.success('Votante agregado exitosamente');
        form.resetFields();
        setShowAdd(false);
      })
      .catch(() => {});
  };

  const handleDelete = (v: Votante) => {
    setVotantes((prev) => prev.filter((x) => x.id !== v.id));
    sonnerToast.success(`Votante ${v.nombre} eliminado`);
  };

  const handleToggleEstado = (v: Votante) => {
    setVotantes((prev) =>
      prev.map((x) =>
        x.id === v.id
          ? { ...x, estado: x.estado === 'Habilitado' ? 'Inhabilitado' : 'Habilitado' }
          : x
      )
    );
    sonnerToast.success('Estado actualizado correctamente');
  };

  const filtroActivo = comiteFiltro !== '';
  const comiteContextoValido = filtroActivo && comiteExiste(comiteFiltro);

  const columns = [
    {
      title: 'Id Comité',
      dataIndex: 'comite',
      key: 'comite',
      width: 110,
      render: (v: number) => <ComiteIdBadge id={v} />,
    },
    {
      title: 'RUT Votante',
      dataIndex: 'rut',
      key: 'rut',
      render: (v: string) => (
        <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v}</span>
      ),
    },
    {
      title: 'Nombre Completo',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (v: string) => (
        <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 500, color: '#111827' }}>
          {v}
        </span>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 160,
      render: (_: unknown, row: Votante) => (
        <Popconfirm
          title={
            <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#111827' }}>
              {row.estado === 'Habilitado'
                ? `¿Inhabilitar a ${row.nombre}?`
                : `¿Habilitar a ${row.nombre}?`}
            </span>
          }
          icon={<Warning size={16} weight="fill" color="#F59E0B" />}
          okText="Sí, cambiar"
          cancelText="No"
          okButtonProps={{ style: { fontFamily: 'Poppins', fontWeight: 500 } }}
          cancelButtonProps={{ style: { fontFamily: 'Poppins' } }}
          onConfirm={() => handleToggleEstado(row)}
        >
          <AntTooltip title="Clic para cambiar estado">
            <span style={{ display: 'inline-block' }}>
              <EstadoBadge estado={row.estado} clickable />
            </span>
          </AntTooltip>
        </Popconfirm>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      render: (_: unknown, row: Votante) => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <AntTooltip title="Ver detalle">
            <button
              type="button"
              onClick={() => {
                setSelected(row);
                setShowDetail(true);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#6B7280' }}
            >
              <Eye size={18} />
            </button>
          </AntTooltip>
          <AntTooltip title="Eliminar votante">
            <button
              type="button"
              onClick={() => handleDelete(row)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#EF4444' }}
            >
              <Trash size={18} />
            </button>
          </AntTooltip>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: { fontFamily: 'Poppins, sans-serif', colorPrimary: TEAL, borderRadius: 8 },
      }}
    >
      <div style={{ fontFamily: 'Poppins, sans-serif' }} className="space-y-4">
        {/* Header de sección */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={20} color={TEAL} weight="duotone" />
            <h2 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>
              Mantenedor de Votantes
            </h2>
          </div>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280', margin: '4px 0 0 28px' }}>
            Gestión y seguimiento de votantes por comité
          </p>
        </div>

        {/* Toolbar */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            {/* Grupo izquierdo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AntInput
                  ref={idComiteRef}
                  placeholder="Id Comité"
                  value={idComite}
                  status={idComiteError ? 'error' : ''}
                  onChange={(e) => {
                    setIdComite(e.target.value.replace(/\D/g, ''));
                    if (idComiteError) setIdComiteError('');
                  }}
                  onPressEnter={handleConsultar}
                  style={{ width: 160, fontFamily: 'Poppins' }}
                />
                <AntButton
                  type="primary"
                  icon={<MagnifyingGlass size={16} />}
                  onClick={handleConsultar}
                  style={{ fontFamily: 'Poppins', fontWeight: 500 }}
                >
                  Consultar
                </AntButton>
                {filtroActivo && (
                  <AntButton
                    type="text"
                    size="small"
                    icon={<X size={14} />}
                    onClick={handleLimpiarFiltro}
                    style={{ fontFamily: 'Poppins', color: '#6B7280' }}
                  >
                    Limpiar filtro
                  </AntButton>
                )}
              </div>
              {idComiteError && (
                <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#ff4d4f' }}>
                  {idComiteError}
                </div>
              )}
            </div>

            {/* Grupo derecho */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AntInput
                placeholder="Buscar votante..."
                prefix={<MagnifyingGlass size={14} color="#9CA3AF" />}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ width: 240, fontFamily: 'Poppins' }}
                allowClear
              />
              <AntButton
                type="primary"
                icon={<UserPlus size={16} />}
                onClick={handleClickAgregar}
                style={{ fontFamily: 'Poppins', fontWeight: 500 }}
              >
                Agregar Votante
              </AntButton>
            </div>
          </div>

          {/* Exportar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {[
              { label: 'CSV', icon: <FileCsv size={14} /> },
              { label: 'Excel', icon: <FileXls size={14} /> },
              { label: 'PDF', icon: <FilePdf size={14} /> },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => handleExport(b.label)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  color: '#6B7280',
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  fontWeight: 500,
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
              >
                {b.icon}
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contexto activo */}
        {comiteContextoValido && (
          <div>
            <ComiteContextBadge id={comiteFiltro} />
          </div>
        )}

        {/* Tabla */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            padding: 16,
          }}
        >
          {pageData.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <UsersThree size={48} color="#D1D5DB" weight="duotone" style={{ display: 'inline-block' }} />
              <div style={{ fontFamily: 'Poppins', fontSize: 14, color: '#6B7280', marginTop: 12 }}>
                {filtroActivo && !comiteContextoValido
                  ? `No se encontraron votantes para el comité ${comiteFiltro}`
                  : 'No se encontraron votantes'}
              </div>
              <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                Intenta con otro Id de comité o término de búsqueda
              </div>
            </div>
          ) : (
            <>
              <AntTable
                rowKey="id"
                columns={columns as any}
                dataSource={pageData}
                pagination={false}
                size="middle"
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 16,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B7280' }}>
                  Mostrando {start + 1} a {Math.min(start + pageSize, total)} de {total} votantes
                </span>
                <AntPagination
                  size="small"
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={setPage}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Agregar Votante */}
        <AntModal
          title={<span style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Agregar Votante</span>}
          open={showAdd}
          onCancel={() => setShowAdd(false)}
          width={480}
          footer={[
            <AntButton key="cancel" onClick={() => setShowAdd(false)} style={{ fontFamily: 'Poppins' }}>
              Cancelar
            </AntButton>,
            <AntButton
              key="ok"
              type="primary"
              icon={<UserPlus size={16} />}
              onClick={handleAdd}
              style={{ fontFamily: 'Poppins', fontWeight: 500 }}
            >
              Agregar votante
            </AntButton>,
          ]}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>Id Comité</span>
            <ComiteContextBadge id={comiteFiltro} />
          </div>
          <AntForm
            form={form}
            layout="vertical"
            initialValues={{ estado: 'Habilitado', permisoInforme: 0, dobleRol: 0 }}
            style={{ fontFamily: 'Poppins' }}
          >
            <AntForm.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Campo obligatorio' }]}>
              <AntInput placeholder="Nombre(s)" />
            </AntForm.Item>
            <AntForm.Item label="Apellido Paterno" name="apellidoPaterno">
              <AntInput placeholder="Apellido paterno" />
            </AntForm.Item>
            <AntForm.Item label="Apellido Materno" name="apellidoMaterno">
              <AntInput placeholder="Apellido materno" />
            </AntForm.Item>
            <div style={{ display: 'flex', gap: 12 }}>
              <AntForm.Item
                label="RUT"
                name="rut"
                style={{ flex: '0 0 70%' }}
                rules={[{ required: true, message: 'Campo obligatorio' }]}
                normalize={(v: string) => (v || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}
              >
                <AntInput placeholder="Ej: 11111111" maxLength={8} />
              </AntForm.Item>
              <AntForm.Item
                label="DV"
                name="dv"
                style={{ flex: '1 1 30%' }}
                rules={[{ required: true, message: 'Campo obligatorio' }]}
                normalize={(v: string) => (v || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 1).toUpperCase()}
              >
                <AntInput placeholder="Ej: K" maxLength={1} />
              </AntForm.Item>
            </div>
            <AntForm.Item label="Estado" name="estado" rules={[{ required: true, message: 'Campo obligatorio' }]}>
              <AntSelect
                options={[
                  { value: 'Habilitado', label: 'Habilitado' },
                  { value: 'Inhabilitado', label: 'Inhabilitado' },
                ]}
              />
            </AntForm.Item>
            <AntForm.Item
              label={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Permiso informe
                  <AntTooltip title="0 = solo puede emitir su voto. 1 = puede votar y ver el informe de resultados.">
                    <Info size={14} color="#6B7280" style={{ cursor: 'help' }} />
                  </AntTooltip>
                </span>
              }
              name="permisoInforme"
              rules={[{ required: true, message: 'Campo obligatorio' }]}
            >
              <AntSelect
                options={[
                  { value: 0, label: '0 — Solo vota' },
                  { value: 1, label: '1 — Vota y ve informes' },
                ]}
              />
            </AntForm.Item>
            <AntForm.Item
              label={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Doble rol
                  <AntTooltip title="0 = participa únicamente como votante. 1 = puede votar y aparecer como candidato opcional.">
                    <Info size={14} color="#6B7280" style={{ cursor: 'help' }} />
                  </AntTooltip>
                </span>
              }
              name="dobleRol"
              rules={[{ required: true, message: 'Campo obligatorio' }]}
            >
              <AntSelect
                options={[
                  { value: 0, label: '0 — Solo votante' },
                  { value: 1, label: '1 — Votante y candidato' },
                ]}
              />
            </AntForm.Item>
          </AntForm>
        </AntModal>

        {/* Modal Detalle */}
        <AntModal
          title={<span style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Detalle del Votante</span>}
          open={showDetail}
          onCancel={() => setShowDetail(false)}
          width={420}
          footer={[
            <AntButton key="close" block onClick={() => setShowDetail(false)} style={{ fontFamily: 'Poppins' }}>
              Cerrar
            </AntButton>,
          ]}
        >
          {selected && (
            <div style={{ fontFamily: 'Poppins' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: TEAL,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {getInitials(selected.nombre)}
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 16, fontWeight: 600, color: '#111827' }}>
                {selected.nombre}
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                {selected.rut}
              </div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Id Comité</span>
                <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#111827' }}>
                  {selected.comite}
                </span>
              </div>
              <div style={{ borderTop: '1px solid #E5E7EB', margin: '16px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Estado</span>
                  <EstadoBadge estado={selected.estado} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Permiso informe</span>
                  <FlagBadge value={selected.permisoInforme} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Doble rol</span>
                  <FlagBadge value={selected.dobleRol} />
                </div>
              </div>
            </div>
          )}
        </AntModal>
      </div>
    </ConfigProvider>
  );
};

export default VotantesTab;
