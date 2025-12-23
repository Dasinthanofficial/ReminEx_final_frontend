import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Listbox, Transition, Portal } from "@headlessui/react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

// Map common Tailwind max-h classes to px so we can estimate space.
// (Used only for flip logic; actual height is still controlled by CSS classes.)
const MAXH_TO_PX = {
  "max-h-40": 160,
  "max-h-48": 192,
  "max-h-56": 224,
  "max-h-64": 256,
};

function SelectMenuBody({
  open,
  label,
  value,
  onChange,
  options,
  className,
  size,
  maxHeight,
  placement,
}) {
  const buttonRef = useRef(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value) || options[0],
    [options, value]
  );

  const [pos, setPos] = useState({ left: 0, top: 0, width: 0, openUp: false });

  const buttonClass =
    size === "sm"
      ? "px-3 py-2 text-sm rounded-xl"
      : "px-4 py-3.5 text-sm rounded-xl";

  const optionClass =
    size === "sm" ? "px-3 py-2.5 text-sm" : "px-4 py-3 text-sm";

  const computePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();

    // estimate needed space for flip
    const itemH = size === "sm" ? 40 : 44;
    const visibleItems = Math.min(options.length, 6);
    const estimatedListHeight = visibleItems * itemH + 24;

    // if maxHeight is smaller, use that for a better estimate
    const maxPx = MAXH_TO_PX[maxHeight] || estimatedListHeight;
    const needed = Math.min(estimatedListHeight, maxPx) + 16; // extra margin

    const below = window.innerHeight - rect.bottom;
    const above = rect.top;

    let openUp = false;
    if (placement === "top") openUp = true;
    else if (placement === "bottom") openUp = false;
    else openUp = below < needed && above > below;

    const gap = 8;
    const left = rect.left;
    const width = rect.width;

    // For "up", we anchor at rect.top and translate -100%
    const top = openUp ? rect.top - gap : rect.bottom + gap;

    setPos({ left, top, width, openUp });
  };

  // ✅ compute on open, and keep aligned on scroll/resize
  useEffect(() => {
    if (!open) return;

    computePosition();

    const onScroll = () => computePosition();
    const onResize = () => computePosition();

    // capture=true so it reacts to scrolling containers too
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement, size, maxHeight, options.length]);

  return (
    <div className={`relative z-[60] ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <Listbox.Button
          ref={buttonRef}
          className={`w-full flex items-center justify-between gap-3 ${buttonClass}
            bg-black/40 border border-white/10 text-white outline-none
            focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] transition`}
        >
          <span className="font-semibold truncate">{selected?.label}</span>
          <FiChevronDown className="text-gray-300 shrink-0" />
        </Listbox.Button>

        {/* ✅ Portal prevents clipping inside overflow containers */}
        <Portal>
          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Listbox.Options
              className={`
                fixed z-[99999]
                overflow-hidden rounded-xl
                border border-white/10 bg-[#122017]/95 backdrop-blur-xl shadow-2xl
                focus:outline-none
              `}
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                transform: pos.openUp ? "translateY(-100%)" : "none",
              }}
            >
              <div className={`${maxHeight} overflow-y-auto`}>
                {options.map((opt) => (
                  <Listbox.Option
                    key={opt.value}
                    value={opt.value}
                    className={({ active }) =>
                      `cursor-pointer select-none flex items-center justify-between ${optionClass}
                       ${active ? "bg-white/10 text-white" : "text-gray-200"}`
                    }
                  >
                    {({ selected: isSelected }) => (
                      <>
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <span className="text-[#38E07B] ml-3 shrink-0">
                            <FiCheck />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </div>
            </Listbox.Options>
          </Transition>
        </Portal>
      </div>
    </div>
  );
}

export default function SelectMenu({
  label,
  value,
  onChange,
  options = [],
  className = "",
  size = "md",
  maxHeight = "max-h-64",
  placement = "auto",
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <SelectMenuBody
          open={open}
          label={label}
          value={value}
          onChange={onChange}
          options={options}
          className={className}
          size={size}
          maxHeight={maxHeight}
          placement={placement}
        />
      )}
    </Listbox>
  );
}