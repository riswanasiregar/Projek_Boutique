import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from './components/Loading';

// Layouts
const AuthLayout     = lazy(() => import('./layouts/AuthLayout'));
const MainLayout     = lazy(() => import('./layouts/MainLayout'));
const ProtectedRoute = lazy(() => import('./layouts/ProtectedRoute'));

// Auth pages
const Login    = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Forgot   = lazy(() => import('./pages/auth/Forgot'));

// Main pages — Store
const Dashboard   = lazy(() => import('./pages/main/Dashboard'));
const Collections = lazy(() => import('./pages/main/Collections'));
const Products    = lazy(() => import('./pages/main/Products'));
const Inventory   = lazy(() => import('./pages/main/Inventory'));
const Orders      = lazy(() => import('./pages/main/Orders'));
const Customers   = lazy(() => import('./pages/main/Customers'));
const Suppliers   = lazy(() => import('./pages/main/Suppliers'));

// Main pages — Business
const Analytics  = lazy(() => import('./pages/main/Analytics'));
const Promotions = lazy(() => import('./pages/main/Promotions'));
const Reports    = lazy(() => import('./pages/main/Reports'));
const Settings   = lazy(() => import('./pages/main/Settings'));

// Error pages
const Error400 = lazy(() => import('./pages/main/Error400'));
const Error401 = lazy(() => import('./pages/main/Error401'));
const Error403 = lazy(() => import('./pages/main/Error403'));
const NotFound = lazy(() => import('./pages/main/NotFound'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Store */}
            <Route path="/"            element={<Dashboard />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/products"    element={<Products />} />
            <Route path="/inventory"   element={<Inventory />} />
            <Route path="/orders"      element={<Orders />} />
            <Route path="/customers"   element={<Customers />} />
            <Route path="/suppliers"   element={<Suppliers />} />
            {/* Business */}
            <Route path="/analytics"   element={<Analytics />} />
            <Route path="/promotions"  element={<Promotions />} />
            <Route path="/reports"     element={<Reports />} />
            <Route path="/settings"    element={<Settings />} />
            {/* Error */}
            <Route path="/error-400"   element={<Error400 />} />
            <Route path="/error-401"   element={<Error401 />} />
            <Route path="/error-403"   element={<Error403 />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
