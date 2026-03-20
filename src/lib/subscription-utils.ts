export function isSubscriptionEnabled(): boolean {
  return import.meta.env.VITE_SUBSCRIPTION_ENABLED === "true";
}
