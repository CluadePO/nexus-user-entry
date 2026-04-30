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
} from '@phosphor-icons/react';
import { toast as sonnerToast } from 'sonner';

const TEAL = '#65BFB1';

interface Votante {
  id: number;
  rut: string;
  nombre: string;
  estado: 'Habilitado' | 'Inhabilitado';
  permisoInforme: 0 | 1;
  dobleRol: 0 | 1;
}

const VOTANTES_POR_COMITE: Record<string, Votante[]> = {
  '644': [
    { id: 6441, rut: '10035838-7', nombre: 'Soraya Katherine Lagos Lagos', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
    { id: 6442, rut: '10108875-8', nombre: 'Sandra Maritza Aravena Duguet', estado: 'Inhabilitado', permisoInforme: 1, dobleRol: 0 },
    { id: 6443, rut: '10213203-3', nombre: 'Jaime Pascual Garcia Soto', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
    { id: 6444, rut: '10461505-8', nombre: 'Gustavo Lehnebach Yovanovich', estado: 'Habilitado', permisoInforme: 1, dobleRol: 1 },
    { id: 6445, rut: '10697688-0', nombre: 'Richard Raul Villalobos Vasquez', estado: 'Habilitado', permisoInforme: 0, dobleRol: 0 },
  ],
  '645': [
    { id: 6451, rut: '12345678-9', nombre: 'Juan Pablo Morales Fuentes', estado: 'Habilitado', permisoInforme: 1, dobleRol: 1 },
    { id: 6452, rut: '13456789-0', nombre: 'María José Contreras Pinto', estado: 'Habilitado', permisoInforme: 0, dobleRol: 0 },
    { id: 6453, rut: '14567890-1', nombre: 'Carlos Andrés Muñoz Rojas', estado: 'Inhabilitado', permisoInforme: 1, dobleRol: 0 },
    { id: 6454, rut: '15678901-2', nombre: 'Ana Belén Torres Soto', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
    { id: 6455, rut: '16789012-3', nombre: 'Pedro Ignacio Vargas León', estado: 'Habilitado', permisoInforme: 1, dobleRol: 1 },
  ],
  '646': [
    { id: 6461, rut: '17890123-4', nombre: 'Francisca Andrea Silva Araya', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
    { id: 6462, rut: '18901234-5', nombre: 'Diego Sebastián Pérez Vega', estado: 'Habilitado', permisoInforme: 1, dobleRol: 0 },
    { id: 6463, rut: '19012345-6', nombre: 'Valentina Paz Rojas Castro', estado: 'Inhabilitado', permisoInforme: 0, dobleRol: 0 },
    { id: 6464, rut: '20123456-7', nombre: 'Rodrigo Alejandro Díaz Meza', estado: 'Habilitado', permisoInforme: 1, dobleRol: 1 },
    { id: 6465, rut: '21234567-8', nombre: 'Camila Fernanda Núñez Reyes', estado: 'Habilitado', permisoInforme: 0, dobleRol: 1 },
  ],
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
};

const EstadoBadge: React.FC<{ estado: Votante['estado'] }> = ({ estado }) => {
  const isOk = estado === 'Habilitado';
  return (
    <span
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
  const [votantes, setVotantes] = useState<Votante[]>([]);
  const [comiteActivo, setComiteActivo] = useState<string>('');
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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return votantes;
    return votantes.filter(
      (v) => v.nombre.toLowerCase().includes(term) || v.rut.toLowerCase().includes(term)
    );
  }, [votantes, search]);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  const handleConsultar = () => {
    if (!idComite) return;
    setIdComiteError('');
    const data = VOTANTES_POR_COMITE[idComite];
    if (data) {
      setVotantes(data);
      setComiteActivo(idComite);
      setPage(1);
      sonnerToast.success(`Comité ${idComite} cargado`);
    } else {
      setVotantes([]);
      setComiteActivo('');
      sonnerToast.error(`No se encontraron votantes para el comité ${idComite}`);
    }
  };

  const handleExport = (formato: string) => {
    sonnerToast.success(`Exportando ${formato}...`);
  };

  const handleClickAgregar = () => {
    if (!comiteActivo) {
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
        const next: Votante = {
          id: Date.now(),
          rut: vals.rut,
          nombre: vals.nombre,
          estado: vals.estado,
          permisoInforme: 0,
          dobleRol: 0,
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

  const columns = [
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
      width: 140,
      render: (v: Votante['estado']) => <EstadoBadge estado={v} />,
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
        {comiteActivo && votantes.length > 0 && (
          <div>
            <ComiteContextBadge id={comiteActivo} />
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
                {idComite && !comiteActivo
                  ? `No se encontraron votantes para el comité ${idComite}`
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
            <ComiteContextBadge id={comiteActivo} />
          </div>
          <AntForm form={form} layout="vertical" initialValues={{ estado: 'Habilitado' }} style={{ fontFamily: 'Poppins' }}>
            <AntForm.Item
              label="RUT"
              name="rut"
              rules={[
                { required: true, message: 'Ingresa el RUT' },
                { pattern: /^\d{7,8}-[\dkK]$/, message: 'Formato inválido (ej: 11111111-1)' },
              ]}
            >
              <AntInput placeholder="11111111-1" />
            </AntForm.Item>
            <AntForm.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Ingresa el nombre' }]}>
              <AntInput placeholder="Nombre completo" />
            </AntForm.Item>
            <AntForm.Item label="Estado" name="estado">
              <AntSelect
                options={[
                  { value: 'Habilitado', label: 'Habilitado' },
                  { value: 'Inhabilitado', label: 'Inhabilitado' },
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
                  {comiteActivo || '—'}
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
