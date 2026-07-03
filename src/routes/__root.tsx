import {
  createRootRoute,
  Outlet,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUser();

  useEffect(() => {
    // undefined 表示查询中，跳过
    if (user === undefined) return;

    // null 表示未注册 且 不在注册页 -> 跳转注册页
    if (user === null && location.pathname !== '/register') {
      navigate({ to: '/register' });
    }
    // 已注册 且 在注册页 -> 跳转首页
    if (user && location.pathname === '/register') {
      navigate({ to: '/' });
    }
  }, [user, location.pathname, navigate]);

  // 查询中显示空白
  if (user === undefined) {
    return null;
  }

  return <Outlet />;
}
