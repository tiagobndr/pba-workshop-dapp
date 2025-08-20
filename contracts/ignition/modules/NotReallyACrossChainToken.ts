import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NotReallyACrossChainTokenModule = buildModule("NotReallyACrossChainTokenModule", (m) => {
    const token = m.contract("NotReallyACrossChainToken");

    return { token };
});

export default NotReallyACrossChainTokenModule;