
import React from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, Package, Wallet, Users, LineChart, MessageSquare, X } from "lucide-react";
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: Wallet, label: "Finance", href: "/finance" },
  { icon: Users, label: "Suppliers", href: "/suppliers" },
  { icon: LineChart, label: "Analytics", href: "/analytics" },
];

const mockMessages = [
  {
    role: "assistant",
    content: "Hello! I'm your AI assistant. How can I help you analyze your business data today?"
  }
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = React.useState(mockMessages);
  const [input, setInput] = React.useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Based on the current data, I can provide insights about your business performance. Would you like to know more about any specific area?"
      }]);
    }, 1000);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background cosmic-particles">
        <Sidebar className="glass-card border-r border-white/5">
          <div className="px-6 py-5 mb-6">
            <h1 className="text-2xl font-semibold gradient-text">EcoVision</h1>
            <p className="text-sm text-muted-foreground mt-1">Enterprise Management</p>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a href={item.href} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex">
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg glow"
                size="icon"
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] h-full glass-card border-white/5">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold gradient-text">AI Assistant</h2>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-auto py-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.role === 'assistant'
                            ? 'bg-accent/30 text-foreground'
                            : 'bg-primary/80 text-primary-foreground'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything about your business..."
                      className="flex-1 px-4 py-2 border border-white/10 bg-background/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </SidebarProvider>
  );
};
