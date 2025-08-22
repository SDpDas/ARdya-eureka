import { useDrop } from "react-dnd"
import { NativeTypes } from "react-dnd-html5-backend"

interface DragDropLayerProps {
  onDrop: (item: any) => void
}

export function DragDropLayer({ onDrop }: DragDropLayerProps) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop(item: { files: any[] }) {
      if (item.files && item.files.length > 0) {
        onDrop(item.files[0])
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  return (
    <div ref={drop} style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}>
      {canDrop && isOver && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "yellow",
          }}
        />
      )}
    </div>
  )
}
