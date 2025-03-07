
import React from 'react';
import ShapeCard from './ShapeCard';
import { shapes } from '@/lib/shapes';

const ShapeGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {shapes.map((shape, index) => (
        <div key={shape.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
          <ShapeCard shape={shape} index={index} />
        </div>
      ))}
    </div>
  );
};

export default ShapeGrid;
