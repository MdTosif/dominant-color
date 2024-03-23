import { useState, useEffect } from "react";

import * as wasm from "dc/pkg/rst_dom_color";

const useWasm = () => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/wasm/rst_dom_color_bg.wasm");
        const ab = await res.arrayBuffer();
        wasm.default(ab);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { wasm, isLoading, error };
};

export default useWasm;
