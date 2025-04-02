import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuSub
} from '@/components/ui/sidebar';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  tooltip?: string;
}

export const CollapsibleMenuItem = ({ 
  icon, 
  label, 
  isActive, 
  onClick, 
  children,
  tooltip
}: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // If there are no children, render a simple menu item
  if (!children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton 
          isActive={isActive} 
          onClick={onClick}
          tooltip={tooltip}
        >
          {icon}
          <span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  
  // Otherwise, render a collapsible menu item
  return (
    <SidebarMenuItem>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            isActive={isActive}
            tooltip={tooltip}
          >
            {icon}
            <span className="flex-1">{label}</span>
            {isOpen ? 
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" /> : 
              <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
            }
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {children}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};
