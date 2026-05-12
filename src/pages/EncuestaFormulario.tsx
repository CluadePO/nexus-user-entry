import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Button } from 'antd';
import { Buildings, PaperPlaneTilt, CheckCircle } from '@phosphor-icons/react';
import { ResponderHeader, ResponderFooter } from '@/pages/EncuestaResponder';

const TEAL = '#65BFB1';

const SECCIONES: { titulo: string; preguntas: string[] }[] = [
  {
    titulo: 'APLICACIÓN DE CONOCIMIENTOS',
    preguntas: [
      'Los aprendizajes obtenidos son utilizados en el trabajo diario',
      'La persona trabajadora demuestra mayor comprensión de sus funciones',
      'Los conocimientos adquiridos tienen aplicación a corto y mediano plazo',
      'La persona trabajadora se muestra más segura en el desempeño de sus labores',
    ],
  },
  {
    titulo: 'DESARROLLO DE HABILIDADES',
    preguntas: [
      'Las habilidades adquiridas han sido aplicadas de manera efectiva',
      'Se observa una mejora en el desempeño relacionado con la capacitación',
      'La persona trabajadora considera nuevas formas o estrategias de trabajo',
    ],
  },
  {
    titulo: 'SATISFACCIÓN GENERAL',
    preguntas: [
      'El contenido del curso fue relevante para mi trabajo',
      'El relator dominaba los temas tratados en la capacitación',
      'Las metodologías utilizadas facilitaron el aprendizaje',
      'En general me encuentro satisfecho(a) con la capacitación recibida',
    ],
  },
];

const ESCALA = ['1', '2', '3', '4', '5', 'NA'];

interface EscalaRowProps {
  value: string | null;
  onChange: (v: string) => void;
}

const EscalaRow: React.FC<EscalaRowProps> = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {ESCALA.map((v) => {
      const selected = value === v;
      return (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `1.5px solid ${selected ? TEAL : '#D1D5DB'}`,
            background: selected ? TEAL : '#FFFFFF',
            color: selected ? '#FFFFFF' : '#6B7280',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {v}
        </button>
      );
    })}
  </div>
);

const EncuestaFormulario: React.FC = () => {
  const { encuestaId } = useParams<{ encuestaId: string }>();

  const data = {
    participante: 'HILDA ZIERATH COLINIR',
    curso: 'INDUCCION HSE MINERA ESCONDIDA',
    fecha: '14-10-2023 al 14-10-2023',
    relator: 'Prueba Relator',
  };

  const [nombre, setNombre] = useState(data.participante);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [seccionesIncompletas, setSeccionesIncompletas] = useState<number[]>([]);
  const [enviado, setEnviado] = useState(false);
  const [hoverPregunta, setHoverPregunta] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setRespuesta = (key: string, v: string) => {
    setRespuestas((p) => ({ ...p, [key]: v }));
  };

  const handleEnviar = () => {
    const incompletas: number[] = [];
    SECCIONES.forEach((s, si) => {
      const todas = s.preguntas.every((_, pi) => !!respuestas[`${si}-${pi}`]);
      if (!todas) incompletas.push(si);
    });
    setSeccionesIncompletas(incompletas);
    if (incompletas.length > 0) {
      const first = sectionRefs.current[incompletas[0]];
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setEnviado(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingTop: 64, paddingBottom: 80 }}>
      <ResponderHeader />
      <main
        style={{
          maxWidth: 680,
          margin: '40px auto',
          padding: '40px',
          background: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {enviado ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <CheckCircle size={72} color={TEAL} weight="fill" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: TEAL, marginBottom: 12 }}>
              ¡Respuestas enviadas exitosamente!
            </h2>
            <p style={{ fontSize: 14, color: '#374151', marginBottom: 24, lineHeight: 1.6 }}>
              Gracias por tomarte el tiempo de responder esta encuesta. Tu opinión es muy importante para seguir mejorando la calidad de nuestras capacitaciones.
            </p>
            <div
              style={{
                background: '#F9FAFB',
                borderRadius: 8,
                padding: 16,
                marginBottom: 24,
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                Curso: {data.curso}
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>
                Fecha: {data.fecha}
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>
                Relator: {data.relator}
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 32 }}>
              Puedes cerrar esta ventana.
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
        ) : (
          <>
            {/* Cabecera */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                style={{
                  width: 80,
                  height: 32,
                  background: '#F3F4F6',
                  borderRadius: 6,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 6,
                }}
              >
                <Buildings size={16} color="#6B7280" />
              </div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>OTIC de la CChC</div>
            </div>

            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 20 }}>
              Encuesta de Satisfacción Estándar v2.0
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 8 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Nombre:
                </label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Nombre del Curso:
                </label>
                <Input value={data.curso} disabled />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Relator:
                </label>
                <Input value={data.relator} disabled />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', margin: '20px 0' }} />

            <p style={{ fontSize: 13, color: '#374151', marginBottom: 24, lineHeight: 1.6 }}>
              El objetivo de esta evaluación es comprobar si se ha producido algún cambio o mejora en el desempeño de la persona trabajadora a partir de la capacitación realizada. Por favor, responde los puntos del cuestionario llenando completamente los círculos con la escala que mejor refleje tu opinión.
            </p>

            {SECCIONES.map((sec, si) => {
              const incompleta = seccionesIncompletas.includes(si);
              return (
                <div
                  key={si}
                  ref={(el) => (sectionRefs.current[si] = el)}
                  style={{
                    marginBottom: 28,
                    paddingLeft: incompleta ? 12 : 0,
                    borderLeft: incompleta ? '3px solid #DC2626' : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      borderBottom: `1.5px solid ${TEAL}`,
                      paddingBottom: 6,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        color: TEAL,
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.3,
                      }}
                    >
                      {sec.titulo}
                    </div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#6B7280' }}>
                      {ESCALA.map((v) => (
                        <span key={v} style={{ width: 32, textAlign: 'center' }}>{v}</span>
                      ))}
                    </div>
                  </div>

                  {sec.preguntas.map((preg, pi) => {
                    const key = `${si}-${pi}`;
                    return (
                      <div
                        key={pi}
                        onMouseEnter={() => setHoverPregunta(key)}
                        onMouseLeave={() => setHoverPregunta(null)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 16,
                          padding: '10px 8px',
                          borderBottom: '1px solid #F3F4F6',
                          background: hoverPregunta === key ? '#F9FAFB' : 'transparent',
                          transition: 'background 0.15s',
                        }}
                      >
                        <div style={{ fontSize: 13, color: '#374151', flex: 1 }}>
                          {pi + 1}. {preg}
                        </div>
                        <EscalaRow
                          value={respuestas[key] || null}
                          onChange={(v) => setRespuesta(key, v)}
                        />
                      </div>
                    );
                  })}

                  {incompleta && (
                    <div style={{ fontSize: 12, color: '#DC2626', marginTop: 8 }}>
                      Debes responder todas las preguntas de esta sección.
                    </div>
                  )}
                </div>
              );
            })}

            <Button
              type="primary"
              onClick={handleEnviar}
              icon={<PaperPlaneTilt size={16} weight="fill" />}
              style={{
                width: '100%',
                height: 44,
                marginTop: 32,
                background: TEAL,
                borderColor: TEAL,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Enviar Respuestas
            </Button>
          </>
        )}
      </main>
      <ResponderFooter />
    </div>
  );
};

export default EncuestaFormulario;
