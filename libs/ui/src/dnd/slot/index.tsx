import { ConnectDropTarget, DropTargetHookSpec, useDrop } from 'react-dnd';

export type SlotChildProps = {
  ref?: ConnectDropTarget;
  slotProps?: SlotProps;
  collection?: any;
};

export interface SlotProps<DO = any, DR = any, CP = any>
  extends DropTargetHookSpec<DO, DR, CP> {
  children?: (props: SlotChildProps) => JSX.Element;
}

export function Slot({ children, ...slotProps }: Readonly<SlotProps>) {
  const [collection, ref] = useDrop(
    () => ({
      ...(slotProps ?? {}),
    }),
    []
  );
  return children?.({ ref, slotProps, collection });
}

export default Slot;
