import React from 'react';
import { Buildings } from '@phosphor-icons/react';

const TEAL = '#65BFB1';

export interface EncuestaEmailData {
  participante: string;
  curso: string;
  fecha: string;
  relator: string;
}

interface Props {
  data: EncuestaEmailData;
  onResponderClick: () => void;
}

export const EncuestaEmailContent: React.FC<Props> = ({ data, onResponderClick }) => {
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
        Estimado(a) {data.participante},
      </div>

      <p style={{ fontSize: 13, color: '#374151', marginBottom: 20, lineHeight: 1.6 }}>
        Junto con saludar, nuestra Organización está comprometida con mejorar el servicio de Capacitación que entregamos, es por ello que nos gustaría conocer su opinión sobre su experiencia en la actividad a la cual participó:
      </p>

      <ul style={{ fontSize: 13, color: '#374151', marginBottom: 24, paddingLeft: 20, lineHeight: 1.8 }}>
        <li><strong>Nombre Curso:</strong> {data.curso}</li>
        <li><strong>Fecha de Realización:</strong> {data.fecha}</li>
        <li><strong>Relator:</strong> {data.relator}</li>
      </ul>

      <p style={{ fontSize: 13, color: '#374151', marginBottom: 16, textAlign: 'center' }}>
        Para responder, favor ingresar{' '}
        <button
          type="button"
          onClick={onResponderClick}
          style={{
            background: 'none',
            border: 'none',
            color: TEAL,
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

      <p style={{ fontSize: 13, color: '#374151', fontStyle: 'italic', marginBottom: 8, textAlign: 'center' }}>
        Gracias por su Tiempo, Comentarios y Preferencia.
      </p>

      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 32, textAlign: 'center' }}>
        Saludos Cordiales.
      </p>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
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
        <p style={{ fontSize: 12, color: '#6B7280', textAlign: 'center', margin: 0 }}>
          Este correo fue enviado por el OTIC de la CChC de forma automática, por favor no responder.
        </p>
      </div>
    </div>
  );
};
