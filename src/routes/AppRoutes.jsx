import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout    from '../layouts/AdminLayout'
import AuthLayout     from '../layouts/AuthLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import { PERMISSIONS } from '../lib/permissions'

import Login            from '../pages/Login'
import Dashboard        from '../pages/Dashboard'
import ProfilePage       from '../pages/profile/ProfilePage'
import TenantsList       from '../pages/tenants/TenantsList'
import InstitutionsList  from '../pages/institutions/InstitutionsList'
import InstitutionCreate from '../pages/institutions/InstitutionCreate'
import InstitutionEdit   from '../pages/institutions/InstitutionEdit'
import WorkersList       from '../pages/workers/WorkersList'
import WorkerCreate      from '../pages/workers/WorkerCreate'
import WorkerEdit        from '../pages/workers/WorkerEdit'
import RolesList         from '../pages/roles/RolesList'
import RoleForm          from '../pages/roles/RoleForm'
import AdministratorsList from '../pages/administrators/AdministratorsList'
import AdminCreate        from '../pages/administrators/AdminCreate'
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
        <Route path="/dashboard"             element={<ProtectedRoute requiredPermission={PERMISSIONS.dashboard.view}><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"               element={<ProfilePage />} />
        <Route path="/tenants"               element={<ProtectedRoute requiredPermission={PERMISSIONS.tenants.view}><TenantsList /></ProtectedRoute>} />
        <Route path="/institutions"          element={<ProtectedRoute requiredPermission={PERMISSIONS.institutions.view}><InstitutionsList /></ProtectedRoute>} />
        <Route path="/institutions/create"   element={<ProtectedRoute requiredPermission={PERMISSIONS.institutions.createUpdate}><InstitutionCreate /></ProtectedRoute>} />
        <Route path="/institutions/:id/edit" element={<ProtectedRoute requiredPermission={PERMISSIONS.institutions.createUpdate}><InstitutionEdit /></ProtectedRoute>} />
        <Route path="/workers"               element={<ProtectedRoute requiredPermission={PERMISSIONS.workers.view}><WorkersList /></ProtectedRoute>} />
        <Route path="/workers/create"        element={<ProtectedRoute requiredPermission={PERMISSIONS.workers.createUpdate}><WorkerCreate /></ProtectedRoute>} />
        <Route path="/workers/:id/edit"      element={<ProtectedRoute requiredPermission={PERMISSIONS.workers.createUpdate}><WorkerEdit /></ProtectedRoute>} />
        <Route path="/roles"                 element={<ProtectedRoute requiredPermission={PERMISSIONS.administrators.view}><RolesList /></ProtectedRoute>} />
        <Route path="/roles/create"          element={<ProtectedRoute requiredPermission={PERMISSIONS.administrators.createUpdate}><RoleForm /></ProtectedRoute>} />
        <Route path="/roles/:id/edit"        element={<ProtectedRoute requiredPermission={PERMISSIONS.administrators.createUpdate}><RoleForm /></ProtectedRoute>} />
        <Route path="/administrators"        element={<ProtectedRoute requiredPermission={PERMISSIONS.administrators.view}><AdministratorsList /></ProtectedRoute>} />
        <Route path="/administrators/create" element={<ProtectedRoute requiredPermission={PERMISSIONS.administrators.createUpdate}><AdminCreate /></ProtectedRoute>} />
        <Route path="/system"                element={<ProtectedRoute requiredPermission={PERMISSIONS.system.view}><SystemAdmin /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
