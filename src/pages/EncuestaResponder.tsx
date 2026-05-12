import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TEAL = '#0D9E75';
const RED = '#E53E3E';
const GREEN = '#38A169';
const YELLOW = '#D69E2E';

const OTICHeader: React.FC = () => (
  <div style={{ textAlign: 'center', marginBottom: 24, fontFamily: 'Poppins, sans-serif' }}>
    <div style={{ fontSize: 36, fontWeight: 900, color: TEAL, lineHeight: 1, letterSpacing: '-1px' }}>
      OTiC
    </div>
    <div style={{ display: 'flex', width: 80, height: 4, margin: '8px auto 0' }}>
      <div style={{ flex: 1, background: RED }} />
      <div style={{ flex: 1, background: GREEN }} />
      <div style={{ flex: 1, background: YELLOW }} />
    </div>
    <div style={{ fontSize: 11, color: TEAL, marginTop: 4, fontWeight: 500, letterSpacing: '0.05em' }}>
      somos CChC
    </div>
  </div>
);

const SocialIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: 6,
      background: '#374151',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontSize: 14,
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

const EncuestaResponder: React.FC = () => {
  const { encuestaId } = useParams<{ encuestaId: string }>();
  const navigate = useNavigate();

  const data = {
    participante: 'Hilda Zierath Colinir',
    curso: 'INDUCCION HSE MINERA ESCONDIDA',
    fechaInicio: '14-10-2023',
    fechaTermino: '14-10-2023',
    relator: 'Prueba Relator',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F3F4F6',
        fontFamily: 'Poppins, sans-serif',
        padding: '40px 16px',
      }}
    >
      <OTICHeader />

      {/* Main card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: 40,
          maxWidth: 580,
          margin: '0 auto',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 24,
            fontWeight: 700,
            color: TEAL,
            marginBottom: 20,
          }}
        >
          Cuéntanos tu experiencia
        </div>

        {/* Greeting */}
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 14,
            color: '#111827',
            marginBottom: 4,
          }}
        >
          Hola, {data.participante}:
        </div>

        {/* Course text */}
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 14,
            color: '#111827',
            marginBottom: 16,
          }}
        >
          Gracias por participar en el curso <strong>{data.curso}</strong>.
        </div>

        {/* Motivational paragraph */}
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 13,
            color: '#374151',
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          Queremos conocer tu experiencia para seguir mejorando nuestras actividades de capacitación y entregarte un mejor servicio.
        </div>

        {/* Course data card */}
        <div
          style={{
            background: '#F0FDF9',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              color: TEAL,
              marginBottom: 12,
            }}
          >
            Datos del curso:
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              color: '#111827',
              marginBottom: 6,
            }}
          >
            <strong>Curso:</strong> {data.curso}
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              color: '#111827',
              marginBottom: 6,
            }}
          >
            <strong>Fecha de realización:</strong> {data.fechaInicio} al {data.fechaTermino}
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              color: '#111827',
            }}
          >
            <strong>Relator(a):</strong> {data.relator}
          </div>
        </div>

        {/* Text before button */}
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 13,
            color: '#374151',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          Para responder la encuesta, haz clic en el siguiente botón:
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={() => navigate(`/encuestas/responder/${encuestaId}/formulario`)}
          style={{
            display: 'block',
            margin: '0 auto',
            background: TEAL,
            color: '#FFFFFF',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 999,
            padding: '14px 48px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(13,158,117,0.3)',
            marginBottom: 24,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#0A7A5A';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = TEAL;
          }}
        >
          Responder encuesta
        </button>

        {/* Info card */}
        <div
          style={{
            background: '#EFF6FF',
            borderRadius: 10,
            padding: '14px 16px',
            marginBottom: 24,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#1D4ED8',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            i
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              color: '#1D4ED8',
              lineHeight: 1.5,
            }}
          >
            La encuesta estará disponible por tiempo limitado y responderla te tomará solo unos minutos.
          </div>
        </div>

        {/* Thank you */}
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 13,
            color: '#374151',
            marginBottom: 16,
          }}
        >
          Agradecemos tu tiempo y participación.
        </div>

        {/* Sign-off */}
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 13,
            color: '#374151',
            marginBottom: 4,
          }}
        >
          Saludos,
        </div>
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            color: '#111827',
            marginBottom: 0,
          }}
        >
          Equipo OTIC CChC
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          maxWidth: 580,
          margin: '24px auto 0',
          paddingTop: 24,
          borderTop: '1px solid #E5E7EB',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {/* Social icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 12 }}>
          <SocialIcon>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </SocialIcon>
          <SocialIcon>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </SocialIcon>
          <SocialIcon>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </SocialIcon>
        </div>

        {/* Institutional text */}
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 12,
            color: TEAL,
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          OTIC de la Cámara Chilena de la Construcción
        </div>

        {/* Contact row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 11,
            color: '#6B7280',
          }}
        >
          <span>www.ccc.cl</span>
          <span>¿Necesitas ayuda? Contáctanos</span>
          <span>+(56) 2 2405 2000</span>
        </div>
      </div>
    </div>
  );
};

// Kept exports as no-op stubs in case other files import them
export const ResponderHeader: React.FC = () => null;
export const ResponderFooter: React.FC = () => null;

export default EncuestaResponder;
