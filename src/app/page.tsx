"use client";
import Link from "next/link";
import "./page.module.scss";

export default function Page() {
  return (
    <>
      <p>
        <Link href="/NagoyaCentralPark/">NagoyaCentralPark</Link>
      </p>
      <p>
        <Link href="/NagoyaUnimall/">NagoyaUnimall</Link>
      </p>
      <p>
        <Link href="/NaritaAirport/">NaritaAirport</Link>
      </p>
      <p>
        <Link href="/NissanStd/">NissanStd</Link>
      </p>
      <p>
        <Link href="/ShinjukuTerminal/">ShinjukuTerminal</Link>
      </p>
      <p>
        <Link href="/ShinyokohamaStation/">ShinyokohamaStation</Link>
      </p>
      <p>
        <Link href="/TokyoStation/">TokyoStation</Link>
      </p>
    </>
  );
}
