import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  GripVertical,
  X,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  MoreVertical,
  Settings
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '../../lib/utils';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  size: 'small' | 'medium' | 'large' | 'full';
  visible: boolean;
  category: string;
  component?: React.ReactNode;
}

interface DraggableWidgetProps {
  widget: WidgetConfig;
  isCustomizing: boolean;
  onRemove?: () => void;
  onToggleVisibility?: () => void;
  onResize?: (size: 'small' | 'medium' | 'large' | 'full') => void;
  children?: React.ReactNode;
}

const sizeClasses = {
  small: 'col-span-12 md:col-span-6 lg:col-span-3',
  medium: 'col-span-12 md:col-span-6',
  large: 'col-span-12 lg:col-span-8',
  full: 'col-span-12',
};

export function DraggableWidget({
  widget,
  isCustomizing,
  onRemove,
  onToggleVisibility,
  onResize,
  children,
}: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!widget.visible && !isCustomizing) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        sizeClasses[widget.size],
        isDragging && 'opacity-50',
        !widget.visible && 'opacity-50'
      )}
    >
      <Card className={cn(
        'h-full transition-all',
        isCustomizing && 'border-dashed border-2 hover:border-primary',
        isDragging && 'shadow-lg border-primary'
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            {isCustomizing && (
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <CardTitle className="text-base font-medium flex items-center gap-2">
              {widget.icon}
              {widget.title}
            </CardTitle>
          </div>

          {isCustomizing && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onToggleVisibility}
              >
                {widget.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[150px] bg-popover rounded-md shadow-lg border p-1 z-50"
                    align="end"
                  >
                    <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
                      الحجم
                    </DropdownMenu.Label>
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
                      onClick={() => onResize?.('small')}
                    >
                      <Minimize2 className="h-4 w-4" /> صغير
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
                      onClick={() => onResize?.('medium')}
                    >
                      متوسط
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
                      onClick={() => onResize?.('large')}
                    >
                      كبير
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none"
                      onClick={() => onResize?.('full')}
                    >
                      <Maximize2 className="h-4 w-4" /> كامل العرض
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-border my-1" />
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm outline-none text-red-500"
                      onClick={onRemove}
                    >
                      <X className="h-4 w-4" /> إزالة
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isCustomizing ? (
            <div className="h-32 flex items-center justify-center bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {widget.description || 'محتوى الـ Widget'}
              </p>
            </div>
          ) : (
            children || widget.component
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DraggableWidget;
