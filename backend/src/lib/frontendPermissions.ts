/**
 * Frontend utility untuk permission checking
 * Digunakan di dashboard untuk menampilkan/menyembunyikan UI elements berdasarkan permission
 */

import { PERMISSIONS, Permission } from '@/constants/permissions';

export class FrontendPermissions {
  private static userPermissions: string[] = [];
  private static userRoles: string[] = [];

  /**
   * Initialize permissions dari user data
   */
  static initialize(userRoles: string[], userPermissions?: string[]) {
    this.userRoles = userRoles || [];
    this.userPermissions = userPermissions || [];
  }

  /**
   * Check apakah user memiliki permission tertentu
   */
  static hasPermission(permission: Permission): boolean {
    return this.userPermissions.includes(permission);
  }

  /**
   * Check apakah user memiliki salah satu dari permissions
   */
  static hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.userPermissions.includes(permission));
  }

  /**
   * Check apakah user memiliki semua permissions
   */
  static hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.userPermissions.includes(permission));
  }

  /**
   * Check apakah user memiliki role tertentu
   */
  static hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  /**
   * Check apakah user memiliki salah satu dari roles
   */
  static hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.userRoles.includes(role));
  }

  /**
   * Get level role user (untuk hierarchy check)
   */
  static getUserRoleLevel(): number {
    const roleLevels: { [key: string]: number } = {
      'superadmin': 100,
      'admin': 80,
      'admin 1': 70,
      'admin 2': 60,
      'user': 10
    };

    const highestLevel = Math.max(
      ...this.userRoles.map(role => roleLevels[role] || 0)
    );

    return highestLevel;
  }

  /**
   * Check apakah user bisa access content management
   */
  static canManageContent(): boolean {
    return this.hasAnyPermission([
      PERMISSIONS.MANAGEMENT_CREATE,
      PERMISSIONS.SLIDER_CREATE,
      PERMISSIONS.GALLERY_CREATE,
      PERMISSIONS.SERVICE_CREATE,
      PERMISSIONS.PROJECT_CREATE
    ]);
  }

  /**
   * Check apakah user bisa manage users
   */
  static canManageUsers(): boolean {
    return this.hasAnyPermission([
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE
    ]);
  }

  /**
   * Check apakah user bisa manage system
   */
  static canManageSystem(): boolean {
    return this.hasAnyPermission([
      PERMISSIONS.SYSTEM_SETTINGS,
      PERMISSIONS.SYSTEM_BACKUP,
      PERMISSIONS.SYSTEM_LOGS,
      PERMISSIONS.ROLE_CREATE,
      PERMISSIONS.PERMISSION_CREATE
    ]);
  }

  /**
   * Get permissions untuk specific module
   */
  static getModulePermissions(module: string): {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canList: boolean;
  } {
    const modulePrefix = module.toLowerCase();
    
    return {
      canCreate: this.hasPermission(`${modulePrefix}:create` as Permission),
      canRead: this.hasPermission(`${modulePrefix}:read` as Permission),
      canUpdate: this.hasPermission(`${modulePrefix}:update` as Permission),
      canDelete: this.hasPermission(`${modulePrefix}:delete` as Permission),
      canList: this.hasPermission(`${modulePrefix}:list` as Permission),
    };
  }

  /**
   * Check permission untuk UI elements
   */
  static ui = {
    // Sidebar menu permissions
    showManagementMenu: () => this.hasPermission(PERMISSIONS.MANAGEMENT_LIST),
    showSlidersMenu: () => this.hasPermission(PERMISSIONS.SLIDER_LIST),
    showGalleryMenu: () => this.hasPermission(PERMISSIONS.GALLERY_LIST),
    showServicesMenu: () => this.hasPermission(PERMISSIONS.SERVICE_LIST),
    showProjectsMenu: () => this.hasPermission(PERMISSIONS.PROJECT_LIST),
    showContactMenu: () => this.hasPermission(PERMISSIONS.CONTACT_LIST),
    showOfficeMenu: () => this.hasPermission(PERMISSIONS.OFFICE_LIST),
    showUsersMenu: () => this.hasPermission(PERMISSIONS.USER_LIST),
    showRolesMenu: () => this.hasPermission(PERMISSIONS.ROLE_LIST),
    showSystemMenu: () => this.hasPermission(PERMISSIONS.SYSTEM_SETTINGS),

    // Button permissions
    showCreateButton: (module: string) => this.hasPermission(`${module.toLowerCase()}:create` as Permission),
    showEditButton: (module: string) => this.hasPermission(`${module.toLowerCase()}:update` as Permission),
    showDeleteButton: (module: string) => this.hasPermission(`${module.toLowerCase()}:delete` as Permission),
    
    // Special permissions
    showBulkActions: () => this.getUserRoleLevel() >= 80, // Admin level and above
    showAdvancedSettings: () => this.getUserRoleLevel() >= 100, // Superadmin only
    showUserManagement: () => this.hasPermission(PERMISSIONS.USER_LIST),
    showRoleManagement: () => this.hasPermission(PERMISSIONS.ROLE_LIST),
  };

  /**
   * Debug info untuk development
   */
  static getDebugInfo(): {
    roles: string[];
    permissions: string[];
    roleLevel: number;
    canManageContent: boolean;
    canManageUsers: boolean;
    canManageSystem: boolean;
  } {
    return {
      roles: this.userRoles,
      permissions: this.userPermissions,
      roleLevel: this.getUserRoleLevel(),
      canManageContent: this.canManageContent(),
      canManageUsers: this.canManageUsers(),
      canManageSystem: this.canManageSystem()
    };
  }
}

/**
 * React Hook untuk permission checking
 */
export function usePermissions() {
  return {
    hasPermission: (permission: Permission) => FrontendPermissions.hasPermission(permission),
    hasAnyPermission: (permissions: Permission[]) => FrontendPermissions.hasAnyPermission(permissions),
    hasAllPermissions: (permissions: Permission[]) => FrontendPermissions.hasAllPermissions(permissions),
    hasRole: (role: string) => FrontendPermissions.hasRole(role),
    hasAnyRole: (roles: string[]) => FrontendPermissions.hasAnyRole(roles),
    getUserRoleLevel: () => FrontendPermissions.getUserRoleLevel(),
    canManageContent: () => FrontendPermissions.canManageContent(),
    canManageUsers: () => FrontendPermissions.canManageUsers(),
    canManageSystem: () => FrontendPermissions.canManageSystem(),
    getModulePermissions: (module: string) => FrontendPermissions.getModulePermissions(module),
    ui: FrontendPermissions.ui,
    debug: () => FrontendPermissions.getDebugInfo()
  };
}

/**
 * Higher-order component untuk permission-based rendering
 */
export function withPermission(
  Component: React.ComponentType<any>, 
  requiredPermissions: Permission[]
) {
  return function PermissionWrapper(props: any) {
    const hasPermission = FrontendPermissions.hasAllPermissions(requiredPermissions);
    
    if (!hasPermission) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-lg font-medium text-gray-600 mb-2">Akses Terbatas</p>
            <p className="text-sm text-gray-500">Anda tidak memiliki permission untuk mengakses fitur ini.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}
