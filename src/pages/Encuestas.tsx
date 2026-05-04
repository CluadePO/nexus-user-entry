import React, { useState } from 'react';
import { Button, Tabs } from 'antd';
import { Plus, ClipboardText, Note, UserPlus } from '@phosphor-icons/react';

const Encuestas: React.FC = () => {
  const [activeTab, setActiveTab] = useState('evaluaciones');

  const renderEmpty = (Icon: React.ComponentType<any>, label: string) => (
    <div className="flex flex-col items-center justify-center py-24">
      <Icon size={64} color="#D1D5DB" weight="regular" />
      <p
        className="mt-4 mb-1"
        style={{ fontFamily: 'Poppins, sans-serif', fontSize: 16, color: '#9CA3AF' }}
      >
        Próximamente
      </p>
      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, color: '#9CA3AF' }}>
        {label}
      </p>
    </div>
  );

  const tabItems = [
    {
      key: 'evaluaciones',
      label: (
        <span className="flex items-center gap-2">
          <ClipboardText size={16} weight="regular" />
          Administrar Evaluaciones
        </span>
      ),
      children: renderEmpty(ClipboardText, 'Administrar Evaluaciones'),
    },
    {
      key: 'encuestas',
      label: (
        <span className="flex items-center gap-2">
          <Note size={16} weight="regular" />
          Administrar Encuestas
        </span>
      ),
      children: renderEmpty(Note, 'Administrar Encuestas'),
    },
    {
      key: 'asignar',
      label: (
        <span className="flex items-center gap-2">
          <UserPlus size={16} weight="regular" />
          Asignar Encuestas
        </span>
      ),
      children: renderEmpty(UserPlus, 'Asignar Encuestas'),
    },
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 700, color: '#111827', margin: 0 }}>
            Encuestas
          </h1>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
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
        tabBarStyle={{ fontFamily: 'Poppins, sans-serif' }}
      />
    </div>
  );
};

export default Encuestas;
