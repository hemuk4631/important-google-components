
'use client'
import dynamic from 'next/dynamic';

const DotConnectPolygon = dynamic(() => import('@/components/dotConnectPolygon'), {
  ssr: false,
});

export default function FreehandMapPage() {
  return (
    <div>
      <h1>Dot connect Fencing</h1>
      <DotConnectPolygon />
    </div>
  );
}
