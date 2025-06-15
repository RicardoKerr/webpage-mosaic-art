
import React from 'react';
import { Stone } from './types';
import StoneCard from './StoneCard';
import { Skeleton } from '@/components/ui/skeleton';

interface StoneGridProps {
  stones: Stone[];
  isLoading: boolean;
  isError: boolean;
  getImageUrl: (imageFileName: string) => string;
}

const StoneGrid: React.FC<StoneGridProps> = ({ stones, isLoading, isError, getImageUrl }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-semibold">Error loading stones.</p>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    );
  }

  if (stones.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-700 font-semibold">No stones found.</p>
        <p className="text-gray-500">Try adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {stones.map(stone => {
        const stoneWithUrl = {
          ...stone,
          image_url: stone.image_url || getImageUrl(stone.image_filename),
        };
        return <StoneCard key={stone.id} stone={stoneWithUrl} />;
      })}
    </div>
  );
};

export default StoneGrid;
