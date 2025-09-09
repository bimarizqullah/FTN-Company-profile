import prisma from '@/lib/db';
import { PERMISSIONS, PERMISSION_GROUPS, Permission } from '@/constants/permissions';
import { ROLES } from '@/constants/roles';

/**
 * Utility functions untuk role dan permission management
 */

export class RolePermissionManager {
  /**
   * Assign permissions ke role
   */
  static async assignPermissionsToRole(
    roleId: number, 
    permissions: Permission[]
  ): Promise<boolean> {
    try {
      // Hapus permission lama
      await prisma.rolePermission.deleteMany({
        where: { roleId }
      });

      // Ambil permission IDs
      const permissionRecords = await prisma.permission.findMany({
        where: {
          permission: {
            in: permissions
          }
        }
      });

      // Create new role-permission mappings
      const rolePermissionData = permissionRecords.map(permission => ({
        roleId,
        permissionId: permission.id
      }));

      await prisma.rolePermission.createMany({
        data: rolePermissionData,
        skipDuplicates: true
      });

      return true;
    } catch (error) {
      console.error('Error assigning permissions to role:', error);
      return false;
    }
  }

  /**
   * Assign role ke user
   */
  static async assignRoleToUser(userId: number, roleIds: number[]): Promise<boolean> {
    try {
      // Hapus role lama
      await prisma.userRole.deleteMany({
        where: { userId }
      });

      // Create new user-role mappings
      const userRoleData = roleIds.map(roleId => ({
        userId,
        roleId
      }));

      await prisma.userRole.createMany({
        data: userRoleData,
        skipDuplicates: true
      });

      return true;
    } catch (error) {
      console.error('Error assigning role to user:', error);
      return false;
    }
  }

  /**
   * Get all permissions untuk role tertentu
   */
  static async getRolePermissions(roleId: number): Promise<Permission[]> {
    try {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: { roleId },
        include: {
          permission: true
        }
      });

      return rolePermissions.map(rp => rp.permission.permission as Permission);
    } catch (error) {
      console.error('Error getting role permissions:', error);
      return [];
    }
  }

  /**
   * Get all permissions untuk user tertentu
   */
  static async getUserPermissions(userId: number): Promise<Permission[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!user) return [];

      const permissions: string[] = [];
      user.roles.forEach(userRole => {
        userRole.role.permissions.forEach(rolePermission => {
          permissions.push(rolePermission.permission.permission);
        });
      });

      return [...new Set(permissions)] as Permission[];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  /**
   * Check apakah user memiliki permission tertentu
   */
  static async userHasPermission(userId: number, permission: Permission): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      return userPermissions.includes(permission);
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  }

  /**
   * Check apakah user memiliki salah satu dari permissions
   */
  static async userHasAnyPermission(userId: number, permissions: Permission[]): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      return permissions.some(permission => userPermissions.includes(permission));
    } catch (error) {
      console.error('Error checking user any permission:', error);
      return false;
    }
  }

  /**
   * Check apakah user memiliki semua permissions
   */
  static async userHasAllPermissions(userId: number, permissions: Permission[]): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      return permissions.every(permission => userPermissions.includes(permission));
    } catch (error) {
      console.error('Error checking user all permissions:', error);
      return false;
    }
  }

  /**
   * Setup default permissions untuk role baru
   */
  static async setupDefaultPermissions(): Promise<boolean> {
    try {
      // Ensure all permissions exist in database
      const allPermissions = Object.values(PERMISSIONS);
      
      for (const permission of allPermissions) {
        await prisma.permission.upsert({
          where: { permission },
          update: {},
          create: {
            permission,
            description: this.getPermissionDescription(permission)
          }
        });
      }

      // Setup default role permissions
      const superadminRole = await prisma.role.findUnique({
        where: { role: ROLES.SUPERADMIN }
      });

      const adminRole = await prisma.role.findUnique({
        where: { role: ROLES.ADMIN }
      });

      if (superadminRole) {
        // Superadmin gets all permissions
        await this.assignPermissionsToRole(superadminRole.id, allPermissions);
      }

      if (adminRole) {
        // Admin gets content management permissions
        const adminPermissions = [
          ...PERMISSION_GROUPS.CONTENT_MANAGEMENT,
          ...PERMISSION_GROUPS.CONTACT_OFFICE_MANAGEMENT,
          ...PERMISSION_GROUPS.BASIC_ACCESS
        ];
        await this.assignPermissionsToRole(adminRole.id, adminPermissions);
      }

      return true;
    } catch (error) {
      console.error('Error setting up default permissions:', error);
      return false;
    }
  }

  /**
   * Get description untuk permission
   */
  private static getPermissionDescription(permission: string): string {
    const descriptions: { [key: string]: string } = {
      // User management
      'user:create': 'Membuat user baru',
      'user:read': 'Melihat data user',
      'user:update': 'Mengupdate data user',
      'user:delete': 'Menghapus user',
      'user:list': 'Melihat daftar user',

      // Management team
      'management:create': 'Membuat anggota management',
      'management:read': 'Melihat data management',
      'management:update': 'Mengupdate data management',
      'management:delete': 'Menghapus anggota management',
      'management:list': 'Melihat daftar management',

      // Slider
      'slider:create': 'Membuat slider baru',
      'slider:read': 'Melihat data slider',
      'slider:update': 'Mengupdate slider',
      'slider:delete': 'Menghapus slider',
      'slider:list': 'Melihat daftar slider',

      // Gallery
      'gallery:create': 'Upload foto ke gallery',
      'gallery:read': 'Melihat gallery',
      'gallery:update': 'Mengupdate foto gallery',
      'gallery:delete': 'Menghapus foto gallery',
      'gallery:list': 'Melihat daftar gallery',

      // Service
      'service:create': 'Membuat layanan baru',
      'service:read': 'Melihat data layanan',
      'service:update': 'Mengupdate layanan',
      'service:delete': 'Menghapus layanan',
      'service:list': 'Melihat daftar layanan',

      // Project
      'project:create': 'Membuat project baru',
      'project:read': 'Melihat data project',
      'project:update': 'Mengupdate project',
      'project:delete': 'Menghapus project',
      'project:list': 'Melihat daftar project',

      // Contact
      'contact:create': 'Membuat kontak baru',
      'contact:read': 'Melihat data kontak',
      'contact:update': 'Mengupdate kontak',
      'contact:delete': 'Menghapus kontak',
      'contact:list': 'Melihat daftar kontak',

      // Office
      'office:create': 'Membuat kantor baru',
      'office:read': 'Melihat data kantor',
      'office:update': 'Mengupdate kantor',
      'office:delete': 'Menghapus kantor',
      'office:list': 'Melihat daftar kantor',

      // Role management
      'role:create': 'Membuat role baru',
      'role:read': 'Melihat data role',
      'role:update': 'Mengupdate role',
      'role:delete': 'Menghapus role',
      'role:list': 'Melihat daftar role',

      // Permission management
      'permission:create': 'Membuat permission baru',
      'permission:read': 'Melihat data permission',
      'permission:update': 'Mengupdate permission',
      'permission:delete': 'Menghapus permission',
      'permission:list': 'Melihat daftar permission',

      // Role-Permission mapping
      'role_permission:create': 'Assign permission ke role',
      'role_permission:read': 'Melihat role-permission mapping',
      'role_permission:update': 'Mengupdate role-permission mapping',
      'role_permission:delete': 'Menghapus role-permission mapping',
      'role_permission:list': 'Melihat daftar role-permission',

      // User-Role mapping
      'user_role:create': 'Assign role ke user',
      'user_role:read': 'Melihat user-role mapping',
      'user_role:update': 'Mengupdate user-role mapping',
      'user_role:delete': 'Menghapus user-role mapping',
      'user_role:list': 'Melihat daftar user-role',

      // Dashboard
      'dashboard:access': 'Akses dashboard',
      'dashboard:stats': 'Melihat statistik dashboard',

      // System
      'system:settings': 'Mengakses pengaturan sistem',
      'system:backup': 'Melakukan backup sistem',
      'system:logs': 'Melihat log sistem',

      // Profile
      'profile:read': 'Melihat profil sendiri',
      'profile:update': 'Mengupdate profil sendiri',
      'profile:change_password': 'Mengubah password sendiri',

      // Content management
      'content:manage': 'Mengelola konten',
      'content:publish': 'Mempublikasi konten',
      'content:moderate': 'Moderasi konten'
    };

    return descriptions[permission] || `Permission: ${permission}`;
  }

  /**
   * Get role hierarchy level (untuk authorization logic)
   */
  static getRoleLevel(role: string): number {
    const roleLevels: { [key: string]: number } = {
      [ROLES.SUPERADMIN]: 100,
      [ROLES.ADMIN]: 80,
      [ROLES.ADMIN1]: 70,
      [ROLES.ADMIN2]: 60,
      'user': 10
    };

    return roleLevels[role] || 0;
  }

  /**
   * Check apakah role1 memiliki level lebih tinggi dari role2
   */
  static isHigherRole(role1: string, role2: string): boolean {
    return this.getRoleLevel(role1) > this.getRoleLevel(role2);
  }
}
