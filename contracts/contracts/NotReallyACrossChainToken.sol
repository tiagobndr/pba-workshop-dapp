// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

address constant XCM_PRECOMPILE_ADDRESS = address(0xA0000);
address constant CROSS_CHAIN_TRANSFERS_ADDRESS = 0x624d7E5D9F6E02E2b67a6bE9DB161d5e8f126C64;

interface IXcm {
    struct Weight {
        uint64 refTime;
        uint64 proofSize;
    }

    function execute(bytes calldata message, Weight calldata weight) external;
    function send(bytes calldata destination, bytes calldata message) external;
    function weighMessage(bytes calldata message) external returns (Weight memory weight);
}

interface ICrossChainTransfers {
    function teleport(uint128 amount, uint32 paraId, bytes32 beneficiary) external returns (bytes memory);
}

contract NotReallyACrossChainToken is ERC20 {
    error NoValueSent();
    error InsufficientFunds();
    error RedeemFailed(bytes reason);

    event RedeemSuccess(address indexed account, uint128 amount);
    
    constructor() ERC20("NotReallyACrossChainToken", "NRXT") {}

    function mint() external payable {
        if (msg.value == 0) revert NoValueSent();
        _mint(msg.sender, msg.value);
    }

    function redeem(uint128 amount, uint32 paraId, bytes32 beneficiary) external {
        if (balanceOf(msg.sender) < amount) revert InsufficientFunds();
        _burn(msg.sender, amount);

        bytes memory message = ICrossChainTransfers(CROSS_CHAIN_TRANSFERS_ADDRESS).teleport(amount / 1e8, paraId, beneficiary);

        IXcm.Weight memory weight = IXcm(XCM_PRECOMPILE_ADDRESS).weighMessage(message);

        try IXcm(XCM_PRECOMPILE_ADDRESS).execute(message, weight) {
            emit RedeemSuccess(msg.sender, amount);
        } catch (bytes memory reason) {
            revert RedeemFailed(reason);
        }
    }
}