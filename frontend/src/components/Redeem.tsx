import { notReallyACrossChainTokenModuleNotReallyACrossChainTokenAbi } from "../generated";
import { useWriteContract } from "wagmi";

import { useState } from "react";
import { generateXcmMessage } from "../utils/get-XCM-message";
import { convertEthToSubstrate } from "../utils/convert-eth-to-ss58";
import { u8aToHex } from "@polkadot/util";
import { decodeAddress } from "@polkadot/util-crypto";

export function Redeem(params: {
  contractAddress: `0x${string}`;
  accounts: `0x${string}`[] | undefined;
  symbol: string;
}) {
  const [amount, setAmount] = useState<bigint>(0n);
  const [chainId, setChainId] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<string>(
    params.accounts && params.accounts.length > 0 ? params.accounts[0] : ""
  );
  const [customAddress, setCustomAddress] = useState<string>("");
  const finalAccount =
    selectedAccount === "custom" ? customAddress : selectedAccount;

  const { writeContract, status, data, error } = useWriteContract();

  type ChainLabel = "Asset Hub" | "People" | "Coretime" | "Relay Chain";

  const chainOptions: Record<ChainLabel, number | null> = {
    "Asset Hub": 1000,
    People: 1004,
    Coretime: 1005,
    "Relay Chain": null,
  };

  return (
    <div className="my-5 mx-2 p-2 w-fit inline-block">
      <h3 className="px-2 block mb-4 font-bold text-lg">
        Redeem {params.symbol}s to PAS
      </h3>

      {/* Chain */}
      <div className="text-right my-2 w-[400px] ml-auto">
        <label
          htmlFor="chainSelect"
          className="px-2 mb-2 inline-block text-left w-full"
        >
          Chain
        </label>
        <select
          id="chainSelect"
          onChange={(e) => {
            const selected = e.target.value as ChainLabel;
            if (chainOptions[selected] !== null) {
              setChainId(chainOptions[selected] as number);
            }
          }}
          disabled={status === "pending"}
          defaultValue=""
          className="border rounded-md pl-2 h-10 w-full focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        >
          <option value="" disabled hidden>
            Select a chain
          </option>
          {Object.entries(chainOptions).map(([label]) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

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
          onChange={(e) =>
            setAmount(BigInt(e.target.value) * 10n ** BigInt(18))
          }
          disabled={status === "pending"}
          className="border rounded-md pl-2 h-10 w-full focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        />
      </div>

      {/* Account */}
      <div className="text-right my-2 w-[400px] ml-auto">
        <label
          htmlFor="accountSelect"
          className="px-2 mb-2 inline-block text-left w-full"
        >
          Account
        </label>
        <div className="space-y-2">
          <select
            id="accountSelect"
            value={selectedAccount}
            onChange={(e) =>
              setSelectedAccount(e.target.value as `0x${string}`)
            }
            className="border rounded-md pl-2 h-10 w-full focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          >
            {params.accounts?.map((address) => (
              <option key={address} value={address}>
                {address}
              </option>
            ))}
            <option value="custom">Choose another address</option>
          </select>

          {selectedAccount === "custom" && (
            <input
              type="text"
              placeholder="Enter custom address"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="border rounded-md pl-2 h-10 w-full focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            />
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="text-right mt-4 w-[400px] ml-auto">
        <button
          onClick={async () => {
            writeContract({
              address: params.contractAddress,
              abi: notReallyACrossChainTokenModuleNotReallyACrossChainTokenAbi,
              functionName: "redeem",
              args: [
                amount,
                chainId,
                u8aToHex(decodeAddress(convertEthToSubstrate(finalAccount))),
              ],
            });
          }}
          disabled={status === "pending"}
          style={{ backgroundColor: "#E6007A" }}
          className="w-full h-10 text-white rounded-md disabled:opacity-50"
        >
          Redeem{" "}
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
