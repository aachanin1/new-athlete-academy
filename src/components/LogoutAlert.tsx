"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export default function LogoutAlert() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (searchParams.get("logged_out") === "true") {
            setShow(true);
            // Remove the query param from URL
            const timer = setTimeout(() => {
                router.replace("/", { scroll: false });
            }, 100);

            // Auto hide after 4 seconds
            const hideTimer = setTimeout(() => {
                setShow(false);
            }, 4000);

            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [searchParams, router]);

    if (!show) return null;

    return (
        <div style={{
            position: "fixed",
            top: 90,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            background: "linear-gradient(135deg, rgba(16,185,129,0.95) 0%, rgba(5,150,105,0.95) 100%)",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
            animation: "slideDown 0.3s ease-out"
        }}>
            <CheckCircle size={24} />
            <span style={{ fontWeight: 500 }}>ออกจากระบบเรียบร้อยแล้ว</span>
            <button
                onClick={() => setShow(false)}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    marginLeft: 8,
                    padding: 4
                }}
            >
                <X size={18} />
            </button>
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
