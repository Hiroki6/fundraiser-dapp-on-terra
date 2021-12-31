use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub count: i32,
    pub owner: Addr,
}

pub const STATE: Item<State> = Item::new("state");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Fundraiser {
    pub name: String,
    pub url: String,
    pub image_url: String,
    pub description: String,
    pub owner: Addr,
    pub beneficiary: Addr,
    pub custodian: Addr,
}

pub const FUNDRAISER: Item<Fundraiser> = Item::new("fundraiser");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Donation {
    pub value: Uint128,
    pub date: Uint128,
}

// @todo find the solution to use Map<Addr, Vec<Donation>> without parsing error
pub const DONATION: Map<Addr, Uint128> = Map::new("donation");
//pub const DONATION: Map<Addr, Vec<Donation>> = Map::new("donation");