import { useState } from "react";
import { useMountedRef } from ".";

// useMemo & useCallback 在state保存函数的时候用
interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = {
    ...defaultConfig,
    initialConfig,
  };
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });
  const [retry, setRetry] = useState(() => () => {});
  const mounted = useMountedRef();

  const setData = (data: D) =>
    setState({
      data,
      stat: "success",
      error: null,
    });

  const setError = (error: Error) =>
    setState({
      error,
      stat: "error",
      data: null,
    });

  // 用来触发异步请求
  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error("请传入Promise类型数据");
    }
    setState({
      ...state,
      stat: "loading",
    });
    return promise
      .then((data) => {
        mounted.current && setData(data);
        return data;
      })
      .catch((err) => {
        setError(err);
        if (config.throwOnError) {
          return Promise.reject(err);
        }
        return err;
      });
  };

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    retry,
    setRetry,
    ...state,
  };
};
