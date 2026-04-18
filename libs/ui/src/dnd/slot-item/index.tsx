import { TChild, TComponent, TComponentActions } from '@dnd-builder/core/types';
import {
  ConnectDragPreview,
  ConnectDragSource,
  DragSourceHookSpec,
  useDrag,
} from 'react-dnd';
export * from 'react-dnd';

export type Item<C = TComponent> = {
  component?: C;
  node?: TChild;
  action?: TComponentActions;
  parent?: TChild;
  positionIndex?: number;
};

export interface SlotItemProps<
  I = Item<TComponent>,
  DO = any,
  DR = any,
  CP = any
> extends Omit<DragSourceHookSpec<DO, DR, CP>, 'item'> {
  children?: (props: SlotItemChildProps) => JSX.Element;
  item?: I;
}

export type SlotItemChildProps<C = any, DO = any, DR = any, CP = any> = {
  move: {
    collection?: C;
    dragRef: ConnectDragSource;
    previewRef: ConnectDragPreview;
  };
  copy: {
    collection?: C;
    dragRef: ConnectDragSource;
    previewRef: ConnectDragPreview;
  };
  slotItemProps?: SlotItemProps<Item, DO, DR, CP>;
};

export function SlotItem<C = TComponent>({
  children,
  ...slotItemProps
}: Readonly<SlotItemProps<Item<C>>>) {
  const item = slotItemProps?.item;
  const move = useDrag(
    () => ({
      ...(slotItemProps ?? {}),
      item: { ...(item ?? {}), action: item?.action ?? 'MOVE' },
    }),
    []
  );
  const copy = useDrag(
    () => ({
      ...(slotItemProps ?? {}),
      item: { ...(item ?? {}), action: 'COPY' },
    }),
    []
  );
  return children?.({
    move: {
      collection: move?.[0],
      dragRef: move?.[1],
      previewRef: move?.[2],
    },
    copy: {
      collection: copy?.[0],
      dragRef: copy?.[1],
      previewRef: copy?.[2],
    },
    slotItemProps,
  });
}

export default SlotItem;
