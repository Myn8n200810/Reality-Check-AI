"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type SectionKey =
  | "general"
  | "personalisation"
  | "account"
  | "security"
  | "notifications"
  | "plan";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
  initialSection?: SectionKey;
};

type DropdownKey = "appearance" | "contrast" | "accent" | null;

const accentClasses = [
  "accent-default",
  "accent-blue",
  "accent-green",
  "accent-yellow",
  "accent-pink",
  "accent-orange",
  "accent-purple",
  "accent-black",
];

const contrastClasses = [
  "contrast-system",
  "contrast-medium",
  "contrast-increased",
];

const appearanceClasses = [
  "appearance-system",
  "appearance-dark",
  "appearance-light",
];

function applyGeneralSetting(
  type: "appearance" | "contrast" | "accent",
  value: string
) {
  const root = document.documentElement;

  if (type === "appearance") {
    root.classList.remove(...appearanceClasses);

    if (value === "Dark") root.classList.add("appearance-dark");
    else if (value === "Light") root.classList.add("appearance-light");
    else root.classList.add("appearance-system");

    localStorage.setItem("decidely-appearance", value);
  }

  if (type === "contrast") {
    root.classList.remove(...contrastClasses);

    if (value === "Medium") root.classList.add("contrast-medium");
    else if (value === "Increased") root.classList.add("contrast-increased");
    else root.classList.add("contrast-system");

    localStorage.setItem("decidely-contrast", value);
  }

  if (type === "accent") {
    root.classList.remove(...accentClasses);

    const normalized = value.toLowerCase();
    root.classList.add(`accent-${normalized}`);

    localStorage.setItem("decidely-accent", value);
  }
}

const sections: {
  key: SectionKey;
  label: string;
  icon: ReactNode;
}[] = [
  {
    key: "general",
    label: "General",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 15.5A3.5 3.5 0 1012 8a3.5 3.5 0 000 7.5z" />
        <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 00-2 .1 8 8 0 01-1.6.7 1.7 1.7 0 00-1.1 1.6V23H9v-.3a1.7 1.7 0 00-1.1-1.6 8 8 0 01-1.6-.7 1.7 1.7 0 00-2-.1l-.2.1-2-3.4.1-.1A1.7 1.7 0 002.6 15 8 8 0 012 13.2 1.7 1.7 0 00.5 12V8a1.7 1.7 0 001.5-1.2A8 8 0 012.6 5a1.7 1.7 0 00-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 002-.1A8 8 0 018 .9 1.7 1.7 0 009 0h4a1.7 1.7 0 001.1.9 8 8 0 011.6.7 1.7 1.7 0 002 .1l.2-.1 2 3.4-.1.1a1.7 1.7 0 00-.3 1.9 8 8 0 01.6 1.8A1.7 1.7 0 0023.5 8v4a1.7 1.7 0 00-1.5 1.2A8 8 0 0119.4 15z" />
      </svg>
    ),
  },
  {
    key: "personalisation",
    label: "Personalisation",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 3l2.1 4.6L19 9l-3.5 3.4.9 4.9L12 15l-4.4 2.3.9-4.9L5 9l4.9-1.4L12 3z" />
        <path d="M4 20h16" />
      </svg>
    ),
  },
  {
    key: "security",
    label: "Security",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
        <path d="M9.5 12.5l1.7 1.7 3.3-3.7" />
      </svg>
    ),
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z" />
        <path d="M10 21h4" />
      </svg>
    ),
  },
  {
    key: "plan",
    label: "Plan",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L12 16.9 6.4 19l1.1-6.1L3 8.5l6.2-.9L12 2z" />
      </svg>
    ),
  },
  {
    key: "account",
    label: "Account",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4.5 4.5-7 8-7s6.5 2.5 8 7" />
      </svg>
    ),
  },
];

export default function SettingsModal({
  open,
  onClose,
  initialSection,
}: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>(
    initialSection ?? "general"
  );

  useEffect(() => {
    if (open) {
      setActiveSection(initialSection ?? "general");
    }
  }, [open, initialSection]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const content = useMemo(() => {
    switch (activeSection) {
      case "general":
        return <GeneralContent />;

      case "personalisation":
        return <PersonalisationContent />;

      case "security":
        return <SecurityContent />;

      case "notifications":
        return <NotificationsContent />;

      case "plan":
        return <PlanContent />;

      case "account":
        return <AccountContent />;

      default:
        return null;
    }
  }, [activeSection]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div className="flex min-h-screen items-center justify-center px-4 py-6 md:px-6 md:py-8">
        <div
          className="flex h-[min(86vh,760px)] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#111111]/98 shadow-[0_30px_120px_rgba(0,0,0,0.85)]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <aside className="flex w-[270px] shrink-0 flex-col border-r border-white/10 bg-black/25">
            <div className="flex items-center px-5 pb-4 pt-5">
              <button
                onClick={onClose}
                className="btn-press rounded-xl p-2 text-white/75 hover:text-white"
                aria-label="Close settings"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="px-3 pb-5">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`btn-press flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm ${
                      activeSection === section.key
                        ? "bg-white/10 text-white"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    <span className="text-white/85">{section.icon}</span>
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1 overflow-y-auto">
            <div className="px-6 pb-8 pt-6 md:px-8 md:pb-10 md:pt-7">
              {content}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-[2rem] font-semibold tracking-tight text-white">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-1 text-sm text-white/50">{subtitle}</p>
      ) : null}
    </div>
  );
}

function SettingsCard({
  title,
  description,
  actionLabel,
}: {
  title: string;
  description: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-4 rounded-[24px] border border-white/8 bg-black/45 p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
          <path d="M9.5 12.5l1.7 1.7 3.3-3.7" />
        </svg>
      </div>

      <h3 className="text-[1.35rem] font-semibold text-white">{title}</h3>

      <p className="mt-2 max-w-2xl text-base leading-7 text-white/75">
        {description}
      </p>

      {actionLabel ? (
        <button className="btn-press mt-5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function StaticSettingRow({
  label,
  value,
  helper,
}: {
  label: string;
  value: ReactNode;
  helper?: string;
}) {
  return (
    <div className="border-t border-white/8 py-5 first:border-t-0">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[1.05rem] font-medium text-white">{label}</p>

          {helper ? (
            <p className="mt-1 max-w-xl text-sm leading-6 text-white/45">
              {helper}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-white/90">
          {value}
        </div>
      </div>
    </div>
  );
}

function DropdownSettingRow({
  label,
  value,
  open,
  onToggle,
  children,
  helper,
  panelClassName = "w-[280px]",
}: {
  label: string;
  value: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  helper?: string;
  panelClassName?: string;
}) {
  return (
    <div className="relative border-t border-white/8 py-5 first:border-t-0">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[1.05rem] font-medium text-white">{label}</p>

          {helper ? (
            <p className="mt-1 max-w-xl text-sm leading-6 text-white/45">
              {helper}
            </p>
          ) : null}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onToggle}
            className="btn-press flex min-w-[160px] items-center justify-end gap-2 rounded-full border border-transparent px-2 py-2 text-sm font-medium text-white/95"
          >
            <span className="flex items-center gap-2">{value}</span>

            <svg
              className={`h-4 w-4 text-white/80 transition ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div
              className={`absolute right-0 top-full z-20 mt-3 overflow-hidden rounded-[26px] border border-white/10 bg-[#1f1f1f] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.65)] ${panelClassName}`}
            >
              <div className="space-y-1">{children}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DropdownOption({
  label,
  selected,
  onClick,
  prefix,
  suffix,
  muted = false,
}: {
  label: ReactNode;
  selected?: boolean;
  onClick: () => void;
  prefix?: ReactNode;
  suffix?: ReactNode;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-press flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left text-[1.05rem] ${
        selected
          ? "bg-white/10 text-white"
          : muted
          ? "text-white/45"
          : "text-white/90"
      }`}
    >
      <span className="flex items-center gap-3">
        {prefix}
        <span>{label}</span>
      </span>

      <span className="flex items-center gap-2">
        {suffix}

        {selected ? (
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

function ColorDot({ className }: { className: string }) {
  return <span className={`inline-block h-4 w-4 rounded-full ${className}`} />;
}

function GeneralContent() {
  const [appearance, setAppearance] = useState("System");
  const [contrast, setContrast] = useState("System");
  const [accent, setAccent] = useState("Default");
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedAppearance =
      localStorage.getItem("decidely-appearance") || "System";
    const savedContrast =
      localStorage.getItem("decidely-contrast") || "System";
    const savedAccent =
      localStorage.getItem("decidely-accent") || "Default";

    setAppearance(savedAppearance);
    setContrast(savedContrast);
    setAccent(savedAccent);

    applyGeneralSetting("appearance", savedAppearance);
    applyGeneralSetting("contrast", savedContrast);
    applyGeneralSetting("accent", savedAccent);
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const accentDot = (name: string) => {
    switch (name) {
      case "Blue":
        return <ColorDot className="bg-blue-500" />;
      case "Green":
        return <ColorDot className="bg-emerald-500" />;
      case "Yellow":
        return <ColorDot className="bg-yellow-400" />;
      case "Pink":
        return <ColorDot className="bg-pink-500" />;
      case "Orange":
        return <ColorDot className="bg-orange-500" />;
      case "Purple":
        return <ColorDot className="bg-violet-500" />;
      case "Black":
        return <ColorDot className="border border-white/10 bg-black" />;
      default:
        return <ColorDot className="bg-zinc-400" />;
    }
  };

  return (
    <div ref={containerRef}>
      <SectionTitle
        title="General"
        subtitle="Manage how the application looks and behaves."
      />

      <div className="mt-2">
        <DropdownSettingRow
          label="Appearance"
          value={appearance}
          open={openDropdown === "appearance"}
          onToggle={() =>
            setOpenDropdown((prev) =>
              prev === "appearance" ? null : "appearance"
            )
          }
        >
          {["System", "Dark"].map((option) => (
            <DropdownOption
              key={option}
              label={option}
              selected={appearance === option}
              onClick={() => {
                setAppearance(option);
                applyGeneralSetting("appearance", option);
                setOpenDropdown(null);
              }}
            />
          ))}
        </DropdownSettingRow>

        <DropdownSettingRow
          label="Contrast"
          value={contrast}
          open={openDropdown === "contrast"}
          onToggle={() =>
            setOpenDropdown((prev) =>
              prev === "contrast" ? null : "contrast"
            )
          }
        >
          {["System", "Medium", "Increased"].map((option) => (
            <DropdownOption
              key={option}
              label={option}
              selected={contrast === option}
              onClick={() => {
                setContrast(option);
                applyGeneralSetting("contrast", option);
                setOpenDropdown(null);
              }}
            />
          ))}
        </DropdownSettingRow>

        <DropdownSettingRow
          label="Accent color"
          value={
            <>
              {accentDot(accent)}
              <span>{accent}</span>
            </>
          }
          open={openDropdown === "accent"}
          onToggle={() =>
            setOpenDropdown((prev) => (prev === "accent" ? null : "accent"))
          }
          panelClassName="w-[330px]"
        >
          {[
            "Default",
            "Blue",
            "Green",
            "Yellow",
            "Pink",
            "Orange",
            "Purple",
          ].map((option) => (
            <DropdownOption
              key={option}
              label={option}
              prefix={accentDot(option)}
              selected={accent === option}
              onClick={() => {
                setAccent(option);
                applyGeneralSetting("accent", option);
                setOpenDropdown(null);
              }}
            />
          ))}

          <DropdownOption
            label="Black"
            prefix={accentDot("Black")}
            selected={accent === "Black"}
            muted
            suffix={
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-white/45">
                Pro
              </span>
            }
            onClick={() => {
              setAccent("Black");
              applyGeneralSetting("accent", "Black");
              setOpenDropdown(null);
            }}
          />
        </DropdownSettingRow>

        <StaticSettingRow label="Language" value="Auto-detect" />

        <StaticSettingRow
          label="Spoken language"
          value="Auto-detect"
          helper="For best results, select the language you mainly speak."
        />
      </div>
    </div>
  );
}

function PersonalisationContent() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [baseStyle, setBaseStyle] = useState("Default");
  const [warm, setWarm] = useState("Default");
  const [enthusiastic, setEnthusiastic] = useState("Default");
  const [headersLists, setHeadersLists] = useState("Default");
  const [emoji, setEmoji] = useState("Default");

  const [fastAnswers, setFastAnswers] = useState(true);
  const [savedMemories, setSavedMemories] = useState(true);
  const [chatHistory, setChatHistory] = useState(true);
  const [recordHistory, setRecordHistory] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const toneOptions = [
    "Default",
    "Direct",
    "Friendly",
    "Professional",
    "Concise",
  ];

  const characteristicOptions = ["Default", "More", "Less"];

  return (
    <div ref={containerRef}>
      <SectionTitle
        title="Personalisation"
        subtitle="Adjust how DecidelyAI responds and what it remembers."
      />

      <div className="mt-2">
        <DropdownSettingRow
          label="Base style and tone"
          helper="Set the overall response style. This does not change the app’s core analysis ability."
          value={baseStyle}
          open={openDropdown === "baseStyle"}
          onToggle={() =>
            setOpenDropdown((prev) =>
              prev === "baseStyle" ? null : "baseStyle"
            )
          }
        >
          {toneOptions.map((option) => (
            <DropdownOption
              key={option}
              label={option}
              selected={baseStyle === option}
              onClick={() => {
                setBaseStyle(option);
                setOpenDropdown(null);
              }}
            />
          ))}
        </DropdownSettingRow>

        <div className="border-t border-white/8 py-5">
          <p className="text-[1.15rem] font-semibold text-white">
            Characteristics
          </p>

          <p className="mt-1 text-sm leading-6 text-white/50">
            Choose extra style preferences on top of your base tone.
          </p>
        </div>

        <DropdownSettingRow
          label="Warm"
          value={warm}
          open={openDropdown === "warm"}
          onToggle={() =>
            setOpenDropdown((prev) => (prev === "warm" ? null : "warm"))
          }
        >
          {characteristicOptions.map((option) => (
            <DropdownOption
              key={option}
              label={option}
              selected={warm === option}
              onClick={() => {
                setWarm(option);
                setOpenDropdown(null);
              }}
            />
          ))}
        </DropdownSettingRow>

        <DropdownSettingRow
          label="Enthusiastic"
          value={enthusiastic}
          open={openDropdown === "enthusiastic"}
          onToggle={() =>
            setOpenDropdown((prev) =>
              prev === "enthusiastic" ? null : "enthusiastic"
            )
          }
        >
          {characteristicOptions.map((option) => (
            <DropdownOption
              key={option}
              label={option}
              selected={enthusiastic === option}
              onClick={() => {
                setEnthusiastic(option);
                setOpenDropdown(null);
              }}
            />
          ))}
        </DropdownSettingRow>

        <DropdownSettingRow
          label="Headers & Lists"
          value={headersLists}
          open={openDropdown === "headersLists"}
          onToggle={() =>
            setOpenDropdown((prev) =>
              prev === "headersLists" ? null : "headersLists"
            )
          }
        >
          {characteristicOptions.map((option) => (
            <DropdownOption
              key={option}
              label={option}
              selected={headersLists === option}
              onClick={() => {
                setHeadersLists(option);
                setOpenDropdown(null);
              }}
            />
          ))}
        </DropdownSettingRow>

        <DropdownSettingRow
          label="Emoji"
          value={emoji}
          open={openDropdown === "emoji"}
          onToggle={() =>
            setOpenDropdown((prev) => (prev === "emoji" ? null : "emoji"))
          }
        >
          {characteristicOptions.map((option) => (
            <DropdownOption
              key={option}
              label={option}
              selected={emoji === option}
              onClick={() => {
                setEmoji(option);
                setOpenDropdown(null);
              }}
            />
          ))}
        </DropdownSettingRow>

        <div className="border-t border-white/8 py-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[1.05rem] font-semibold text-white">
                Fast answers
              </p>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                Allow quick general responses when deep personal context is not
                needed.
              </p>
            </div>

            <NotificationToggle
              label=""
              enabled={fastAnswers}
              onClick={() => setFastAnswers((prev) => !prev)}
            />
          </div>
        </div>

        <div className="border-t border-white/8 py-5">
          <p className="text-[1.05rem] font-semibold text-white">
            Custom instructions
          </p>

          <input
            placeholder="Additional behavior, style, and tone preferences"
            className="mt-4 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-white/25"
          />
        </div>

        <div className="border-t border-white/8 py-6">
          <h3 className="text-[1.55rem] font-semibold text-white">About you</h3>
        </div>

        <PersonalisationInput
          label="Nickname"
          placeholder="What should DecidelyAI call you?"
        />

        <PersonalisationInput
          label="Occupation"
          placeholder="Student, founder, trader, consultant..."
        />

        <PersonalisationInput
          label="More about you"
          placeholder="Interests, goals, values, or preferences to keep in mind"
        />

        <div className="border-t border-white/8 py-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[1.55rem] font-semibold text-white">Memory</h3>

            <button className="btn-press rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white">
              Manage
            </button>
          </div>
        </div>

        <MemoryRow
          title="Reference saved memories"
          description="Let DecidelyAI use saved preferences when responding."
          enabled={savedMemories}
          onClick={() => setSavedMemories((prev) => !prev)}
        />

        <MemoryRow
          title="Reference chat history"
          description="Let DecidelyAI use past conversations to improve context."
          enabled={chatHistory}
          onClick={() => setChatHistory((prev) => !prev)}
        />

        <p className="border-t border-white/8 py-5 text-sm leading-6 text-white/50">
          Personalisation can help the app respond in a way that better matches
          your style and goals.
        </p>

        <div className="border-t border-white/8 py-6">
          <h3 className="text-[1.55rem] font-semibold text-white">
            Record mode
          </h3>
        </div>

        <MemoryRow
          title="Reference record history"
          description="Let DecidelyAI use saved records when giving future responses."
          enabled={recordHistory}
          onClick={() => setRecordHistory((prev) => !prev)}
        />
      </div>
    </div>
  );
}

function PersonalisationInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="border-t border-white/8 py-5">
      <p className="text-[1.05rem] font-semibold text-white">{label}</p>

      <input
        placeholder={placeholder}
        className="mt-4 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-white/25"
      />
    </div>
  );
}

function MemoryRow({
  title,
  description,
  enabled,
  onClick,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-t border-white/8 py-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[1.05rem] font-semibold text-white">{title}</p>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
            {description}
          </p>
        </div>

        <NotificationToggle label="" enabled={enabled} onClick={onClick} />
      </div>
    </div>
  );
}

function SecurityContent() {
  return (
    <>
      <SectionTitle
        title="Security"
        subtitle="Manage password, devices, and account access."
      />

      <div className="mt-2">
        <div className="border-t border-white/8 py-5">
          <div className="flex items-center justify-between gap-6">
            <p className="text-[1.05rem] font-semibold text-white">
              Password
            </p>

            <button className="btn-press flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white">
              Add
              <svg
                className="h-4 w-4 text-white/80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="border-t border-white/8 py-5">
          <p className="text-[1.05rem] font-semibold text-white">
            Trusted Devices
          </p>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
            When you sign in on another device, it can appear here and may
            receive prompts for safer sign-ins.
          </p>
        </div>

        <div className="border-t border-white/8 py-5">
          <div className="flex items-center justify-between gap-6">
            <p className="text-[1.05rem] font-semibold text-white">
              Log out of this device
            </p>

            <button className="btn-press rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white">
              Log out
            </button>
          </div>
        </div>

        <div className="border-t border-white/8 py-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[1.05rem] font-semibold text-white">
                Log out of all devices
              </p>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                End all active sessions across your devices. Other devices may
                take a short time to fully sign out.
              </p>
            </div>

            <button className="btn-press-danger shrink-0 rounded-full border border-red-400/70 px-5 py-2.5 text-sm font-semibold text-red-400">
              Log out all
            </button>
          </div>
        </div>

        <div className="border-t border-white/8 py-8">
          <h3 className="text-[1.55rem] font-semibold tracking-tight text-white">
            Secure sign in with DecidelyAI
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
            Sign in to supported tools and services with the trusted security of
            your DecidelyAI account.
          </p>

          <button className="btn-press mt-1 rounded-full px-2 py-1 text-sm text-white/70 underline underline-offset-2 hover:text-white">
            Learn more
          </button>
        </div>
      </div>
    </>
  );
}

function NotificationsContent() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [recommendations, setRecommendations] = useState({
    push: true,
    email: true,
  });

  const [responses, setResponses] = useState({
    push: true,
  });

  const [tasks, setTasks] = useState({
    push: true,
    email: true,
  });

  const [usage, setUsage] = useState({
    push: true,
    email: true,
  });

  return (
    <>
      <SectionTitle
        title="Notifications"
        subtitle="Choose which alerts you want to receive."
      />

      <div className="mt-2">
        <NotificationRow
          title="Recommendations"
          description="Get updates about useful tools, tips, and new features."
          value="Push, Email"
          open={openMenu === "recommendations"}
          onToggle={() =>
            setOpenMenu((prev) =>
              prev === "recommendations" ? null : "recommendations"
            )
          }
        >
          <NotificationToggle
            label="Push"
            enabled={recommendations.push}
            onClick={() =>
              setRecommendations((prev) => ({
                ...prev,
                push: !prev.push,
              }))
            }
          />

          <NotificationToggle
            label="Email"
            enabled={recommendations.email}
            onClick={() =>
              setRecommendations((prev) => ({
                ...prev,
                email: !prev.email,
              }))
            }
          />
        </NotificationRow>

        <NotificationRow
          title="Responses"
          description="Get notified when longer AI actions or delayed results are ready."
          value="Push"
          open={openMenu === "responses"}
          onToggle={() =>
            setOpenMenu((prev) =>
              prev === "responses" ? null : "responses"
            )
          }
        >
          <NotificationToggle
            label="Push"
            enabled={responses.push}
            onClick={() =>
              setResponses((prev) => ({
                ...prev,
                push: !prev.push,
              }))
            }
          />
        </NotificationRow>

        <NotificationRow
          title="Tasks"
          description="Receive alerts when tasks you create have new updates."
          value="Push, Email"
          open={openMenu === "tasks"}
          onToggle={() =>
            setOpenMenu((prev) => (prev === "tasks" ? null : "tasks"))
          }
        >
          <NotificationToggle
            label="Push"
            enabled={tasks.push}
            onClick={() =>
              setTasks((prev) => ({
                ...prev,
                push: !prev.push,
              }))
            }
          />

          <NotificationToggle
            label="Email"
            enabled={tasks.email}
            onClick={() =>
              setTasks((prev) => ({
                ...prev,
                email: !prev.email,
              }))
            }
          />
        </NotificationRow>

        <NotificationRow
          title="Usage"
          description="Get alerts when limits, resets, or usage-related updates change."
          value="Push, Email"
          open={openMenu === "usage"}
          onToggle={() =>
            setOpenMenu((prev) => (prev === "usage" ? null : "usage"))
          }
        >
          <NotificationToggle
            label="Push"
            enabled={usage.push}
            onClick={() =>
              setUsage((prev) => ({
                ...prev,
                push: !prev.push,
              }))
            }
          />

          <NotificationToggle
            label="Email"
            enabled={usage.email}
            onClick={() =>
              setUsage((prev) => ({
                ...prev,
                email: !prev.email,
              }))
            }
          />
        </NotificationRow>
      </div>
    </>
  );
}

function NotificationRow({
  title,
  description,
  value,
  open,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative border-t border-white/8 py-5 first:border-t-0">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[1.05rem] font-semibold text-white">{title}</p>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
            {description}
          </p>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onToggle}
            className={`btn-press flex min-w-[150px] items-center justify-end gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-white ${
              open ? "bg-white/14" : ""
            }`}
          >
            <span>{value}</span>

            <svg
              className={`h-4 w-4 text-white/80 transition ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 top-full z-30 mt-3 w-[190px] rounded-[24px] border border-white/10 bg-[#1f1f1f] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
              <div className="space-y-2">{children}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  enabled,
  onClick,
}: {
  label: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-press flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-left text-sm font-medium text-white"
    >
      <span>{label}</span>

      <span
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-blue-500" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function PlanContent() {
  return (
    <>
      <SectionTitle
        title="Plan"
        subtitle="See your current plan and future upgrade options."
      />

      <SettingsCard
        title="Current plan"
        description="You are currently on your active plan. More plan controls and upgrade options can be added here later."
        actionLabel="Manage plan"
      />

      <div className="mt-2">
        <StaticSettingRow label="Current plan" value="Plus" />
        <StaticSettingRow label="Upgrade options" value="Coming soon" />
        <StaticSettingRow label="Plan details" value="Open" />
      </div>
    </>
  );
}

function AccountContent() {
  return (
    <>
      <SectionTitle title="Account" subtitle="Manage basic account details." />

      <div className="mt-2">
        <div className="border-t border-white/8 py-5">
          <p className="text-[1.05rem] font-semibold text-white">Name</p>
        </div>

        <div className="border-t border-white/8 py-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[1.05rem] font-semibold text-white">
                Age verification
              </p>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                Some account settings may require age verification to keep the
                experience appropriate and secure.
              </p>

              <button className="btn-press mt-1 rounded-full px-2 py-1 text-sm text-white/70 underline underline-offset-2 hover:text-white">
                Learn more
              </button>
            </div>

            <button className="btn-press-light shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black">
              Verify age
            </button>
          </div>
        </div>

        <div className="border-t border-white/8 py-5">
          <div className="flex items-center justify-between gap-6">
            <p className="text-[1.05rem] font-semibold text-white">
              Delete account
            </p>

            <button className="btn-press-danger shrink-0 rounded-full border border-red-400/70 px-5 py-2.5 text-sm font-semibold text-red-400">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
