import { Routes, Route, Link } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CategoriesPage from './pages/CategoriesPage'
import CategoryProductsPage from './pages/CategoryProductsPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import SupplierLayout from './components/SupplierLayout'
import SupplierProductsPage from './pages/SupplierProductsPage'
import SupplierProductFormPage from './pages/SupplierProductFormPage'
import SupplierOrdersPage from './pages/SupplierOrdersPage'
import SupplierFinancePage from './pages/SupplierFinancePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminCategoriesPage from './pages/AdminCategoriesPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CategoriesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier"
          element={
            <ProtectedRoute requiredRole="supplier">
              <SupplierLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SupplierProductsPage />} />
          <Route path="products/new" element={<SupplierProductFormPage />} />
          <Route path="products/:id/edit" element={<SupplierProductFormPage />} />
          <Route path="orders" element={<SupplierOrdersPage />} />
          <Route path="finance" element={<SupplierFinancePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCategoriesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen bg-concrete flex items-center justify-center">
              <div className="text-center">
                <h1 className="font-display text-4xl font-semibold text-charcoal mb-2">
                  Страница не найдена
                </h1>
                <Link to="/" className="text-steel hover:underline">
                  Вернуться на главную
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  )
}

export default App