export const PERMISSIONS = {
  // User management permissions
  USER_CREATE: 'user:create',
  USER_READ: 'user:read', 
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_LIST: 'user:list',

  // Management team permissions
  MANAGEMENT_CREATE: 'management:create',
  MANAGEMENT_READ: 'management:read',
  MANAGEMENT_UPDATE: 'management:update', 
  MANAGEMENT_DELETE: 'management:delete',
  MANAGEMENT_LIST: 'management:list',

  // Slider permissions
  SLIDER_CREATE: 'slider:create',
  SLIDER_READ: 'slider:read',
  SLIDER_UPDATE: 'slider:update',
  SLIDER_DELETE: 'slider:delete', 
  SLIDER_LIST: 'slider:list',

  // Gallery permissions
  GALLERY_CREATE: 'gallery:create',
  GALLERY_READ: 'gallery:read',
  GALLERY_UPDATE: 'gallery:update',
  GALLERY_DELETE: 'gallery:delete',
  GALLERY_LIST: 'gallery:list',

  // Service permissions
  SERVICE_CREATE: 'service:create',
  SERVICE_READ: 'service:read',
  SERVICE_UPDATE: 'service:update',
  SERVICE_DELETE: 'service:delete',
  SERVICE_LIST: 'service:list',

  // Project permissions
  PROJECT_CREATE: 'project:create',
  PROJECT_READ: 'project:read',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',
  PROJECT_LIST: 'project:list',

  // Contact permissions
  CONTACT_CREATE: 'contact:create',
  CONTACT_READ: 'contact:read',
  CONTACT_UPDATE: 'contact:update',
  CONTACT_DELETE: 'contact:delete',
  CONTACT_LIST: 'contact:list',

  // Office permissions
  OFFICE_CREATE: 'office:create',
  OFFICE_READ: 'office:read',
  OFFICE_UPDATE: 'office:update',
  OFFICE_DELETE: 'office:delete',
  OFFICE_LIST: 'office:list',

  // Role management permissions
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  ROLE_LIST: 'role:list',

  // Permission management permissions
  PERMISSION_CREATE: 'permission:create',
  PERMISSION_READ: 'permission:read',
  PERMISSION_UPDATE: 'permission:update',
  PERMISSION_DELETE: 'permission:delete',
  PERMISSION_LIST: 'permission:list',

  // Role-Permission mapping permissions
  ROLE_PERMISSION_CREATE: 'role_permission:create',
  ROLE_PERMISSION_READ: 'role_permission:read',
  ROLE_PERMISSION_UPDATE: 'role_permission:update',
  ROLE_PERMISSION_DELETE: 'role_permission:delete',
  ROLE_PERMISSION_LIST: 'role_permission:list',

  // User-Role mapping permissions
  USER_ROLE_CREATE: 'user_role:create',
  USER_ROLE_READ: 'user_role:read',
  USER_ROLE_UPDATE: 'user_role:update',
  USER_ROLE_DELETE: 'user_role:delete',
  USER_ROLE_LIST: 'user_role:list',

  // Dashboard permissions
  DASHBOARD_ACCESS: 'dashboard:access',
  DASHBOARD_STATS: 'dashboard:stats',

  // System permissions
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_LOGS: 'system:logs',

  // Profile permissions
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
  PROFILE_CHANGE_PASSWORD: 'profile:change_password',

  // Content management permissions (general)
  CONTENT_MANAGE: 'content:manage',
  CONTENT_PUBLISH: 'content:publish',
  CONTENT_MODERATE: 'content:moderate'
} as const;

// Helper type for type safety
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_LIST
  ],
  
  CONTENT_MANAGEMENT: [
    PERMISSIONS.MANAGEMENT_CREATE,
    PERMISSIONS.MANAGEMENT_READ,
    PERMISSIONS.MANAGEMENT_UPDATE,
    PERMISSIONS.MANAGEMENT_DELETE,
    PERMISSIONS.MANAGEMENT_LIST,
    PERMISSIONS.SLIDER_CREATE,
    PERMISSIONS.SLIDER_READ,
    PERMISSIONS.SLIDER_UPDATE,
    PERMISSIONS.SLIDER_DELETE,
    PERMISSIONS.SLIDER_LIST,
    PERMISSIONS.GALLERY_CREATE,
    PERMISSIONS.GALLERY_READ,
    PERMISSIONS.GALLERY_UPDATE,
    PERMISSIONS.GALLERY_DELETE,
    PERMISSIONS.GALLERY_LIST,
    PERMISSIONS.SERVICE_CREATE,
    PERMISSIONS.SERVICE_READ,
    PERMISSIONS.SERVICE_UPDATE,
    PERMISSIONS.SERVICE_DELETE,
    PERMISSIONS.SERVICE_LIST,
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.PROJECT_UPDATE,
    PERMISSIONS.PROJECT_DELETE,
    PERMISSIONS.PROJECT_LIST
  ],

  CONTACT_OFFICE_MANAGEMENT: [
    PERMISSIONS.CONTACT_CREATE,
    PERMISSIONS.CONTACT_READ,
    PERMISSIONS.CONTACT_UPDATE,
    PERMISSIONS.CONTACT_DELETE,
    PERMISSIONS.CONTACT_LIST,
    PERMISSIONS.OFFICE_CREATE,
    PERMISSIONS.OFFICE_READ,
    PERMISSIONS.OFFICE_UPDATE,
    PERMISSIONS.OFFICE_DELETE,
    PERMISSIONS.OFFICE_LIST
  ],

  SYSTEM_ADMINISTRATION: [
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_READ,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.ROLE_LIST,
    PERMISSIONS.PERMISSION_CREATE,
    PERMISSIONS.PERMISSION_READ,
    PERMISSIONS.PERMISSION_UPDATE,
    PERMISSIONS.PERMISSION_DELETE,
    PERMISSIONS.PERMISSION_LIST,
    PERMISSIONS.ROLE_PERMISSION_CREATE,
    PERMISSIONS.ROLE_PERMISSION_READ,
    PERMISSIONS.ROLE_PERMISSION_UPDATE,
    PERMISSIONS.ROLE_PERMISSION_DELETE,
    PERMISSIONS.ROLE_PERMISSION_LIST,
    PERMISSIONS.USER_ROLE_CREATE,
    PERMISSIONS.USER_ROLE_READ,
    PERMISSIONS.USER_ROLE_UPDATE,
    PERMISSIONS.USER_ROLE_DELETE,
    PERMISSIONS.USER_ROLE_LIST,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_LOGS
  ],

  BASIC_ACCESS: [
    PERMISSIONS.DASHBOARD_ACCESS,
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.PROFILE_CHANGE_PASSWORD
  ]
} as const;
