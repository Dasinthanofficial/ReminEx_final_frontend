import React, { Fragment, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

export default function SelectMenu({
  label,
  value,
  onChange,
  options = [],
  className = "",
  size = "md",          // "sm" for tight UI, "md" default
  maxHeight = "max-h-64", // dropdown scroll height
}) {
  const selected = useMemo(
    () => options.find((o) => o.value === value) || options[0],
    [options, value]
  );

  const buttonClass =
    size === "sm"
      ? "px-3 py-2 text-sm rounded-xl"
      : "px-4 py-3.5 text-sm rounded-xl";

  const optionClass =
    size === "sm"
      ? "px-3 py-2.5 text-sm"
      : "px-4 py-3 text-sm";

  return (
    <div className={`relative z-[60] ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={`w-full flex items-center justify-between gap-3 ${buttonClass}
              bg-black/40 border border-white/10 text-white outline-none
              focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] transition`}
          >
            <span className="font-semibold truncate">
              {selected?.label}
            </span>
            <FiChevronDown className="text-gray-300 shrink-0" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Listbox.Options
              className={`
                absolute mt-2 w-full overflow-hidden rounded-xl
                border border-white/10 bg-[#122017]/95 backdrop-blur-xl shadow-2xl
                focus:outline-none
                z-[70]   /* ensure above card/backdrop */
              `}
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
                    {({ selected }) => (
                      <>
                        <span className="truncate">{opt.label}</span>
                        {selected && (
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
        </div>
      </Listbox>
    </div>
  );
}