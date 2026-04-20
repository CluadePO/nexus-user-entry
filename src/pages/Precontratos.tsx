import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Pencil, ArrowLeft, Mail, FileDown, ChevronUp, ChevronDown, Users, FileText, Building2, GraduationCap, Search, Upload, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
// ── Precontratos Normales ──

interface Participante {
  nombre: string;
  rut: string;
  correo: string;
  telefono: string;
  firmaEmpresa: 'FALTANTE' | 'FIRMADO';
  firmaParticipante: 'FALTANTE' | 'POR VALIDAR' | 'EN CORRECCIÓN' | 'VALIDADO' | 'FIRMADO';
  autorizMenor: 'NO APLICA' | 'FALTANTE' | 'FIRMADO';
  vulnerabilidad: 'FALTANTE' | 'SIN VULNERABILIDAD' | 'VULNERABLE';
  ultimoRecordatorio: string;
}

interface PrecontratoNormal {
  diasPlazo: number;
  nroInscripcion: string;
  sencenet: string;
  curso: string;
  empresa: string;
  empresaRut: string;
  empresaNombre: string;
  otecNombre: string;
  otecRut: string;
  codigoSence: string;
  tipoContrato: string;
  inicioTermino: string;
  preinscripcion: string;
  precontratosFaltantes: string;
  autorizMenores: string;
  vulnerabilidad: number;
  celula: string;
  criticidad: 'alta' | 'media' | 'baja';
  repLegalNombre: string;
  repLegalCi: string;
  participantes: Participante[];
}

const mockParticipantes: Participante[] = [
  { nombre: 'Yoselin Ceron Jaramillo', rut: '19.249.775-2', correo: 'YMALDONADO@INACAP.CL', telefono: '987159317', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'Ermelinda Mellado Jaramillo', rut: '13.520.404-8', correo: 'YMALDONADO@INACAP.CL', telefono: '949247596', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'María Núñez Almonacid', rut: '11.325.257-K', correo: 'YMALDONADO@INACAP.CL', telefono: '999403690', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'Patricia Rivas Burgos', rut: '11.129.550-6', correo: 'YMALDONADO@INACAP.CL', telefono: '967239584', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'Juana Loiza Saez', rut: '10.987.653-4', correo: 'YMALDONADO@INACAP.CL', telefono: '993999593', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
];

const precontratosNormalesData: PrecontratoNormal[] = [
  { diasPlazo: -74, nroInscripcion: '2132479', sencenet: '6739401', curso: 'Producción de Pastelería y Repostería Básica', empresa: '84.009.400-6 – Astilleros y Servicios Navales S.A.', empresaRut: '84.009.400-6', empresaNombre: 'Astilleros y Servicios Navales S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073224', tipoContrato: 'precontrato', inicioTermino: '29/11/2025 - 31/12/2025', preinscripcion: '134960892', precontratosFaltantes: '20/20', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel8', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: -76, nroInscripcion: '2132535', sencenet: '6739647', curso: 'Aplicación de Procedimientos Orientados a la Operación Planta Concentradora', empresa: '76.727.040-2 – Minera Centinela', empresaRut: '76.727.040-2', empresaNombre: 'Minera Centinela', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073225', tipoContrato: 'precontrato', inicioTermino: '01/12/2025 - 15/01/2026', preinscripcion: '134960893', precontratosFaltantes: '0/8', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel2', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes.slice(0, 3) },
  { diasPlazo: -76, nroInscripcion: '2132546', sencenet: '6739652', curso: 'Aplicación de Procedimientos Orientados a la Operación Planta Concentradora', empresa: '76.727.040-2 – Minera Centinela', empresaRut: '76.727.040-2', empresaNombre: 'Minera Centinela', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073226', tipoContrato: 'precontrato', inicioTermino: '01/12/2025 - 15/01/2026', preinscripcion: '134960894', precontratosFaltantes: '11/22', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel2', criticidad: 'media', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes.slice(0, 4) },
  { diasPlazo: -79, nroInscripcion: '2144256', sencenet: '6752620', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.829-3 – Gestiones y Servicios Los Álamos S.A.', empresaRut: '78.163.829-3', empresaNombre: 'Gestiones y Servicios Los Álamos S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073227', tipoContrato: 'precontrato', inicioTermino: '05/12/2025 - 20/01/2026', preinscripcion: '134960895', precontratosFaltantes: '24/24', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: -79, nroInscripcion: '2144293', sencenet: '6752622', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', empresaRut: '78.163.838-2', empresaNombre: 'Outsourcing Global de Servicios S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073228', tipoContrato: 'precontrato', inicioTermino: '05/12/2025 - 20/01/2026', preinscripcion: '134960896', precontratosFaltantes: '25/25', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: -79, nroInscripcion: '2144300', sencenet: '6752626', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', empresaRut: '78.163.838-2', empresaNombre: 'Outsourcing Global de Servicios S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073229', tipoContrato: 'precontrato', inicioTermino: '05/12/2025 - 20/01/2026', preinscripcion: '134960897', precontratosFaltantes: '24/24', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: -79, nroInscripcion: '2144305', sencenet: '6752627', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', empresaRut: '78.163.838-2', empresaNombre: 'Outsourcing Global de Servicios S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073230', tipoContrato: 'precontrato', inicioTermino: '05/12/2025 - 20/01/2026', preinscripcion: '134960898', precontratosFaltantes: '27/27', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
];

interface PrecontratoCerrado {
  fechaCierre: string;
  nroInscripcion: string;
  sencenet: string;
  curso: string;
  empresa: string;
  empresaRut: string;
  empresaNombre: string;
  otecNombre: string;
  otecRut: string;
  codigoSence: string;
  tipoContrato: string;
  inicioTermino: string;
  preinscripcion: string;
  precontratosFirmados: string;
  celula: string;
  repLegalNombre: string;
  repLegalCi: string;
  participantes: Participante[];
}

const mockParticipantesCerrados: Participante[] = [
  { nombre: 'María Blanca Pérez Vargas', rut: '8.904.037-K', correo: 'mariablancadelcarmenperezvargas@gmail.com', telefono: '956060400', firmaEmpresa: 'FALTANTE', firmaParticipante: 'VALIDADO', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'Eduardo Enrique Yañez Vega', rut: '9.582.994-5', correo: 'eduardoenriqueyave@gmail.com', telefono: '966012459', firmaEmpresa: 'FALTANTE', firmaParticipante: 'VALIDADO', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'Francisco Javier Moreno Navarrete', rut: '10.697.224-9', correo: 'cobreloa634@gmail.com', telefono: '949606476', firmaEmpresa: 'FALTANTE', firmaParticipante: 'VALIDADO', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'María Martina Iriarte Jiménez', rut: '11.007.480-8', correo: 'maria.iriartel@gmail.com', telefono: '995933344', firmaEmpresa: 'FALTANTE', firmaParticipante: 'VALIDADO', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'Solange Maritza Villarroel Olivares', rut: '11.506.661-7', correo: 'sole.villarroel1970@gmail.com', telefono: '937142381', firmaEmpresa: 'FALTANTE', firmaParticipante: 'VALIDADO', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
];

const precontratosCerradosData: PrecontratoCerrado[] = [
  { fechaCierre: '10/11/2025', nroInscripcion: '2103038', sencenet: '6688091', curso: '2º Ciclo de Educacion Media', empresa: '76.081.590-K – Sierra Gorda S.c.m.', empresaRut: '76.081.590-K', empresaNombre: 'Sierra Gorda S.c.m.', otecNombre: 'Sociedad Centro de Capacitacion Dvc Limitada', otecRut: '76.546.376-9', codigoSence: '0099000646', tipoContrato: 'precontrato', inicioTermino: '02/09/2025 - 09/10/2025', preinscripcion: '126735227', precontratosFirmados: '46/46', celula: 'Cel1', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantesCerrados },
  { fechaCierre: '28/10/2025', nroInscripcion: '2104934', sencenet: '6690634', curso: 'Aplicación de Funciones Matemáticas Para Medir y Calcular Con Exactitud los Diferentes Procesos Productivos en la Industria Minera', empresa: '85.066.600-8 – Albemarle Limitada', empresaRut: '85.066.600-8', empresaNombre: 'Albemarle Limitada', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073224', tipoContrato: 'precontrato', inicioTermino: '15/10/2025 - 15/11/2025', preinscripcion: '126735228', precontratosFirmados: '13/13', celula: 'Cel1', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantesCerrados.slice(0, 3) },
  { fechaCierre: '24/11/2025', nroInscripcion: '2119350', sencenet: '6717009', curso: 'Aplicación de Cerámicos en Construcción', empresa: '93.770.000-8 – Goodyear de Chile S.a.i.c.', empresaRut: '93.770.000-8', empresaNombre: 'Goodyear de Chile S.a.i.c.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073225', tipoContrato: 'precontrato', inicioTermino: '01/11/2025 - 01/12/2025', preinscripcion: '126735229', precontratosFirmados: '17/17', celula: 'Cel7', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantesCerrados.slice(0, 4) },
  { fechaCierre: '19/11/2025', nroInscripcion: '2124060', sencenet: '6724813', curso: 'Aplicación de Cerámicos en Construcción', empresa: '93.770.000-8 – Goodyear de Chile S.a.i.c.', empresaRut: '93.770.000-8', empresaNombre: 'Goodyear de Chile S.a.i.c.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073226', tipoContrato: 'precontrato', inicioTermino: '20/10/2025 - 20/11/2025', preinscripcion: '126735230', precontratosFirmados: '7/7', celula: 'Cel7', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantesCerrados.slice(0, 2) },
  { fechaCierre: '29/07/2025', nroInscripcion: '2088172', sencenet: '6652266', curso: 'Aplicación de Estrategias de Gestión Del Bienestar Físico y Emocional', empresa: '93.077.000-0 – Metso Chile SPA', empresaRut: '93.077.000-0', empresaNombre: 'Metso Chile SPA', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073227', tipoContrato: 'precontrato', inicioTermino: '01/07/2025 - 01/08/2025', preinscripcion: '126735231', precontratosFirmados: '15/15', celula: 'Cel9', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantesCerrados },
  { fechaCierre: '04/08/2025', nroInscripcion: '2088964', sencenet: '6654519', curso: 'Aplicación de Estratégica de Gestión de Redes Sociales – Precontratos', empresa: '98.000.000-1 – A.f.p. Capital S.A.', empresaRut: '98.000.000-1', empresaNombre: 'A.f.p. Capital S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073228', tipoContrato: 'precontrato', inicioTermino: '10/07/2025 - 10/08/2025', preinscripcion: '126735232', precontratosFirmados: '39/39', celula: 'Cel4', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantesCerrados },
  { fechaCierre: '18/08/2025', nroInscripcion: '2090118', sencenet: '6657872', curso: 'Aplicación de Estratégica de Gestión de Redes Sociales – Precontratos', empresa: '98.000.000-1 – A.f.p. Capital S.A.', empresaRut: '98.000.000-1', empresaNombre: 'A.f.p. Capital S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073229', tipoContrato: 'precontrato', inicioTermino: '20/07/2025 - 20/08/2025', preinscripcion: '126735233', precontratosFirmados: '38/38', celula: 'Cel4', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantesCerrados.slice(0, 3) },
  { fechaCierre: '18/08/2025', nroInscripcion: '2092419', sencenet: '6665325', curso: 'Aplicación de Estratégica de Gestión de Redes Sociales – Precontratos', empresa: '98.000.000-1 – A.f.p. Capital S.A.', empresaRut: '98.000.000-1', empresaNombre: 'A.f.p. Capital S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073230', tipoContrato: 'precontrato', inicioTermino: '20/07/2025 - 20/08/2025', preinscripcion: '126735234', precontratosFirmados: '41/41', celula: 'Cel4', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantesCerrados },
];

const celulasOperacionales = ['Cel1', 'Cel2', 'Cel3', 'Cel4', 'Cel5', 'Cel6', 'Cel7', 'Cel8', 'Cel9'];

const precontratosProximosAVencer: PrecontratoNormal[] = [
  { diasPlazo: 3, nroInscripcion: '2155001', sencenet: '6780101', curso: 'Gestión de Seguridad en Minería', empresa: '76.081.590-K – Sierra Gorda S.c.m.', empresaRut: '76.081.590-K', empresaNombre: 'Sierra Gorda S.c.m.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238074001', tipoContrato: 'precontrato', inicioTermino: '15/04/2026 - 15/05/2026', preinscripcion: '134961001', precontratosFaltantes: '8/15', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel1', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: 5, nroInscripcion: '2155002', sencenet: '6780102', curso: 'Operación de Maquinaria Pesada', empresa: '85.066.600-8 – Albemarle Limitada', empresaRut: '85.066.600-8', empresaNombre: 'Albemarle Limitada', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238074002', tipoContrato: 'precontrato', inicioTermino: '17/04/2026 - 17/05/2026', preinscripcion: '134961002', precontratosFaltantes: '12/20', autorizMenores: '1/1', vulnerabilidad: 2, celula: 'Cel2', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes.slice(0, 4) },
  { diasPlazo: 7, nroInscripcion: '2155003', sencenet: '6780103', curso: 'Técnicas de Soldadura Industrial', empresa: '93.770.000-8 – Goodyear de Chile S.a.i.c.', empresaRut: '93.770.000-8', empresaNombre: 'Goodyear de Chile S.a.i.c.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238074003', tipoContrato: 'precontrato', inicioTermino: '19/04/2026 - 19/05/2026', preinscripcion: '134961003', precontratosFaltantes: '5/10', autorizMenores: '0/0', vulnerabilidad: 1, celula: 'Cel3', criticidad: 'media', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes.slice(0, 3) },
  { diasPlazo: 2, nroInscripcion: '2155004', sencenet: '6780104', curso: 'Administración de Bodegas y Logística', empresa: '78.163.829-3 – Gestiones y Servicios Los Álamos S.A.', empresaRut: '78.163.829-3', empresaNombre: 'Gestiones y Servicios Los Álamos S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238074004', tipoContrato: 'precontrato', inicioTermino: '14/04/2026 - 14/05/2026', preinscripcion: '134961004', precontratosFaltantes: '18/18', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: 9, nroInscripcion: '2155005', sencenet: '6780105', curso: 'Prevención de Riesgos Laborales', empresa: '93.077.000-0 – Metso Chile SPA', empresaRut: '93.077.000-0', empresaNombre: 'Metso Chile SPA', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238074005', tipoContrato: 'precontrato', inicioTermino: '21/04/2026 - 21/05/2026', preinscripcion: '134961005', precontratosFaltantes: '3/12', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel5', criticidad: 'baja', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes.slice(0, 2) },
  { diasPlazo: 1, nroInscripcion: '2155006', sencenet: '6780106', curso: 'Mantenimiento Eléctrico Industrial', empresa: '76.727.040-2 – Minera Centinela', empresaRut: '76.727.040-2', empresaNombre: 'Minera Centinela', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238074006', tipoContrato: 'precontrato', inicioTermino: '13/04/2026 - 13/05/2026', preinscripcion: '134961006', precontratosFaltantes: '22/22', autorizMenores: '2/2', vulnerabilidad: 3, celula: 'Cel6', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: 6, nroInscripcion: '2155007', sencenet: '6780107', curso: 'Control de Calidad en Procesos Mineros', empresa: '98.000.000-1 – A.f.p. Capital S.A.', empresaRut: '98.000.000-1', empresaNombre: 'A.f.p. Capital S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238074007', tipoContrato: 'precontrato', inicioTermino: '18/04/2026 - 18/05/2026', preinscripcion: '134961007', precontratosFaltantes: '10/16', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel7', criticidad: 'media', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes.slice(0, 4) },
  { diasPlazo: 4, nroInscripcion: '2155008', sencenet: '6780108', curso: 'Hidráulica y Neumática Básica', empresa: '84.009.400-6 – Astilleros y Servicios Navales S.A.', empresaRut: '84.009.400-6', empresaNombre: 'Astilleros y Servicios Navales S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238074008', tipoContrato: 'precontrato', inicioTermino: '16/04/2026 - 16/05/2026', preinscripcion: '134961008', precontratosFaltantes: '14/14', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel8', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: 10, nroInscripcion: '2155009', sencenet: '6780109', curso: 'Gestión Ambiental en la Industria', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', empresaRut: '78.163.838-2', empresaNombre: 'Outsourcing Global de Servicios S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238074009', tipoContrato: 'precontrato', inicioTermino: '22/04/2026 - 22/05/2026', preinscripcion: '134961009', precontratosFaltantes: '7/25', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel9', criticidad: 'media', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes.slice(0, 3) },
];

const getCriticidadColor = (val: string) => {
  const [a, b] = val.split('/').map(Number);
  if (a === b && a > 0) return 'text-green-700 bg-green-50 border-green-200';
  if (a === 0) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return 'text-orange-700 bg-orange-50 border-orange-200';
};

const getStatusBadge = (status: string, onClick?: () => void) => {
  const base = "inline-block text-[10px] font-semibold rounded px-2 py-0.5";
  const clickable = onClick ? "cursor-pointer hover:opacity-80" : "";
  switch (status) {
    case 'FALTANTE':
      return <span className={`${base} bg-red-500 text-white ${clickable}`} onClick={onClick}>FALTANTE</span>;
    case 'POR VALIDAR':
      return <span className={`${base} bg-yellow-600 text-white ${clickable}`} onClick={onClick}>POR VALIDAR</span>;
    case 'EN CORRECCIÓN':
      return <span className={`${base} bg-orange-500 text-white ${clickable}`} onClick={onClick}>EN CORRECCIÓN</span>;
    case 'VALIDADO':
      return <span className={`${base} bg-green-600 text-white ${clickable}`} onClick={onClick}>VALIDADO</span>;
    case 'FIRMADO':
      return <span className={`${base} bg-green-600 text-white ${clickable}`} onClick={onClick}>FIRMADO</span>;
    case 'NO APLICA':
      return <span className={`${base} bg-muted text-muted-foreground ${clickable}`} onClick={onClick}>NO APLICA</span>;
    case 'SIN VULNERABILIDAD':
      return <span className={`${base} bg-green-600 text-white ${clickable}`} onClick={onClick}>SIN VULNERABILIDAD</span>;
    case 'VULNERABLE':
      return <span className={`${base} bg-orange-500 text-white ${clickable}`} onClick={onClick}>VULNERABLE</span>;
    default:
      return <span className="text-[10px] text-muted-foreground">{status}</span>;
  }
};

// ── Precontratos Modulares ──

interface CursoModular {
  moduloRef: string;
  sc: string;
  cliente: string;
  nroPart: number;
  mtFranquicia: string;
  inicioCurso: string;
}

interface ModuloGroup {
  modulo: string;
  cursos: CursoModular[];
}

const precontratosModulares: ModuloGroup[] = [
  {
    modulo: 'MOD-001',
    cursos: [
      { moduloRef: 'MOD-001', sc: '2103919', cliente: 'CORPORACION NACIONAL DEL COBRE', nroPart: 27, mtFranquicia: '$22.680.000', inicioCurso: '26/12/2025' },
      { moduloRef: 'MOD-001', sc: '2103920', cliente: 'MINERA ESCONDIDA LTDA', nroPart: 15, mtFranquicia: '$18.500.000', inicioCurso: '27/12/2025' },
      { moduloRef: 'MOD-001', sc: '2103921', cliente: 'ANGLO AMERICAN SUR', nroPart: 22, mtFranquicia: '$20.100.000', inicioCurso: '28/12/2025' },
    ],
  },
  {
    modulo: 'MOD-002',
    cursos: [
      { moduloRef: 'MOD-002', sc: '2103922', cliente: 'BHP BILLITON CHILE', nroPart: 30, mtFranquicia: '$25.000.000', inicioCurso: '02/01/2026' },
      { moduloRef: 'MOD-002', sc: '2103923', cliente: 'ANTOFAGASTA MINERALS', nroPart: 18, mtFranquicia: '$16.800.000', inicioCurso: '03/01/2026' },
    ],
  },
  {
    modulo: 'MOD-003',
    cursos: [
      { moduloRef: 'MOD-003', sc: '2103924', cliente: 'COLLAHUASI SCM', nroPart: 25, mtFranquicia: '$21.500.000', inicioCurso: '10/01/2026' },
      { moduloRef: '—', sc: '2103925', cliente: 'TECK RESOURCES CHILE', nroPart: 12, mtFranquicia: '$14.000.000', inicioCurso: '15/01/2026' },
    ],
  },
];

// ── Detail View Component ──

const PrecontratoDetailView: React.FC<{ precontrato: PrecontratoNormal; onBack: () => void }> = ({ precontrato, onBack }) => {
  const [detalleOpen, setDetalleOpen] = useState(true);
  const [searchParticipante, setSearchParticipante] = useState('');
  const [participantesState, setParticipantesState] = useState<Participante[]>(precontrato.participantes);

  // Upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const legajoInputRef = useRef<HTMLInputElement>(null);

  // Validation actions modal (POR VALIDAR clicked)
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [validationTarget, setValidationTarget] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState(false);

  // Correction modal
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState<number | null>(null);
  const [correctionEmail, setCorrectionEmail] = useState('');
  const [correctionObservaciones, setCorrectionObservaciones] = useState('');

  // Validated document viewer modal
  const [viewDocModalOpen, setViewDocModalOpen] = useState(false);
  const [viewDocTarget, setViewDocTarget] = useState<number | null>(null);

  const filteredParticipantes = participantesState.filter(p =>
    p.nombre.toLowerCase().includes(searchParticipante.toLowerCase()) ||
    p.rut.includes(searchParticipante)
  );

  const handleFirmaParticipanteClick = (globalIdx: number, status: string) => {
    if (status === 'FALTANTE') {
      setUploadTarget(globalIdx);
      setUploadedFile(null);
      setUploadModalOpen(true);
    } else if (status === 'POR VALIDAR') {
      setValidationTarget(globalIdx);
      setPreviewFile(false);
      setValidationModalOpen(true);
    } else if (status === 'VALIDADO') {
      setViewDocTarget(globalIdx);
      setViewDocModalOpen(true);
    }
  };

  const handleDownloadPrecontrato = () => {
    if (viewDocTarget !== null) {
      const p = participantesState[viewDocTarget];
      const fileName = `${precontrato.sencenet}_Precontrato_${p.nombre.replace(/\s+/g, '_')}.pdf`;
      const blob = new Blob(['Contenido del precontrato'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Documento descargado: ${fileName}`);
    }
  };

  const handleSubirLegajo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Mark all participants as VALIDADO
    setParticipantesState(prev =>
      prev.map(p => ({
        ...p,
        firmaEmpresa: 'FIRMADO' as const,
        firmaParticipante: 'VALIDADO' as const,
        vulnerabilidad: p.vulnerabilidad === 'FALTANTE' ? 'SIN VULNERABILIDAD' as const : p.vulnerabilidad,
      }))
    );
    toast.success(`Legajo "${file.name}" subido correctamente. Todos los participantes han sido validados.`);
    // Reset input
    if (legajoInputRef.current) legajoInputRef.current.value = '';
  };

  const handleDescargarLegajo = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 0;

    const addNewPage = () => { doc.addPage(); y = margin; };
    const checkPage = (needed: number) => { if (y + needed > 280) addNewPage(); };

    // --- Cover page ---
    y = 60;
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LEGAJO DE PRECONTRATO', pageWidth / 2, y, { align: 'center' });
    y += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Curso: ${precontrato.curso}`, pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.text(`Sencenet: ${precontrato.sencenet}`, pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.text(`Empresa: ${precontrato.empresaNombre}`, pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.text(`OTEC: ${precontrato.otecNombre}`, pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.text(`Periodo: ${precontrato.inicioTermino}`, pageWidth / 2, y, { align: 'center' });
    y += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total participantes: ${participantesState.length}`, pageWidth / 2, y, { align: 'center' });
    y += 20;

    // Order info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const orderItems = [
      'Orden del legajo por participante:',
      '1. Precontrato',
      '2. Cedula de Identidad',
      '3. Registro Social de Hogares',
      '4. Autorizacion del Tutor',
      '5. Cedula de Identidad del Tutor',
    ];
    orderItems.forEach(item => {
      doc.text(item, pageWidth / 2, y, { align: 'center' });
      y += 6;
    });

    // --- Per participant ---
    participantesState.forEach((p, idx) => {
      // === 1. PRECONTRATO ===
      addNewPage();
      doc.setFillColor(0, 128, 128);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Participante ${idx + 1} de ${participantesState.length} - ${p.nombre} - RUT: ${p.rut}`, pageWidth / 2, 8, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      y = 25;

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTRATO DE CAPACITACION', pageWidth / 2, y, { align: 'center' });
      y += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const contractText = `En ANTOFAGASTA a 2 de Septiembre del 2025, entre la Empresa ${precontrato.empresaNombre.toUpperCase()}, R.U.T. No${precontrato.empresaRut}, representada por don ${precontrato.repLegalNombre}, ambos domiciliados en la ciudad de Antofagasta, en adelante la empresa, y Don(a) ${p.nombre.toUpperCase()}, Cedula Nacional de Identidad No ${p.rut}, en adelante el capacitado, se ha convenido el siguiente Contrato de Capacitacion.`;
      const lines = doc.splitTextToSize(contractText, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 10;

      // Course table
      checkPage(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const tableHeaders = ['COD. SENCE', 'NOMBRE CURSO', 'OTEC', 'DURACION', 'FECHA INICIO/TERMINO'];
      const colWidths = [30, 40, 40, 25, 35];
      let tx = margin;
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, y - 3, contentWidth, 8, 'F');
      tableHeaders.forEach((h, i) => {
        doc.text(h, tx + 1, y + 2);
        tx += colWidths[i];
      });
      y += 10;

      doc.setFont('helvetica', 'normal');
      tx = margin;
      const tableData = [precontrato.codigoSence, precontrato.curso.substring(0, 25), precontrato.otecNombre.substring(0, 25), '200 hrs', precontrato.inicioTermino];
      tableData.forEach((d, i) => {
        doc.text(d, tx + 1, y + 2);
        tx += colWidths[i];
      });
      doc.rect(margin, y - 3, contentWidth, 8);
      y += 15;

      // Numbered clauses
      checkPage(40);
      doc.setFontSize(9);
      const clauses = [
        '1. El Capacitado se obliga a asistir a los siguientes cursos, sin perjuicio de ser modificado(s) el lugar y horario.',
        '2. El presente contrato tendra una duracion de acuerdo al periodo indicado en la tabla anterior.',
        '3. La empresa se obliga a pagar al capacitado la suma correspondiente al costo del curso.',
        '4. El capacitado declara conocer y aceptar las condiciones del presente contrato de capacitacion.',
      ];
      clauses.forEach(c => {
        checkPage(10);
        const cl = doc.splitTextToSize(c, contentWidth);
        doc.text(cl, margin, y);
        y += cl.length * 4.5 + 3;
      });

      y += 15;
      checkPage(25);
      doc.line(margin, y, margin + 60, y);
      doc.line(pageWidth - margin - 60, y, pageWidth - margin, y);
      y += 5;
      doc.setFontSize(8);
      doc.text('Firma Empresa', margin + 15, y);
      doc.text('Firma Participante', pageWidth - margin - 50, y);

      // === 2. CEDULA DE IDENTIDAD ===
      addNewPage();
      doc.setFillColor(0, 128, 128);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Cedula de Identidad - ${p.nombre}`, pageWidth / 2, 8, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      y = 30;

      doc.setFontSize(14);
      doc.text('CEDULA DE IDENTIDAD', pageWidth / 2, y, { align: 'center' });
      y += 15;
      doc.setDrawColor(180, 180, 180);
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin + 10, y, contentWidth - 20, 60, 3, 3, 'FD');
      y += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${p.nombre}`, margin + 20, y); y += 8;
      doc.text(`RUT: ${p.rut}`, margin + 20, y); y += 8;
      doc.text(`Nacionalidad: Chilena`, margin + 20, y); y += 8;
      doc.text(`[Imagen del documento de identidad]`, margin + 20, y);

      // === 3. REGISTRO SOCIAL DE HOGARES ===
      addNewPage();
      doc.setFillColor(0, 128, 128);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Registro Social de Hogares - ${p.nombre}`, pageWidth / 2, 8, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      y = 30;

      doc.setFontSize(14);
      doc.text('REGISTRO SOCIAL DE HOGARES', pageWidth / 2, y, { align: 'center' });
      y += 15;
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin + 10, y, contentWidth - 20, 50, 3, 3, 'FD');
      y += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Participante: ${p.nombre}`, margin + 20, y); y += 8;
      doc.text(`RUT: ${p.rut}`, margin + 20, y); y += 8;
      doc.text(`[Documento de Registro Social de Hogares]`, margin + 20, y);

      // === 4. AUTORIZACION DEL TUTOR ===
      addNewPage();
      doc.setFillColor(0, 128, 128);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Autorizacion del Tutor - ${p.nombre}`, pageWidth / 2, 8, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      y = 30;

      doc.setFontSize(14);
      doc.text('AUTORIZACION DEL TUTOR', pageWidth / 2, y, { align: 'center' });
      y += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const authText = `Yo, en calidad de tutor/a legal del participante ${p.nombre}, RUT ${p.rut}, autorizo su participacion en el curso "${precontrato.curso}" impartido por ${precontrato.otecNombre}, en el periodo ${precontrato.inicioTermino}.`;
      const authLines = doc.splitTextToSize(authText, contentWidth);
      doc.text(authLines, margin, y);
      y += authLines.length * 5 + 20;

      checkPage(25);
      doc.line(margin, y, margin + 60, y);
      y += 5;
      doc.setFontSize(8);
      doc.text('Firma del Tutor', margin + 15, y);

      // === 5. CEDULA DE IDENTIDAD DEL TUTOR ===
      addNewPage();
      doc.setFillColor(0, 128, 128);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Cedula de Identidad del Tutor - ${p.nombre}`, pageWidth / 2, 8, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      y = 30;

      doc.setFontSize(14);
      doc.text('CEDULA DE IDENTIDAD DEL TUTOR', pageWidth / 2, y, { align: 'center' });
      y += 15;
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin + 10, y, contentWidth - 20, 50, 3, 3, 'FD');
      y += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Tutor del participante: ${p.nombre}`, margin + 20, y); y += 8;
      doc.text(`[Imagen del documento de identidad del tutor]`, margin + 20, y);
    });

    const fileName = `${precontrato.sencenet}_Legajo_Precontrato_${precontrato.curso.replace(/\s+/g, '_').substring(0, 50)}.pdf`;
    doc.save(fileName);
    toast.success(`Legajo descargado: ${fileName}`);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleCargarPrecontrato = () => {
    if (uploadTarget !== null && uploadedFile) {
      setParticipantesState(prev => prev.map((p, i) =>
        i === uploadTarget ? { ...p, firmaParticipante: 'POR VALIDAR' as const } : p
      ));
      setUploadModalOpen(false);
      setUploadedFile(null);
      toast.success('Se ha subido el documento con éxito');
    }
  };

  const handleSolicitarCorreccion = (idx: number) => {
    const p = participantesState[idx];
    setCorrectionTarget(idx);
    setCorrectionEmail(p.correo.toLowerCase());
    setCorrectionObservaciones('');
    setValidationModalOpen(false);
    setCorrectionModalOpen(true);
  };

  const handleEnviarCorreccion = () => {
    if (correctionTarget !== null) {
      setParticipantesState(prev => prev.map((p, i) =>
        i === correctionTarget ? { ...p, firmaParticipante: 'EN CORRECCIÓN' as const } : p
      ));
      setCorrectionModalOpen(false);
      toast.success('Solicitud de corrección enviada');
    }
  };

  const handleValidarDocumento = () => {
    if (validationTarget !== null) {
      setParticipantesState(prev => prev.map((p, i) =>
        i === validationTarget ? { ...p, firmaParticipante: 'VALIDADO' as const } : p
      ));
      setValidationModalOpen(false);
      toast.success('Documento validado exitosamente');
    }
  };

  const handleReemplazarDocumento = () => {
    if (validationTarget !== null) {
      setValidationModalOpen(false);
      setUploadTarget(validationTarget);
      setUploadedFile(null);
      setUploadModalOpen(true);
    }
  };

  const targetParticipante = uploadTarget !== null ? participantesState[uploadTarget] : null;
  const validationParticipante = validationTarget !== null ? participantesState[validationTarget] : null;
  const correctionParticipante = correctionTarget !== null ? participantesState[correctionTarget] : null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </button>

      {/* Detalle del curso - Collapsible */}
      <div className="border rounded-lg bg-background">
        <button
          onClick={() => setDetalleOpen(!detalleOpen)}
          className="w-full flex items-center justify-between p-3 text-left"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-foreground">Detalle del curso</h2>
            <Button variant="outline" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); }}>
              <Mail className="h-3.5 w-3.5 mr-1" />
              RECORDATORIO MASIVO
            </Button>
          </div>
          {detalleOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {detalleOpen && (
          <div className="px-3 pb-3 space-y-3">
            {/* Curso info */}
            <div className="flex items-start gap-3 border-b pb-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 grid grid-cols-5 gap-2 text-xs">
                <div><p className="text-primary font-medium">Curso</p><p className="text-foreground leading-tight">{precontrato.curso}</p></div>
                <div><p className="text-primary font-medium">Sencenet</p><p className="text-foreground">{precontrato.sencenet}</p></div>
                <div><p className="text-primary font-medium">Código Sence</p><p className="text-foreground">{precontrato.codigoSence}</p></div>
                <div><p className="text-primary font-medium">Tipo de contrato</p><p className="text-foreground font-semibold">{precontrato.tipoContrato}</p></div>
                <div><p className="text-primary font-medium">Inicio y término</p><p className="text-foreground">{precontrato.inicioTermino}</p></div>
              </div>
            </div>

            {/* Días de plazo, Preinscripción, Célula */}
            <div className="flex items-start gap-3 border-b pb-3 pl-11">
              <div className="grid grid-cols-3 gap-6 text-xs">
                <div>
                  <p className="text-primary font-medium">Días de plazo</p>
                  <span className="inline-flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full px-2 py-0.5 mt-0.5">{precontrato.diasPlazo}</span>
                </div>
                <div><p className="text-primary font-medium">Preinscripción</p><p className="text-foreground">{precontrato.preinscripcion}</p></div>
                <div><p className="text-primary font-medium">Célula</p><p className="text-foreground">{precontrato.celula}</p></div>
              </div>
            </div>

            {/* Empresa info */}
            <div className="flex items-start gap-3 border-b pb-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 grid grid-cols-4 gap-2 text-xs">
                <div><p className="text-primary font-medium">Empresa</p><p className="text-foreground">{precontrato.empresaNombre}</p></div>
                <div><p className="text-primary font-medium">RUT</p><p className="text-foreground">{precontrato.empresaRut}</p></div>
                <div><p className="text-primary font-medium">Nombre Rep. Legal</p><p className="text-foreground">{precontrato.repLegalNombre}</p></div>
                <div><p className="text-primary font-medium">C.I. Rep. Legal</p><p className="text-foreground">{precontrato.repLegalCi}</p></div>
              </div>
            </div>

            {/* OTEC info */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                <div><p className="text-primary font-medium">Otec</p><p className="text-foreground">{precontrato.otecNombre}</p></div>
                <div><p className="text-primary font-medium">RUT</p><p className="text-foreground">{precontrato.otecRut}</p></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Precontrato - Participantes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">Precontrato</h2>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{participantesState.length} participantes activos</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-teal-600 text-teal-700 hover:bg-teal-50"
              onClick={handleDescargarLegajo}
            >
              <FileDown className="h-3.5 w-3.5 mr-1" />
              DESCARGA LEGAJO DE PRECONTRATO
              <span className="bg-blue-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full ml-1">C1PPPC3</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-amber-600 text-amber-700 hover:bg-amber-50"
              onClick={() => legajoInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5 mr-1" />
              SUBIR LEGAJO DE PRECONTRATO
              <span className="bg-blue-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full ml-1">C1PPPC15</span>
            </Button>
            <input
              ref={legajoInputRef}
              type="file"
              accept=".pdf,.zip"
              className="hidden"
              onChange={handleSubirLegajo}
            />
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o rut"
                value={searchParticipante}
                onChange={(e) => setSearchParticipante(e.target.value)}
                className="pl-8 h-8 text-xs w-[200px]"
              />
            </div>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-xs table-fixed">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-2 text-left font-medium text-primary">Nombre participante</th>
                <th className="p-2 text-left font-medium text-primary">Rut</th>
                <th className="p-2 text-left font-medium text-primary">Correo</th>
                <th className="p-2 text-left font-medium text-primary">Teléfono</th>
                <th className="p-2 text-center font-medium text-primary">Firma<br/>empresa</th>
                <th className="p-2 text-center font-medium text-primary">Firma<br/>particip.</th>
                <th className="p-2 text-center font-medium text-primary">Autoriz.<br/>menor</th>
                <th className="p-2 text-center font-medium text-primary">Vulner.</th>
                <th className="p-2 text-left font-medium text-primary">Último recordatorio</th>
                <th className="p-2 text-center font-medium text-primary w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipantes.map((p) => {
                const globalIdx = participantesState.findIndex(pp => pp.rut === p.rut);
                return (
                  <tr key={p.rut} className={`border-b ${globalIdx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20`}>
                    <td className="p-2 text-primary font-medium truncate">{p.nombre}</td>
                    <td className="p-2 truncate">{p.rut}</td>
                    <td className="p-2 text-muted-foreground truncate">{p.correo}</td>
                    <td className="p-2">{p.telefono}</td>
                    <td className="p-2 text-center">{getStatusBadge(p.firmaEmpresa)}</td>
                    <td className="p-2 text-center">
                      {getStatusBadge(
                        p.firmaParticipante,
                        (p.firmaParticipante === 'FALTANTE' || p.firmaParticipante === 'POR VALIDAR' || p.firmaParticipante === 'VALIDADO')
                          ? () => handleFirmaParticipanteClick(globalIdx, p.firmaParticipante)
                          : undefined
                      )}
                    </td>
                    <td className="p-2 text-center">{getStatusBadge(p.autorizMenor)}</td>
                    <td className="p-2 text-center">{getStatusBadge(p.vulnerabilidad)}</td>
                    <td className="p-2 text-muted-foreground truncate">{p.ultimoRecordatorio}</td>
                    <td className="p-2 text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <button className="text-muted-foreground hover:text-foreground"><Mail className="h-3 w-3" /></button>
                        <button className="text-muted-foreground hover:text-foreground"><FileDown className="h-3 w-3" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Upload Modal ── */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <DialogTitle className="text-white text-base font-semibold">
              Cargar Precontrato · RUT {targetParticipante?.rut} · {targetParticipante?.nombre}
            </DialogTitle>
          </div>
          <div className="px-6 py-4 space-y-4">
            {/* Course info header */}
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 grid grid-cols-5 gap-3 text-xs">
                <div><p className="text-muted-foreground font-medium">Curso</p><p className="text-foreground">{precontrato.curso}</p></div>
                <div><p className="text-muted-foreground font-medium">Sencenet</p><p className="text-foreground">{precontrato.sencenet}</p></div>
                <div><p className="text-muted-foreground font-medium">Código Sence</p><p className="text-foreground">{precontrato.codigoSence}</p></div>
                <div><p className="text-muted-foreground font-medium">Inicio y término</p><p className="text-foreground">{precontrato.inicioTermino}</p></div>
                <div><p className="text-muted-foreground font-medium">Participantes activos</p><p className="text-foreground">{participantesState.length}</p></div>
              </div>
            </div>

            {/* Drop zone */}
            <div
              className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileUpload(file);
              }}
            >
              {uploadedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Arrastra el archivo aquí o presiona para seleccionarlo</p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <button className="text-sm text-red-600 font-medium hover:underline">ELIMINAR</button>
            <div className="flex items-center gap-3">
              <button className="text-sm font-medium text-foreground hover:underline" onClick={() => setUploadModalOpen(false)}>CANCELAR</button>
              <Button
                size="sm"
                disabled={!uploadedFile}
                className="bg-teal-700 hover:bg-teal-800 text-white"
                onClick={handleCargarPrecontrato}
              >
                CARGAR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Validation Actions Modal (POR VALIDAR) ── */}
      <Dialog open={validationModalOpen} onOpenChange={setValidationModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <DialogTitle className="text-white text-base font-semibold">
              Precontrato · Nº Inscripción {precontrato.nroInscripcion} · RUT {validationParticipante?.rut} · {validationParticipante?.nombre} · POR VALIDAR
            </DialogTitle>
          </div>
          <div className="px-6 py-4 space-y-4">
            {/* Course info */}
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 grid grid-cols-5 gap-3 text-xs">
                <div><p className="text-muted-foreground font-medium">Curso</p><p className="text-foreground">{precontrato.curso}</p></div>
                <div><p className="text-muted-foreground font-medium">Sencenet</p><p className="text-foreground">{precontrato.sencenet}</p></div>
                <div><p className="text-muted-foreground font-medium">Código Sence</p><p className="text-foreground">{precontrato.codigoSence}</p></div>
                <div><p className="text-muted-foreground font-medium">Inicio y término</p><p className="text-foreground">{precontrato.inicioTermino}</p></div>
                <div><p className="text-muted-foreground font-medium">Participantes activos</p><p className="text-foreground">{participantesState.length}</p></div>
              </div>
            </div>

            {/* Document preview placeholder */}
            <div className="bg-muted/20 border rounded-lg h-64 flex items-center justify-center">
              <div className="text-center space-y-2">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Vista previa del documento cargado</p>
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 px-6 py-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => validationTarget !== null && handleSolicitarCorreccion(validationTarget)}
            >
              <Mail className="h-3.5 w-3.5 mr-1" />
              SOLICITAR CORRECCIÓN
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleValidarDocumento}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              VALIDAR DOCUMENTO
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReemplazarDocumento}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              REEMPLAZAR DOCUMENTO
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Correction Email Modal ── */}
      <Dialog open={correctionModalOpen} onOpenChange={setCorrectionModalOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <DialogTitle className="text-white text-base font-semibold">
              Solicitar corrección · RUT {correctionParticipante?.rut} · {correctionParticipante?.nombre} · POR VALIDAR
            </DialogTitle>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground font-medium w-12">Para</span>
              <Input value={correctionEmail} onChange={(e) => setCorrectionEmail(e.target.value)} className="flex-1" />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground font-medium w-12">Asunto</span>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-teal-600" />
                <span>Solicitar corrección</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Observaciones del documento</span>
                <span className="text-xs text-muted-foreground">{correctionObservaciones.length}/1500</span>
              </div>
              <Textarea
                value={correctionObservaciones}
                onChange={(e) => setCorrectionObservaciones(e.target.value.slice(0, 1500))}
                placeholder="Escriba las observaciones..."
                className="min-h-[150px]"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
            <button className="text-sm font-medium text-foreground hover:underline" onClick={() => setCorrectionModalOpen(false)}>CANCELAR</button>
            <Button
              size="sm"
              className="bg-teal-700 hover:bg-teal-800 text-white"
              onClick={handleEnviarCorreccion}
            >
              ENVIAR
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Validated Document Viewer Modal */}
      <Dialog open={viewDocModalOpen} onOpenChange={setViewDocModalOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          {viewDocTarget !== null && participantesState[viewDocTarget] && (() => {
            const p = participantesState[viewDocTarget];
            return (
              <>
                {/* Header */}
                <div className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium">
                      Precontrato · Nº Inscripción {precontrato.nroInscripcion} · RUT {p.rut} · {p.nombre} · VALIDADO
                    </p>
                    <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">C1PPPC3</span>
                  </div>
                </div>

                {/* Course info bar */}
                <div className="bg-muted/30 px-6 py-3 flex items-center gap-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-xs">
                      <p className="text-primary font-medium">Curso</p>
                      <p className="text-foreground">{precontrato.curso}</p>
                    </div>
                  </div>
                  <div className="text-xs">
                    <p className="text-primary font-medium">Sencenet</p>
                    <p className="text-foreground">{precontrato.sencenet}</p>
                  </div>
                  <div className="text-xs">
                    <p className="text-primary font-medium">Código Sence</p>
                    <p className="text-foreground">{precontrato.codigoSence}</p>
                  </div>
                  <div className="text-xs">
                    <p className="text-primary font-medium">Inicio y término</p>
                    <p className="text-foreground">{precontrato.inicioTermino}</p>
                  </div>
                  <div className="text-xs">
                    <p className="text-primary font-medium">Participantes activos</p>
                    <p className="text-foreground">{precontrato.participantes.length}</p>
                  </div>
                </div>

                {/* Document preview area */}
                <div className="bg-muted/20 flex flex-col items-center justify-center min-h-[400px] p-6">
                  <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-10 space-y-6 text-sm text-foreground border">
                    <h3 className="text-center font-bold text-base">CONTRATO DE CAPACITACIÓN</h3>
                    <p className="text-justify leading-relaxed">
                      En ANTOFAGASTA a 2 de Septiembre del 2025, entre la Empresa <strong>{precontrato.empresaNombre.toUpperCase()}</strong>, R.U.T. Nº{precontrato.empresaRut}, representada por don <strong>{precontrato.repLegalNombre}</strong>, ambos domiciliados en la ciudad de Antofagasta, en adelante la empresa, y Don(ña) <strong>{p.nombre.toUpperCase()}</strong>, Cédula Nacional de Identidad Nº {p.rut}, en adelante el capacitado, se ha convenido el siguiente Contrato de Capacitación.
                    </p>
                    <div className="border rounded overflow-hidden">
                      <table className="w-full text-[10px]">
                        <thead>
                          <tr className="bg-muted/40 border-b">
                            <th className="p-1.5 border-r text-left font-semibold">CÓDIGO SENCE</th>
                            <th className="p-1.5 border-r text-left font-semibold">NOMBRE CURSO</th>
                            <th className="p-1.5 border-r text-left font-semibold">OTEC</th>
                            <th className="p-1.5 border-r text-left font-semibold">DURACIÓN EN HORAS</th>
                            <th className="p-1.5 text-left font-semibold">FECHA INICIO/TÉRMINO</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-1.5 border-r">{precontrato.codigoSence}</td>
                            <td className="p-1.5 border-r">{precontrato.curso}</td>
                            <td className="p-1.5 border-r">{precontrato.otecNombre}</td>
                            <td className="p-1.5 border-r text-center">200</td>
                            <td className="p-1.5">{precontrato.inicioTermino}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer with download button */}
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>El archivo se descarga con el nombre que indica el Sence y el nombre del participante</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewDocModalOpen(false)}
                    >
                      CERRAR
                    </Button>
                    <Button
                      size="sm"
                      className="bg-teal-700 hover:bg-teal-800 text-white"
                      onClick={handleDownloadPrecontrato}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      DESCARGAR
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ── Main Component ──

const Precontratos: React.FC = () => {
  const [selectedModulares, setSelectedModulares] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('precontratos');
  const [subTab, setSubTab] = useState('pendientes');
  const [celulaFilter, setCelulaFilter] = useState('todas');
  const [criticidadAlta, setCriticidadAlta] = useState(true);
  const [criticidadMedia, setCriticidadMedia] = useState(true);
  const [criticidadBaja, setCriticidadBaja] = useState(true);
  const [selectedPrecontrato, setSelectedPrecontrato] = useState<PrecontratoNormal | null>(null);
  const [selectedCerrado, setSelectedCerrado] = useState<PrecontratoCerrado | null>(null);

  const handleSelectModular = (sc: string, checked: boolean) => {
    setSelectedModulares(prev =>
      checked ? [...prev, sc] : prev.filter(s => s !== sc)
    );
  };

  const handleSelectModulo = (modulo: string, checked: boolean) => {
    const grupo = precontratosModulares.find(m => m.modulo === modulo);
    if (!grupo) return;
    const scs = grupo.cursos.map(c => c.sc);
    setSelectedModulares(prev =>
      checked ? [...new Set([...prev, ...scs])] : prev.filter(s => !scs.includes(s))
    );
  };

  const filteredNormales = precontratosNormalesData.filter(p => {
    if (p.criticidad === 'alta' && !criticidadAlta) return false;
    if (p.criticidad === 'media' && !criticidadMedia) return false;
    if (p.criticidad === 'baja' && !criticidadBaja) return false;
    return true;
  });

  const filteredProximos = precontratosProximosAVencer.filter(p => {
    if (celulaFilter !== 'todas' && p.celula !== celulaFilter) return false;
    return true;
  });


  const cerradoToNormal = (c: PrecontratoCerrado): PrecontratoNormal => ({
    diasPlazo: 0,
    nroInscripcion: c.nroInscripcion,
    sencenet: c.sencenet,
    curso: c.curso,
    empresa: c.empresa,
    empresaRut: c.empresaRut,
    empresaNombre: c.empresaNombre,
    otecNombre: c.otecNombre,
    otecRut: c.otecRut,
    codigoSence: c.codigoSence,
    tipoContrato: c.tipoContrato,
    inicioTermino: c.inicioTermino,
    preinscripcion: c.preinscripcion,
    precontratosFaltantes: c.precontratosFirmados,
    autorizMenores: '0/0',
    vulnerabilidad: 0,
    celula: c.celula,
    criticidad: 'baja',
    repLegalNombre: c.repLegalNombre,
    repLegalCi: c.repLegalCi,
    participantes: c.participantes,
  });

  // If a precontrato is selected, show detail view
  if (selectedPrecontrato) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Conecccta</h1>
            <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">C1PPPC11</span>
          </div>
        </div>
        <PrecontratoDetailView
          precontrato={selectedPrecontrato}
          onBack={() => setSelectedPrecontrato(null)}
        />
      </div>
    );
  }

  // If a cerrado is selected, show detail view
  if (selectedCerrado) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Conecccta</h1>
            <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">C1PPPC11</span>
          </div>
        </div>
        <PrecontratoDetailView
          precontrato={cerradoToNormal(selectedCerrado)}
          onBack={() => setSelectedCerrado(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Conecccta</h1>
          <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">C1PPPC11</span>
        </div>
        <p className="text-muted-foreground">Gestión de precontratos y precontratos modulares</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="precontratos">Precontratos (Normal)</TabsTrigger>
          <TabsTrigger value="modulares">Precontratos Modulares</TabsTrigger>
          <TabsTrigger value="inscritos-modulares">Modulares</TabsTrigger>
        </TabsList>

        {/* ── Tab: Precontratos ── */}
        <TabsContent value="precontratos" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="border rounded-lg p-4 space-y-3 bg-background">
            <div className="grid grid-cols-3 gap-4">
              <Select>
                <SelectTrigger><SelectValue placeholder="Nº Inscripción" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent>
              </Select>
              <Select>
                <SelectTrigger><SelectValue placeholder="Sencenet" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent>
              </Select>
              <Select>
                <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <Select>
                <SelectTrigger><SelectValue placeholder="Empresa" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todas</SelectItem></SelectContent>
              </Select>
              <Select>
                <SelectTrigger><SelectValue placeholder="OTEC" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todas</SelectItem></SelectContent>
              </Select>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground">Criticidad</span>
                <label className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={criticidadAlta} onCheckedChange={(c) => setCriticidadAlta(!!c)} className="border-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                  Alta
                </label>
                <label className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={criticidadMedia} onCheckedChange={(c) => setCriticidadMedia(!!c)} className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                  Media
                </label>
                <label className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={criticidadBaja} onCheckedChange={(c) => setCriticidadBaja(!!c)} className="border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />
                  Baja
                </label>
              </div>
            </div>
          </div>

          {/* Sub-tabs + Download */}
          <div className="flex items-center justify-between">
            <div className="flex border-b">
              <button
                onClick={() => setSubTab('pendientes')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${subTab === 'pendientes' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                PENDIENTES
              </button>
              <button
                onClick={() => setSubTab('cerrados')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${subTab === 'cerrados' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                CERRADOS
              </button>
              <button
                onClick={() => setSubTab('proximos')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${subTab === 'proximos' ? 'border-orange-500 text-orange-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                PRÓXIMOS A VENCER
                <span className="bg-blue-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full ml-1">C1PPPC17</span>
              </button>
            </div>
            <Button variant="default" size="sm" className="bg-teal-700 hover:bg-teal-800 text-white">
              <Download className="h-4 w-4 mr-1" />
              DESCARGAR
            </Button>
          </div>

          {/* Table - Pendientes */}
          {subTab === 'pendientes' && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Días de<br/>plazo</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[9%]">Nº<br/>Inscripción</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Sencenet</th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[20%]">Curso</th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[20%]">Empresa</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[10%]">Precontratos<br/>faltantes</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Autoriz.<br/>Menores</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[9%]">Vulnerabilidad</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[4%]"></th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[6%]">Célula</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNormales.map((p, idx) => (
                    <tr
                      key={p.nroInscripcion}
                      className={`border-b ${idx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20 cursor-pointer`}
                      onClick={() => setSelectedPrecontrato(p)}
                    >
                      <td className="p-2 text-center">
                        <span className="inline-flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full px-2 py-0.5 min-w-[36px]">
                          {p.diasPlazo}
                        </span>
                      </td>
                      <td className="p-2 text-center">{p.nroInscripcion}</td>
                      <td className="p-2 text-center">{p.sencenet}</td>
                      <td className="p-2">{p.curso}</td>
                      <td className="p-2 text-muted-foreground">{p.empresa}</td>
                      <td className="p-2 text-center">
                        <span className={`inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium ${getCriticidadColor(p.precontratosFaltantes)}`}>
                          {p.precontratosFaltantes}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span className="inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium text-green-700 bg-green-50 border-green-200">
                          {p.autorizMenores}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span className="inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/30 border-border">
                          {p.vulnerabilidad}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <button className="text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </td>
                      <td className="p-2 text-center text-muted-foreground">{p.celula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table - Cerrados */}
          {subTab === 'cerrados' && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">Fecha de<br/>cierre</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[10%]">Nº<br/>Inscripción</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Sencenet</th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[30%]">Curso</th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[22%]">Empresa</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[12%]">Precontratos<br/>firmados</th>
                    <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Célula</th>
                  </tr>
                </thead>
                <tbody>
                  {precontratosCerradosData.map((p, idx) => (
                    <tr key={p.nroInscripcion} className={`border-b ${idx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20 cursor-pointer`} onClick={() => setSelectedCerrado(p)}>
                      <td className="p-2">{p.fechaCierre}</td>
                      <td className="p-2 text-center">{p.nroInscripcion}</td>
                      <td className="p-2 text-center">{p.sencenet}</td>
                      <td className="p-2">{p.curso}</td>
                      <td className="p-2 text-muted-foreground">{p.empresa}</td>
                      <td className="p-2 text-center">
                        <span className="inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium text-green-700 bg-green-50 border-green-200">
                          {p.precontratosFirmados}
                        </span>
                      </td>
                      <td className="p-2 text-center text-muted-foreground">{p.celula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table - Próximos a Vencer */}
          {subTab === 'proximos' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">Célula Operacional:</span>
                <Select value={celulaFilter} onValueChange={setCelulaFilter}>
                  <SelectTrigger className="w-[180px] h-8 text-xs">
                    <SelectValue placeholder="Todas las células" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las células</SelectItem>
                    {celulasOperacionales.map(cel => (
                      <SelectItem key={cel} value={cel}>{cel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-xs text-orange-600 font-medium">
                  {filteredProximos.length} curso{filteredProximos.length !== 1 ? 's' : ''} próximo{filteredProximos.length !== 1 ? 's' : ''} a vencer (≤10 días)
                </span>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-orange-50/50">
                      <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Días<br/>restantes</th>
                      <th className="p-2 text-center font-medium text-muted-foreground w-[9%]">Nº<br/>Inscripción</th>
                      <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Sencenet</th>
                      <th className="p-2 text-left font-medium text-muted-foreground w-[20%]">Curso</th>
                      <th className="p-2 text-left font-medium text-muted-foreground w-[20%]">Empresa</th>
                      <th className="p-2 text-center font-medium text-muted-foreground w-[10%]">Precontratos<br/>faltantes</th>
                      <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Autoriz.<br/>Menores</th>
                      <th className="p-2 text-center font-medium text-muted-foreground w-[9%]">Vulnerabilidad</th>
                      <th className="p-2 text-center font-medium text-muted-foreground w-[6%]">Célula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProximos.sort((a, b) => a.diasPlazo - b.diasPlazo).map((p, idx) => (
                      <tr
                        key={p.nroInscripcion}
                        className={`border-b ${idx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20 cursor-pointer`}
                        onClick={() => setSelectedPrecontrato(p)}
                      >
                        <td className="p-2 text-center">
                          <span className={`inline-flex items-center justify-center text-white text-[10px] font-bold rounded-full px-2 py-0.5 min-w-[36px] ${p.diasPlazo <= 3 ? 'bg-red-600' : p.diasPlazo <= 7 ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                            {p.diasPlazo}d
                          </span>
                        </td>
                        <td className="p-2 text-center">{p.nroInscripcion}</td>
                        <td className="p-2 text-center">{p.sencenet}</td>
                        <td className="p-2">{p.curso}</td>
                        <td className="p-2 text-muted-foreground">{p.empresa}</td>
                        <td className="p-2 text-center">
                          <span className={`inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium ${getCriticidadColor(p.precontratosFaltantes)}`}>
                            {p.precontratosFaltantes}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <span className="inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium text-green-700 bg-green-50 border-green-200">
                            {p.autorizMenores}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <span className="inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/30 border-border">
                            {p.vulnerabilidad}
                          </span>
                        </td>
                        <td className="p-2 text-center text-muted-foreground">{p.celula}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Tab: Precontratos Modulares ── */}
        <TabsContent value="modulares" className="space-y-4 mt-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-xs table-fixed">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-2 w-8"></th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[12%]">Módulo</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">S.C.</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[30%]">Cliente</th>
                  <th className="p-2 text-center font-medium text-muted-foreground w-[10%]">Nro. Part.</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[15%]">M.T. Franquicia</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[15%]">Inicio Curso</th>
                </tr>
              </thead>
              <tbody>
                {precontratosModulares.map((modulo) => (
                  <React.Fragment key={modulo.modulo}>
                    <tr className="bg-muted/20 border-b">
                      <td className="p-2">
                        <Checkbox
                          checked={modulo.cursos.every(c => selectedModulares.includes(c.sc))}
                          onCheckedChange={(checked) => handleSelectModulo(modulo.modulo, !!checked)}
                        />
                      </td>
                      <td colSpan={6} className="p-2 font-semibold text-primary text-xs">
                        {modulo.modulo} - Seleccionar todos ({modulo.cursos.length} cursos)
                      </td>
                    </tr>
                    {modulo.cursos.map((curso, idx) => (
                      <tr key={curso.sc} className={`border-b ${idx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20`}>
                        <td className="p-2">
                          <Checkbox
                            checked={selectedModulares.includes(curso.sc)}
                            onCheckedChange={(checked) => handleSelectModular(curso.sc, !!checked)}
                          />
                        </td>
                        <td className="p-2 text-muted-foreground">{curso.moduloRef}</td>
                        <td className="p-2 font-medium">{curso.sc}</td>
                        <td className="p-2 text-muted-foreground">{curso.cliente}</td>
                        <td className="p-2 text-center">{curso.nroPart}</td>
                        <td className="p-2">{curso.mtFranquicia}</td>
                        <td className="p-2">{curso.inicioCurso}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Precontratos;
