import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CarFront, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useCan } from '@/hooks/use-can';

interface NavMainProps {
    items: NavItem[];
    handleMainNavItems: (item: NavItem) => void;
}

export function NavMain({ items = [], handleMainNavItems}: NavMainProps) {
    const page = usePage();
    const can = useCan()
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.filter((item) => {
                    if(!item.can) return true
                    const res = item.can.filter(el=>can(el))
                    return Boolean(res.length)
                }).map((item) => (
                    item.subItems ?
                    <Collapsible
                        open={item.isOpen}
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className='group/collapsible'
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton 
                                    isActive={item.url === page.url}
                                    tooltip={item.title}
                                    onClick={() => handleMainNavItems(item)}   
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.subItems?.filter((subItem)=>{
                                        if(!subItem.can) return true
                                        const res = subItem.can.filter(el=>can(el))
                                        return Boolean(res.length)
                                    }).map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={subItem.url === page.url}
                                        >
                                            <Link href={subItem.url} prefetch>
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                    :
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild 
                            isActive={page.url.startsWith(item.url)}
                        >
                            <Link href={item.url} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
