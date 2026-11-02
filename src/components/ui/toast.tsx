"use client";

import { Toast } from "@base-ui/react/toast";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";

const toneStyles: Record<
  ToastTone,
  { icon: LucideIcon; badge: string; accent: string }
> = {
  success: {
    icon: CheckCircle2,
    badge: "bg-primary/10 text-primary",
    accent: "bg-primary",
  },
  error: {
    icon: AlertCircle,
    badge: "bg-destructive/10 text-destructive",
    accent: "bg-destructive",
  },
  info: {
    icon: Info,
    badge: "bg-accent/15 text-accent",
    accent: "bg-accent",
  },
};

/**
 * Shared toast manager so any client module can queue a notification,
 * while a single viewport (mounted in the root layout) renders it.
 */
export const toastManager = Toast.createToastManager();

function notify(
  tone: ToastTone,
  title: string,
  description?: string,
  options?: { id?: string },
) {
  return toastManager.add({
    id: options?.id,
    type: tone,
    title,
    description,
    priority: tone === "error" ? "high" : "low",
    timeout: tone === "error" ? 6000 : 4000,
  });
}

export const toast = {
  success: (title: string, description?: string) =>
    notify("success", title, description),
  error: (title: string, description?: string, options?: { id?: string }) =>
    notify("error", title, description, options),
  info: (title: string, description?: string) =>
    notify("info", title, description),
};

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Viewport className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex w-full flex-col-reverse gap-2.5 px-4 pb-4 sm:inset-x-auto sm:right-0 sm:w-[26rem] sm:pr-6 sm:pb-6">
      {toasts.map((item) => {
        const tone = (item.type as ToastTone) ?? "info";
        const style = toneStyles[tone] ?? toneStyles.info;
        const Icon = style.icon;

        return (
          <Toast.Root
            key={item.id}
            toast={item}
            className={cn(
              "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg shadow-foreground/5",
              "transition-all duration-200 ease-out",
              "data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0",
              "data-[ending-style]:translate-y-1 data-[ending-style]:opacity-0",
              "data-[limited]:hidden",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-0 left-0 w-1 rounded-l-xl",
                style.accent,
              )}
            />

            <span
              aria-hidden
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                style.badge,
              )}
            >
              <Icon className="size-4" />
            </span>

            <Toast.Content className="min-w-0 flex-1">
              <Toast.Title className="font-sans text-sm leading-5 font-semibold text-foreground" />
              <Toast.Description className="mt-0.5 text-sm leading-5 text-muted-foreground empty:hidden" />
            </Toast.Content>

            <Toast.Close
              aria-label="Dismiss notification"
              className="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden />
            </Toast.Close>
          </Toast.Root>
        );
      })}
    </Toast.Viewport>
  );
}

export function Toaster() {
  return (
    <Toast.Provider toastManager={toastManager} limit={4}>
      <Toast.Portal>
        <ToastList />
      </Toast.Portal>
    </Toast.Provider>
  );
}
