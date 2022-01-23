use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

pub struct FundraiserContract<'a> {
    pub fundraiser: Item<'a, Fundraiser>,
    pub donation: Map<'a, Addr, Vec<Donation>>
}

impl Default for FundraiserContract<'static> {
    fn default() -> Self {
        Self::new(
            "fundraiser",
            "donation"
        )
    }
}

impl<'a> FundraiserContract<'a> {
    fn new(
        fundraiser_key: &'a str,
        donation_key: &'a str
    ) -> Self {
        Self {
            fundraiser: Item::new(fundraiser_key),
            donation: Map::new(donation_key),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Fundraiser {
    pub name: String,
    pub url: String,
    pub image_url: String,
    pub description: String,
    pub owner: Addr,
    pub beneficiary: Addr,
}


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Donation {
    pub value: Uint128,
    pub date: Uint128,
}
