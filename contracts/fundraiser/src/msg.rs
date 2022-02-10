use crate::state::Donation;
use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub name: String,
    pub url: String,
    pub image_url: String,
    pub description: String,
    pub beneficiary: String,
    pub custodian: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    SetBeneficiary { beneficiary: String },
    Donate {},
    Withdraw {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetFundraiser {},
    DonationAmount { address: String },
    MyDonations { address: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct FundraiserResponse {
    pub name: String,
    pub url: String,
    pub image_url: String,
    pub description: String,
    pub owner: String,
    pub beneficiary: String,
    pub total_donations: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct DonationAmountResponse {
    pub amount: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct MyDonationsResponse {
    pub donations: Vec<Donation>,
}
