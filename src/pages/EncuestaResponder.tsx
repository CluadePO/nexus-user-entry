import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TEAL = '#0D9E75';
const RED = '#E53E3E';
const GREEN = '#38A169';
const YELLOW = '#D69E2E';

const OTICFooter: React.FC = () => (
  <div style={{ marginTop: 48, fontFamily: 'Poppins, sans-serif' }}>
    {/* Top block - logo */}
    <div style={{ background: '#FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 32, fontWeight: 900, color: TEAL, lineHeight: 1, letterSpacing: '-0.5px' }}>
        OTiC
      </div>
      <div style={{ display: 'flex', width: 90, height: 5, marginTop: 4 }}>
        <div style={{ flex: 1, background: RED }} />
        <div style={{ flex: 1, background: GREEN }} />
        <div style={{ flex: 1, background: YELLOW }} />
      </div>
      <div style={{ fontSize: 11, color: TEAL, marginTop: 4, fontWeight: 500 }}>
        somos CChC
      </div>
    </div>

    {/* Bottom block - diagonal gradient with message */}
    <div
      style={{
        position: 'relative',
        background: `linear-gradient(90deg, ${TEAL} 0%, #4FC3A1 100%)`,
        clipPath: 'polygon(0 24px, 100% 0, 100% 100%, 0 100%)',
        padding: '56px 32px 64px',
        overflow: 'hidden',
        minHeight: 180,
      }}
    >
      {/* Decorative teal shapes */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: -40,
          width: 200,
          height: 200,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 100,
          width: 140,
          height: 140,
          background: 'rgba(13,158,117,0.4)',
          borderRadius: '50%',
        }}
      />

      {/* Bottom-left red triangle */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '0 0 60px 80px',
          borderColor: `transparent transparent ${RED} transparent`,
        }}
      />
      {/* Bottom-right yellow rectangle */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 90,
          height: 36,
          background: YELLOW,
        }}
      />

      <div
        style={{
          position: 'relative',
          textAlign: 'right',
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1.5,
          maxWidth: 520,
          marginLeft: 'auto',
        }}
      >
        Este correo fue enviado por el OTIC de la CChC de forma automática,{' '}
        <span style={{ fontSize: 17, fontWeight: 800, display: 'inline-block' }}>
          por favor no responder.
        </span>
      </div>
    </div>
  </div>
);

const EncuestaResponder: React.FC = () => {
  const { encuestaId } = useParams<{ encuestaId: string }>();
  const navigate = useNavigate();

  const data = {
    participante: 'HILDA ZIERATH COLINIR',
    curso: 'INDUCCION HSE MINERA ESCONDIDA',
    fecha: '14-10-2023 al 14-10-2023',
    relator: 'Prueba Relator',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 32px 0' }}>
        <div style={{ fontSize: 14, color: '#000000', marginBottom: 16 }}>
          Estimado(a) <strong>{data.participante.toUpperCase()}</strong>,
        </div>

        <p style={{ fontSize: 13, color: '#000000', marginBottom: 12, lineHeight: 1.6 }}>
          Junto con saludar, nuestra Organización está comprometida con mejorar el servicio de Capacitación que entregamos, es por ello que nos gustaría conocer su opinión sobre su experiencia en la actividad a la cual participó:
        </p>

        <ul style={{ fontSize: 13, color: '#000000', marginBottom: 20, paddingLeft: 24, lineHeight: 1.8 }}>
          <li><strong>Nombre Curso:</strong> {data.curso}</li>
          <li><strong>Fecha de Realización:</strong> {data.fecha}</li>
          <li><strong>Relator:</strong> {data.relator}</li>
        </ul>

        <p style={{ fontSize: 13, color: '#000000', marginBottom: 16, textAlign: 'center' }}>
          Para responder, favor ingresar{' '}
          <button
            type="button"
            onClick={() => navigate(`/encuestas/responder/${encuestaId}/formulario`)}
            style={{
              background: 'none',
              border: 'none',
              color: '#1D4ED8',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 600,
            }}
          >
            AQUÍ
          </button>
        </p>

        <p style={{ fontSize: 13, color: '#000000', fontStyle: 'italic', marginBottom: 8, textAlign: 'center' }}>
          Gracias por su Tiempo, Comentarios y Preferencia.
        </p>

        <p style={{ fontSize: 13, fontWeight: 700, color: '#000000', marginBottom: 48, textAlign: 'center' }}>
          Saludos Cordiales.
        </p>
      </div>

      <OTICFooter />
    </div>
  );
};

// Kept exports as no-op stubs in case other files import them
export const ResponderHeader: React.FC = () => null;
export const ResponderFooter: React.FC = () => null;

export default EncuestaResponder;
