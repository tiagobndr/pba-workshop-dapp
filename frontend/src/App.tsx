import { injected, useAccount, useConnect } from "wagmi";
import "./App.css";
import { notReallyACrossChainTokenModuleNotReallyACrossChainTokenAddress } from "./generated";

import polkadotLogo from "./assets/polkadot-logo.svg";
import { ContractData } from "./components/ContractData";
import { Mint } from "./components/Mint";
import { Redeem } from "./components/Redeem";
import { useEffect } from "react";

const contractAddress =
  notReallyACrossChainTokenModuleNotReallyACrossChainTokenAddress[420420422];

function App() {
  const accountData = useAccount();
  const { connect } = useConnect();

  useEffect(() => {
    document.title = "NotReallyACrossChainToken";
  }, []);

  return (
    <>
      <img
        src={polkadotLogo}
        className="mx-auto h-52	p-4 logo"
        alt="Polkadot logo"
      />
      {accountData.connector !== undefined ? (
        <div className="container mx-auto p-2 leading-6">
          <h2 className="text-2xl font-bold">Success!</h2>
          <p>Metamask wallet connected!</p>
          <p>
            Connected to chain ID:{" "}
            <span className="font-bold">{accountData.chainId}</span>
          </p>

          <p>
            {accountData.addresses && accountData.addresses.length > 0 ? (
              <>
                <b>{accountData.addresses.length}</b> addresses connected!
              </>
            ) : (
              <>No addresses connected</>
            )}
          </p>
        </div>
      ) : (
        <div className="container mx-auto p-2 leading-6">
          <p>
            Metamask wallet not connected or installed. Chain interaction is
            disabled.
          </p>
          <div className="mt-4">
            <button
              onClick={() => connect({ connector: injected() })}
              className="px-4 py-2 text-white rounded-lg shadow"
              style={{ backgroundColor: "#E6007A" }}
            >
              Connect
            </button>
          </div>
        </div>
      )}

      <ContractData
        contractAddress={contractAddress}
        userAddresses={accountData.addresses}
      />
      <Mint contractAddress={contractAddress} symbol={"NRXT"} />
      <Redeem
        contractAddress={contractAddress}
        accounts={
          accountData.addresses ? [...accountData.addresses] : undefined
        }
        symbol={"NRXT"}
      />
    </>
  );
}

export default App;
