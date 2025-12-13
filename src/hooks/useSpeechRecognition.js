import { useCallback, useRef, useState } from "react";

export function useSpeechRecognition() {
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [lastError, setLastError] = useState(null);

  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const isSupported = !!SpeechRecognition;

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    recognitionRef.current = null;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;

    setListening(false);
  }, []);

  const listenOnce = useCallback(
    ({ lang = "en-US", timeoutMs = 12000 } = {}) =>
      new Promise((resolve, reject) => {
        if (!SpeechRecognition) {
          const err = new Error("SpeechRecognition not supported in this browser.");
          setLastError(err.message);
          reject(err);
          return;
        }

        setLastError(null);

        const rec = new SpeechRecognition();
        recognitionRef.current = rec;

        rec.lang = lang;
        rec.continuous = false;
        rec.interimResults = false;
        rec.maxAlternatives = 1;

        rec.onstart = () => setListening(true);

        rec.onerror = (e) => {
          setListening(false);
          const msg = e?.error || "speech_error";
          setLastError(msg);
          reject(new Error(msg));
        };

        rec.onend = () => {
          setListening(false);
          recognitionRef.current = null;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        };

        rec.onresult = (event) => {
          const text =
            event?.results?.[0]?.[0]?.transcript?.toString()?.trim() || "";
          resolve(text);
        };

        timeoutRef.current = setTimeout(() => {
          try {
            rec.stop();
          } catch {}
          reject(new Error("speech_timeout"));
        }, timeoutMs);

        try {
          rec.start();
        } catch (err) {
          setListening(false);
          reject(err);
        }
      }),
    [SpeechRecognition]
  );

  return { isSupported, listening, lastError, listenOnce, stop };
}
