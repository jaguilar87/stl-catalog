import React from 'react';
import { VendorsList } from '@/components/vendors/VendorsList';
import { ParserModal } from '@/components/parser/ParserModal';
import { MergerModal } from '@/components/merger/MergerModal';
import { GalleryModal } from '@/components/gallery/GalleryModal';

export default function Home() {
  return (
    <main className="mt-20">
      <VendorsList />
      <ParserModal />
      <MergerModal />
      <GalleryModal />
    </main>
  );
}
