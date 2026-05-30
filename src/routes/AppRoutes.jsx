import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout    from '../layouts/AdminLayout'
import AuthLayout     from '../layouts/AuthLayout'
import ProtectedRoute from '../components/ProtectedRoute'

import Login            from '../pages/Login'
import Dashboard        from '../pages/Dashboard'
import TenantsList       from '../pages/tenants/TenantsList'
import InstitutionsList  from '../pages/institutions/InstitutionsList'
import InstitutionCreate from '../pages/institutions/InstitutionCreate'
import InstitutionEdit   from '../pages/institutions/InstitutionEdit'
import WorkersList       from '../pages/workers/WorkersList'
import WorkerCreate      from '../pages/workers/WorkerCreate'
import WorkerEdit        from '../pages/workers/WorkerEdit'
import SystemAdmin       from '../pages/system/SystemAdmin'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"             element={<Dashboard />} />
        <Route path="/tenants"               element={<TenantsList />} />
        <Route path="/institutions"          element={<InstitutionsList />} />
        <Route path="/institutions/create"   element={<InstitutionCreate />} />
        <Route path="/institutions/:id/edit" element={<InstitutionEdit />} />
        <Route path="/workers"               element={<WorkersList />} />
        <Route path="/workers/create"        element={<WorkerCreate />} />
        <Route path="/workers/:id/edit"      element={<WorkerEdit />} />
        <Route path="/system"                element={<SystemAdmin />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
