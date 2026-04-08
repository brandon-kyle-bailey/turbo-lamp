import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const token = (await cookies()).get("session")?.value;

  if (!token) redirect("/"); // No token, send to login

  // try {
  //   // Replace JWT_PUBLIC with your public key or secret
  //   const decoded = jwt.verify(token, process.env.JWT_PUBLIC!, {
  //     algorithms: ["RS256"],
  //     issuer: "auth-server",
  //     audience: "api",
  //   });
  //
  //   // Optional: attach user info to context or props
  //   // const user = decoded as { userId: string; username: string };
  // } catch (err) {
  //   // Invalid or expired token
  //   redirect("/");
  // }

  return <>{children}</>;
}
