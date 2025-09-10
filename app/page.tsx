"use client"
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  console.log(session.data)
  console.log(session.status)
  return (
    <>
      <h1>
        Hi there!
      </h1>
    </>
  );
}
