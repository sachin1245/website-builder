import { useDrag } from "react-dnd";

export const useElementDrag = (type: string, item: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return { isDragging, drag };
};
