import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type SchemaField = {
  name: string;
  label?: string;
  default?: string;
};

type ListManagerProps = {
  schema: SchemaField[];
  value?: Record<string, string>[];
  defaultValue?: Record<string, string>[];
  onChange?: (items: Record<string, string>[]) => void;
};

type DragItem = {
  id: string;
  index: number;
};

const ItemType = "ITEM";

function DraggableItem({
  id,
  index,
  moveItem,
  children,
}: {
  id: string;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
}) {
  const [, ref] = useDrag<DragItem>({
    type: ItemType,
    item: { id, index },
  });

  const [, drop] = useDrop<DragItem>({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} style={{ marginBottom: "10px" }}>
      {children}
    </div>
  );
}

export default function ListManager({ schema, value, defaultValue, onChange }: ListManagerProps) {
  const [items, setItems] = useState<Record<string, string>[]>(value || defaultValue || []);

  const handleAdd = () => {
    const newItem: Record<string, string> = schema.reduce((obj, field) => {
      obj[field.name] = field.default || "";
      return obj;
    }, {} as Record<string, string>);
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onChange && onChange(updatedItems);
  };

  const handleEdit = (index: number, field: string, newValue: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = newValue;
    setItems(updatedItems);
    onChange && onChange(updatedItems);
  };

  const handleDelete = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    onChange && onChange(updatedItems);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
    onChange && onChange(updatedItems);
  };

  return (
    <div>
      <button onClick={handleAdd}>Add Item</button>
      <DndProvider backend={HTML5Backend}>
        {items.map((item, index) => (
          <DraggableItem
            key={index}
            id={index.toString()}
            index={index}
            moveItem={moveItem}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {schema.map((field) => (
                <div key={field.name} style={{ marginRight: "10px" }}>
                  <label>
                    {field.label || field.name}:
                    <input
                      type="text"
                      value={item[field.name]}
                      onChange={(e) => handleEdit(index, field.name, e.target.value)}
                    />
                  </label>
                </div>
              ))}
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          </DraggableItem>
        ))}
      </DndProvider>
    </div>
  );
}
