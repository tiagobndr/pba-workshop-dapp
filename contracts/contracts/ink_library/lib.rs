#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod my_contract {
    use ink::xcm::{prelude::*, latest::AssetTransferFilter};
    use ink::prelude::vec;
    use ink::scale::Encode;
    use ink::SolBytes;

    #[ink(storage)]
    pub struct XTransfers {}

    impl XTransfers {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {}
        }

        #[ink(message)]
        pub fn teleport(&mut self, para_id: u32, amount: u128, beneficiary: SolBytes<[u8; 32]>) -> SolBytes<Vec<u8>> {
            let assets_to_withdraw = vec![(Parent, amount).into()];

            let fees_assets: Asset = (Parent, amount.saturating_div(10)).into();

            let destination = Location::new(1, [Parachain(para_id)]);
            let remote_fees = AssetTransferFilter::Teleport(Definite((Parent, amount.saturating_div(10)).into()));
            let preserve_origin = false;
            let transfer_assets = vec![AssetTransferFilter::Teleport(Wild(AllCounted(1)))];
            let beneficiary = Location::new(1, [AccountId32 { network: None, id: beneficiary.into() }]);
            let remote_xcm = Xcm::<()>::builder_unsafe()
                .deposit_asset(Wild(AllCounted(1)), beneficiary)
                .build();
            
            let xcm = Xcm::<()>::builder()
                .withdraw_asset(assets_to_withdraw)
                .pay_fees(fees_assets)
                .initiate_transfer(
                    destination,
                    remote_fees,
                    preserve_origin,
                    transfer_assets,
                    remote_xcm,
                )
                .build();

            let versioned_xcm: VersionedXcm<()> = VersionedXcm::from(xcm);
            let encoded_xcm = versioned_xcm.encode();

            hex::encode(encoded_xcm)
        }
    }
}