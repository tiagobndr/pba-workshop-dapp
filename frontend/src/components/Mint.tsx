import { notReallyACrossChainTokenModuleNotReallyACrossChainTokenAbi } from "../generated";
import { useWriteContract } from "wagmi";

import { useState } from "react";

export function Mint(params: {
  contractAddress: `0x${string}`;
  symbol: string;
}) {
  const [amount, setAmount] = useState(0);

  const { writeContract, status } = useWriteContract();

  return (
    <div className="my-5 mx-2 p-2 w-fit inline-block">
      <h3 className="px-2 block mb-4 font-bold text-lg">
        Mint {params.symbol}s
      </h3>

      {/* Amount */}
      <div className="text-right my-2 w-[400px] ml-auto">
        <label
          htmlFor="amount"
          className="px-2 mb-2 inline-block text-left w-full"
        >
          Amount
        </label>
        <input
          id="amount"
          type="number"
          placeholder="0"
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={status === "pending"}
          className="border rounded-md pl-2 h-10 w-full focus:ring-2 focus:ring-inset"
        />
      </div>

      {/* Mint Button */}
      <div className="text-right mt-4 w-[400px] ml-auto">
        <button
          onClick={() => {
            writeContract({
              address: params.contractAddress,
              abi: notReallyACrossChainTokenModuleNotReallyACrossChainTokenAbi,
              functionName: "mint",
              value: BigInt(amount) * 10n ** BigInt(18),
            });
          }}
          disabled={status === "pending"}
          style={{ backgroundColor: "#E6007A" }}
          className="w-full h-10 text-white rounded-md hover:brightness-110 disabled:opacity-50 transition-colors"
        >
          Mint{" "}
          {status === "pending"
            ? "⏳"
            : status === "success"
              ? "✅"
              : status === "error"
                ? "❌"
                : ""}
        </button>
      </div>
    </div>
  );
}
