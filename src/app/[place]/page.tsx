"use client";
import GeoFilesLoader from "@/components/GeoFilesLoader";
import { use, useState } from "react";
import ThreeScene from "../ThreeScene";
interface Params {
  place: string;
}

export default function Page({ params }: { params: Promise<Params> }) {
  const { place } = use(params);
  const [loading, setLoading] = useState(true);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <GeoFilesLoader />}
      <ThreeScene
        place={place}
        onLoadComplete={handleLoadComplete}
        key={place}
      />
    </>
  );
}
