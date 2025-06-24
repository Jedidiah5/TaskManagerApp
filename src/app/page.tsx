import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 space-y-6 bg-background">
          <div className="flex justify-end items-center gap-4">
            <Tabs defaultValue="board" className="w-auto">
              <TabsList>
                <TabsTrigger value="board">Board view</TabsTrigger>
                {/* Add other views here if needed */}
              </TabsList>
            </Tabs>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add new view
            </Button>
          </div>
          
          <Tabs defaultValue="board" className="w-full">
            <TabsContent value="board" className="mt-0">
              <TaskBoard />
            </TabsContent>
            {/* Add TabsContent for other views here */}
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
