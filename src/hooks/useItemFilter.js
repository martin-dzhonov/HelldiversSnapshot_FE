import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { patchPeriods } from "../constants";

const paramMap = {
  p: "patch",
  f: "faction",
  fmt: "format",
};

const reverseParamMap = Object.fromEntries(
  Object.entries(paramMap).map(([k, v]) => [v, k])
);

export default function useItemFilter(defaults) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const result = { ...defaults };

    for (const [paramKey, filterKey] of Object.entries(paramMap)) {
      const val = searchParams.get(paramKey);

      if (filterKey === "patch") {
        const idx = parseInt(val, 10);
        if (!isNaN(idx) && patchPeriods[idx]) {
          result.patch = patchPeriods[idx];
        }
      } else if (val !== null) {
        result[filterKey] = val;
      }
    }

    return result;
  }, [searchParams, defaults]);

  const setFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(updates)) {
      const paramKey = reverseParamMap[key];
      if (!paramKey) continue;

      if (key === "patch" && value?.id != null) {
        const idx = patchPeriods.findIndex((p) => p.id === value.id);
        if (idx >= 0) newParams.set("p", `${idx}`);
      } else {
        newParams.set(paramKey, value);
      }
    }

    setSearchParams(newParams, { replace: true });
  };

  return [filters, setFilters];
}