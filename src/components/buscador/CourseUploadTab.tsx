import React, { useState, useRef, useMemo } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  MoreHorizontal,
  Pencil,
  Power,
  Search,
  FileCheck,
  Loader2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { toast } from 'sonner';

interface UploadedCourse {
  id: string;
  name: string;
  specialty: string;
  type: 'Sence' | 'No Sence';
  code: string;
  validUntil: string;
  price: number;
  modality: string;
  uploadDate: string;
  status: 'active' | 'inactive';
}

const CourseUploadTab: React.FC = () => {
  const [uploadedCourses, setUploadedCourses] = useState<UploadedCourse[]>([
    {
      id: '1',
      name: 'Excel Avanzado para Empresas',
      specialty: 'Ofimática',
      type: 'Sence',
      code: '1237889456',
      validUntil: '2026-12-31',
      price: 180000,
      modality: 'E-learning',
      uploadDate: '2025-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Liderazgo y Gestión de Equipos',
      specialty: 'Habilidades Blandas',
      type: 'Sence',
      code: '1237889457',
      validUntil: '2026-06-30',
      price: 350000,
      modality: 'Presencial',
      uploadDate: '2025-01-14',
      status: 'active'
    },
    {
      id: '3',
      name: 'Marketing Digital Básico',
      specialty: 'Marketing',
      type: 'No Sence',
      code: 'NS-001',
      validUntil: '2025-12-31',
      price: 150000,
      modality: 'E-learning',
      uploadDate: '2025-01-13',
      status: 'inactive'
    },
    {
      id: '4',
      name: 'Seguridad Industrial',
      specialty: 'Prevención de Riesgos',
      type: 'Sence',
      code: '1237889458',
      validUntil: '2026-03-15',
      price: 280000,
      modality: 'Presencial',
      uploadDate: '2025-01-12',
      status: 'active'
    },
    {
      id: '5',
      name: 'Comunicación Efectiva',
      specialty: 'Habilidades Blandas',
      type: 'No Sence',
      code: 'NS-002',
      validUntil: '2025-08-20',
      price: 120000,
      modality: 'Distancia',
      uploadDate: '2025-01-11',
      status: 'active'
    },
    {
      id: '6',
      name: 'Gestión de Proyectos Ágiles',
      specialty: 'Gestión',
      type: 'Sence',
      code: '1237889459',
      validUntil: '2026-09-01',
      price: 420000,
      modality: 'E-learning',
      uploadDate: '2025-01-10',
      status: 'inactive'
    },
    {
      id: '7',
      name: 'Inglés Técnico Nivel 1',
      specialty: 'Idiomas',
      type: 'Sence',
      code: '1237889460',
      validUntil: '2026-07-15',
      price: 220000,
      modality: 'E-learning',
      uploadDate: '2025-01-09',
      status: 'active'
    },
    {
      id: '8',
      name: 'Atención al Cliente Premium',
      specialty: 'Servicio al Cliente',
      type: 'No Sence',
      code: 'NS-003',
      validUntil: '2025-11-30',
      price: 95000,
      modality: 'E-learning',
      uploadDate: '2025-01-08',
      status: 'active'
    },
    {
      id: '9',
      name: 'Python para Análisis de Datos',
      specialty: 'Tecnología',
      type: 'Sence',
      code: '1237889461',
      validUntil: '2026-10-20',
      price: 380000,
      modality: 'E-learning',
      uploadDate: '2025-01-07',
      status: 'active'
    },
    {
      id: '10',
      name: 'Contabilidad Básica',
      specialty: 'Finanzas',
      type: 'Sence',
      code: '1237889462',
      validUntil: '2026-04-10',
      price: 250000,
      modality: 'Presencial',
      uploadDate: '2025-01-06',
      status: 'active'
    },
    {
      id: '11',
      name: 'Negociación Efectiva',
      specialty: 'Habilidades Blandas',
      type: 'Sence',
      code: '1237889463',
      validUntil: '2026-05-15',
      price: 290000,
      modality: 'Presencial',
      uploadDate: '2025-01-05',
      status: 'active'
    },
    {
      id: '12',
      name: 'Primeros Auxilios',
      specialty: 'Prevención de Riesgos',
      type: 'Sence',
      code: '1237889464',
      validUntil: '2026-08-20',
      price: 180000,
      modality: 'Presencial',
      uploadDate: '2025-01-04',
      status: 'active'
    },
    {
      id: '13',
      name: 'Word y PowerPoint Avanzado',
      specialty: 'Ofimática',
      type: 'Sence',
      code: '1237889465',
      validUntil: '2026-11-30',
      price: 160000,
      modality: 'E-learning',
      uploadDate: '2025-01-03',
      status: 'active'
    },
    {
      id: '14',
      name: 'Ventas Consultivas',
      specialty: 'Ventas',
      type: 'Sence',
      code: '1237889466',
      validUntil: '2026-02-28',
      price: 320000,
      modality: 'Presencial',
      uploadDate: '2025-01-02',
      status: 'inactive'
    },
    {
      id: '15',
      name: 'Gestión del Tiempo',
      specialty: 'Habilidades Blandas',
      type: 'Sence',
      code: '1237889467',
      validUntil: '2026-07-01',
      price: 140000,
      modality: 'E-learning',
      uploadDate: '2025-01-01',
      status: 'active'
    },
    {
      id: '16',
      name: 'Diseño Gráfico Básico',
      specialty: 'Diseño',
      type: 'No Sence',
      code: 'NS-004',
      validUntil: '2025-10-15',
      price: 175000,
      modality: 'E-learning',
      uploadDate: '2024-12-31',
      status: 'active'
    },
    {
      id: '17',
      name: 'Redes Sociales para Negocios',
      specialty: 'Marketing',
      type: 'No Sence',
      code: 'NS-005',
      validUntil: '2025-09-20',
      price: 130000,
      modality: 'E-learning',
      uploadDate: '2024-12-30',
      status: 'active'
    },
    {
      id: '18',
      name: 'Fotografía Profesional',
      specialty: 'Diseño',
      type: 'No Sence',
      code: 'NS-006',
      validUntil: '2025-12-01',
      price: 200000,
      modality: 'Presencial',
      uploadDate: '2024-12-29',
      status: 'inactive'
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [courseTypeTab, setCourseTypeTab] = useState<'sence' | 'no-sence'>('sence');
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [fileValidationStatus, setFileValidationStatus] = useState<'validating' | 'valid' | 'error'>('validating');
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [validCoursesCount, setValidCoursesCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ITEMS_PER_PAGE = 10;

  const filteredCourses = useMemo(() => {
    return uploadedCourses
      .filter(course => courseTypeTab === 'sence' ? course.type === 'Sence' : course.type === 'No Sence')
      .filter(course => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          course.name.toLowerCase().includes(query) ||
          course.specialty.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          course.modality.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }, [uploadedCourses, courseTypeTab, searchQuery]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast.error('Formato no válido', {
        description: 'Por favor sube un archivo Excel (.xlsx, .xls) o CSV.'
      });
      return;
    }

    // Reset validation state and show confirmation dialog
    setPendingFile(file);
    setFileValidationStatus('validating');
    setFileErrors([]);
    setValidCoursesCount(0);
    setShowUploadConfirmation(true);

    // Simulate file validation (in real app, this would parse the Excel)
    setTimeout(() => {
      // Simulate random validation result for demo
      const hasErrors = Math.random() > 0.7; // 30% chance of errors
      
      if (hasErrors) {
        setFileValidationStatus('error');
        setFileErrors([
          'Fila 3: El campo "Código Sence" está vacío',
          'Fila 7: El valor del campo "Precio" no es válido',
          'Fila 12: La fecha de vigencia tiene un formato incorrecto'
        ]);
      } else {
        setFileValidationStatus('valid');
        setValidCoursesCount(Math.floor(Math.random() * 10) + 5); // 5-15 courses
      }
    }, 1500);
  };

  const confirmUpload = () => {
    if (!pendingFile) return;

    const newCourses: UploadedCourse[] = [
      {
        id: `new-${Date.now()}`,
        name: 'Nuevo Curso Cargado',
        specialty: 'General',
        type: courseTypeTab === 'sence' ? 'Sence' : 'No Sence',
        code: courseTypeTab === 'sence' ? '1237889999' : 'NS-NEW',
        validUntil: '2026-12-31',
        price: 200000,
        modality: 'E-learning',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'active'
      }
    ];

    setUploadedCourses(prev => [...newCourses, ...prev]);
    setShowUploadConfirmation(false);
    
    toast.success('¡Cursos cargados exitosamente!', {
      description: `Se han procesado los cursos del archivo "${pendingFile.name}".`
    });
    
    setPendingFile(null);
  };

  const cancelUpload = () => {
    setShowUploadConfirmation(false);
    setPendingFile(null);
    setFileValidationStatus('validating');
    setFileErrors([]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDeleteCourse = (courseId: string) => {
    setUploadedCourses(prev => prev.filter(c => c.id !== courseId));
    toast.success('Curso eliminado correctamente');
  };

  const handleEditCourse = (courseId: string) => {
    toast.info('Editar curso', {
      description: `Editando curso ID: ${courseId}`
    });
  };

  const handleToggleCourseStatus = (courseId: string) => {
    setUploadedCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const newStatus = course.status === 'active' ? 'inactive' : 'active';
        toast.success(`Curso ${newStatus === 'active' ? 'activado' : 'desactivado'} correctamente`);
        return { ...course, status: newStatus };
      }
      return course;
    }));
  };

  const downloadTemplate = (type: 'sence' | 'no-sence') => {
    toast.success('Descargando plantilla', {
      description: `Plantilla de cursos ${type === 'sence' ? 'SENCE' : 'No SENCE'} descargada.`
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">No Activo</Badge>;
      default:
        return null;
    }
  };

  const senceCount = uploadedCourses.filter(c => c.type === 'Sence').length;
  const noSenceCount = uploadedCourses.filter(c => c.type === 'No Sence').length;

  return (
    <>
      {/* Upload Confirmation Dialog */}
      <Dialog open={showUploadConfirmation} onOpenChange={(open) => {
        if (!open) cancelUpload();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {/* Dynamic Icon based on status */}
            <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full ${
              fileValidationStatus === 'validating' ? 'bg-muted' :
              fileValidationStatus === 'valid' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
              'bg-red-100 dark:bg-red-900/30'
            }`}>
              {fileValidationStatus === 'validating' && (
                <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
              )}
              {fileValidationStatus === 'valid' && (
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              )}
              {fileValidationStatus === 'error' && (
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            
            <DialogTitle className="text-center">
              {fileValidationStatus === 'validating' && 'Validando archivo...'}
              {fileValidationStatus === 'valid' && 'Archivo validado correctamente'}
              {fileValidationStatus === 'error' && 'Se encontraron errores en el archivo'}
            </DialogTitle>
            
            <DialogDescription className="text-center">
              {fileValidationStatus === 'validating' && (
                <>Analizando <span className="font-medium text-foreground">"{pendingFile?.name}"</span>...</>
              )}
              {fileValidationStatus === 'valid' && (
                <>El archivo <span className="font-medium text-foreground">"{pendingFile?.name}"</span> está listo para cargar.</>
              )}
              {fileValidationStatus === 'error' && (
                <>El archivo <span className="font-medium text-foreground">"{pendingFile?.name}"</span> contiene errores que deben corregirse.</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {/* Content based on status */}
          {fileValidationStatus === 'validating' && (
            <div className="bg-muted/50 rounded-lg p-4 my-2">
              <p className="text-sm text-muted-foreground text-center">
                Verificando estructura y datos del archivo Excel...
              </p>
            </div>
          )}
          
          {fileValidationStatus === 'valid' && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 my-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    {validCoursesCount} cursos listos para cargar
                  </p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                    Tipo: {courseTypeTab === 'sence' ? 'SENCE' : 'No SENCE'}. Los cursos serán añadidos a tu catálogo y podrás editarlos posteriormente.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {fileValidationStatus === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-2">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                    Errores encontrados ({fileErrors.length}):
                  </p>
                  <ul className="space-y-1">
                    {fileErrors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-3">
                    Corrige los errores en el archivo Excel y vuelve a intentar.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelUpload} className="flex-1 sm:flex-none">
              {fileValidationStatus === 'error' ? 'Cerrar' : 'Cancelar'}
            </Button>
            {fileValidationStatus === 'valid' && (
              <Button onClick={confirmUpload} className="flex-1 sm:flex-none">
                <Upload className="h-4 w-4 mr-2" />
                Confirmar Carga
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SENCE Upload Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Cursos SENCE
            </CardTitle>
            <CardDescription>
              Carga cursos con código SENCE válido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragging && courseTypeTab === 'sence'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                setCourseTypeTab('sence');
                handleDrop(e);
              }}
              onClick={() => {
                setCourseTypeTab('sence');
                fileInputRef.current?.click();
              }}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">
                Arrastra tu archivo Excel aquí
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Formatos: .xlsx, .xls, .csv
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => downloadTemplate('sence')}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar plantilla SENCE
            </Button>
          </CardContent>
        </Card>

        {/* No SENCE Upload Card */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Cursos No SENCE
            </CardTitle>
            <CardDescription>
              Carga cursos sin código SENCE
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragging && courseTypeTab === 'no-sence'
                  ? 'border-orange-500 bg-orange-500/5'
                  : 'border-muted-foreground/25 hover:border-orange-500/50 hover:bg-muted/30'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                setCourseTypeTab('no-sence');
                handleDrop(e);
              }}
              onClick={() => {
                setCourseTypeTab('no-sence');
                fileInputRef.current?.click();
              }}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">
                Arrastra tu archivo Excel aquí
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Formatos: .xlsx, .xls, .csv
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => downloadTemplate('no-sence')}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar plantilla No SENCE
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Uploaded Courses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Cursos Cargados
          </CardTitle>
          <CardDescription>
            Gestiona los cursos que has subido a la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={courseTypeTab} onValueChange={(v) => {
            setCourseTypeTab(v as 'sence' | 'no-sence');
            setCurrentPage(1);
            setSearchQuery('');
          }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="sence" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  SENCE
                  <Badge variant="secondary" className="ml-1">{senceCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="no-sence" className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  No SENCE
                  <Badge variant="secondary" className="ml-1">{noSenceCount}</Badge>
                </TabsTrigger>
              </TabsList>

              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            <TabsContent value="sence" className="mt-0">
              <CourseTable 
                courses={paginatedCourses} 
                onDelete={handleDeleteCourse}
                onEdit={handleEditCourse}
                onToggleStatus={handleToggleCourseStatus}
                formatPrice={formatPrice}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="no-sence" className="mt-0">
              <CourseTable 
                courses={paginatedCourses} 
                onDelete={handleDeleteCourse}
                onEdit={handleEditCourse}
                onToggleStatus={handleToggleCourseStatus}
                formatPrice={formatPrice}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length)} de {filteredCourses.length} cursos
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {filteredCourses.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron cursos que coincidan con "{searchQuery}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

interface CourseTableProps {
  courses: UploadedCourse[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  formatPrice: (price: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, onDelete, onEdit, onToggleStatus, formatPrice, getStatusBadge }) => {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-muted rounded-full mb-4">
          <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">No hay cursos cargados</p>
        <p className="text-sm text-muted-foreground mt-1">
          Sube un archivo Excel para comenzar
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Nombre del curso</TableHead>
            <TableHead className="min-w-[120px]">Especialidad</TableHead>
            <TableHead className="min-w-[120px]">Código Sence</TableHead>
            <TableHead className="min-w-[110px]">Vigencia</TableHead>
            <TableHead className="min-w-[100px]">Modalidad</TableHead>
            <TableHead className="min-w-[130px] text-right">Valor p/participante</TableHead>
            <TableHead className="min-w-[90px]">Estado</TableHead>
            <TableHead className="min-w-[80px] text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">
                {course.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {course.specialty}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">
                {course.code}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(course.validUntil)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {course.modality}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatPrice(course.price)}
              </TableCell>
              <TableCell>
                {getStatusBadge(course.status)}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(course.id)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar Curso
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(course.id)}>
                      <Power className="h-4 w-4 mr-2" />
                      {course.status === 'active' ? 'Desactivar Curso' : 'Activar Curso'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(course.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Curso
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseUploadTab;
