import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import { AuthProvider } from './auth/AuthProvider';
import { RequireStaff } from './auth/RequireStaff';
import { AdminLayout } from './components/AdminLayout';
import { Login } from './screens/Login';
import { Dashboard } from './screens/Dashboard';
import { ProduceOffersList } from './features/produce/ProduceOffersList';
import { ProduceOfferDetail } from './features/produce/ProduceOfferDetail';
import { FarmSupportList } from './features/support/FarmSupportList';
import { FarmSupportDetail } from './features/support/FarmSupportDetail';
import { LandOffersList } from './features/land/LandOffersList';
import { LandOfferDetail } from './features/land/LandOfferDetail';
import { UsersWorkspace } from './features/users/UsersWorkspace';
import { UserDetail } from './features/users/UserDetail';
import { LearnList } from './features/learn/LearnList';
import { NewArticle, EditArticle } from './features/learn/LearnEditor';
import { SupportList } from './features/helpdesk/SupportList';
import { SupportDetail } from './features/helpdesk/SupportDetail';
import { AccessControl } from './features/access/AccessControl';
import { ADMIN_BASENAME } from './lib/config';

const router = createBrowserRouter(
  [
    { path: '/login', element: <Login /> },
    {
      path: '/',
      element: (
        <RequireStaff>
          <AdminLayout />
        </RequireStaff>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'produce-offers', element: <ProduceOffersList /> },
        { path: 'produce-offers/:id', element: <ProduceOfferDetail /> },
        { path: 'farm-support', element: <FarmSupportList /> },
        { path: 'farm-support/:id', element: <FarmSupportDetail /> },
        { path: 'land-offers', element: <LandOffersList /> },
        { path: 'land-offers/:id', element: <LandOfferDetail /> },
        { path: 'users', element: <UsersWorkspace /> },
        { path: 'users/:id', element: <UserDetail /> },
        { path: 'learn', element: <LearnList /> },
        { path: 'learn/new', element: <NewArticle /> },
        { path: 'learn/:id', element: <EditArticle /> },
        { path: 'support', element: <SupportList /> },
        { path: 'support/:id', element: <SupportDetail /> },
        { path: 'access-control', element: <AccessControl /> },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ],
  { basename: ADMIN_BASENAME },
);

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
