import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Clock,
  DollarSign,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  type: 'Sence' | 'No Sence';
  code: string;
  hours: number;
  price: number;
  modality: string;
  uploadDate: string;
  status: 'active' | 'pending' | 'error';
}

const CourseUploadTab: React.FC = () => {
  const [uploadedCourses, setUploadedCourses] = useState<UploadedCourse[]>([
    // Mock data for demonstration
    {
      id: '1',
      name: 'Excel Avanzado para Empresas',
      type: 'Sence',
      code: '1237889456',
      hours: 40,
      price: 180000,
      modality: 'E-learning',
      uploadDate: '2025-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Liderazgo y Gestión de Equipos',
      type: 'Sence',
      code: '1237889457',
      hours: 24,
      price: 350000,
      modality: 'Presencial',
      uploadDate: '2025-01-14',
      status: 'active'
    },
    {
      id: '3',
      name: 'Marketing Digital Básico',
      type: 'No Sence',
      code: 'NS-001',
      hours: 20,
      price: 150000,
      modality: 'E-learning',
      uploadDate: '2025-01-13',
      status: 'pending'
    },
    {
      id: '4',
      name: 'Seguridad Industrial',
      type: 'Sence',
      code: '1237889458',
      hours: 32,
      price: 280000,
      modality: 'Presencial',
      uploadDate: '2025-01-12',
      status: 'active'
    },
    {
      id: '5',
      name: 'Comunicación Efectiva',
      type: 'No Sence',
      code: 'NS-002',
      hours: 16,
      price: 120000,
      modality: 'Distancia',
      uploadDate: '2025-01-11',
      status: 'active'
    },
    {
      id: '6',
      name: 'Gestión de Proyectos Ágiles',
      type: 'Sence',
      code: '1237889459',
      hours: 48,
      price: 420000,
      modality: 'E-learning',
      uploadDate: '2025-01-10',
      status: 'error'
    },
    {
      id: '7',
      name: 'Inglés Técnico Nivel 1',
      type: 'Sence',
      code: '1237889460',
      hours: 60,
      price: 220000,
      modality: 'E-learning',
      uploadDate: '2025-01-09',
      status: 'active'
    },
    {
      id: '8',
      name: 'Atención al Cliente Premium',
      type: 'No Sence',
      code: 'NS-003',
      hours: 12,
      price: 95000,
      modality: 'E-learning',
      uploadDate: '2025-01-08',
      status: 'active'
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [courseTypeTab, setCourseTypeTab] = useState<'sence' | 'no-sence'>('sence');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ITEMS_PER_PAGE = 5;

  const filteredCourses = uploadedCourses.filter(course => 
    courseTypeTab === 'sence' ? course.type === 'Sence' : course.type === 'No Sence'
  );

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

    // Simulate file processing
    toast.success('Archivo cargado correctamente', {
      description: `${file.name} está siendo procesado.`
    });

    // Add mock courses from the uploaded file
    const newCourses: UploadedCourse[] = [
      {
        id: `new-${Date.now()}`,
        name: 'Nuevo Curso Cargado',
        type: courseTypeTab === 'sence' ? 'Sence' : 'No Sence',
        code: courseTypeTab === 'sence' ? '1237889999' : 'NS-NEW',
        hours: 30,
        price: 200000,
        modality: 'E-learning',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
    ];

    setUploadedCourses(prev => [...newCourses, ...prev]);
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
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Pendiente</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Error</Badge>;
      default:
        return null;
    }
  };

  const senceCount = uploadedCourses.filter(c => c.type === 'Sence').length;
  const noSenceCount = uploadedCourses.filter(c => c.type === 'No Sence').length;

  return (
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
          }}>
            <TabsList className="mb-4">
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

            <TabsContent value="sence" className="mt-0">
              <CourseTable 
                courses={paginatedCourses} 
                onDelete={handleDeleteCourse}
                formatPrice={formatPrice}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="no-sence" className="mt-0">
              <CourseTable 
                courses={paginatedCourses} 
                onDelete={handleDeleteCourse}
                formatPrice={formatPrice}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
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
        </CardContent>
      </Card>
    </div>
  );
};

interface CourseTableProps {
  courses: UploadedCourse[];
  onDelete: (id: string) => void;
  formatPrice: (price: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, onDelete, formatPrice, getStatusBadge }) => {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Curso</TableHead>
            <TableHead>Código</TableHead>
            <TableHead className="text-center">Horas</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead>Modalidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium max-w-[200px] truncate">
                {course.name}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">
                {course.code}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {course.hours}h
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatPrice(course.price)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {course.modality}
                </Badge>
              </TableCell>
              <TableCell>
                {getStatusBadge(course.status)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(course.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseUploadTab;
