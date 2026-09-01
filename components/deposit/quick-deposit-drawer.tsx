"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IconAlertCircle,
  IconBuildingBank,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronUp,
  IconCoin,
  IconCopy,
  IconCreditCard,
  IconCurrencyBitcoin,
  IconCurrencyDollar,
  IconInfoCircle,
  IconLoader2,
  IconLock,
  IconShield,
} from "@tabler/icons-react";

import {
  WalletHubActionTabs,
  WalletHubDepositHome,
  CRYPTO_COINS,
  type CryptoCoinId,
  type DepositCategory,
} from "@/components/deposit/wallet-hub-home";
import { WalletHubCryptoDeposit } from "@/components/deposit/wallet-hub-crypto-deposit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerHandle,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AUTH_OPEN_WALLET_AFTER_SIGNUP_EVENT,
  consumeOpenWalletAfterSignup,
} from "@/lib/auth-session";
import { cn } from "@/lib/utils";

export type QuickDepositStep =
  | "started"
  | "processing"
  | "almost"
  | "complete";

export type QuickDepositStepLoading = {
  started: boolean;
  processing: boolean;
  almost: boolean;
  complete: boolean;
};

export type WalletHubTab = "deposit" | "withdrawal" | "history" | "settings";

type MethodDef = {
  id: string;
  label: string;
  min: number;
  max: number;
  fee: number;
  feeLabel: string;
  badge?: { text: string; variant: "blue" | "green" };
  logo: "cards" | "bitcoin" | "coin" | "echeck" | "wire" | "moneygram" | "qb" | "eco";
};

const PRIMARY_METHODS: MethodDef[] = [
  {
    id: "card",
    label: "Credit / Debit Card",
    min: 25,
    max: 2500,
    fee: 0.0975,
    feeLabel: "9.75%",
    badge: { text: "POPULAR", variant: "blue" },
    logo: "cards",
  },
  {
    id: "bitcoin",
    label: "Bitcoin (BTC)",
    min: 20,
    max: 500_000,
    fee: 0,
    feeLabel: "0%",
    badge: { text: "10% BOOST", variant: "green" },
    logo: "bitcoin",
  },
];

const OTHER_METHODS: MethodDef[] = [
  {
    id: "altcoins",
    label: "Altcoins",
    min: 20,
    max: 500_000,
    fee: 0,
    feeLabel: "0%",
    logo: "coin",
  },
  {
    id: "echeck",
    label: "eCheck (ACH)",
    min: 20,
    max: 500_000,
    fee: 0.045,
    feeLabel: "4.5%",
    logo: "echeck",
  },
  {
    id: "wire",
    label: "Wire Transfer",
    min: 500,
    max: 10_000,
    fee: 0,
    feeLabel: "0%",
    logo: "wire",
  },
  {
    id: "moneygram",
    label: "MoneyGram",
    min: 50,
    max: 400,
    fee: 0,
    feeLabel: "0%",
    logo: "moneygram",
  },
  {
    id: "qbdirect",
    label: "QBdirect",
    min: 20,
    max: 100_000,
    fee: 0,
    feeLabel: "0%",
    logo: "qb",
  },
  {
    id: "ecopayz",
    label: "ecoPayz",
    min: 10,
    max: 100_000,
    fee: 0,
    feeLabel: "0%",
    logo: "eco",
  },
];

const CARD_QUICK_AMOUNTS = [25, 50, 100, 500] as const;

/** Demo on-chain / BEP20 deposit address for UI preview */
const BITCOIN_DEMO_DEPOSIT_ADDRESS =
  "0xec7842178520bb71523bcce4cadc7e1b478cec40abc7842178520bb7152ebce4ca";

const BITCOIN_USD_RATE = 67_496.351865;

function parseDecimalInput(s: string): number | null {
  const t = s.replace(/,/g, "").trim();
  if (t === "" || t === "." || t === "-") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function formatFiatForConverter(n: number): string {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}

function formatBtcForConverter(n: number): string {
  if (!Number.isFinite(n)) return "";
  const s = n.toFixed(8);
  return s.replace(/\.?0+$/, "") || "0";
}

function cardDigitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

function formatCardNumberInput(raw: string) {
  const d = cardDigitsOnly(raw).slice(0, 19);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiryInput(raw: string) {
  const d = cardDigitsOnly(raw).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function isExpiryValid(expiry: string) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const mm = parseInt(expiry.slice(0, 2), 10);
  return mm >= 1 && mm <= 12;
}

const ALL_METHODS = [...PRIMARY_METHODS, ...OTHER_METHODS];

function normalizeMethodId(raw: string): string {
  if (raw === "card1" || raw === "card2" || raw === "card3") return "card";
  if (ALL_METHODS.some((m) => m.id === raw)) return raw;
  return "card";
}

function getMethod(id: string): MethodDef {
  const n = normalizeMethodId(id);
  return ALL_METHODS.find((m) => m.id === n) ?? PRIMARY_METHODS[0];
}

export type QuickDepositDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  currencySymbol: string;
  depositAmount: number;
  setDepositAmount: (value: number) => void;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (value: string) => void;
  useManualAmount: boolean;
  setUseManualAmount: (value: boolean) => void;
  showDepositConfirmation: boolean;
  setShowDepositConfirmation: (value: boolean) => void;
  depositStep: QuickDepositStep;
  setDepositStep: (value: QuickDepositStep) => void;
  stepLoading: QuickDepositStepLoading;
  setStepLoading: (value: QuickDepositStepLoading) => void;
  transactionId: string;
  setTransactionId: (value: string) => void;
  isDepositLoading: boolean;
  setIsDepositLoading: (value: boolean) => void;
  /** Fires when the flow enters the confirmation screen (e.g. analytics). */
  onTrackDeposit?: (info: { amount: number; method: string }) => void;
  /** Called when the user taps Play Now after the stepper completes. */
  onPlayNow: () => void;
  title?: string;
  /** Summary card — defaults match demo hub. Pass to mirror wallet balance. */
  walletAvailableBalance?: number;
  walletFreeBet?: number;
  /** Open above the game launcher fullscreen overlay (z ~100010). */
  elevateAboveGameLauncher?: boolean;
};

function formatPaymentMethodLabel(method: string) {
  return getMethod(method).label;
}

function formatMoney(n: number, symbol: string) {
  return `${symbol}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function MethodLogo({
  kind,
  className,
}: {
  kind: MethodDef["logo"];
  className?: string;
}) {
  const c = cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", className);
  switch (kind) {
    case "cards":
      return (
        <div className={cn(c, "bg-[var(--ds-control-hover)]")}>
          <IconCreditCard className="h-6 w-6 text-[var(--ds-fg)]" stroke={1.5} />
        </div>
      );
    case "bitcoin":
      return (
        <div className={cn(c, "bg-[#f7931a]/20")}>
          <IconCurrencyBitcoin className="h-7 w-7 text-[#f7931a]" stroke={1.5} />
        </div>
      );
    case "coin":
      return (
        <div className={cn(c, "bg-violet-500/20")}>
          <IconCoin className="h-6 w-6 text-violet-300" stroke={1.5} />
        </div>
      );
    case "echeck":
      return (
        <div className={cn(c, "bg-sky-500/15 font-bold text-[10px] leading-tight text-sky-200")}>
          echeck
        </div>
      );
    case "wire":
      return (
        <div className={cn(c, "bg-[var(--ds-control-hover)]")}>
          <IconBuildingBank className="h-6 w-6 text-[var(--ds-fg-muted)]" stroke={1.5} />
        </div>
      );
    case "moneygram":
      return (
        <div className={cn(c, "bg-red-600/25 text-xs font-bold text-red-200")}>MG</div>
      );
    case "qb":
      return (
        <div className={cn(c, "bg-emerald-500/15 text-[10px] font-semibold text-emerald-200")}>
          QB
        </div>
      );
    case "eco":
      return (
        <div className={cn(c, "bg-blue-500/15 text-[9px] font-semibold leading-tight text-blue-200")}>
          eco
        </div>
      );
    default:
      return <div className={c} />;
  }
}

export function QuickDepositDrawer({
  open,
  onOpenChange,
  isMobile,
  currencySymbol,
  depositAmount,
  setDepositAmount,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  useManualAmount: _useManualAmount,
  setUseManualAmount: _setUseManualAmount,
  showDepositConfirmation,
  setShowDepositConfirmation,
  depositStep,
  setDepositStep,
  stepLoading,
  setStepLoading,
  transactionId,
  setTransactionId,
  isDepositLoading,
  setIsDepositLoading,
  onTrackDeposit,
  onPlayNow,
  title = "Wallet",
  walletAvailableBalance: _walletAvailableBalance = 7000,
  walletFreeBet: _walletFreeBet = 500,
  elevateAboveGameLauncher = false,
}: QuickDepositDrawerProps) {
  const [hubTab, setHubTab] = useState<WalletHubTab>("deposit");
  const [depositCategory, setDepositCategory] =
    useState<DepositCategory>("crypto");
  const [selectedCoinId, setSelectedCoinId] = useState<CryptoCoinId | undefined>();
  const [depositFlowScreen, setDepositFlowScreen] = useState<
    "hub" | "card-checkout" | "bitcoin-checkout"
  >("hub");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");

  // Join / first signup only — open normal wallet deposit UI in place
  useEffect(() => {
    const openAfterSignup = () => {
      if (!consumeOpenWalletAfterSignup()) return;
      onOpenChange(true);
    };
    openAfterSignup();
    window.addEventListener(AUTH_OPEN_WALLET_AFTER_SIGNUP_EVENT, openAfterSignup);
    return () => {
      window.removeEventListener(
        AUTH_OPEN_WALLET_AFTER_SIGNUP_EVENT,
        openAfterSignup
      );
    };
  }, [onOpenChange]);
  const [cardCvc, setCardCvc] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [bitcoinQrExpanded, setBitcoinQrExpanded] = useState(true);
  const [btcCopied, setBtcCopied] = useState(false);
  const [btcConvFiatStr, setBtcConvFiatStr] = useState("");
  const [btcConvCryptoStr, setBtcConvCryptoStr] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevBitcoinFlowRef = useRef<string | null>(null);

  useEffect(() => {
    if (open) {
      setHubTab("deposit");
      setDepositCategory("crypto");
      setSelectedCoinId(undefined);
      setDepositFlowScreen("hub");
      setCardNumber("");
      setCardExpiry("");
      setCardCvc("");
      setSaveCard(true);
      setBitcoinQrExpanded(true);
      setBtcCopied(false);
      setBtcConvFiatStr("");
      setBtcConvCryptoStr("");
      prevBitcoinFlowRef.current = null;
    }
  }, [open, isMobile]);

  useEffect(() => {
    if (open && hubTab === "deposit") {
      scrollAreaRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [open, hubTab, selectedCoinId, depositCategory]);

  const activeMethod = useMemo(
    () => getMethod(selectedPaymentMethod),
    [selectedPaymentMethod],
  );

  const normalizedId = normalizeMethodId(selectedPaymentMethod);

  const showCardCheckout =
    depositFlowScreen === "card-checkout" &&
    hubTab === "deposit" &&
    !showDepositConfirmation;

  const showBitcoinCheckout =
    depositFlowScreen === "bitcoin-checkout" &&
    hubTab === "deposit" &&
    !showDepositConfirmation;

  const isFlowCheckout = showCardCheckout || showBitcoinCheckout;


  const checkoutTitle =
    showDepositConfirmation
      ? null
      : depositFlowScreen === "card-checkout"
        ? "Credit / Debit Card Deposit"
        : depositFlowScreen === "bitcoin-checkout"
          ? "Bitcoin (BTC) Deposit"
          : null;

  const bitcoinMethod = useMemo(() => getMethod("bitcoin"), []);
  const cardMethod = PRIMARY_METHODS[0];

  useEffect(() => {
    if (!open) {
      prevBitcoinFlowRef.current = null;
      return;
    }
    if (depositFlowScreen === "bitcoin-checkout") {
      if (prevBitcoinFlowRef.current !== "bitcoin-checkout") {
        const u = Math.min(
          bitcoinMethod.max,
          Math.max(bitcoinMethod.min, depositAmount),
        );
        setBtcConvFiatStr(formatFiatForConverter(u));
        setBtcConvCryptoStr(formatBtcForConverter(u / BITCOIN_USD_RATE));
      }
      prevBitcoinFlowRef.current = "bitcoin-checkout";
    } else {
      prevBitcoinFlowRef.current = depositFlowScreen;
    }
  }, [
    open,
    depositFlowScreen,
    depositAmount,
    bitcoinMethod.min,
    bitcoinMethod.max,
  ]);
  const cardNumberDigits = useMemo(
    () => cardDigitsOnly(cardNumber),
    [cardNumber],
  );
  const isCardFormValid = useMemo(() => {
    if (cardNumberDigits.length < 15 || cardNumberDigits.length > 19)
      return false;
    if (!isExpiryValid(cardExpiry)) return false;
    const cvc = cardCvc.replace(/\D/g, "");
    if (cvc.length < 3 || cvc.length > 4) return false;
    return true;
  }, [cardNumberDigits, cardExpiry, cardCvc]);

  const cardFeeAmount = depositAmount * cardMethod.fee;
  const cardTotalAmount = depositAmount + cardFeeAmount;

  useEffect(() => {
    if (isFlowCheckout) {
      scrollAreaRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [isFlowCheckout]);

  useEffect(() => {
    const m = getMethod(selectedPaymentMethod);
    const next = Math.min(m.max, Math.max(m.min, depositAmount));
    if (next !== depositAmount) setDepositAmount(next);
  }, [selectedPaymentMethod, depositAmount, setDepositAmount]);

  const handleConfirmDeposit = useCallback(
    (opts?: { amount?: number }) => {
      const amount =
        opts?.amount !== undefined ? opts.amount : depositAmount;
      if (opts?.amount !== undefined && opts.amount !== depositAmount) {
        setDepositAmount(opts.amount);
      }
      setIsDepositLoading(true);
      const txId = Math.floor(Math.random() * 10000000).toString();
      setTransactionId(txId);
      window.setTimeout(() => {
        setIsDepositLoading(false);
        setShowDepositConfirmation(true);
        setDepositFlowScreen("hub");
        onTrackDeposit?.({
          amount,
          method: normalizedId,
        });
        setStepLoading({
          started: true,
          processing: false,
          almost: false,
          complete: false,
        });
        window.setTimeout(() => {
          setDepositStep("started");
          setStepLoading({
            started: false,
            processing: true,
            almost: false,
            complete: false,
          });
          window.setTimeout(() => {
            setDepositStep("processing");
            setStepLoading({
              started: false,
              processing: false,
              almost: true,
              complete: false,
            });
            window.setTimeout(() => {
              setDepositStep("almost");
              setStepLoading({
                started: false,
                processing: false,
                almost: false,
                complete: true,
              });
              window.setTimeout(() => {
                setDepositStep("complete");
                setStepLoading({
                  started: false,
                  processing: false,
                  almost: false,
                  complete: false,
                });
              }, 800);
            }, 1500);
          }, 800);
        }, 500);
      }, 1000);
    },
    [
      depositAmount,
      normalizedId,
      onTrackDeposit,
      setDepositStep,
      setDepositAmount,
      setIsDepositLoading,
      setShowDepositConfirmation,
      setStepLoading,
      setTransactionId,
    ],
  );

  const handleHubBack = useCallback(() => {
    if (showDepositConfirmation) {
      setShowDepositConfirmation(false);
      return;
    }
    if (depositFlowScreen !== "hub") {
      setDepositFlowScreen("hub");
      return;
    }
    if (selectedCoinId) {
      setSelectedCoinId(undefined);
      return;
    }
    if (hubTab !== "deposit") {
      setHubTab("deposit");
      return;
    }
    onOpenChange(false);
  }, [
    showDepositConfirmation,
    depositFlowScreen,
    selectedCoinId,
    hubTab,
    onOpenChange,
    setShowDepositConfirmation,
  ]);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
      shouldScaleBackground={false}
    >
      <DrawerContent
        showOverlay={isMobile || elevateAboveGameLauncher}
        overlayClassName={
          elevateAboveGameLauncher
            ? "game-launcher-wallet-hub-overlay !z-[100040] !inset-0 !top-0 !bottom-0 !h-auto !bg-black/85"
            : undefined
        }
        data-wallet-hub-drawer={elevateAboveGameLauncher ? "" : undefined}
        className={cn(
          "relative flex flex-col bg-[var(--ds-page-bg)] text-[var(--ds-fg)]",
          "w-full overflow-hidden border-l border-[var(--ds-border)] sm:max-w-md",
          isMobile && "rounded-t-[10px]",
          elevateAboveGameLauncher && "wallet-hub-game-launcher-drawer",
        )}
        style={
          isMobile
            ? {
                height: "90vh",
                maxHeight: "90vh",
                top: "auto",
                bottom: 0,
                ...(elevateAboveGameLauncher ? { zIndex: 100050 } : {}),
              }
            : {
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                ...(elevateAboveGameLauncher
                  ? {
                      zIndex: 100050,
                      top: 0,
                      bottom: 0,
                      height: "100%",
                      maxHeight: "100%",
                    }
                  : {}),
              }
        }
      >
        {isMobile && <DrawerHandle variant="dark" />}
        {isMobile && checkoutTitle ? (
          <div className="flex flex-shrink-0 items-center gap-2 border-b border-[var(--ds-border)] px-3 py-3">
            <button
              type="button"
              onClick={handleHubBack}
              className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--ds-fg)] transition-colors hover:bg-[var(--ds-control-hover)]"
              aria-label="Back"
            >
              <IconChevronLeft className="h-5 w-5" stroke={2} />
            </button>
            <h2 className="min-w-0 flex-1 truncate text-sm font-semibold leading-tight text-[var(--ds-fg)]">
              {checkoutTitle}
            </h2>
          </div>
        ) : null}
        {isMobile && !checkoutTitle && (
          <div className="relative flex-shrink-0 space-y-3 border-b border-[var(--ds-border)] px-4 pb-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHubBack}
                className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--ds-fg)] transition-colors hover:bg-[var(--ds-control-hover)]"
                aria-label="Back"
              >
                <IconChevronLeft className="h-5 w-5" stroke={2} />
              </button>
              <h2 className="text-base font-semibold text-[var(--ds-fg)]">{title}</h2>
            </div>
            {!isFlowCheckout && !showDepositConfirmation ? (
              <WalletHubActionTabs active={hubTab} onChange={setHubTab} />
            ) : null}
          </div>
        )}

        {!isMobile && checkoutTitle ? (
          <div className="flex flex-shrink-0 items-center gap-2 border-b border-[var(--ds-border)] px-4 py-3">
            <button
              type="button"
              onClick={handleHubBack}
              className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--ds-fg)] transition-colors hover:bg-[var(--ds-control-hover)]"
              aria-label="Back"
            >
              <IconChevronLeft className="h-5 w-5" stroke={2} />
            </button>
            <h2 className="min-w-0 flex-1 truncate text-base font-semibold leading-tight text-[var(--ds-fg)]">
              {checkoutTitle}
            </h2>
          </div>
        ) : null}
        {!isMobile && !checkoutTitle && (
          <DrawerHeader className="relative flex-shrink-0 space-y-3 border-b border-[var(--ds-border)] px-4 pb-3 pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHubBack}
                className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--ds-fg)] transition-colors hover:bg-[var(--ds-control-hover)]"
                aria-label="Back"
              >
                <IconChevronLeft className="h-5 w-5" stroke={2} />
              </button>
              <h2 className="text-base font-semibold text-[var(--ds-fg)]">{title}</h2>
            </div>
            {!isFlowCheckout && !showDepositConfirmation ? (
              <WalletHubActionTabs active={hubTab} onChange={setHubTab} />
            ) : null}
          </DrawerHeader>
        )}

        <div
          ref={scrollAreaRef}
          className={cn(
            "flex min-h-0 w-full flex-1 flex-col overflow-y-auto",
            isMobile ? "px-4 pb-6" : "px-4 pb-4",
          )}
          style={{
            WebkitOverflowScrolling: "touch",
            overflowY: "auto",
            flex: "1 1 auto",
            minHeight: 0,
            paddingBottom: isMobile
              ? "env(safe-area-inset-bottom, 20px)"
              : undefined,
          }}
        >
          {showCardCheckout ? (
            <div className="space-y-4 pb-2">
              <Card className="border border-[var(--ds-border)] bg-[var(--ds-surface-raised)] shadow-none">
                <CardContent className="space-y-4 p-4">
                  <h3 className="font-semibold text-[var(--ds-fg)]">
                    Enter your card details
                  </h3>
                  <div>
                    <p className="mb-2 text-xs text-[var(--ds-fg-subtle)]">We accept</p>
                    <div className="flex flex-wrap gap-2">
                      {(
                        ["Mastercard", "Visa", "Amex", "Discover"] as const
                      ).map((brand) => (
                        <span
                          key={brand}
                          className="rounded border border-[var(--ds-border-strong)] bg-[var(--ds-control-bg)] px-2 py-1 text-[10px] font-medium text-[var(--ds-fg-muted)]"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="qd-card-number" className="text-xs text-[var(--ds-fg-muted)]">
                      Card Number
                    </label>
                    <div className="relative">
                      <Input
                        id="qd-card-number"
                        autoComplete="cc-number"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumberInput(e.target.value))
                        }
                        placeholder="0000 0000 0000 0000"
                        className="border-[var(--ds-border-strong)] bg-[var(--ds-surface-inset)] pr-10 text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)]"
                      />
                      <IconCreditCard className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ds-fg-subtle)]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="qd-expiry" className="text-xs text-[var(--ds-fg-muted)]">
                        Expiry Date
                      </label>
                      <Input
                        id="qd-expiry"
                        autoComplete="cc-exp"
                        value={cardExpiry}
                        onChange={(e) =>
                          setCardExpiry(formatExpiryInput(e.target.value))
                        }
                        placeholder="MM/YY"
                        className="border-[var(--ds-border-strong)] bg-[var(--ds-surface-inset)] text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="qd-cvc"
                        className="flex items-center gap-1 text-xs text-[var(--ds-fg-muted)]"
                      >
                        CVC / CVV
                        <IconInfoCircle className="h-3.5 w-3.5 text-[var(--ds-fg-subtle)]" />
                      </label>
                      <Input
                        id="qd-cvc"
                        autoComplete="cc-csc"
                        value={cardCvc}
                        onChange={(e) =>
                          setCardCvc(cardDigitsOnly(e.target.value).slice(0, 4))
                        }
                        placeholder="000"
                        className="border-[var(--ds-border-strong)] bg-[var(--ds-surface-inset)] text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)]"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-1">
                    <Checkbox
                      id="qd-save-card"
                      checked={saveCard}
                      onCheckedChange={(v) => setSaveCard(v === true)}
                      className="mt-0.5 border-[var(--ds-border-strong)] data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
                    />
                    <div>
                      <label
                        htmlFor="qd-save-card"
                        className="text-sm font-medium text-[var(--ds-fg)]"
                      >
                        Save Card
                      </label>
                      <p className="text-xs text-[var(--ds-fg-subtle)]">
                        Saving your card details now allows you to deposit funds
                        faster next time!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[var(--ds-border)] bg-[var(--ds-surface-raised)] shadow-none">
                <CardContent className="space-y-4 p-4">
                  <h3 className="font-semibold text-[var(--ds-fg)]">Deposit amount</h3>
                  <div className="flex flex-wrap gap-2">
                    {CARD_QUICK_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() =>
                          setDepositAmount(Math.min(amt, cardMethod.max))
                        }
                        className={cn(
                          "min-w-[4.25rem] flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
                          Math.abs(depositAmount - amt) < 0.01
                            ? "border-emerald-500/70 bg-emerald-500/15 text-white"
                            : "border-[var(--ds-border-strong)] bg-[var(--ds-surface-inset)] text-[var(--ds-fg)] hover:border-[var(--ds-border-strong)]",
                        )}
                      >
                        {currencySymbol}
                        {amt}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="qd-amount" className="text-xs text-[var(--ds-fg-muted)]">
                      Amount
                    </label>
                    <Input
                      id="qd-amount"
                      type="number"
                      min={cardMethod.min}
                      max={cardMethod.max}
                      step={0.01}
                      value={depositAmount}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          setDepositAmount(cardMethod.min);
                          return;
                        }
                        const v = parseFloat(raw);
                        if (Number.isNaN(v)) return;
                        setDepositAmount(
                          Math.min(
                            cardMethod.max,
                            Math.max(cardMethod.min, v),
                          ),
                        );
                      }}
                      placeholder={`${currencySymbol}0.00`}
                      className="border-[var(--ds-border-strong)] bg-[var(--ds-surface-inset)] text-[var(--ds-fg)] placeholder:text-[var(--ds-fg-subtle)]"
                    />
                    <p className="text-right text-[11px] text-[var(--ds-fg-subtle)]">
                      Min. {currencySymbol}
                      {cardMethod.min} / Max. {currencySymbol}
                      {cardMethod.max.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--ds-fg-muted)]">
                    Fee: {cardMethod.feeLabel} / Total Amount:{" "}
                    {formatMoney(cardTotalAmount, currencySymbol)} USD
                  </p>
                  <div className="flex items-start gap-2 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-overlay)] p-3">
                    <IconCurrencyBitcoin className="mt-0.5 h-5 w-5 shrink-0 text-[#f7931a]" />
                    <p className="text-xs text-white/65">
                      Avoid this fee!{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPaymentMethod("bitcoin");
                          setDepositFlowScreen("hub");
                        }}
                        className="font-semibold text-sky-400 underline-offset-2 hover:underline"
                      >
                        Switch to Bitcoin (BTC)
                      </button>
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleConfirmDeposit()}
                    disabled={
                      !isCardFormValid ||
                      depositAmount < cardMethod.min ||
                      depositAmount > cardMethod.max ||
                      isDepositLoading
                    }
                    className="h-12 w-full font-semibold text-[var(--ds-fg)] shadow-none disabled:cursor-not-allowed disabled:opacity-100 enabled:bg-[#059669] enabled:hover:bg-[#10b981] disabled:bg-[var(--ds-control-hover)] disabled:text-[var(--ds-fg-subtle)] disabled:hover:bg-[var(--ds-control-hover)]"
                  >
                    {isDepositLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <IconLoader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "DEPOSIT"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {showBitcoinCheckout ? (
            <div className="space-y-4 pb-2">
              <p className="text-sm leading-snug text-white/65">
                Copy the address or scan the QR, send from your wallet, then tap{" "}
                <span className="font-medium text-white/85">Deposit sent</span>.
              </p>

              <div className="overflow-hidden rounded-xl border border-[var(--ds-border)] bg-white/[0.02]">
                {/* Estimate */}
                <div className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="relative min-w-0 flex-1">
                      <div
                        className="pointer-events-none absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--ds-control-hover)] ring-1 ring-white/10"
                        aria-hidden
                      >
                        <IconCurrencyDollar
                          className="h-3.5 w-3.5 text-[var(--ds-fg-muted)]"
                          stroke={2}
                        />
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        aria-label="Deposit amount in USD"
                        value={btcConvFiatStr}
                        onChange={(e) => {
                          const s = e.target.value;
                          setBtcConvFiatStr(s);
                          const n = parseDecimalInput(s);
                          if (n === null) return;
                          setBtcConvCryptoStr(
                            formatBtcForConverter(n / BITCOIN_USD_RATE),
                          );
                        }}
                        placeholder="0.00"
                        className="h-10 w-full rounded-lg border border-[var(--ds-border)] bg-transparent pl-10 pr-2.5 text-sm font-medium text-[var(--ds-fg)] [font-variant-numeric:tabular-nums] placeholder:text-[var(--ds-fg-subtle)] focus:border-[var(--ds-border-strong)] focus:outline-none focus:ring-1 focus:ring-white/15"
                      />
                    </div>
                    <span
                      className="shrink-0 px-0.5 text-sm font-medium text-[var(--ds-fg-subtle)]"
                      aria-hidden
                    >
                      =
                    </span>
                    <div className="relative min-w-0 flex-1">
                      <div
                        className="pointer-events-none absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#f7931a]/20 ring-1 ring-[#f7931a]/35"
                        aria-hidden
                      >
                        <IconCurrencyBitcoin
                          className="h-4 w-4 text-[#f7931a]"
                          stroke={1.75}
                        />
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        aria-label="Deposit amount in BTC"
                        value={btcConvCryptoStr}
                        onChange={(e) => {
                          const s = e.target.value;
                          setBtcConvCryptoStr(s);
                          const n = parseDecimalInput(s);
                          if (n === null) return;
                          setBtcConvFiatStr(
                            formatFiatForConverter(n * BITCOIN_USD_RATE),
                          );
                        }}
                        placeholder="0"
                        className="h-10 w-full rounded-lg border border-[var(--ds-border)] bg-transparent pl-10 pr-2.5 text-sm font-medium text-[var(--ds-fg)] [font-variant-numeric:tabular-nums] placeholder:text-[var(--ds-fg-subtle)] focus:border-[#f7931a]/35 focus:outline-none focus:ring-1 focus:ring-[#f7931a]/25"
                      />
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] leading-snug text-white/48">
                    <span className="text-[var(--ds-fg-subtle)]">Reference rate</span>
                    <span className="mx-1.5 text-white/[0.22]" aria-hidden>
                      ·
                    </span>
                    <span className="text-sky-200/55">1 BTC</span>
                    <span className="text-[var(--ds-fg-subtle)]"> = </span>
                    <span className="font-medium [font-variant-numeric:tabular-nums] text-white/72">
                      {currencySymbol}
                      {BITCOIN_USD_RATE.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}{" "}
                      USD
                    </span>
                  </p>
                </div>

                <div className="h-px bg-[var(--ds-control-hover)]" />

                {/* Address + copy */}
                <div className="px-4 py-3.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-white/42">
                    Deposit address
                  </p>
                  <p className="mt-1.5 break-words break-all text-[13px] leading-relaxed tracking-tight text-white/78">
                    {BITCOIN_DEMO_DEPOSIT_ADDRESS}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          BITCOIN_DEMO_DEPOSIT_ADDRESS,
                        );
                        setBtcCopied(true);
                        window.setTimeout(() => setBtcCopied(false), 2200);
                      } catch {
                        /* clipboard unavailable */
                      }
                    }}
                    className="mt-3 h-9 w-full border-[var(--ds-border-strong)] bg-transparent text-xs font-semibold text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]"
                  >
                    <IconCopy className="mr-2 h-3.5 w-3.5" stroke={1.5} />
                    {btcCopied ? "Copied" : "Copy"}
                  </Button>
                </div>

                <div className="h-px bg-[var(--ds-control-hover)]" />

                {/* Limits — inline, no extra box */}
                <div className="flex divide-x divide-white/10 px-2 py-3 text-center">
                  <div className="min-w-0 flex-1 px-2">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">
                      Min
                    </p>
                    <p className="mt-0.5 text-xs font-medium [font-variant-numeric:tabular-nums] text-white/88">
                      {currencySymbol}
                      {bitcoinMethod.min}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 px-2">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">
                      Max
                    </p>
                    <p className="mt-0.5 text-xs font-medium [font-variant-numeric:tabular-nums] text-white/88">
                      {currencySymbol}
                      {bitcoinMethod.max.toLocaleString()}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 px-2">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--ds-fg-subtle)]">
                      Fee
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-white/88">
                      {bitcoinMethod.feeLabel}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[var(--ds-control-hover)]" />

                <div className="px-4 py-3">
                  <div className="flex gap-2.5 rounded-lg border border-amber-400/18 bg-gradient-to-b from-amber-500/[0.09] to-amber-950/[0.12] px-3 py-2.5">
                    <IconAlertCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/85"
                      stroke={1.5}
                    />
                    <p className="text-[11px] leading-relaxed text-white/68">
                      <span className="font-semibold text-amber-100/85">
                        Important
                      </span>
                      <span className="text-[var(--ds-fg-subtle)]"> — </span>
                      Send only{" "}
                      <span className="font-medium text-white/88">
                        Bitcoin (BTC)
                      </span>{" "}
                      to this address on{" "}
                      <span className="font-medium text-white/88">
                        Binance Smart Chain (BEP20)
                      </span>
                      . Other assets or networks may result in loss of funds.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[var(--ds-control-hover)]" />

                <div>
                  <button
                    type="button"
                    onClick={() => setBitcoinQrExpanded((e) => !e)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-[var(--ds-fg)]">
                      <IconCurrencyBitcoin className="h-4 w-4 text-[#f7931a]" />
                      {bitcoinQrExpanded ? "Hide QR code" : "Show QR code"}
                    </span>
                    {bitcoinQrExpanded ? (
                      <IconChevronUp className="h-4 w-4 text-[var(--ds-fg-subtle)]" />
                    ) : (
                      <IconChevronDown className="h-4 w-4 text-[var(--ds-fg-subtle)]" />
                    )}
                  </button>
                  {bitcoinQrExpanded ? (
                    <div className="flex flex-col items-center border-t border-[var(--ds-border)] px-4 pb-4 pt-3">
                      <div className="relative rounded-lg bg-white p-2.5 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(BITCOIN_DEMO_DEPOSIT_ADDRESS)}`}
                          alt="Wallet QR code"
                          width={220}
                          height={220}
                          className="h-[220px] w-[220px]"
                        />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f7931a]">
                          <IconCurrencyBitcoin className="h-6 w-6 text-[var(--ds-fg)]" />
                        </div>
                      </div>
                      <a
                        href="https://bitcoin.org/en/getting-started"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 text-xs font-medium text-sky-400/90 hover:underline"
                      >
                        New to Bitcoin? Get started
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>

              <Button
                type="button"
                onClick={() => {
                  const fiatParsed = parseDecimalInput(btcConvFiatStr);
                  const btcParsed = parseDecimalInput(btcConvCryptoStr);
                  let usd: number | null = fiatParsed;
                  if (usd === null && btcParsed !== null)
                    usd = btcParsed * BITCOIN_USD_RATE;
                  if (usd === null || !Number.isFinite(usd) || usd < 0) {
                    usd = bitcoinMethod.min;
                  }
                  const amt = Math.max(
                    bitcoinMethod.min,
                    Math.min(bitcoinMethod.max, usd),
                  );
                  handleConfirmDeposit({ amount: amt });
                }}
                disabled={isDepositLoading}
                className="h-12 w-full bg-[#84cc16] font-bold uppercase tracking-wide text-[#1a1a1a] hover:bg-[#a3e635] disabled:cursor-not-allowed disabled:bg-[var(--ds-control-hover)] disabled:text-[var(--ds-fg-subtle)]"
              >
                {isDepositLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Deposit sent"
                )}
              </Button>
            </div>
          ) : null}

          {hubTab !== "deposit" &&
          !showDepositConfirmation &&
          !isFlowCheckout ? (
            <div className="px-4 py-16 text-center">
              <p className="text-sm font-medium text-[var(--ds-fg-muted)]">
                {hubTab === "withdrawal"
                  ? "Withdrawal"
                  : hubTab === "history"
                    ? "History"
                    : "Settings"}
              </p>
              <p className="mx-auto mt-2 max-w-[240px] text-xs text-[var(--ds-fg-subtle)]">
                This section is coming soon. Use Deposit to add funds.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-6 border-[var(--ds-border-strong)] bg-transparent text-[var(--ds-fg)] hover:bg-[var(--ds-control-hover)]"
                onClick={() => setHubTab("deposit")}
              >
                Back to Deposit
              </Button>
            </div>
          ) : null}

          {hubTab === "deposit" &&
          !showDepositConfirmation &&
          !isFlowCheckout ? (
            depositCategory === "crypto" &&
            selectedCoinId &&
            CRYPTO_COINS.some((c) => c.id === selectedCoinId) ? (
              <WalletHubCryptoDeposit
                coin={CRYPTO_COINS.find((c) => c.id === selectedCoinId)!}
                category={depositCategory}
                onCategoryChange={(c) => {
                  setDepositCategory(c);
                  if (c !== "crypto") setSelectedCoinId(undefined);
                }}
                onSelectCoin={(coin) => {
                  setSelectedCoinId(coin.id);
                  setSelectedPaymentMethod("bitcoin");
                }}
                currencySymbol={currencySymbol}
              />
            ) : (
              <WalletHubDepositHome
                category={depositCategory}
                onCategoryChange={(c) => {
                  setDepositCategory(c);
                  if (c !== "crypto") setSelectedCoinId(undefined);
                }}
                selectedCoinId={selectedCoinId}
                onSelectCoin={(coin) => {
                  setSelectedCoinId(coin.id);
                  setSelectedPaymentMethod("bitcoin");
                }}
                otherMethods={OTHER_METHODS.map((m) => ({
                  id: m.id,
                  label: m.label,
                  feeLabel: m.feeLabel,
                }))}
                selectedOtherId={normalizedId}
                onSelectOther={(id) => setSelectedPaymentMethod(id)}
                onSelectCard={() => {
                  setSelectedPaymentMethod("card");
                  setDepositFlowScreen("card-checkout");
                }}
              />
            )
          ) : null}

          {showDepositConfirmation ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[var(--ds-fg)]">
                  Your deposit is on the way...
                </h2>
                <p className="text-sm text-[var(--ds-fg-subtle)]">
                  Transaction ID: {transactionId}
                </p>
              </div>

              <Card className="border border-[var(--ds-border)] bg-[var(--ds-surface-raised)] shadow-none">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--ds-fg-muted)]">
                        Deposit Amount
                      </span>
                      <span className="text-lg font-semibold text-[var(--ds-fg)]">
                        {currencySymbol}
                        {depositAmount.toFixed(2)}
                      </span>
                    </div>
                    <Separator className="bg-[var(--ds-control-hover)]" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--ds-fg-muted)]">
                        Payment Method
                      </span>
                      <span className="text-sm font-medium text-[var(--ds-fg)]">
                        {formatPaymentMethodLabel(selectedPaymentMethod)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-[var(--ds-border)] bg-[var(--ds-surface-raised)] shadow-none">
                <CardContent className="p-4">
                  <div className="relative">
                    <div className="flex items-start justify-between px-1">
                      <div className="flex min-w-0 flex-1 flex-col items-center">
                        <div
                          className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                            depositStep === "started" ||
                            depositStep === "processing" ||
                            depositStep === "almost" ||
                            depositStep === "complete"
                              ? "bg-[#059669] shadow-sm"
                              : "border-2 border-[var(--ds-border-strong)] bg-[var(--ds-control-hover)]"
                          }`}
                        >
                          {stepLoading.started ? (
                            <IconLoader2 className="h-4 w-4 animate-spin text-[var(--ds-fg)]" />
                          ) : depositStep === "started" ||
                            depositStep === "processing" ||
                            depositStep === "almost" ||
                            depositStep === "complete" ? (
                            <IconCheck className="h-5 w-5 text-[var(--ds-fg)]" />
                          ) : null}
                        </div>
                        <span className="whitespace-nowrap text-xs font-medium text-[var(--ds-fg)]">
                          Started
                        </span>
                      </div>

                      <div
                        className={`mx-2 mt-5 h-1 flex-1 rounded-full transition-all ${
                          depositStep === "processing" ||
                          depositStep === "almost" ||
                          depositStep === "complete"
                            ? "bg-[#059669]"
                            : "bg-[var(--ds-control-hover)]"
                        }`}
                      />

                      <div className="flex min-w-0 flex-1 flex-col items-center">
                        <div
                          className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                            depositStep === "processing"
                              ? "border-2 border-[var(--ds-border-strong)] bg-[var(--ds-surface-raised)] shadow-sm"
                              : depositStep === "almost" ||
                                  depositStep === "complete"
                                ? "bg-[#059669] shadow-sm"
                                : "border-2 border-[var(--ds-border-strong)] bg-[var(--ds-control-hover)]"
                          }`}
                        >
                          {stepLoading.processing ? (
                            <IconLoader2 className="h-4 w-4 animate-spin text-[var(--ds-fg)]" />
                          ) : depositStep === "processing" ? (
                            <IconLoader2 className="h-4 w-4 animate-spin text-[var(--ds-fg)]" />
                          ) : depositStep === "almost" ||
                            depositStep === "complete" ? (
                            <IconCheck className="h-5 w-5 text-[var(--ds-fg)]" />
                          ) : (
                            <span className="text-xs font-bold text-[var(--ds-fg-subtle)]">
                              B
                            </span>
                          )}
                        </div>
                        <span
                          className={`whitespace-nowrap text-xs font-medium ${
                            depositStep === "processing" ||
                            depositStep === "almost" ||
                            depositStep === "complete"
                              ? "text-[var(--ds-fg)]"
                              : "text-[var(--ds-fg-subtle)]"
                          }`}
                        >
                          Processing
                        </span>
                      </div>

                      <div
                        className={`mx-2 mt-5 h-1 flex-1 rounded-full transition-all ${
                          depositStep === "almost" ||
                          depositStep === "complete"
                            ? "bg-[#059669]"
                            : "bg-[var(--ds-control-hover)]"
                        }`}
                      />

                      <div className="flex min-w-0 flex-1 flex-col items-center">
                        <div
                          className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                            depositStep === "almost" ||
                            depositStep === "complete"
                              ? "bg-[#059669] shadow-sm"
                              : "border-2 border-[var(--ds-border-strong)] bg-[var(--ds-control-hover)]"
                          }`}
                        >
                          {stepLoading.almost ? (
                            <IconLoader2 className="h-4 w-4 animate-spin text-[var(--ds-fg)]" />
                          ) : depositStep === "almost" ||
                            depositStep === "complete" ? (
                            <IconCheck className="h-5 w-5 text-[var(--ds-fg)]" />
                          ) : null}
                        </div>
                        <span
                          className={`whitespace-nowrap text-xs font-medium ${
                            depositStep === "almost" ||
                            depositStep === "complete"
                              ? "text-[var(--ds-fg)]"
                              : "text-[var(--ds-fg-subtle)]"
                          }`}
                        >
                          Almost Done
                        </span>
                      </div>

                      <div
                        className={`mx-2 mt-5 h-1 flex-1 rounded-full transition-all ${
                          depositStep === "complete"
                            ? "bg-[#059669]"
                            : "bg-[var(--ds-control-hover)]"
                        }`}
                      />

                      <div className="flex min-w-0 flex-1 flex-col items-center">
                        <div
                          className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                            depositStep === "complete"
                              ? "bg-[#059669] shadow-sm"
                              : "border-2 border-[var(--ds-border-strong)] bg-[var(--ds-control-hover)]"
                          }`}
                        >
                          {stepLoading.complete ? (
                            <IconLoader2 className="h-4 w-4 animate-spin text-[var(--ds-fg)]" />
                          ) : depositStep === "complete" ? (
                            <IconCheck className="h-5 w-5 text-[var(--ds-fg)]" />
                          ) : null}
                        </div>
                        <span
                          className={`whitespace-nowrap text-xs font-medium ${
                            depositStep === "complete"
                              ? "text-[var(--ds-fg)]"
                              : "text-[var(--ds-fg-subtle)]"
                          }`}
                        >
                          Complete
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {depositStep === "complete" && (
                <Button
                  variant="ghost"
                  onClick={onPlayNow}
                  className="mt-4 h-11 w-full rounded-md border-2 border-[var(--ds-border-strong)] font-semibold text-[var(--ds-fg)] transition-colors hover:border-white/35 hover:bg-[var(--ds-control-hover)]"
                >
                  Play Now
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
