
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({
  id,
  item,
  listeners,
  attributes,
  isDragging,
  transform,
  transition,
  displayKey,
  secondaryKey,
}) => {
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const primaryText = item[displayKey] || "No Title";
  const secondaryText = item[secondaryKey] || "";

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-xl cursor-grab shadow-sm border border-gray-200
        ${isDragging ? "ring-2 ring-blue-500 bg-white" : "bg-gray-50 hover:bg-gray-100"}
        transition transform duration-200 hover:scale-[1.01] active:scale-[0.99] opacity-100 translate-y-0
      `}
      style={style}
      {...listeners}
      {...attributes}
      role="button"
      aria-roledescription="sortable"
    >
      {/* Handle icon */}
      <div className="p-2 rounded-md bg-gray-200 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900 truncate">
            {primaryText}
          </div>
          <div className="text-xs text-gray-500">{item.status || ""}</div>
        </div>
        {secondaryText && (
          <div className="text-xs text-gray-500 mt-1 truncate">
            {secondaryText}
          </div>
        )}
      </div>
    </div>
  );
};

const SortableList = ({ items = [], onChange, displayKey, secondaryKey }) => {
  const [localItems, setLocalItems] = useState(items);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => setLocalItems(items), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = localItems.findIndex((i) => i.id === active.id);
      const newIndex = localItems.findIndex((i) => i.id === over.id);
      const newList = arrayMove(localItems, oldIndex, newIndex);
      setLocalItems(newList);
      onChange?.(newList);
    }
  };

  const handleDragCancel = () => setActiveId(null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={localItems.map((i) => i.id)}
        strategy={rectSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {localItems.map((item) => (
            <SortableRow
              key={item.id}
              id={item.id}
              item={item}
              displayKey={displayKey}
              secondaryKey={secondaryKey}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay
        dropAnimation={{
          duration: 160,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeId ? (() => {
          const activeItem = localItems.find((i) => i.id === activeId);
          if (!activeItem) return null;
          return (
            <SortableItem
              item={activeItem}
              isDragging
              displayKey={displayKey}
              secondaryKey={secondaryKey}
            />
          );
        })() : null}
      </DragOverlay>
    </DndContext>
  );
};

function SortableRow({ id, item, displayKey, secondaryKey }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div ref={setNodeRef}>
      <SortableItem
        id={id}
        item={item}
        listeners={listeners}
        attributes={attributes}
        isDragging={isDragging}
        transform={transform}
        transition={transition}
        displayKey={displayKey}
        secondaryKey={secondaryKey}
      />
    </div>
  );
}

export default SortableList;
