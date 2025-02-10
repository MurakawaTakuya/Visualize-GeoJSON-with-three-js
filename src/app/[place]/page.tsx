"use client";
import ThreeScene from "@/components/ThreeScene/ThreeScene";
import { use } from "react";
interface Params {
  place: string;
}

export default function Page({ params }: { params: Promise<Params> }) {
  const { place } = use(params);

  return (
    <>
      <ThreeScene place={place} key={place} />
    </>
  );
}
