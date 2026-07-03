import { Button, Form, Space, Toast, Typography } from '@douyinfe/semi-ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ImportButton } from '../components/ImportButton';
import { db } from '../db';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values: {
    name: string;
    department: string;
    offHour: number;
  }) => {
    try {
      await db.user.add({
        name: values.name,
        department: values.department,
        offHour: values.offHour ?? 0,
      });
      Toast.success('注册成功');
      navigate({ to: '/' });
    } catch {
      Toast.error('注册失败');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg">
            <span className="text-3xl">📋</span>
          </div>
          <Typography.Title heading={2} className="gradient-text mb-2!">
            考勤记录器
          </Typography.Title>
          <Typography.Text type="tertiary">
            请填写个人信息完成注册
          </Typography.Text>
        </div>

        {/* 表单卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50">
          <Form onSubmit={handleSubmit} labelPosition="top">
            <Form.Input
              field="name"
              label="姓名"
              placeholder="请输入姓名"
              size="large"
              rules={[{ required: true, message: '请输入姓名' }]}
            />
            <Form.Input
              field="department"
              label="部门"
              placeholder="请输入部门（如：集团/中心/部门/小组）"
              size="large"
              rules={[{ required: true, message: '请输入部门' }]}
            />
            <Form.InputNumber
              field="offHour"
              label="初始可调休时长（小时）"
              placeholder="请输入初始可调休时长"
              min={0}
              size="large"
              style={{ width: '100%' }}
              initValue={0}
            />

            <div className="mt-8">
              <Space vertical align="center" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  theme="solid"
                  size="large"
                  style={{
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                  }}
                >
                  开始使用
                </Button>
                <div className="mt-2">
                  <ImportButton onSuccess={() => navigate({ to: '/' })} />
                </div>
              </Space>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
