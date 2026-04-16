// resources/js/store/sidebar.ts
import { NavItem } from "@/types";
import { LayoutGrid, UsersRound } from "lucide-react";
import { create } from "zustand";

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
        items: null,
    },
    {
        title: 'Pacientes',
        url: '/patients',
        icon: UsersRound,
        isActive: false,
        isOpen: false,
        items: null,
    },
    {
        title: 'Archivo',
        url: '/archive',
        icon: LayoutGrid,
        isActive: false,
        isOpen: false,
        items: [
            {
                title: 'Movimientos',
                url: '/archive/movements'
            },
            {
                title: 'Depuraciones',
                url: '/archive/debuggs',
            },
        ]
    },
    {
        title: 'Admision',
        url: '/admission',
        icon: LayoutGrid,
        isActive: false,
        isOpen: false,
        items: [
            {
                title: 'Registro de datos',
                url: '/admission/register',
            },
            {
                title: 'Informes',
                url: '/informes'
            }
        ]
    },
];

const initialState = {
  mainNavItems: mainNavItemsInit,
}

export const useSidebarStore = create<SidebarState>((set) => ({
  ...initialState,
  setMainNavItems: (value) => set({ mainNavItems: value }),
}));
