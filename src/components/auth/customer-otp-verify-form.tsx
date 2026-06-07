"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { authBrandBg, authBrandStyle } from "@/components/auth/auth-modal-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OTP_LEN = 6;

function useOtpDigits() {
  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LEN).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const setDigitAt = useCallback((index: number, char: string) => {
    const c = char.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = c;
      return next;
    });
    return c;
  }, []);

  const fillFromPaste = useCallback((raw: string) => {
    const only = raw.replace(/\D/g, "").slice(0, OTP_LEN);
    if (!only) return;
    setDigits(() => {
      const next = Array(OTP_LEN).fill("");
      for (let i = 0; i < only.length; i++) next[i] = only[i]!;
      return next;
    });
    const focusIndex = Math.min(only.length, OTP_LEN - 1);
    requestAnimationFrame(() => inputsRef.current[focusIndex]?.focus());
  }, []);

  return { digits, setDigits, setDigitAt, fillFromPaste, inputsRef };
}

export function CustomerOtpVerifyForm({
  email,
  onVerify,
  onResend,
  isVerifying,
  isResending,
  shakeTrigger,
  resendCooldownSeconds,
  showHeader = true,
}: {
  email: string;
  onVerify: (otpCode: string) => void;
  onResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
  shakeTrigger: number;
  resendCooldownSeconds: number;
  showHeader?: boolean;
}) {
  const formId = useId();
  const { digits, setDigits, setDigitAt, fillFromPaste, inputsRef } =
    useOtpDigits();
  const [shake, setShake] = useState(false);
  const [hasErrorStyle, setHasErrorStyle] = useState(false);

  useEffect(() => {
    if (shakeTrigger <= 0) return;
    setShake(true);
    setHasErrorStyle(true);
    const t = window.setTimeout(() => setShake(false), 480);
    return () => window.clearTimeout(t);
  }, [shakeTrigger]);

  const code = digits.join("");
  const isComplete = code.length === OTP_LEN && /^\d{6}$/.test(code);

  const focusNext = (from: number) => {
    if (from < OTP_LEN - 1) inputsRef.current[from + 1]?.focus();
  };

  const focusPrev = (from: number) => {
    if (from > 0) inputsRef.current[from - 1]?.focus();
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setHasErrorStyle(false);
    const v = e.target.value;
    if (v.length > 1) {
      fillFromPaste(v);
      return;
    }
    setDigitAt(index, v);
    if (v) focusNext(index);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const allowedNav = new Set([
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ]);
    if (allowedNav.has(e.key)) {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        e.preventDefault();
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        focusPrev(index);
      }
      if (e.key === "ArrowLeft") focusPrev(index);
      if (e.key === "ArrowRight") focusNext(index);
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setHasErrorStyle(false);
    fillFromPaste(e.clipboardData.getData("text"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete || isVerifying) return;
    onVerify(code);
  };

  const maskedEmail = email.includes("@")
    ? `${email.slice(0, 2)}***@${email.split("@")[1]}`
    : email;

  return (
    <form
      id={formId}
      noValidate
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col items-center gap-6",
        showHeader ? "min-h-0 flex-1 justify-center p-6" : "px-0 py-2"
      )}
    >
      {showHeader ? (
        <div className="w-full">
          <h3
            className="text-center text-lg font-semibold sm:text-2xl md:text-3xl"
            style={authBrandStyle}
          >
            Verify your email
          </h3>
          <p className="mt-2 text-center text-sm text-gray-150">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-content-neutral-secondary">
              {maskedEmail}
            </span>
          </p>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[17.5rem] sm:max-w-[21rem] md:max-w-[24rem]">
        <fieldset className="w-full">
          <legend className="sr-only">One-time password</legend>
          <div
            className={cn(
              "grid w-full grid-cols-6 gap-1.5 sm:gap-2 md:gap-3",
              shake && "animate-otp-shake"
            )}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                autoFocus={i === 0}
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                disabled={isVerifying}
                className={cn(
                  "aspect-square w-full min-w-0 rounded-lg border-2 bg-[var(--surface-subtle)] text-center text-base font-semibold tabular-nums text-content-neutral-primary shadow-sm outline-none transition-[border-color,box-shadow] sm:rounded-xl sm:text-lg md:text-xl",
                  "border-border-muted focus:border-surface-brand focus:ring-2 focus:ring-surface-brand/35",
                  hasErrorStyle && "border-destructive"
                )}
                aria-label={`Digit ${i + 1} of ${OTP_LEN}`}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex w-full flex-col items-center gap-3">
        <Button
          type="submit"
          disabled={!isComplete || isVerifying}
          className="h-12 min-w-[160px] rounded-full text-content-on-brand"
          style={authBrandBg}
        >
          {isVerifying ? (
            <CircleNotchIcon className="size-5 animate-spin" aria-hidden />
          ) : (
            "Verify & continue"
          )}
        </Button>

        <div className="flex flex-col items-center gap-2 text-center text-sm">
          <button
            type="button"
            disabled={resendCooldownSeconds > 0 || isResending}
            onClick={() => onResend()}
            className={cn(
              "font-medium disabled:cursor-not-allowed disabled:opacity-50",
              resendCooldownSeconds > 0 || isResending
                ? "text-content-neutral-muted"
                : "cursor-pointer"
            )}
            style={
              resendCooldownSeconds > 0 || isResending ? undefined : authBrandStyle
            }
          >
            {isResending ? (
              <span className="inline-flex items-center gap-2">
                <CircleNotchIcon className="size-4 animate-spin" aria-hidden />
                Sending…
              </span>
            ) : resendCooldownSeconds > 0 ? (
              `Resend code in ${resendCooldownSeconds}s`
            ) : (
              "Resend OTP"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
