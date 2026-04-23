// resources/js/store/sidebar.ts
import { NavItem } from '@/types';
import { LayoutGrid, UsersRound } from 'lucide-react';
import { create } from 'zustand';

type SidebarState = {
  mainNavItems: NavItem[];
  setMainNavItems: (value: NavItem[]) => void;
};

const mainNavItemsInit: NavItem[] = [
  {
    title: 'Inicio',
    url: '/dashboard',
    icon: LayoutGrid,
    isActive: true,
    isOpen: false,
    can: null,
    subItems: null,
  },
  {
    title: 'Pacientes',
    url: '/patients',
    icon: UsersRound,
    isActive: false,
    isOpen: false,
    can: ['read_patients'],
    subItems: null,
  },
  {
    title: 'Archivo',
    url: '/archive',
    icon: LayoutGrid,
    isActive: false,
    isOpen: false,
    can: null,
    subItems: [
      {
        title: 'Movimientos',
        url: '/archive/movements',
        can: null,
      },
      {
        title: 'Depuraciones',
        url: '/archive/debuggs',
        can: null,
      },
      {
        title: 'Actualizaciones',
        url: '/archive/updates',
        can: [],
      },
    ],
  },
  {
    title: 'Administración',
    url: '/admin',
    icon: LayoutGrid,
    isActive: false,
    isOpen: false,
    can: ['read_users'],
    subItems: [
      {
        title: 'Usuarios',
        url: '/admin/users',
        can: ['read_users'],
      },
      {
        title: 'Roles',
        url: '/admin/roles',
        can: null,
      },
      {
        title: 'Permisos',
        url: '/admin/permissions',
        can: null,
      },
    ],
  },
];
const initialState = {
  mainNavItems: mainNavItemsInit,
};

export const useSidebarStore = create<SidebarState>((set) => ({
  ...initialState,
  setMainNavItems: (value) => set({ mainNavItems: value }),
}));
