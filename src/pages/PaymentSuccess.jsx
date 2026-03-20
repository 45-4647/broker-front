import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function PaymentSuccess({ theme = "dark" }) {
  const isDark = theme === "dark";
  const location = useLocation();
  const navigate = useNavigate();
  const hasVerified = useRef(false);
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;
      try {
        const params = new URLSearchParams(location.search);
        const session_id = params.get("session_id");
        const tx_ref = params.get("tx_ref");
        if (session_id) await API.get(`/payment/stripe/verify?session_id=${session_id}`);
        if (tx_ref) await API.get(`/payment/chapa/verify?tx_ref=${tx_ref}`);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };
    verifyPayment();
  }, [location.search]);

  useEffect(() => {
    if (status !== "success") return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); navigate("/"); }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
      <div className={`w-full max-w-md rounded-2xl border p-8 text-center ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"}`}>

        {/* Verifying state */}
        {status === "verifying" && (
          <>
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
              <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Please wait while we confirm your transaction...</p>
          </>
        )}

        {/* Success state */}
        {status === "success" && (
          <>
            {/* Animated checkmark circle */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Your product has been submitted and will be live shortly.
            </p>

            {/* Countdown bar */}
            <div className={`rounded-xl px-5 py-4 mb-6 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
              <p className={`text-xs mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Redirecting to home in <span className="font-bold text-green-500">{countdown}s</span>
              </p>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
            >
              Go to Home Now
            </button>
          </>
        )}

        {/* Error state */}
        {status === "error" && (
          <>
            <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              We couldn't verify your payment. If you were charged, please contact support.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}
              >
                Go Home
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all duration-200"
              >
                Contact Support
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
