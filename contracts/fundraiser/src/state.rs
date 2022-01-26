use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Timestamp, Uint128};
use cw_storage_plus::{Item, Map};

pub struct FundraiserContract<'a> {
    pub fundraiser: Item<'a, Fundraiser>,
    pub donation: Map<'a, Addr, Vec<Donation>>,
    pub total_donations: Item<'a, Uint128>
}

impl Default for FundraiserContract<'static> {
    fn default() -> Self {
        Self::new(
            "fundraiser",
            "donation",
            "total_donations"
        )
    }
}

impl<'a> FundraiserContract<'a> {
    fn new(
        fundraiser_key: &'a str,
        donation_key: &'a str,
        total_donation_key: &'a str
    ) -> Self {
        Self {
            fundraiser: Item::new(fundraiser_key),
            donation: Map::new(donation_key),
            total_donations: Item::new(total_donation_key)
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
    pub date: Timestamp,
}
