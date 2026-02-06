import { cookies } from 'next/headers';
import { cache } from 'react';
import prisma from './db/prisma';

export interface Session {
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export async function createSession(userId: string, sessionRole?: string): Promise<void> {
  const cookieStore = await cookies();
  
  // Buscar usuário para obter role padrão se não fornecido
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  const role = sessionRole || user?.role || 'EDITOR';
  
  // Para EDITOR: upsert (1 sessão por usuário)
  // Para VIEWER: upsert também (sobrescrever sessão existente)
  let session;
  if (role === 'EDITOR') {
    session = await prisma.session.upsert({
      where: { 
        userId_role: {
          userId,
          role: 'EDITOR'
        }
      },
      update: {
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        role: 'EDITOR',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  } else {
    // Para VIEWER, também usar upsert para evitar erro de constraint
    session = await prisma.session.upsert({
      where: { 
        userId_role: {
          userId,
          role: 'VIEWER'
        }
      },
      update: {
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        role: 'VIEWER',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Definir cookies
  cookieStore.set('session_id', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  });

  cookieStore.set('session_role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  });
}

export const getSession = cache(async (): Promise<Session | null> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_id');
    const roleCookie = cookieStore.get('session_role');

    if (!sessionCookie) {
      return null;
    }

    const session = await prisma.session.findFirst({
      where: {
        id: sessionCookie.value,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          select: { id: true, username: true, role: true }
        }
      }
    });

    if (!session) {
      return null;
    }

    // Usar role da sessão se disponível, senão usar role do usuário
    const effectiveRole = roleCookie?.value || session.user.role;

    return { 
      user: {
        ...session.user,
        role: effectiveRole
      }
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
});

export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireAuth();
  if (session.user.role !== 'ADMIN') {
    throw new Error('Admin required');
  }
  return session;
}
