import { notReallyACrossChainTokenModuleNotReallyACrossChainTokenAbi } from "../generated";
import { useBalance, useReadContracts } from "wagmi";

export function ContractData(params: {
  contractAddress: `0x${string}`;
  userAddresses?: readonly `0x${string}`[];
}) {
  const notReallyACrossChainTokenContract = {
    address: params.contractAddress,
    abi: notReallyACrossChainTokenModuleNotReallyACrossChainTokenAbi,
  } as const;

  // 1️⃣ Read token info and balances
  const contractData = useReadContracts({
    contracts: [
      { ...notReallyACrossChainTokenContract, functionName: "totalSupply" },
      { ...notReallyACrossChainTokenContract, functionName: "symbol" },
      ...(params.userAddresses ?? []).map((addr) => ({
        ...notReallyACrossChainTokenContract,
        functionName: "balanceOf",
        args: [addr],
      })),
    ],
  });
  let error: string | null = null;

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: params.contractAddress,
  });

  if (contractData.error !== null) {
    error = contractData.error.toString();
  } else {
    error =
      contractData.data?.find((el) => el.error !== undefined)?.toString() ||
      null;
  }

  if (error !== null) {
    return (
      <p>
        Loading contract data for{" "}
        <span className="font-bold">{params.contractAddress}</span> failed!
        <br />
        <code style={{ whiteSpace: "pre-wrap" }}>{error}</code>
      </p>
    );
  }

  if (
    contractData.isLoading ||
    contractData?.data === undefined ||
    contractData.data.some((el) => el === undefined) ||
    balanceLoading
  ) {
    return (
      <p>
        Loading contract data for{" "}
        <span className="font-bold">{params.contractAddress}</span>...
      </p>
    );
  }

  const totalSupply = contractData.data[0].result as bigint;
  const tokenName = contractData.data[1].result as string;
  const balances = contractData.data.slice(2).map((el) => el.result as bigint);

  const formatMoney = (amount: bigint): string =>
    String(Number(amount / 10n ** (BigInt(18) - 3n)) / 1000) + " " + tokenName;

  return (
    <>
      <p>
        Smart contract address:{" "}
        <span className="font-bold">{params.contractAddress}</span>
      </p>
      <p>
        Locked PAS:{" "}
        <span className="font-bold">{balanceData?.formatted ?? "0"}</span>
      </p>
      <p>
        Total supply:{" "}
        <span className="font-bold">{formatMoney(totalSupply)}</span>
      </p>

      {params.userAddresses && params.userAddresses.length > 0 && (
        <div className="border rounded-md my-5 p-2 w-full align-top">
          <h3 className="font-bold text-lg">Balances</h3>
          <div className="w-full grid grid-cols-2">
            {balances
              .map((val, index) => [
                <div key={index.toString() + "_addr"} className="text-left">
                  {params.userAddresses![index]}
                </div>,
                <div key={index.toString() + "_value"} className="text-right">
                  {formatMoney(val)}
                </div>,
              ])
              .flat()}
          </div>
        </div>
      )}
    </>
  );
}
