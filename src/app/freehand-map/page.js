
'use client'
import dynamic from 'next/dynamic';

const FreehandMap = dynamic(() => import('@/components/freeHandMap'), {
  ssr: false,
});

export default function FreehandMapPage() {
  return (
    <div>
      <h1>Freehand Fencing</h1>
      <FreehandMap />
    </div>
  );
}
