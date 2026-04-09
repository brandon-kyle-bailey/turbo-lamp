import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col h-full w-full">
          <SidebarTrigger />
          <AppHeader />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
