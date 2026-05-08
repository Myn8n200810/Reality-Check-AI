"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import SettingsModal, { type SectionKey } from "@/components/SettingsModal";

export default function Navbar({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] =
    useState<SectionKey>("general");

  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const closeNavbar = () => setOpen(false);

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("close-navbar-menu", closeNavbar);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("close-navbar-menu", closeNavbar);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeBothMenus = () => {
    window.dispatchEvent(new Event("close-navbar-menu"));
    window.dispatchEvent(new Event("close-profile-menu"));
  };

  const handleLogout = async () => {
    closeBothMenus();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        initialSection={settingsSection}
      />

      <div ref={menuRef} className="absolute top-4 left-4 z-[1000]">
        <button
          onClick={() => {
            window.dispatchEvent(new Event("close-profile-menu"));
            setOpen(!open);
          }}
          className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10 transition-all duration-150 hover:bg-white/20 active:scale-90 active:bg-white/30"
        >
          <div className="space-y-1">
            <div className="w-5 h-[2px] bg-white" />
            <div className="w-5 h-[2px] bg-white" />
            <div className="w-5 h-[2px] bg-white" />
          </div>
        </button>

        {open && (
          <div className="mt-3 w-64 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/10 shadow-xl p-2 space-y-1">
            <div className="px-4 py-2 text-white/50 text-xs uppercase tracking-widest">
              Menu
            </div>

            {current === "reality" && (
              <button
                onClick={() => {
                  closeBothMenus();
                  router.push("/contract-checker");
                }}
                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
              >
                <svg
                  className="w-5 h-5 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 3h7l5 5v13H7z" />
                </svg>
                Contract Checker
              </button>
            )}

            {current === "contract" && (
              <button
                onClick={() => {
                  closeBothMenus();
                  router.push("/reality-check");
                }}
                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
              >
                <svg
                  className="w-5 h-5 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3c-4 0-7 3-7 7v1c0 2 1 3 2 4v3h10v-3c1-1 2-2 2-4v-1c0-4-3-7-7-7z" />
                </svg>
                Reality Check
              </button>
            )}

            <button
              onClick={() => {
                closeBothMenus();
                setSettingsSection("personalisation");
                setSettingsOpen(true);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
            >
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                <path d="M2 12h2M20 12h2M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
              Personalisation
            </button>

            <button
              onClick={() => {
                closeBothMenus();
                setSettingsSection("general");
                setSettingsOpen(true);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
            >
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M12 15.5A3.5 3.5 0 1012 8a3.5 3.5 0 000 7.5z" />
                <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 00-2 .1 8 8 0 01-1.6.7 1.7 1.7 0 00-1.1 1.6V23H9v-.3a1.7 1.7 0 00-1.1-1.6 8 8 0 01-1.6-.7 1.7 1.7 0 00-2-.1l-.2.1-2-3.4.1-.1A1.7 1.7 0 002.6 15 8 8 0 012 13.2 1.7 1.7 0 00.5 12V8a1.7 1.7 0 001.5-1.2A8 8 0 012.6 5a1.7 1.7 0 00-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 002-.1A8 8 0 018 .9 1.7 1.7 0 009 0h4a1.7 1.7 0 001.1.9 8 8 0 011.6.7 1.7 1.7 0 002 .1l.2-.1 2 3.4-.1.1a1.7 1.7 0 00-.3 1.9 8 8 0 01.6 1.8A1.7 1.7 0 0023.5 8v4a1.7 1.7 0 00-1.5 1.2A8 8 0 0119.4 15z" />
              </svg>
              Settings
            </button>

            <button
              onClick={closeBothMenus}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
            >
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z" />
                <path d="M10 21h4" />
              </svg>
              Notifications
            </button>

            <button
              onClick={closeBothMenus}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
            >
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
                <path d="M8 9h8M8 13h5" />
              </svg>
              Feedback
            </button>

            <button
              onClick={closeBothMenus}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
            >
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 10v6M12 7h.01" />
              </svg>
              About
            </button>

            <button
              onClick={closeBothMenus}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
            >
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9a2.5 2.5 0 015 0c0 2-2.5 2.2-2.5 4" />
                <path d="M12 17h.01" />
              </svg>
              Help & Support
            </button>

            <div className="border-t border-white/10 my-2" />

            <button
              onClick={closeBothMenus}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
            >
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Account
            </button>

            <button
              onClick={closeBothMenus}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 rounded-xl"
            >
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M7 7h11M7 7l4-4M7 7l4 4M17 17H6M17 17l-4 4M17 17l-4-4" />
              </svg>
              Switch Account
            </button>

            <div className="border-t border-white/10 my-2" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-red-500/20 rounded-xl text-red-400"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <path d="M16 17l5-5-5-5M21 12H9" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}