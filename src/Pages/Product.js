import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Product = ({ image, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'product', image },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'logo',
    drop: (item, monitor) => {
      if (onDrop) {
        onDrop(item.image, monitor.getClientOffset());
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  });

  return (
    <DndProvider backend={HTML5Backend}>
    <div
      ref={drop}
      style={{
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        border: `1px solid ${canDrop ? 'green' : 'transparent'}`,
        backgroundColor: isOver ? 'lightgreen' : 'transparent',
        cursor: 'move',
      }}
    >
      <img src={image} alt="Product" style={{ maxWidth: '100%' }} />
      <div ref={drag} style={{ position: 'absolute', top: 0, left: 0 }}>
        <img src="/logo.png" alt="Logo" style={{ maxWidth: '50%' }} />
      </div>
    </div>
    </DndProvider>
  );
};

export default Product;
