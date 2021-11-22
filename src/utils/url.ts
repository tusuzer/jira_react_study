import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { cleanObject } from ".";

/**
 * 返回页面url中，制定key的参数值
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  // 拿到url参数，并返回
  const [searchParams, setSearchParams] = useSearchParams();
  const [stateKeys] = useState(keys);
  return [
    useMemo(
      () =>
        stateKeys.reduce((prev, key) => {
          return {
            ...prev,
            [key]: searchParams.get(key) || "",
          };
        }, {} as { [key in K]: string }),
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParams(o);
    },
  ] as const;
};
