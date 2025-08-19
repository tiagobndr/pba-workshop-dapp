import { hexToU8a } from "@polkadot/util";
import { encodeAddress } from "@polkadot/util-crypto";

function convertEthToSubstrate(ethAddress: string): string {
  if (!ethAddress.startsWith("0x") || ethAddress.length !== 42) {
    throw new Error("Invalid Ethereum address");
  }

  const ethBytes = hexToU8a(ethAddress); // 20 bytes
  const substrateBytes = new Uint8Array(32).fill(0xee); // padded with 0xee
  substrateBytes.set(ethBytes, 0); // insert Ethereum bytes into beginning

  return encodeAddress(substrateBytes, 42);
}

export { convertEthToSubstrate };
