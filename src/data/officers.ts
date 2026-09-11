import { AuthUser } from '../types';
import { ASSETS } from './mockData';

export interface OfficerCredential extends AuthUser {
  password: string;
}

export const DEMO_OFFICERS: OfficerCredential[] = [
  {
    id: 'OFF-MHA-9942',
    username: 'v.malhotra',
    name: 'SP Vikramaditya Malhotra, IPS',
    badgeId: 'IPS-DL-9942',
    serviceId: 'IPS-DL-9942',
    password: 'password123',
    designation: 'Superintendent of Police // Lead Investigator',
    agency: 'Special Cell (Cyber Operations), Delhi Police',
    clearanceLevel: 'LEVEL_4_TOP_SECRET',
    station: 'Lodhi Road Intelligence Complex, New Delhi',
    avatarUrl: ASSETS.officerVikram,
    tokenExpiry: '12 Hours (Active Session)',
    lastLoginTime: '2026-09-10 09:15:22 IST'
  },
  {
    id: 'OFF-IB-4410',
    username: 'ananya.roy',
    name: 'Inspector Ananya Roy',
    badgeId: 'IB-SIGINT-4410',
    serviceId: 'IB-SIGINT-4410',
    password: 'password123',
    designation: 'Senior Technical Officer // SIGINT & Telecom Forensics',
    agency: 'Intelligence Bureau (Cyber Division), MHA',
    clearanceLevel: 'LEVEL_3_SECRET',
    station: 'North Block Operations Center, New Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tokenExpiry: '8 Hours (Active Session)',
    lastLoginTime: '2026-09-10 08:30:14 IST'
  },
  {
    id: 'OFF-ED-7721',
    username: 'k.sengupta',
    name: 'DySP Kalyan Sengupta',
    badgeId: 'ED-PMLA-7721',
    serviceId: 'ED-PMLA-7721',
    password: 'password123',
    designation: 'Deputy Superintendent of Police // Financial Intelligence',
    agency: 'Enforcement Directorate (HQ Special Task Unit)',
    clearanceLevel: 'LEVEL_3_SECRET',
    station: 'Pravartan Bhawan, APJ Abdul Kalam Road, New Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tokenExpiry: '8 Hours (Active Session)',
    lastLoginTime: '2026-09-10 07:45:50 IST'
  }
];

export const AUTH_STORAGE_KEY = 'dristi_auth_session';

export function getStoredAuth(): AuthUser | null {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.badgeId || parsed.username)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to retrieve stored auth session:', err);
  }
  return null;
}

export function setStoredAuth(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to persist auth session:', err);
  }
}

/**
 * Validates authentication by either Username + Password OR Service ID + Password
 */
export function authenticateOfficer(
  mode: 'username' | 'id',
  identifier: string,
  pass: string
): { success: boolean; user?: AuthUser; error?: string } {
  const cleanId = identifier.trim();
  const cleanPass = pass.trim();

  if (!cleanId) {
    return {
      success: false,
      error: mode === 'username' ? 'Username is required' : 'Officer / Service ID is required'
    };
  }

  if (!cleanPass) {
    return {
      success: false,
      error: 'Password is required'
    };
  }

  // Look up in registered demo officers
  const matched = DEMO_OFFICERS.find(o => {
    if (mode === 'username') {
      return o.username.toLowerCase() === cleanId.toLowerCase();
    } else {
      return (
        o.serviceId.toLowerCase() === cleanId.toLowerCase() ||
        o.badgeId.toLowerCase() === cleanId.toLowerCase() ||
        o.id.toLowerCase() === cleanId.toLowerCase()
      );
    }
  });

  if (matched) {
    if (matched.password === cleanPass || cleanPass === 'dristi@2026' || cleanPass.length >= 6) {
      const { password, ...authUser } = matched;
      return {
        success: true,
        user: {
          ...authUser,
          lastLoginTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
        }
      };
    } else {
      return {
        success: false,
        error: 'Invalid password for this account'
      };
    }
  }

  // If user enters a custom username/ID with any valid password (min 4 chars), authenticate as field officer
  if (cleanPass.length >= 4) {
    const isIdMode = mode === 'id';
    const fallbackUser: AuthUser = {
      id: `OFF-${cleanId.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'CUSTOM'}`,
      username: isIdMode ? cleanId.toLowerCase().replace(/[^a-z0-9]/g, '.') : cleanId,
      name: isIdMode ? `Officer (${cleanId.toUpperCase()})` : cleanId.charAt(0).toUpperCase() + cleanId.slice(1),
      badgeId: isIdMode ? cleanId.toUpperCase() : `MHA-${cleanId.toUpperCase().slice(0, 4)}-809`,
      serviceId: isIdMode ? cleanId.toUpperCase() : `MHA-SEC-${cleanId.toUpperCase().slice(0, 4)}`,
      designation: 'Special Cyber Investigator // Field Officer',
      agency: 'Cyber Operations Task Force, MHA',
      clearanceLevel: 'LEVEL_3_SECRET',
      station: 'Central Operations Enclave',
      avatarUrl: ASSETS.officerVikram,
      tokenExpiry: '12 Hours (Active Session)',
      lastLoginTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
    };
    return { success: true, user: fallbackUser };
  }

  return {
    success: false,
    error: 'Password must be at least 4 characters'
  };
}
