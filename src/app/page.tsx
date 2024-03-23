"use client";

import useWasm from "dc/hooks/wasm";
import Image from "next/image";
import { useState } from "react";

export default function Encryption() {
  const { wasm, isLoading, error } = useWasm();
  const [downloadUrl, setDownloadUrl] = useState<
    {
      url: string;
      filename: string;
      colors: { r: number; g: number; b: number }[];
    }[]
  >([]);

  const handleFileInputChange = (file: FileList | null) => {
    if (file && file[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        // encrypting
        const filename = file[0].name;
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        let colors = wasm.get_colors(
          bytes,
          filename.split(".").at(-1) as string,
        );
        let col: { r: number; g: number; b: number }[] = [];
        for (let index = 0; index < colors.length; index += 3) {
          const r = colors[index].valueOf();
          const g = colors[index + 1].valueOf();
          const b = colors[index + 2].valueOf();
          col.push({ r, g, b });
        }
        const blob = new Blob([bytes], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        setDownloadUrl((e) => [
          ...e,
          {
            url,
            filename,
            colors: col,
          },
        ]);
      };
      reader.readAsArrayBuffer(file[0]);
    }
  };

  return (
    <div className="card m-4 border-primary-content">
      <div className="">
        <h2 className="">Get Color Pallet of the image</h2>
        <input
          type="file"
          className="file-input file-input-bordered file-input-secondary w-full"
          multiple={false}
          accept="image/png, image/gif, image/jpeg"
          onChange={(e) => handleFileInputChange(e.target.files)}
        />
        {downloadUrl.length > 0 && <p>Output Files after the process:</p>}
        <div className="flex flex-wrap gap-3">
          {downloadUrl &&
            downloadUrl.map((e, idx) => (
              <div key={`${e.filename}+${idx}`}>
                <div className="w-64 h-64 relative">
                  <Image
                    src={e.url}
                    layout="fill"
                    objectFit="contain"
                    alt={e.filename}
                  />
                </div>
                <div className="flex content-evenly w-64">
                  {e.colors.map(({ r, g, b }) => (
                    <div
                      key={[r, g, b].join()}
                      // color={`rgb(${r},${g},${b})`}
                      className={`h-12 w-12`}
                      style={{ backgroundColor: `rgb(${r},${g},${b})` }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
