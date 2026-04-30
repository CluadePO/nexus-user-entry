import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Radio, Select, Modal, message } from 'antd';
import {
  IdentificationCard,
  ArrowRight,
  CheckCircle,
  SignOut,
  Warning,
  ChartBar,
  FileText,
  Users,
} from '@phosphor-icons/react';

const candidatos = [
  { id: 'c1', nombre: 'María Fernanda González Pérez' },
  { id: 'c2', nombre: 'Juan Carlos Rodríguez Soto' },
  { id: 'c3', nombre: 'Patricia Andrea Muñoz Silva' },
];

const candidatosOpcionales = [
  { id: 'o1', nombre: 'Roberto Antonio Vásquez Castro' },
  { id: 'o2', nombre: 'Carolina Beatriz Herrera Rojas' },
  { id: 'o3', nombre: 'Luis Eduardo Pinto Mendoza' },
];

const RUT_REGEX = /^[0-9kK]{1,9}-[0-9kK]$/;

const Header: React.FC = () => (
  <header
    className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6"
    style={{ borderBottom: '1px solid #E5E7EB', height: 64, fontFamily: 'Poppins, sans-serif' }}
  >
    <div className="flex items-center gap-3">
      <div style={{ width: 80, height: 32, background: '#E5E7EB', borderRadius: 4 }} />
      <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>
        Sistema Comité Bipartito
      </span>
    </div>
    <Button type="text" icon={<SignOut size={16} />} style={{ fontFamily: 'Poppins' }}>
      Cerrar Sesión
    </Button>
  </header>
);

const Footer: React.FC = () => (
  <footer
    className="fixed bottom-0 left-0 right-0 bg-white flex items-center justify-center px-6"
    style={{
      borderTop: '1px solid #E5E7EB',
      height: 48,
      fontFamily: 'Poppins, sans-serif',
      fontSize: 12,
      color: '#9CA3AF',
    }}
  >
    OTIC de Capacitación · Cámara Chilena de la Construcción
  </footer>
);

const PantallaRUT: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const [rut, setRut] = useState('');
  const [error, setError] = useState('');

  const isValid = RUT_REGEX.test(rut);

  const handleBlur = () => {
    if (rut && !isValid) setError('Formato inválido. Ej: 11111111-1');
    else setError('');
  };

  return (
    <div
      style={{
        background: '#fff',
        maxWidth: 480,
        width: '100%',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: 40,
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div className="flex justify-center mb-4">
        <IdentificationCard size={48} color="#65BFB1" weight="duotone" />
      </div>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: '#111827',
          textAlign: 'center',
          margin: 0,
        }}
      >
        Ingresa tu RUT para votar
      </h1>
      <p
        style={{
          fontSize: 13,
          color: '#6B7280',
          textAlign: 'center',
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        Ingresa tu RUT sin puntos y con guión para separar el DV
      </p>

      <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
        RUT
      </label>
      <Input
        size="large"
        placeholder="Ej: 11111111-1"
        value={rut}
        maxLength={11}
        onChange={(e) => {
          const v = e.target.value.replace(/[^0-9kK-]/g, '');
          setRut(v);
          if (error) setError('');
        }}
        onBlur={handleBlur}
        status={error ? 'error' : ''}
      />
      {error && (
        <div style={{ color: '#DC2626', fontSize: 12, marginTop: 6 }}>{error}</div>
      )}

      <Button
        type="primary"
        size="large"
        block
        disabled={!isValid}
        onClick={onContinue}
        style={{ marginTop: 24, fontFamily: 'Poppins', fontWeight: 600 }}
        icon={<ArrowRight size={18} />}
        iconPosition="end"
      >
        Votar
      </Button>
    </div>
  );
};

const PantallaVoto: React.FC<{ tipo: 1 | 2 }> = ({ tipo }) => {
  const navigate = useNavigate();
  const [radioSelected, setRadioSelected] = useState<string | null>(null);
  const [dropdownSelected, setDropdownSelected] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedId = radioSelected || dropdownSelected;
  const selectedName =
    candidatos.find((c) => c.id === radioSelected)?.nombre ||
    candidatosOpcionales.find((c) => c.id === dropdownSelected)?.nombre ||
    '';

  if (success) {
    return (
      <div
        style={{
          background: '#fff',
          maxWidth: 600,
          width: '100%',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: 40,
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} color="#65BFB1" weight="fill" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}>
          ¡Voto registrado exitosamente!
        </h2>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 12 }}>
          Tu participación ha sido registrada. Gracias por contribuir a la formación del Comité
          Bipartito.
        </p>
        {tipo === 2 && (
          <Button
            type="default"
            size="large"
            icon={<ChartBar size={18} />}
            onClick={() => navigate('/cursos/comite-bipartito?tab=reportes')}
            style={{
              marginTop: 24,
              fontFamily: 'Poppins',
              fontWeight: 600,
              borderColor: '#65BFB1',
              color: '#65BFB1',
            }}
          >
            Ver resultados del comité
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#fff',
        maxWidth: 600,
        width: '100%',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: 40,
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <p style={{ fontSize: 13, color: '#374151', marginBottom: 24, lineHeight: 1.6 }}>
        A continuación encontrarás a los candidatos que postulan al cupo del representante de los
        colaboradores en el Comité Bipartito de Capacitación. El candidato seleccionado se sumará a
        los 3 representantes por la empresa para constituir y dar funcionamiento a este Comité.
        Favor selecciona el participante de tu elección.
      </p>

      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: '#111827',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        Candidatos
      </h3>

      <Radio.Group
        value={radioSelected}
        onChange={(e) => {
          setRadioSelected(e.target.value);
          setDropdownSelected(null);
        }}
        style={{ width: '100%' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {candidatos.map((c, i) => (
            <label
              key={c.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 8px',
                background: '#fff',
                borderBottom: i < candidatos.length - 1 ? '1px solid #E5E7EB' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              <Radio value={c.id} />
              <span style={{ fontSize: 14, color: '#111827' }}>{c.nombre}</span>
            </label>
          ))}
        </div>
      </Radio.Group>

      <p
        style={{
          fontSize: 13,
          color: '#6B7280',
          textAlign: 'center',
          margin: '24px 0',
        }}
      >
        Si los candidatos no son de su preferencia, favor elegir a quien más le represente del
        siguiente listado.
      </p>

      <Select
        size="large"
        placeholder="Seleccione"
        style={{ width: '100%' }}
        value={dropdownSelected}
        onChange={(v) => {
          setDropdownSelected(v);
          setRadioSelected(null);
        }}
        options={candidatosOpcionales.map((c) => ({ value: c.id, label: c.nombre }))}
      />

      <Button
        type="primary"
        size="large"
        block
        disabled={!selectedId}
        onClick={() => setConfirmOpen(true)}
        style={{ marginTop: 32, fontFamily: 'Poppins', fontWeight: 600 }}
        icon={<CheckCircle size={18} />}
        iconPosition="end"
      >
        Votar
      </Button>

      <Modal
        open={confirmOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Poppins' }}>
            <Warning size={20} color="#F59E0B" weight="fill" />
            Confirmar voto
          </div>
        }
        onCancel={() => setConfirmOpen(false)}
        footer={[
          <Button key="cancel" type="text" onClick={() => setConfirmOpen(false)}>
            Cancelar
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={() => {
              setConfirmOpen(false);
              setSuccess(true);
            }}
          >
            Sí, confirmar voto
          </Button>,
        ]}
      >
        <p style={{ fontFamily: 'Poppins', fontSize: 14, color: '#374151' }}>
          ¿Confirmas tu voto por <strong>{selectedName}</strong>? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};

const ComiteVoto: React.FC<{ tipo: 1 | 2 }> = ({ tipo }) => {
  const [step, setStep] = useState<'rut' | 'voto'>('rut');
  // comiteId is visual-only in this prototype
  useParams();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F9FAFB',
        fontFamily: 'Poppins, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 16px 80px',
        }}
      >
        {step === 'rut' ? (
          <PantallaRUT onContinue={() => setStep('voto')} />
        ) : (
          <PantallaVoto tipo={tipo} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ComiteVoto;
