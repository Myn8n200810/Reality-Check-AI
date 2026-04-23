import posthog from "posthog-js";

type EventProperties = Record<string, unknown>;

export function trackEvent(eventName: string, properties: EventProperties = {}) {
  try {
    if (typeof window === "undefined") return;
    posthog.capture(eventName, properties);
  } catch (error) {
    console.error(`Failed to track event: ${eventName}`, error);
  }
}