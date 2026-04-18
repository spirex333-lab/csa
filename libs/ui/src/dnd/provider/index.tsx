import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
export interface DNDProviderProps {
  children?: any;
}
export function DNDProvider({ children }: DNDProviderProps) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

export default DNDProvider;
