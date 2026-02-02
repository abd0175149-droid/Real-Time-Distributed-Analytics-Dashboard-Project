import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { DraggableWidget, WidgetConfig } from './DraggableWidget';
import { WidgetLibrary } from './WidgetLibrary';
import {
  Settings,
  Save,
  RotateCcw,
  Plus,
  X,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface DashboardCustomizerProps {
  initialWidgets: WidgetConfig[];
  onSave: (widgets: WidgetConfig[]) => void;
  onCancel: () => void;
}

export function DashboardCustomizer({
  initialWidgets,
  onSave,
  onCancel,
}: DashboardCustomizerProps) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(initialWidgets);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleAddWidget = (widget: WidgetConfig) => {
    setWidgets((prev) => [...prev, { ...widget, id: `${widget.type}-${Date.now()}` }]);
    setShowLibrary(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
  };

  const handleToggleVisibility = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      )
    );
  };

  const handleResizeWidget = (widgetId: string, size: 'small' | 'medium' | 'large' | 'full') => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === widgetId ? { ...w, size } : w
      )
    );
  };

  const handleReset = () => {
    setWidgets(initialWidgets);
  };

  const activeWidget = widgets.find((w) => w.id === activeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold">تخصيص لوحة التحكم</h2>
            <p className="text-sm text-muted-foreground">
              اسحب وأفلت الـ widgets لإعادة ترتيبها
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowLibrary(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة Widget
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 ml-2" />
            إعادة تعيين
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button size="sm" onClick={() => onSave(widgets)}>
            <Save className="h-4 w-4 ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* Widget Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-12 gap-4">
            {widgets.map((widget) => (
              <DraggableWidget
                key={widget.id}
                widget={widget}
                isCustomizing={true}
                onRemove={() => handleRemoveWidget(widget.id)}
                onToggleVisibility={() => handleToggleVisibility(widget.id)}
                onResize={(size) => handleResizeWidget(widget.id, size)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeWidget ? (
            <div className="bg-card border-2 border-primary rounded-lg p-4 shadow-lg opacity-80">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{activeWidget.title}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Widget Library Modal */}
      {showLibrary && (
        <WidgetLibrary
          onSelect={handleAddWidget}
          onClose={() => setShowLibrary(false)}
          existingWidgets={widgets}
        />
      )}
    </div>
  );
}

export default DashboardCustomizer;
