"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import useSound from "use-sound";
import styles from "./picoViewer.module.css";

export type PicoClass = "Fire" | "Nofire" | string;

export interface PicoData {
	timestamp: number;
	class?: PicoClass;
	confidence?: number;
	fire_score?: number;
	nofire_score?: number;
	[key: string]: unknown;
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
	if (!ctx) throw new Error("usePico must be inside a <PicoViewer />");
	return ctx;
};

interface PicoViewerProps {
	refreshMs?: number; // milliseconds; 0 or negative = no auto-refresh
	showHistory?: boolean;
	className?: string;
	baseUrl?: string; // optional base url to fetch (e.g. http://localhost:3001)
	children?: ReactNode;
}

const deepEqual = (a: unknown, b: unknown): boolean => {
	if (a === b) return true;
	if (a == null || b == null) return a === b;

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!deepEqual(a[i], b[i])) return false;
		}
		return true;
	}

	if (typeof a === "object" && typeof b === "object") {
		const aRec = a as Record<string, unknown>;
		const bRec = b as Record<string, unknown>;
		const aKeys = Object.keys(aRec);
		const bKeys = Object.keys(bRec);
		if (aKeys.length !== bKeys.length) return false;
		for (const k of aKeys) {
			if (!Object.prototype.hasOwnProperty.call(bRec, k)) return false;
			if (!deepEqual(aRec[k], bRec[k])) return false;
		}
		return true;
	}

	return false;
};

const isPicoData = (x: unknown): x is PicoData =>
	typeof x === "object" &&
	x !== null &&
	typeof (x as Record<string, unknown>).timestamp === "number";

const isArrayOfPicoData = (x: unknown): x is PicoData[] =>
	Array.isArray(x) && x.every(isPicoData);

const getErrorMessage = (err: unknown): string => {
	if (err instanceof Error) return err.message;
	try {
		return String(err);
	} catch {
		return "Unknown error";
	}
};

function isMaybePromise<T = unknown>(v: unknown): v is Promise<T> {
	return (
		typeof v === "object" &&
		v !== null &&
		typeof (v as { then?: unknown }).then === "function"
	);
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
	const latestRef = useRef<PicoData | null>(null);
	const historyRef = useRef<PicoData[]>([]);

	useEffect(() => {
		latestRef.current = latest;
	}, [latest]);
	useEffect(() => {
		historyRef.current = history;
	}, [history]);

	const [play, { sound }] = useSound("/alert.wav", { interrupt: true });

	const repeatRemainingRef = useRef<number>(0);
	const howlHandlerRef = useRef<(() => void) | null>(null);

	const safePlay = useCallback(() => {
		try {
			const maybe = play();
			if (isMaybePromise(maybe)) {
				maybe.catch((err) => {
					if (process.env.NODE_ENV !== "production") {
						console.debug(
							"Audio playback rejected (likely autoplay policy):",
							err,
						);
					}
				});
			}
		} catch (err) {
			if (process.env.NODE_ENV !== "production") {
				console.debug("Audio play() threw synchronously:", err);
			}
		}
	}, [play]);

	useEffect(() => {
		return () => {
			if (sound && howlHandlerRef.current && typeof sound.off === "function") {
				sound.off("end", howlHandlerRef.current);
				howlHandlerRef.current = null;
			}
		};
		// intentionally not listing `sound` so this runs on unmount only
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const playAlert = useCallback(
		(times = 5) => {
			if (times < 1) return;

			if (sound && howlHandlerRef.current && typeof sound.off === "function") {
				sound.off("end", howlHandlerRef.current);
				howlHandlerRef.current = null;
			}

			repeatRemainingRef.current = times;

			const onEnd = () => {
				repeatRemainingRef.current -= 1;
				if (repeatRemainingRef.current > 0) {
					safePlay();
				} else {
					if (sound && typeof sound.off === "function") {
						sound.off("end", onEnd);
					}
					howlHandlerRef.current = null;
				}
			};

			if (sound && typeof sound.on === "function") {
				howlHandlerRef.current = onEnd;
				sound.on("end", onEnd);
				safePlay();
				return;
			}

			safePlay();

			let attempts = 0;
			const maxAttempts = 30;
			const pollIntervalMs = 50;
			const poll = () => {
				attempts++;
				if (sound && typeof sound.on === "function") {
					howlHandlerRef.current = onEnd;
					sound.on("end", onEnd);
					return;
				}
				if (attempts <= maxAttempts) {
					setTimeout(poll, pollIntervalMs);
				} else {
					if (process.env.NODE_ENV !== "production") {
						console.debug(
							"Failed to attach Howl 'end' handler within timeout.",
						);
					}
				}
			};
			setTimeout(poll, pollIntervalMs);
		},
		[safePlay, sound],
	);

	const fetchData = useCallback(async (): Promise<void> => {
		if (abortRef.current) abortRef.current.abort();
		const ac = new AbortController();
		abortRef.current = ac;

		const initialLoad =
			!latestRef.current &&
			(!historyRef.current || historyRef.current.length === 0);
		if (initialLoad) setLoading(true);

		try {
			const trimmedBase = baseUrl ? baseUrl.replace(/\/$/, "") : "";
			const endpoint = showHistory ? "/pico_data/history" : "/pico_data/latest";
			const url = (trimmedBase || "") + endpoint;

			const res = await fetch(url, { signal: ac.signal });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const json: unknown = await res.json();

			if (!mountedRef.current) return;

			if (showHistory) {
				const arr: PicoData[] = isArrayOfPicoData(json) ? json : [];
				if (!deepEqual(arr, historyRef.current)) {
					setHistory(arr);
					setLatest(arr.length > 0 ? arr[arr.length - 1] : null);

					// play alert whenever new data is fetched (5 times)
					playAlert(5);
				}
			} else {
				const incoming: PicoData | null = isPicoData(json) ? json : null;
				if (!deepEqual(incoming, latestRef.current)) {
					setLatest(incoming);

					// play alert whenever new data is fetched (5 times)
					playAlert(5);
				}
			}

			setError(null);
		} catch (err: unknown) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			if (err instanceof Error && err.name === "AbortError") return;
			setError(getErrorMessage(err));
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	}, [showHistory, baseUrl, playAlert]);

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
		[latest, history, loading, error, refreshMs, showHistory, fetchData],
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
	omitFallback?: boolean;
}) => {
	const { loading, error, latest, history } = usePico();
	const hasData = !!latest || (history && history.length > 0);

	if (!omitFallback) {
		if (loading && !hasData)
			return (
				<div className={styles.picoLoading}>
					Carregando detecções de incêndio…
				</div>
			);
		if (error && !hasData)
			return <div className={styles.picoError}>Erro: {error}</div>;
	}
	return <div className={styles.picoLatest}>{children}</div>;
};

export const DashboardHeader = ({ children }: { children?: ReactNode }) => (
	<h4 className={styles.picoSectionHeader}>{children}</h4>
);

const getDetectionStatusClass = (
	detectedClass?: PicoClass,
	fireScore?: number,
	confidence?: number,
): string => {
	if (detectedClass === "Fire") {
		if (typeof fireScore === "number" && typeof confidence === "number")
			return styles.fireDetected;
	}
	return styles.noFireDetected; // for all other cases, no fire was properly detected
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
						latest.confidence,
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
						latest.confidence,
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
	if (typeof latest?.confidence !== "number") return <>{fallback}</>;
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
	const { loading, history } = usePico();

	if ((!history || history.length === 0) && !loading)
		return <div className={styles.picoHistoryEmpty}>Nenhuma detecção</div>;
	else if (loading) return <></>;

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
							// timestamp + index ensures uniqueness even when timestamps collide (parallel reqs)
							key={`${entry.timestamp ?? "no-ts"}-${i}`}
							className={getDetectionStatusClass(
								entry.class,
								entry.fire_score,
								entry.confidence,
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
									? entry.nofire_score!.toFixed(3)
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
