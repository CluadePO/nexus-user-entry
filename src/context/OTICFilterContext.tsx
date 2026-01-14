import React, { createContext, useContext, useState, useMemo } from 'react';

// Types
interface Holding {
  id: string;
  name: string;
  rut: string;
}

interface Company {
  id: string;
  name: string;
  rut: string;
  holdingId: string;
}

interface OTICFilterContextType {
  holdings: Holding[];
  companies: Company[];
  selectedHoldingId: string | null;
  selectedCompanyId: string | null;
  setSelectedHoldingId: (id: string | null) => void;
  setSelectedCompanyId: (id: string | null) => void;
  filteredCompanies: Company[];
  selectedHolding: Holding | null;
  selectedCompany: Company | null;
  filterLabel: string;
}

// Mock data for holdings and companies
const holdingsData: Holding[] = [
  { id: 'h1', name: 'Grupo Industrial Norte', rut: '76.100.000-K' },
  { id: 'h2', name: 'Holding Comercial Sur', rut: '76.200.000-1' },
  { id: 'h3', name: 'Corporación Minera Central', rut: '76.300.000-2' },
];

const companiesData: Company[] = [
  // Grupo Industrial Norte
  { id: 'c1', name: 'Empresa ABC Ltda.', rut: '76.123.456-7', holdingId: 'h1' },
  { id: 'c2', name: 'Industria Tech S.A.', rut: '76.123.457-5', holdingId: 'h1' },
  { id: 'c3', name: 'Manufactura Norte', rut: '76.123.458-3', holdingId: 'h1' },
  // Holding Comercial Sur
  { id: 'c4', name: 'Retail Plus', rut: '76.456.789-0', holdingId: 'h2' },
  { id: 'c5', name: 'Comercial Express', rut: '76.456.790-4', holdingId: 'h2' },
  { id: 'c6', name: 'Distribuidora Sur', rut: '76.456.791-2', holdingId: 'h2' },
  // Corporación Minera Central
  { id: 'c7', name: 'Minera del Norte', rut: '76.345.678-9', holdingId: 'h3' },
  { id: 'c8', name: 'Minera del Centro', rut: '76.345.679-7', holdingId: 'h3' },
  { id: 'c9', name: 'Exploraciones Mineras', rut: '76.345.680-0', holdingId: 'h3' },
];

const OTICFilterContext = createContext<OTICFilterContextType | undefined>(undefined);

export const OTICFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedHoldingId, setSelectedHoldingId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const filteredCompanies = useMemo(() => {
    if (!selectedHoldingId) return companiesData;
    return companiesData.filter(c => c.holdingId === selectedHoldingId);
  }, [selectedHoldingId]);

  const selectedHolding = useMemo(() => {
    return holdingsData.find(h => h.id === selectedHoldingId) || null;
  }, [selectedHoldingId]);

  const selectedCompany = useMemo(() => {
    return companiesData.find(c => c.id === selectedCompanyId) || null;
  }, [selectedCompanyId]);

  const filterLabel = useMemo(() => {
    if (selectedCompany) {
      return selectedCompany.name;
    }
    if (selectedHolding) {
      return `${selectedHolding.name} (${filteredCompanies.length} empresas)`;
    }
    return 'Todas las empresas';
  }, [selectedHolding, selectedCompany, filteredCompanies.length]);

  // Reset company when holding changes
  const handleSetHoldingId = (id: string | null) => {
    setSelectedHoldingId(id);
    setSelectedCompanyId(null);
  };

  const value: OTICFilterContextType = {
    holdings: holdingsData,
    companies: companiesData,
    selectedHoldingId,
    selectedCompanyId,
    setSelectedHoldingId: handleSetHoldingId,
    setSelectedCompanyId,
    filteredCompanies,
    selectedHolding,
    selectedCompany,
    filterLabel,
  };

  return (
    <OTICFilterContext.Provider value={value}>
      {children}
    </OTICFilterContext.Provider>
  );
};

export const useOTICFilter = () => {
  const context = useContext(OTICFilterContext);
  if (context === undefined) {
    throw new Error('useOTICFilter must be used within an OTICFilterProvider');
  }
  return context;
};
