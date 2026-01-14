import React from 'react';
import { Select, Tag } from 'antd';
import { Building2, Building, Filter } from 'lucide-react';
import { useOTICFilter } from '@/context/OTICFilterContext';

export const OTICFilterBar: React.FC = () => {
  const {
    holdings,
    filteredCompanies,
    selectedHoldingId,
    selectedCompanyId,
    setSelectedHoldingId,
    setSelectedCompanyId,
    filterLabel,
  } = useOTICFilter();

  return (
    <div className="bg-card border rounded-xl p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtrar datos por:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Holding Filter */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <Select
              placeholder="Seleccione Holding"
              allowClear
              value={selectedHoldingId}
              onChange={setSelectedHoldingId}
              className="w-56"
              options={holdings.map(h => ({
                value: h.id,
                label: (
                  <div className="flex flex-col">
                    <span>{h.name}</span>
                    <span className="text-xs text-muted-foreground">{h.rut}</span>
                  </div>
                ),
              }))}
              optionLabelProp="label"
              optionRender={(option) => (
                <div className="flex flex-col py-1">
                  <span className="font-medium">{holdings.find(h => h.id === option.value)?.name}</span>
                  <span className="text-xs text-muted-foreground">{holdings.find(h => h.id === option.value)?.rut}</span>
                </div>
              )}
            />
          </div>

          {/* Company Filter */}
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
            <Select
              placeholder="Seleccione Empresa"
              allowClear
              value={selectedCompanyId}
              onChange={setSelectedCompanyId}
              className="w-56"
              disabled={!selectedHoldingId}
              options={filteredCompanies.map(c => ({
                value: c.id,
                label: (
                  <div className="flex flex-col">
                    <span>{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.rut}</span>
                  </div>
                ),
              }))}
              optionLabelProp="label"
              optionRender={(option) => (
                <div className="flex flex-col py-1">
                  <span className="font-medium">{filteredCompanies.find(c => c.id === option.value)?.name}</span>
                  <span className="text-xs text-muted-foreground">{filteredCompanies.find(c => c.id === option.value)?.rut}</span>
                </div>
              )}
            />
          </div>
        </div>

        {/* Current Filter Label */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrando:</span>
          <Tag color="blue" className="m-0 text-sm">
            {filterLabel}
          </Tag>
        </div>
      </div>
    </div>
  );
};
