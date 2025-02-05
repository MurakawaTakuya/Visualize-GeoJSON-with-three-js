"use client";
import { use } from "react";
import ThreeScene from "../ThreeScene";

interface Params {
  place: string;
}

export default function Page({ params }: { params: Promise<Params> }) {
  const { place } = use(params);

  return <ThreeScene place={place} key={place} />;
}
