import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Spin } from 'antd';
import { SearchOutlined, ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';
import CreateUserModal from '@/components/admin/CreateUserModal';

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

const AdminUsuarios: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  useEffect(() => {
    fetchUsers();
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
  ];

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
    </div>
  );
};

export default AdminUsuarios;
