import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const BMC_PAGE_ID = "helldive.live";
const IFRAME_URL =
  `https://www.buymeacoffee.com/widget/page/${BMC_PAGE_ID}` +
  `?description=Support%20me%20on%20Buy%20me%20a%20coffee!` +
  `&color=%23FFDD00`;

export default function DonateButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 600 + 20 - 80, 
        left: rect.left - 420 + 20,
      });
    }
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 50,
          bottom: 50,
          background: "#FFDD00",
          border: "none",
          borderRadius: 8,
          padding: "10px 18px",
          fontWeight: 700,
          cursor: "pointer",
          zIndex: 10000,
        }}
      >
        ☕ Buy me a coffee
      </button>

      {open &&
        createPortal(
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 10001,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: `${Math.max(position.top, 20)}px`,
                left: `${Math.max(position.left, 20)}px`,
                width: 420,
                height: 630,
                overflow: "hidden",
                marginTop: "-20px", 
                borderRadius: 12,
                boxShadow: "0 6px 30px rgba(0,0,0,0.25)",
                background: "#fff",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                title="Buy Me a Coffee"
                src={IFRAME_URL}
                style={{
                  border: "none",
                  width: "100%",
                  height: "100%",
                  display: "block",
                  margin: 0,
                  padding: 0,
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
