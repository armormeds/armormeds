import { useEffect, useRef, useCallback, useState } from "react";

const ACTIVITY_EVENTS = [
  "mousemove", "mousedown", "keydown", "scroll", "touchstart", "click",
] as const;

const WARNING_MS = 13 * 60 * 1000;
const LOGOUT_MS = 15 * 60 * 1000;

export function useAdminInactivityTimeout(
  onLogout: () => void,
  enabled: boolean
) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);

  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onLogoutRef = useRef(onLogout);
  onLogoutRef.current = onLogout;

  const clearAllTimers = useCallback(() => {
    if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const startCountdown = useCallback(() => {
    setSecondsLeft(120);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  const resetTimer = useCallback(() => {
    if (!enabled) return;
    clearAllTimers();
    setShowWarning(false);

    warnTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
      logoutTimerRef.current = setTimeout(() => {
        onLogoutRef.current();
      }, LOGOUT_MS - WARNING_MS);
    }, WARNING_MS);
  }, [enabled, clearAllTimers, startCountdown]);

  const stayLoggedIn = useCallback(() => {
    setShowWarning(false);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) return;
    resetTimer();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    );
    return () => {
      clearAllTimers();
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [enabled, resetTimer, clearAllTimers]);

  return { showWarning, secondsLeft, stayLoggedIn };
}
