import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/user';
import { UserTypeSelector } from '@/components/login/UserTypeSelector';
import { Shield, Award, Building2 } from 'lucide-react';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('EMPRESA');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
    setLoading(true);
    try {
      const success = await login(values.email, values.password, selectedRole);
      if (success) {
        message.success('¡Bienvenido a Sucursal Virtual!');
        navigate('/dashboard');
      } else {
        message.error('Credenciales inválidas');
      }
    } catch (error) {
      message.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 login-hero text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl font-bold">
              SV
            </div>
            <div>
              <h1 className="text-xl font-bold">Sucursal Virtual</h1>
              <p className="text-white/70 text-sm">Plataforma de Capacitación</p>
            </div>
          </div>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Gestiona tus{' '}
              <span className="text-[#65BFB1]">capacitaciones</span>
              {' '}en un solo lugar
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Plataforma integral para OTICs, OTECs y Empresas. 
              Administra cursos, franquicias y certificaciones de forma eficiente.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-white/90">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span>Gestión segura de franquicia SENCE</span>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span>Certificaciones y acreditaciones</span>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span>Portal para empresas y organismos</span>
          </div>
        </div>
        
        <p className="text-white/50 text-sm">
          © 2024 Sucursal Virtual. Todos los derechos reservados.
        </p>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Iniciar Sesión</h2>
            <p className="text-muted-foreground mt-2">
              Ingresa tus credenciales para acceder
            </p>
          </div>
          
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            className="space-y-4"
          >
            <UserTypeSelector 
              selectedType={selectedRole} 
              onSelect={setSelectedRole} 
            />
            
            <Form.Item
              label={<span className="font-medium">Correo Electrónico</span>}
              name="email"
              rules={[
                { required: true, message: 'Ingresa tu correo electrónico' },
                { type: 'email', message: 'Ingresa un correo válido' }
              ]}
            >
              <Input 
                placeholder="correo@ejemplo.cl" 
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
            
            <Form.Item
              label={<span className="font-medium">Contraseña</span>}
              name="password"
              rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
            >
              <Input.Password 
                placeholder="••••••••" 
                size="large"
                className="rounded-lg"
                iconRender={(visible) => 
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            
            <div className="flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>
                  <span className="text-muted-foreground">Recordarme</span>
                </Checkbox>
              </Form.Item>
              <a href="#" className="text-primary hover:text-primary/80 text-sm font-medium">
                ¿Olvidó su contraseña?
              </a>
            </div>
            
            <Form.Item className="mb-0 mt-6">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                block
                icon={<LoginOutlined />}
                className="h-12 rounded-lg font-medium text-base"
              >
                Ingresar
              </Button>
            </Form.Item>
          </Form>
          
          <p className="text-center mt-6 text-muted-foreground">
            ¿No tiene cuenta?{' '}
            <a href="#" className="text-primary hover:text-primary/80 font-medium">
              Solicitar acceso
            </a>
          </p>
          
          {/* Mobile footer */}
          <p className="lg:hidden text-center mt-8 text-muted-foreground text-sm">
            © 2024 Sucursal Virtual. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
