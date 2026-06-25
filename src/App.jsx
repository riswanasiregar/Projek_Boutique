import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from './components/Loading';

// Layouts
const GuestLayout    = lazy(() => import('./layouts/GuestLayout'));
const AuthLayout     = lazy(() => import('./layouts/AuthLayout'));
const MainLayout     = lazy(() => import('./layouts/MainLayout'));
const MemberLayout   = lazy(() => import('./layouts/MemberLayout'));
const ProtectedRoute = lazy(() => import('./layouts/ProtectedRoute'));

// Guest pages
const CompanyProfile = lazy(() => import('./pages/guest/CompanyProfile'));

// Member pages
const MemberHome = lazy(() => import('./pages/member/MemberHome'));

// Auth pages
const Login    = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Forgot   = lazy(() => import('./pages/auth/Forgot'));

// Main pages
const Dashboard      = lazy(() => import('./pages/main/Dashboard'));
const Orders         = lazy(() => import('./pages/main/Orders'));
const OrderDetail    = lazy(() => import('./pages/main/OrderDetail'));
const Products       = lazy(() => import('./pages/main/Products'));
const ProductDetail  = lazy(() => import('./pages/main/ProductDetail'));
const Customers      = lazy(() => import('./pages/main/Customers'));
const CustomerDetail = lazy(() => import('./pages/main/CustomerDetail'));

// CRM Analytical pages
const Analytics  = lazy(() => import('./pages/main/Analytics'));
const Strategic  = lazy(() => import('./pages/main/Strategic'));

// Admin pages
const Users      = lazy(() => import('./pages/main/Users'));

// CRM Engagement pages
const Support    = lazy(() => import('./pages/main/Support'));
const Feedback   = lazy(() => import('./pages/main/Feedback'));
const Broadcast  = lazy(() => import('./pages/main/Broadcast'));
const Campaigns  = lazy(() => import('./pages/main/Campaigns'));

// Error pages
const Error400 = lazy(() => import('./pages/main/Error400'));
const Error401 = lazy(() => import('./pages/main/Error401'));
const Error403 = lazy(() => import('./pages/main/Error403'));
const NotFound = lazy(() => import('./pages/main/NotFound'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<GuestLayout />}>
          <Route path="/guest" element={<CompanyProfile />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />} />
        </Route>
        {/* Member routes — auth + role check handled by MemberLayout */}
        <Route element={<MemberLayout />}>
          <Route path="/member" element={<MemberHome />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/"                element={<Dashboard />} />
            <Route path="/orders"          element={<Orders />} />
            <Route path="/orders/:id"      element={<OrderDetail />} />
            <Route path="/products"        element={<Products />} />
            <Route path="/products/:id"    element={<ProductDetail />} />
            <Route path="/customers"       element={<Customers />} />
            <Route path="/customers/:id"   element={<CustomerDetail />} />
            <Route path="/support"         element={<Support />} />
            <Route path="/feedback"        element={<Feedback />} />
            <Route path="/broadcast"       element={<Broadcast />} />
            <Route path="/campaigns"       element={<Campaigns />} />
            <Route path="/analytics"       element={<Analytics />} />
            <Route path="/strategic"       element={<Strategic />} />
            <Route path="/users"           element={<Users />} />
            <Route path="/error-400"       element={<Error400 />} />
            <Route path="/error-401"       element={<Error401 />} />
            <Route path="/error-403"       element={<Error403 />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
