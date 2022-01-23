use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr};
use cw_storage_plus::Item;

pub struct FundraiserFactoryContract<'a> {
    // fundraiser contract addresses
    pub fundraisers: Item<'a, Vec<Addr>>,
    pub config: Item<'a, Config>
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub owner: Addr,
    pub fundraiser_code_id: u64
}

impl Default for FundraiserFactoryContract<'static> {
    fn default() -> Self {
        Self::new(
            "fundraisers",
            "config"
        )
    }
}

impl<'a> FundraiserFactoryContract<'a> {
    fn new(
        fundraisers_key: &'a str,
        config_key: &'a str
    ) -> Self {
        Self {
            fundraisers: Item::new(fundraisers_key),
            config: Item::new(config_key),
        }
    }
}
