import React, { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FiCheck, FiChevronDown, FiGlobe, FiSearch } from "react-icons/fi";

export default function CurrencyMenu({
  value = "USD",
  onChange,
  options = ["USD"],
  compact = false, // compact style for navbar
}) {
  const [q, setQ] = useState("");

  const selected = (value || "USD").toUpperCase();

  const filtered = useMemo(() => {
    const query = q.trim().toUpperCase();
    if (!query) return options;
    return options.filter((c) => c.toUpperCase().includes(query));
  }, [q, options]);

  return (
    <Listbox value={selected} onChange={(v) => onChange?.(v)}>
      <div className="relative">
        <Listbox.Button
          className={
            compact
              ? "flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:border-[#38E07B]/50 transition-colors text-white"
              : "w-full flex items-center justify-between gap-3 p-3.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] transition"
          }
        >
          <span className="flex items-center gap-2">
            <FiGlobe className="text-[#38E07B]" />
            <span className="font-bold uppercase text-sm">{selected}</span>
          </span>
          <FiChevronDown className="text-gray-300" />
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
          <Listbox.Options className="absolute z-[9999] mt-2 w-64 md:w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#122017]/95 backdrop-blur-xl shadow-2xl focus:outline-none">
            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search currency..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-sm outline-none focus:border-[#38E07B]"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                Example: USD, LKR, EUR
              </p>
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-4 text-sm text-gray-400">
                  No matches.
                </div>
              ) : (
                filtered.map((c) => (
                  <Listbox.Option
                    key={c}
                    value={c}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-3 text-sm font-semibold flex items-center justify-between ${
                        active ? "bg-white/10 text-white" : "text-gray-200"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="uppercase">{c}</span>
                        {selected && (
                          <span className="text-[#38E07B]">
                            <FiCheck />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </div>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}