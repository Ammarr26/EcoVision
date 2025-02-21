
import React from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, Package, Wallet, Users, LineChart, Settings } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: Wallet, label: "Finance", href: "/finance" },
  { icon: Users, label: "Suppliers", href: "/suppliers" },
  { icon: LineChart, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-accent">
        <Sidebar>
          <div className="px-6 py-5 mb-6">
            <h1 className="text-2xl font-semibold text-primary">EcoVision</h1>
            <p className="text-sm text-secondary mt-1">Inventory Management</p>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a href={item.href} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
