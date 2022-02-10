use crate::msg::{DonationAmountResponse, FundraiserResponse};
use crate::msg::{MyDonationsResponse, QueryMsg};
use crate::state::FundraiserContract;
use cosmwasm_std::{to_binary, Binary, Deps, Env, StdResult, Uint128};

impl<'a> FundraiserContract<'a> {
    pub fn query(&self, deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
        match msg {
            QueryMsg::GetFundraiser {} => to_binary(&self.query_fundraiser(deps)?),
            QueryMsg::DonationAmount { address } => {
                to_binary(&self.query_donation_amount(deps, address)?)
            }
            QueryMsg::MyDonations { address } => {
                to_binary(&self.query_my_donations(deps, address)?)
            }
        }
    }
}

impl<'a> FundraiserContract<'a> {
    fn query_fundraiser(&self, deps: Deps) -> StdResult<FundraiserResponse> {
        let fundraiser = self.fundraiser.load(deps.storage)?;
        let total_donations = self.total_donations.load(deps.storage)?;

        Ok(FundraiserResponse {
            name: fundraiser.name,
            url: fundraiser.url,
            image_url: fundraiser.image_url,
            description: fundraiser.description,
            owner: fundraiser.owner.into_string(),
            beneficiary: fundraiser.beneficiary.into_string(),
            total_donations,
        })
    }

    fn query_donation_amount(
        &self,
        deps: Deps,
        address: String,
    ) -> StdResult<DonationAmountResponse> {
        let checked_address = deps.api.addr_validate(&address)?;
        let donation_count = match self.donation.may_load(deps.storage, checked_address)? {
            Some(donations) => {
                let sum = donations.iter().map(|d| d.value.u128()).sum();
                Uint128::new(sum)
            }
            None => Uint128::zero(),
        };
        Ok(DonationAmountResponse {
            amount: donation_count,
        })
    }

    fn query_my_donations(&self, deps: Deps, address: String) -> StdResult<MyDonationsResponse> {
        let checked_address = deps.api.addr_validate(&address)?;

        let donations = self
            .donation
            .may_load(deps.storage, checked_address)?
            .unwrap_or_default();
        Ok(MyDonationsResponse { donations })
    }
}
