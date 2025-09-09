import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { Permission } from '@/constants/permissions';

/**
 * Permission-based middleware yang lebih granular
 * Mengecek permission specific daripada hanya role
 */
export async function permissionMiddleware(
  req: NextRequest, 
  requiredPermissions: Permission[]
) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No token provided in permissionMiddleware:', authHeader);
      return NextResponse.json(
        { message: 'Unauthorized - No token provided' }, 
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || typeof decoded === 'string') {
      console.error('Invalid token payload:', decoded);
      return NextResponse.json(
        { message: 'Unauthorized - Invalid token payload' }, 
        { status: 401 }
      );
    }

    // Get user with roles and permissions
    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
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

    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return NextResponse.json(
        { message: 'Unauthorized - User not found' }, 
        { status: 401 }
      );
    }

    if (user.status === 'inactive') {
      console.error('Inactive user attempted access:', decoded.userId);
      return NextResponse.json(
        { message: 'Akun Anda tidak aktif. Hubungi administrator.' }, 
        { status: 403 }
      );
    }

    // Extract all permissions from user's roles
    const userPermissions: string[] = [];
    user.roles.forEach(userRole => {
      userRole.role.permissions.forEach(rolePermission => {
        userPermissions.push(rolePermission.permission.permission);
      });
    });

    // Remove duplicates
    const uniquePermissions = [...new Set(userPermissions)];

    // Check if user has required permissions
    const hasAllPermissions = requiredPermissions.every(permission => 
      uniquePermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(permission => 
        !uniquePermissions.includes(permission)
      );
      
      console.error('Insufficient permissions:', {
        userPermissions: uniquePermissions,
        requiredPermissions,
        missingPermissions,
        userId: user.id
      });
      
      return NextResponse.json({
        message: 'Forbidden - Insufficient permissions',
        required: requiredPermissions,
        missing: missingPermissions
      }, { status: 403 });
    }

    // Add user info to headers for downstream use
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', String(user.id));
    requestHeaders.set('x-user-roles', JSON.stringify(user.roles.map(r => r.role.role)));
    requestHeaders.set('x-user-permissions', JSON.stringify(uniquePermissions));

    return null;
  } catch (error: any) {
    console.error('Permission Middleware Error:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: 'Unauthorized: Permission middleware error', error: error.message }, 
      { status: 401 }
    );
  }
}

/**
 * Helper function untuk mengecek apakah user memiliki permission tertentu
 */
export async function hasPermission(
  userId: number, 
  permission: Permission
): Promise<boolean> {
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

    if (!user || user.status === 'inactive') {
      return false;
    }

    // Extract all permissions
    const userPermissions: string[] = [];
    user.roles.forEach(userRole => {
      userRole.role.permissions.forEach(rolePermission => {
        userPermissions.push(rolePermission.permission.permission);
      });
    });

    return userPermissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Helper function untuk mendapatkan semua permission user
 */
export async function getUserPermissions(userId: number): Promise<string[]> {
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

    if (!user || user.status === 'inactive') {
      return [];
    }

    // Extract all permissions
    const userPermissions: string[] = [];
    user.roles.forEach(userRole => {
      userRole.role.permissions.forEach(rolePermission => {
        userPermissions.push(rolePermission.permission.permission);
      });
    });

    return [...new Set(userPermissions)]; // Remove duplicates
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}
