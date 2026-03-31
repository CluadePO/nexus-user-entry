import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Spin, Tooltip, Modal } from 'antd';
import { SearchOutlined, ReloadOutlined, UserAddOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Briefcase } from 'lucide-react';
import CreateUserModal from '@/components/admin/CreateUserModal';
import dayjs from 'dayjs';

interface SystemUser {
  id: string;
  rut: string;
  email: string;
  nombre: string;
  apellido: string;
  cargo: string | null;
  holding: string | null;
  empresa: string | null;
  celula: string | null;
  jefe_comercial: string | null;
  lider_servicio_edc: string | null;
  analista_comercial: string | null;
  lider_servicio_op: string | null;
  analista_op: string | null;
}

interface PortfolioAssignment {
  id: string;
  user_id: string;
  user_name: string;
  celula: string | null;
  jefe_comercial: string | null;
  analista_comercial: string | null;
  analista_op: string | null;
  lider_servicio_edc: string | null;
  lider_servicio_op: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  notas: string | null;
}

const AdminUsuarios: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [portfolioAssignments, setPortfolioAssignments] = useState<PortfolioAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_users')
        .select('*')
        .order('apellido', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_assignments')
        .select('*');

      if (error) throw error;
      setPortfolioAssignments(data || []);
    } catch (error) {
      console.error('Error fetching portfolio assignments:', error);
    }
  };

  // Check if user has active portfolio assignment
  const hasActivePortfolioAssignment = (userId: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return portfolioAssignments.some(assignment => {
      if (assignment.user_id !== userId || !assignment.activo) return false;
      const startDate = new Date(assignment.fecha_inicio);
      const endDate = new Date(assignment.fecha_fin);
      return today >= startDate && today <= endDate;
    });
  };

  // Get portfolio assignment status for user
  const getPortfolioAssignmentInfo = (userId: string): { hasAssignment: boolean; isActive: boolean; isPending: boolean; isExpired: boolean } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const userAssignments = portfolioAssignments.filter(a => a.user_id === userId && a.activo);
    
    if (userAssignments.length === 0) {
      return { hasAssignment: false, isActive: false, isPending: false, isExpired: false };
    }
    
    const isActive = userAssignments.some(a => {
      const startDate = new Date(a.fecha_inicio);
      const endDate = new Date(a.fecha_fin);
      return today >= startDate && today <= endDate;
    });
    
    const isPending = userAssignments.some(a => {
      const startDate = new Date(a.fecha_inicio);
      return today < startDate;
    });
    
    const isExpired = userAssignments.every(a => {
      const endDate = new Date(a.fecha_fin);
      return today > endDate;
    });
    
    return { hasAssignment: true, isActive, isPending, isExpired };
  };

  useEffect(() => {
    fetchUsers();
    fetchPortfolioAssignments();
  }, []);

  const filteredUsers = users.filter(user => {
    const searchLower = searchText.toLowerCase();
    return (
      user.rut.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.nombre.toLowerCase().includes(searchLower) ||
      user.apellido.toLowerCase().includes(searchLower) ||
      (user.empresa?.toLowerCase().includes(searchLower) ?? false) ||
      (user.holding?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  const columns: ColumnsType<SystemUser> = [
    {
      title: '',
      key: 'portfolio',
      width: 50,
      fixed: 'left',
      render: (_, record) => {
        const info = getPortfolioAssignmentInfo(record.id);
        if (!info.hasAssignment) return null;
        
        let color = 'text-muted-foreground';
        let tooltipText = 'Sin asignación activa';
        
        if (info.isActive) {
          color = 'text-green-600';
          tooltipText = 'Cartera comercial asignada (activa)';
        } else if (info.isPending) {
          color = 'text-blue-600';
          tooltipText = 'Cartera comercial programada';
        } else if (info.isExpired) {
          color = 'text-orange-500';
          tooltipText = 'Cartera comercial vencida';
        }
        
        return (
          <Tooltip title={tooltipText}>
            <Briefcase className={`h-4 w-4 ${color}`} />
          </Tooltip>
        );
      },
    },
    {
      title: 'RUT',
      dataIndex: 'rut',
      key: 'rut',
      width: 130,
      fixed: 'left',
      render: (rut: string) => (
        <span className="font-mono text-sm">{rut}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
      render: (email: string) => (
        <a href={`mailto:${email}`} className="text-primary hover:underline">
          {email}
        </a>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 120,
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
      width: 150,
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
      width: 180,
      render: (cargo: string | null) => cargo || <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Holding',
      dataIndex: 'holding',
      key: 'holding',
      width: 130,
      render: (holding: string | null) => 
        holding ? <Tag color="blue">{holding}</Tag> : <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Empresa',
      dataIndex: 'empresa',
      key: 'empresa',
      width: 180,
      render: (empresa: string | null) => 
        empresa ? <Tag color="green">{empresa}</Tag> : <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Célula',
      dataIndex: 'celula',
      key: 'celula',
      width: 130,
      render: (celula: string | null) => 
        celula ? <Tag color="purple">{celula}</Tag> : <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Jefe Comercial',
      dataIndex: 'jefe_comercial',
      key: 'jefe_comercial',
      width: 150,
      render: (value: string | null) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Líder Servicio EDC',
      dataIndex: 'lider_servicio_edc',
      key: 'lider_servicio_edc',
      width: 160,
      render: (value: string | null) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Analista Comercial',
      dataIndex: 'analista_comercial',
      key: 'analista_comercial',
      width: 160,
      render: (value: string | null) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Líder Servicio OP',
      dataIndex: 'lider_servicio_op',
      key: 'lider_servicio_op',
      width: 160,
      render: (value: string | null) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Analista OP',
      dataIndex: 'analista_op',
      key: 'analista_op',
      width: 140,
      render: (value: string | null) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          onClick={() => {
            setSelectedUser(record);
            setIsViewModalOpen(true);
          }}
          size="small"
        />
      ),
    },
  ];

  // Get portfolio assignments for a specific user
  const getUserPortfolioAssignments = (userId: string): PortfolioAssignment[] => {
    return portfolioAssignments.filter(a => a.user_id === userId);
  };

  // Get status tag for portfolio assignment
  const getPortfolioStatusTag = (assignment: PortfolioAssignment) => {
    const today = dayjs();
    const startDate = dayjs(assignment.fecha_inicio);
    const endDate = dayjs(assignment.fecha_fin);

    if (!assignment.activo) {
      return <Tag color="default">Inactiva</Tag>;
    }
    if (today.isBefore(startDate)) {
      return <Tag color="blue">Programada</Tag>;
    }
    if (today.isAfter(endDate)) {
      return <Tag color="red">Vencida</Tag>;
    }
    return <Tag color="green">Activa</Tag>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
            <p className="text-muted-foreground text-sm">
              Administra los usuarios del sistema
            </p>
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          size="large"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">
              Listado de Usuarios ({filteredUsers.length})
            </CardTitle>
            <Space>
              <Input
                placeholder="Buscar por RUT, nombre, email, empresa..."
                prefix={<SearchOutlined className="text-muted-foreground" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 320 }}
                allowClear
              />
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchUsers}
                loading={loading}
              >
                Actualizar
              </Button>
            </Space>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="id"
              scroll={{ x: 2000 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} de ${total} usuarios`,
                pageSizeOptions: ['10', '20', '50'],
              }}
              size="middle"
              bordered
              className="[&_.ant-table]:!border-0"
            />
          </Spin>
        </CardContent>
      </Card>

      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchUsers}
      />

      {/* View User Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <span>Detalles del Usuario</span>
            {selectedUser && getPortfolioAssignmentInfo(selectedUser.id).hasAssignment && (
              <Tooltip title="Usuario con cartera comercial asignada">
                <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  Cartera Asignada
                </Badge>
              </Tooltip>
            )}
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}>
            Cerrar
          </Button>
        ]}
        width={700}
        destroyOnClose
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info Section */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">Información del Usuario</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Nombre:</span>
                  <p className="font-medium">{selectedUser.nombre} {selectedUser.apellido}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">RUT:</span>
                  <p className="font-medium font-mono">{selectedUser.rut}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cargo:</span>
                  <p className="font-medium">{selectedUser.cargo || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Empresa:</span>
                  <p className="font-medium">{selectedUser.empresa || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Holding:</span>
                  <p className="font-medium">{selectedUser.holding || '-'}</p>
                </div>
              </div>
            </div>

            {/* Operational Assignment Section */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">Asignación Operacional</h4>
              {(selectedUser.celula || selectedUser.jefe_comercial || selectedUser.analista_comercial || selectedUser.analista_op || selectedUser.lider_servicio_edc || selectedUser.lider_servicio_op) ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Célula:</span>
                    <p className="font-medium">{selectedUser.celula || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Jefe Comercial:</span>
                    <p className="font-medium">{selectedUser.jefe_comercial || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Analista Comercial:</span>
                    <p className="font-medium">{selectedUser.analista_comercial || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Analista Operacional:</span>
                    <p className="font-medium">{selectedUser.analista_op || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Líder Servicio EDC:</span>
                    <p className="font-medium">{selectedUser.lider_servicio_edc || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Líder Servicio OP:</span>
                    <p className="font-medium">{selectedUser.lider_servicio_op || '-'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Este usuario no tiene asignación operacional configurada</p>
              )}
            </div>

            {/* Portfolio Assignments Section */}
            {getUserPortfolioAssignments(selectedUser.id).length > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm text-primary">Carteras Comerciales Asignadas</h4>
                </div>
                <div className="space-y-3">
                  {getUserPortfolioAssignments(selectedUser.id).map((assignment) => (
                    <div key={assignment.id} className="bg-background rounded-lg p-3 border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CalendarOutlined className="text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {dayjs(assignment.fecha_inicio).format('DD/MM/YYYY')} - {dayjs(assignment.fecha_fin).format('DD/MM/YYYY')}
                          </span>
                        </div>
                        {getPortfolioStatusTag(assignment)}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {assignment.celula && (
                          <div>
                            <span className="text-muted-foreground">Célula:</span>
                            <p className="font-medium">{assignment.celula}</p>
                          </div>
                        )}
                        {assignment.jefe_comercial && (
                          <div>
                            <span className="text-muted-foreground">Jefe Comercial:</span>
                            <p className="font-medium">{assignment.jefe_comercial}</p>
                          </div>
                        )}
                        {assignment.analista_comercial && (
                          <div>
                            <span className="text-muted-foreground">Analista Comercial:</span>
                            <p className="font-medium">{assignment.analista_comercial}</p>
                          </div>
                        )}
                        {assignment.analista_op && (
                          <div>
                            <span className="text-muted-foreground">Analista Operacional:</span>
                            <p className="font-medium">{assignment.analista_op}</p>
                          </div>
                        )}
                        {assignment.lider_servicio_edc && (
                          <div>
                            <span className="text-muted-foreground">Líder EDC:</span>
                            <p className="font-medium">{assignment.lider_servicio_edc}</p>
                          </div>
                        )}
                        {assignment.lider_servicio_op && (
                          <div>
                            <span className="text-muted-foreground">Líder Operacional:</span>
                            <p className="font-medium">{assignment.lider_servicio_op}</p>
                          </div>
                        )}
                      </div>
                      {assignment.notas && (
                        <div className="mt-2 pt-2 border-t text-xs">
                          <span className="text-muted-foreground">Notas:</span>
                          <p className="text-muted-foreground italic">{assignment.notas}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Portfolio Assignment Message */}
            {getUserPortfolioAssignments(selectedUser.id).length === 0 && (
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Este usuario no tiene carteras comerciales asignadas</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsuarios;
