"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import styles from "./picoViewer.module.css";

export type PicoClass = "Fire" | "Nofire" | string;

export interface PicoData {
  timestamp: number;
  class?: PicoClass;
  confidence?: number;
  fire_score?: number;
  nofire_score?: number;
  [key: string]: any;
}

interface PicoContextType {
  latest: PicoData | null;
  history: PicoData[];
  loading: boolean;
  error: string | null;
  refreshMs: number;
  showHistory: boolean;
  refetch: () => Promise<void>;
}

const PicoContext = createContext<PicoContextType | undefined>(undefined);

export const usePico = () => {
  const ctx = useContext(PicoContext);
  if (!ctx) throw new Error("usePico must be used inside a <PicoViewer />");
  return ctx;
};

interface PicoViewerProps {
  refreshMs?: number; // milliseconds; 0 or negative = no auto-refresh
  showHistory?: boolean;
  className?: string;
  baseUrl?: string; // optional base url (e.g. http://localhost:3000)
  children?: ReactNode;
}

export const PicoViewer = ({
  refreshMs = 12 * 1000,
  showHistory = false,
  className = "",
  baseUrl = "",
  children,
}: PicoViewerProps) => {
  const [latest, setLatest] = useState<PicoData | null>(null);
  const [history, setHistory] = useState<PicoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);

    try {
      const trimmedBase = baseUrl ? baseUrl.replace(/\/$/, "") : "";
      const endpoint = showHistory ? "/pico_data/history" : "/pico_data/latest";
      const url = (trimmedBase || "") + endpoint;

      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (!mountedRef.current) return;

      if (showHistory) {
        const arr = Array.isArray(json) ? json : [];
        setHistory(arr);
        setLatest(arr.length > 0 ? arr[arr.length - 1] : null);
      } else {
        setLatest(json ?? null);
      }

      setError(null);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setError(err?.message ?? String(err));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [showHistory, baseUrl]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    let interval: ReturnType<typeof setInterval> | undefined;
    if (refreshMs > 0) {
      interval = setInterval(() => {
        fetchData();
      }, refreshMs);
    }

    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
      if (interval) clearInterval(interval);
    };
  }, [fetchData, refreshMs]);

  const ctx = useMemo(
    () => ({
      latest,
      history,
      loading,
      error,
      refreshMs,
      showHistory,
      refetch: fetchData,
    }),
    [latest, history, loading, error, refreshMs, showHistory, fetchData]
  );

  return (
    <PicoContext.Provider value={ctx}>
      <div className={`${styles.picoContainer} ${className}`.trim()}>
        {children}
      </div>
    </PicoContext.Provider>
  );
};

export const Header = ({ children }: { children?: ReactNode }) => (
  <div className={styles.picoTitle}>{children}</div>
);

export const ViewerDashboard = ({
  children,
  omitFallback = false,
}: {
  children?: ReactNode;
  omitFallback?: boolean; // if true, dashboard will not render loading/error fallbacks
}) => {
  const { loading, error } = usePico();
  if (!omitFallback) {
    if (loading)
      return (
        <div className={styles.picoLoading}>
          Carregando detecções de incêndio…
        </div>
      );
    if (error) return <div className={styles.picoError}>Erro: {error}</div>;
  }
  return <div className={styles.picoLatest}>{children}</div>;
};

export const DashboardHeader = ({ children }: { children?: ReactNode }) => (
  <h4 className={styles.picoSectionHeader}>{children}</h4>
);

const getDetectionStatusClass = (
  detectedClass?: string,
  fireScore?: number,
  confidence?: number
) => {
  if (detectedClass === "Fire") {
    if (
      typeof fireScore === "number" &&
      typeof confidence === "number" &&
      fireScore >= 60 &&
      confidence >= 60
    )
      return styles.fireDetected;
    else return styles.noFireDetected;
  } else if (detectedClass === "Nofire") return styles.noFireDetected;
  return ""; // edge case
};

export const DetectionResult = ({
  ifFire = "FOGO!!!",
  ifNoFire = "Sem fogo",
  unknown = "—",
  className = "",
}: {
  ifFire?: ReactNode;
  ifNoFire?: ReactNode;
  unknown?: ReactNode;
  className?: string;
}) => {
  const { latest } = usePico();
  if (!latest) return <>{unknown}</>;
  if (latest.class === "Fire")
    return (
      <>
        <span
          className={`${className} ${getDetectionStatusClass(
            latest.class,
            latest.fire_score,
            latest.confidence
          )}`.trim()}
        >
          {ifFire}
        </span>
      </>
    );
  if (latest.class === "Nofire")
    return (
      <>
        <span
          className={`${className} ${getDetectionStatusClass(
            latest.class,
            latest.fire_score,
            latest.confidence
          )}`.trim()}
        >
          {ifNoFire}
        </span>
      </>
    );
  return <>{unknown}</>;
};

export const DetectionConfidence = ({
  fallback = "—",
}: {
  fallback?: ReactNode;
}) => {
  const { latest } = usePico();
  if (!latest?.confidence && latest?.confidence !== 0) return <>{fallback}</>;
  return <>{`${(latest!.confidence! * 100).toFixed(1)}%`}</>;
};

export const DetectionFireScore = ({
  fallback = "—",
}: {
  fallback?: ReactNode;
}) => {
  const { latest } = usePico();
  if (typeof latest?.fire_score !== "number") return <>{fallback}</>;
  return <>{latest!.fire_score!.toFixed(3)}</>;
};

export const DetectionNoFireScore = ({
  fallback = "—",
}: {
  fallback?: ReactNode;
}) => {
  const { latest } = usePico();
  if (typeof latest?.nofire_score !== "number") return <>{fallback}</>;
  return <>{latest!.nofire_score!.toFixed(3)}</>;
};

export const DetectionTimestamp = ({
  localeOptions,
  fallback = "—",
}: {
  localeOptions?: Intl.DateTimeFormatOptions;
  fallback?: ReactNode;
}) => {
  const { latest } = usePico();
  if (!latest) return <>{fallback}</>;
  return (
    <>{new Date(latest.timestamp).toLocaleString(undefined, localeOptions)}</>
  );
};

export const HistoryTable = () => {
  const { history } = usePico();

  if (!history || history.length === 0)
    return <div className={styles.picoHistoryEmpty}>Nenhuma detecção</div>;

  const rows = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className={styles.picoHistory}>
      <h4>Histórico de Detecções</h4>
      <table className={styles.picoTable}>
        <thead>
          <tr>
            <th>Horário</th>
            <th>Classe</th>
            <th>Confiança</th>
            <th>Score (fire)</th>
            <th>Score (nofire)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, i) => (
            <tr
              key={entry.timestamp ?? i}
              className={getDetectionStatusClass(
                entry.class,
                entry.fire_score,
                entry.confidence
              )}
            >
              <td>{new Date(entry.timestamp).toLocaleTimeString()}</td>
              <td>
                {entry.class === "Fire"
                  ? "fire"
                  : entry.class === "Nofire"
                  ? "nofire"
                  : "—"}
              </td>
              <td>
                {typeof entry.confidence === "number"
                  ? `${(entry.confidence * 100).toFixed(1)}%`
                  : "—"}
              </td>
              <td>
                {typeof entry.fire_score === "number"
                  ? entry.fire_score.toFixed(3)
                  : "—"}
              </td>
              <td>
                {typeof entry.nofire_score === "number"
                  ? entry.nofire_score.toFixed(3)
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PicoViewer;
