import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Spin, DatePicker, Modal, Form, Select, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, CalendarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Users } from 'lucide-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface SystemUser {
  id: string;
  rut: string;
  email: string;
  nombre: string;
  apellido: string;
  cargo: string | null;
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
  user_rut: string;
  user_name: string;
  user_email: string;
  celula: string | null;
  jefe_comercial: string | null;
  analista_comercial: string | null;
  analista_op: string | null;
  lider_servicio_edc: string | null;
  lider_servicio_op: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  notas: string | null;
  activo: boolean;
  created_at: string;
}

// Mock data for dropdowns
const celulasOptions = ['Célula Norte', 'Célula Sur', 'Célula Centro', 'Célula Oriente'];
const jefesComerciales = ['María González', 'Pedro Sánchez', 'Ana López', 'Carlos Ruiz'];
const analistasComerciales = ['Laura Díaz', 'Roberto Fernández', 'Carmen Vega', 'Miguel Torres'];
const analistasOperacionales = ['Patricia Mora', 'Andrés Silva', 'Claudia Reyes', 'Felipe Castillo'];
const lideresEDC = ['Sofía Vargas', 'Jorge Mendoza', 'Isabel Rojas', 'Diego Herrera'];
const lideresOperacionales = ['Valentina Muñoz', 'Sebastián Cortés', 'Francisca Navarro', 'Tomás Espinoza'];

const AdminCarterasComerciales: React.FC = () => {
  const [assignments, setAssignments] = useState<PortfolioAssignment[]>([]);
  const [oticUsers, setOticUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<PortfolioAssignment | null>(null);
  const [form] = Form.useForm();
  const { toast } = useToast();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las asignaciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOticUsers = async () => {
    try {
      // Fetch all users - in a real scenario, filter by user type OTIC
      const { data, error } = await supabase
        .from('system_users')
        .select('*')
        .order('apellido', { ascending: true });

      if (error) throw error;
      setOticUsers(data || []);
    } catch (error) {
      console.error('Error fetching OTIC users:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchOticUsers();
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    const searchLower = searchText.toLowerCase();
    return (
      assignment.user_rut.toLowerCase().includes(searchLower) ||
      assignment.user_name.toLowerCase().includes(searchLower) ||
      assignment.user_email.toLowerCase().includes(searchLower) ||
      (assignment.celula?.toLowerCase().includes(searchLower) ?? false) ||
      (assignment.jefe_comercial?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  const handleOpenModal = (assignment?: PortfolioAssignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      form.setFieldsValue({
        user_id: assignment.user_id,
        celula: assignment.celula,
        jefe_comercial: assignment.jefe_comercial,
        analista_comercial: assignment.analista_comercial,
        analista_op: assignment.analista_op,
        lider_servicio_edc: assignment.lider_servicio_edc,
        lider_servicio_op: assignment.lider_servicio_op,
        fechas: [dayjs(assignment.fecha_inicio), dayjs(assignment.fecha_fin)],
        notas: assignment.notas,
      });
    } else {
      setEditingAssignment(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const selectedUser = oticUsers.find(u => u.id === values.user_id);
      
      if (!selectedUser) {
        message.error('Usuario no encontrado');
        return;
      }

      const assignmentData = {
        user_id: values.user_id,
        user_rut: selectedUser.rut,
        user_name: `${selectedUser.nombre} ${selectedUser.apellido}`,
        user_email: selectedUser.email,
        celula: values.celula || null,
        jefe_comercial: values.jefe_comercial || null,
        analista_comercial: values.analista_comercial || null,
        analista_op: values.analista_op || null,
        lider_servicio_edc: values.lider_servicio_edc || null,
        lider_servicio_op: values.lider_servicio_op || null,
        fecha_inicio: values.fechas[0].format('YYYY-MM-DD'),
        fecha_fin: values.fechas[1].format('YYYY-MM-DD'),
        notas: values.notas || null,
        activo: true,
      };

      if (editingAssignment) {
        const { error } = await supabase
          .from('portfolio_assignments')
          .update(assignmentData)
          .eq('id', editingAssignment.id);

        if (error) throw error;
        message.success('Asignación actualizada correctamente');
      } else {
        const { error } = await supabase
          .from('portfolio_assignments')
          .insert([assignmentData]);

        if (error) throw error;
        message.success('Asignación creada correctamente');
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingAssignment(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
      message.error('Error al guardar la asignación');
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '¿Eliminar asignación?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          const { error } = await supabase
            .from('portfolio_assignments')
            .delete()
            .eq('id', id);

          if (error) throw error;
          message.success('Asignación eliminada');
          fetchAssignments();
        } catch (error) {
          console.error('Error deleting assignment:', error);
          message.error('Error al eliminar la asignación');
        }
      },
    });
  };

  const getStatusTag = (assignment: PortfolioAssignment) => {
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

  const columns: ColumnsType<PortfolioAssignment> = [
    {
      title: 'Usuario',
      key: 'user',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <div>
          <p className="font-medium">{record.user_name}</p>
          <p className="text-xs text-muted-foreground">{record.user_rut}</p>
        </div>
      ),
    },
    {
      title: 'Estado',
      key: 'status',
      width: 100,
      render: (_, record) => getStatusTag(record),
    },
    {
      title: 'Período',
      key: 'period',
      width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-muted-foreground" />
          <span className="text-sm">
            {dayjs(record.fecha_inicio).format('DD/MM/YYYY')} - {dayjs(record.fecha_fin).format('DD/MM/YYYY')}
          </span>
        </div>
      ),
    },
    {
      title: 'Célula',
      dataIndex: 'celula',
      key: 'celula',
      width: 130,
      render: (value: string | null) => 
        value ? <Tag color="purple">{value}</Tag> : <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Jefe Comercial',
      dataIndex: 'jefe_comercial',
      key: 'jefe_comercial',
      width: 150,
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
      title: 'Analista Operacional',
      dataIndex: 'analista_op',
      key: 'analista_op',
      width: 160,
      render: (value: string | null) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Líder EDC',
      dataIndex: 'lider_servicio_edc',
      key: 'lider_servicio_edc',
      width: 150,
      render: (value: string | null) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Líder Operacional',
      dataIndex: 'lider_servicio_op',
      key: 'lider_servicio_op',
      width: 160,
      render: (value: string | null) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenModal(record)}
            size="small"
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Asignación de Carteras Comerciales</h1>
            <p className="text-muted-foreground text-sm">
              Gestiona las asignaciones temporales de carteras a usuarios OTIC
            </p>
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => handleOpenModal()}
        >
          Nueva Asignación
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{assignments.length}</p>
                <p className="text-sm text-muted-foreground">Total Asignaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {assignments.filter(a => {
                    const today = dayjs();
                    return a.activo && today.isAfter(dayjs(a.fecha_inicio)) && today.isBefore(dayjs(a.fecha_fin));
                  }).length}
                </p>
                <p className="text-sm text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CalendarOutlined className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {assignments.filter(a => dayjs().isBefore(dayjs(a.fecha_inicio))).length}
                </p>
                <p className="text-sm text-muted-foreground">Programadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <CalendarOutlined className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {assignments.filter(a => dayjs().isAfter(dayjs(a.fecha_fin))).length}
                </p>
                <p className="text-sm text-muted-foreground">Vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">
              Listado de Asignaciones ({filteredAssignments.length})
            </CardTitle>
            <Space>
              <Input
                placeholder="Buscar por usuario, RUT, célula..."
                prefix={<SearchOutlined className="text-muted-foreground" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 320 }}
                allowClear
              />
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchAssignments}
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
              dataSource={filteredAssignments}
              rowKey="id"
              scroll={{ x: 1600 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} de ${total} asignaciones`,
                pageSizeOptions: ['10', '20', '50'],
              }}
              size="middle"
              bordered
              className="[&_.ant-table]:!border-0"
            />
          </Spin>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingAssignment ? 'Editar Asignación' : 'Nueva Asignación de Cartera Comercial'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingAssignment(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={editingAssignment ? 'Guardar Cambios' : 'Crear Asignación'}
        cancelText="Cancelar"
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="user_id"
            label="Usuario OTIC"
            rules={[{ required: true, message: 'Seleccione un usuario' }]}
          >
            <Select
              placeholder="Seleccione un usuario"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={oticUsers.map(user => ({
                value: user.id,
                label: `${user.nombre} ${user.apellido} (${user.rut})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="fechas"
            label="Período de Asignación"
            rules={[{ required: true, message: 'Seleccione el período' }]}
          >
            <RangePicker 
              className="w-full" 
              format="DD/MM/YYYY"
              placeholder={['Fecha Inicio', 'Fecha Fin']}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="celula"
              label="Célula"
            >
              <Select
                placeholder="Seleccione célula"
                allowClear
                options={celulasOptions.map(c => ({ value: c, label: c }))}
              />
            </Form.Item>

            <Form.Item
              name="jefe_comercial"
              label="Jefe Comercial"
            >
              <Select
                placeholder="Seleccione jefe comercial"
                allowClear
                options={jefesComerciales.map(j => ({ value: j, label: j }))}
              />
            </Form.Item>

            <Form.Item
              name="analista_comercial"
              label="Analista Comercial"
            >
              <Select
                placeholder="Seleccione analista comercial"
                allowClear
                options={analistasComerciales.map(a => ({ value: a, label: a }))}
              />
            </Form.Item>

            <Form.Item
              name="analista_op"
              label="Analista Operacional"
            >
              <Select
                placeholder="Seleccione analista operacional"
                allowClear
                options={analistasOperacionales.map(a => ({ value: a, label: a }))}
              />
            </Form.Item>

            <Form.Item
              name="lider_servicio_edc"
              label="Líder Servicio EDC"
            >
              <Select
                placeholder="Seleccione líder EDC"
                allowClear
                options={lideresEDC.map(l => ({ value: l, label: l }))}
              />
            </Form.Item>

            <Form.Item
              name="lider_servicio_op"
              label="Líder Servicio Operacional"
            >
              <Select
                placeholder="Seleccione líder operacional"
                allowClear
                options={lideresOperacionales.map(l => ({ value: l, label: l }))}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="notas"
            label="Notas"
          >
            <TextArea 
              rows={3} 
              placeholder="Notas adicionales sobre la asignación..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCarterasComerciales;
