"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";

const NavbarAuth = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        return;
      }

      setOpen(false);

      toast.success("সফলভাবে সাইন আউট হয়েছে");

      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করার সময় সমস্যা হয়েছে");
    } finally {
      setSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div
        className="h-9 w-20 animate-pulse rounded-lg bg-gray-100"
        aria-label="লোড হচ্ছে"
      />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-green-700"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const user = session.user;

  const avatarFallback =
    user.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <div ref={menuRef} className="relative">
      {/* Profile button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-50"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="প্রোফাইল মেনু"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "প্রোফাইল"}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
            {avatarFallback}
          </div>
        )}

        <span className="hidden text-sm font-medium text-gray-700 sm:block">
          {user.name || "ব্যবহারকারী"}
        </span>

        <span
          className={`text-xs text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Profile dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full z-[100] mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          role="menu"
        >
          <div className="border-b border-gray-100 px-4 py-4">
            <p className="truncate text-sm font-semibold text-gray-800">
              {user.name || "ব্যবহারকারী"}
            </p>

            <p className="mt-1 truncate text-xs text-gray-500">
              {user.email}
            </p>
          </div>

          <div className="p-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
              role="menuitem"
            >
              <span>👤</span>
              <span>আমার প্রোফাইল</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              role="menuitem"
            >
              <span>↪</span>
              <span>
                {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarAuth;