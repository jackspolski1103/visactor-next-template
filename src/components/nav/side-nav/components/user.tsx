"use client";

import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/hooks/use-auth";

export default function User() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch {
      // Error handling could be improved with toast notifications
    }
  };

  return (
    <div className="flex h-16 items-center border-b border-border px-2 relative">
      <div 
        className="flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center">
          <Image
            src="/avatar.png"
            alt="User"
            className="mr-2 rounded-full"
            width={36}
            height={36}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {session?.user?.name || "Usuario"}
            </span>
            <span className="text-xs text-muted-foreground">
              {session?.user?.email || "usuario@email.com"}
            </span>
          </div>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isDropdownOpen && (
        <>
          {/* Overlay para cerrar el dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute top-full left-2 right-2 z-20 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <LogOut size={16} className="mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}
