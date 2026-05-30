// Mirror i eTerminiAPI.Domain.Authorization.Permissions (backend).
// Përdoret për të renderuar matricën e lejeve dhe për gating të menusë/rrugëve.

export const PERMISSIONS = {
  dashboard: { view: 'dashboard.view' },
  tenants: {
    view: 'tenants.view',
    createUpdate: 'tenants.create_update',
    delete: 'tenants.delete',
  },
  institutions: {
    view: 'institutions.view',
    createUpdate: 'institutions.create_update',
    delete: 'institutions.delete',
  },
  workers: {
    view: 'workers.view',
    createUpdate: 'workers.create_update',
    delete: 'workers.delete',
  },
  system: { view: 'system.view' },
  administrators: {
    view: 'administrators.view',
    createUpdate: 'administrators.create_update',
    delete: 'administrators.delete',
  },
}

// Katalog fallback nëse API-ja nuk thirret; faqja e roleve përdor /permissions-catalog.
export const PERMISSION_CATALOG = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    actions: [{ code: 'dashboard.view', label: 'Shiko' }],
  },
  {
    key: 'tenants',
    label: 'Qytetet',
    actions: [
      { code: 'tenants.view', label: 'Shiko qytetet' },
      { code: 'tenants.create_update', label: 'Krijo/Përditëso' },
      { code: 'tenants.delete', label: 'Fshi' },
    ],
  },
  {
    key: 'institutions',
    label: 'Institucionet',
    actions: [
      { code: 'institutions.view', label: 'Shiko institucionet' },
      { code: 'institutions.create_update', label: 'Krijo/Përditëso' },
      { code: 'institutions.delete', label: 'Fshi' },
    ],
  },
  {
    key: 'workers',
    label: 'Punëtorët',
    actions: [
      { code: 'workers.view', label: 'Shiko punëtorët' },
      { code: 'workers.create_update', label: 'Krijo/Përditëso' },
      { code: 'workers.delete', label: 'Fshi' },
    ],
  },
  {
    key: 'system',
    label: 'Sistemi',
    actions: [{ code: 'system.view', label: 'Shiko' }],
  },
  {
    key: 'administrators',
    label: 'Shto Administrator',
    actions: [
      { code: 'administrators.view', label: 'Shiko rolet & administratorët' },
      { code: 'administrators.create_update', label: 'Krijo/Përditëso' },
      { code: 'administrators.delete', label: 'Fshi' },
    ],
  },
]
