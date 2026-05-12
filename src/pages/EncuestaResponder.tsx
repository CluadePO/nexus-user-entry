import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Buildings } from '@phosphor-icons/react';
import { EncuestaEmailContent } from '@/components/encuestas/EncuestaEmailContent';
import { PreviewModal, ENCUESTA_INFO } from '@/pages/Encuestas';

const Header: React.FC = () => (
  <header
    className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6"
    style={{ borderBottom: '1px solid #E5E7EB', height: 64, fontFamily: 'Poppins, sans-serif' }}
  >
    <div className="flex items-center gap-3">
      <div
        style={{
          width: 80,
          height: 32,
          background: '#F3F4F6',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Buildings size={16} color="#6B7280" />
      </div>
      <div style={{ width: 1, height: 24, background: '#E5E7EB' }} />
      <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>
        Sistema de Encuestas OTIC
      </span>
    </div>
    <span style={{ fontSize: 12, color: '#6B7280' }}>
      Este correo fue enviado de forma automática, por favor no responder.
    </span>
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

const EncuestaResponder: React.FC = () => {
  const { encuestaId } = useParams<{ encuestaId: string }>();
  const [previewOpen, setPreviewOpen] = useState(false);

  // Datos simulados
  const data = {
    participante: 'HILDA ZIERATH COLINIR',
    curso: 'INDUCCION HSE MINERA ESCONDIDA',
    fecha: '14-10-2023 al 14-10-2023',
    relator: 'Prueba Relator',
  };

  const info = ENCUESTA_INFO['Satisfacción'];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingTop: 64, paddingBottom: 48 }}>
      <Header />
      <main
        style={{
          maxWidth: 600,
          margin: '40px auto',
          padding: '40px',
          background: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <EncuestaEmailContent data={data} onResponderClick={() => setPreviewOpen(true)} />
      </main>
      <Footer />

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        encuesta={{
          id: info.id,
          nombre: info.nombre,
          origen: 'OTIC',
          cliente: '',
          tipo: 'Satisfacción',
          version: 2,
          vigente: 'Si',
        } as any}
      />
    </div>
  );
};

export default EncuestaResponder;
