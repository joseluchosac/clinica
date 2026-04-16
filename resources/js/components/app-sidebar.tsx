import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';
import { useEffect, useState } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';

// const mainNavItemsInit: NavItem[] = [
//     {
//         title: 'Inicio',
//         url: '/dashboard',
//         icon: LayoutGrid,
//         isActive: true,
//         isOpen: false,
//         items: null,
//     },
//     {
//         title: 'Pacientes',
//         url: '/patients',
//         icon: UsersRound,
//         isActive: false,
//         isOpen: false,
//         items: null,
//     },
//     {
//         title: 'Archivo',
//         url: '/archive',
//         icon: LayoutGrid,
//         isActive: false,
//         isOpen: false,
//         items: [
//             {
//                 title: 'Movimientos',
//                 url: '/archive/movements'
//             },
//             {
//                 title: 'Depuraciones',
//                 url: '/archive/debuggs',
//             },
//         ]
//     },
//     {
//         title: 'Admision',
//         url: '/admission',
//         icon: LayoutGrid,
//         isActive: false,
//         isOpen: false,
//         items: [
//             {
//                 title: 'Toma de datos',
//                 url: '/toma_datos',
//             },
//             {
//                 title: 'Informes',
//                 url: '/informes'
//             }
//         ]
//     },
// ];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     url: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     url: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    // const [mainNavItems, setMainNavItems] = useState(mainNavItemsInit);
    const mainNavItems = useSidebarStore(state => state.mainNavItems);
    const setMainNavItems = useSidebarStore(state => state.setMainNavItems);
    const {url} = usePage();
    const currentPage =  url?.split('?')[0];
    // console.log(currentPage)
    const handleMainNavItems = (item: NavItem) => {
        const newMainNavItems = mainNavItems.map((mainNavItem) => {
            if (mainNavItem.title == item.title) {
                return { ...mainNavItem, isOpen: !mainNavItem.isOpen};
            }else{
                return mainNavItem;
            }
        });
        setMainNavItems(newMainNavItems);
    };

    useEffect(()=>{
        const newMainNavItems = mainNavItems.map((mainNavItem) => {
            if (currentPage.startsWith(mainNavItem.url)) {
                return { ...mainNavItem, isOpen: true};
            }else{
                return mainNavItem;
            }
        });
        setMainNavItems(newMainNavItems);
    },[currentPage])

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} handleMainNavItems={handleMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
