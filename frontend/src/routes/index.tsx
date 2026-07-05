import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import SearchPage from '../pages/SearchPage';
import AssistantPage from '../pages/AssistantPage';
import ProductDetails from '../pages/ProductDetails';
import ComparePage from '../pages/ComparePage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'assistant', element: <AssistantPage /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
