// safeBack — pop the stack if possible, otherwise route to a sensible home.
// Use on any screen reachable via deep-link or modal/replace, where router.back()
// can fail with "GO_BACK was not handled by any navigator" if the stack is empty.

import { router } from 'expo-router';

export function safeBack(fallback: string) {
  // expo-router exposes canGoBack on the router singleton; guard for safety.
  const canGoBack = (router as unknown as { canGoBack?: () => boolean }).canGoBack;
  if (canGoBack?.()) {
    router.back();
    return;
  }
  router.replace(fallback as any);
}
