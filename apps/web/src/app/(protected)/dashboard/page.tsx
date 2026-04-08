"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  id: string;
  name: string;
}

export default function Dashboard() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/core/v1/auth/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
      })
      .catch(() => router.replace("/"));
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <main>
      <h1>Welcome to your Dashboard</h1>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Username:</strong> {user.name}
      </p>
      <p>
        <strong>User email:</strong> {user.email}
      </p>
    </main>
  );
}
