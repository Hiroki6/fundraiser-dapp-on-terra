use crate::state::FundraiserContract;
use cosmwasm_std::{Deps, Env, Binary, StdResult, to_binary, Uint128};
use crate::msg::{QueryMsg};
use crate::msg::{FundraiserResponse, DonationAmountResponse};

impl<'a> FundraiserContract<'a> {
    pub fn query(&self, deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
        match msg {
            QueryMsg::GetFundraiser {} => to_binary(&self.query_fundraiser(deps)?),
            QueryMsg::DonationAmount { address } => to_binary(&self.query_donation_amount(deps, address)?)
        }
    }
}

impl<'a> FundraiserContract<'a> {
    fn query_fundraiser(&self, deps: Deps) -> StdResult<FundraiserResponse> {
        let fundraiser = self.fundraiser.load(deps.storage)?;
        Ok(FundraiserResponse {
            name: fundraiser.name,
            url: fundraiser.url,
            image_url: fundraiser.image_url,
            description: fundraiser.description,
            owner: fundraiser.owner.into_string(),
            beneficiary: fundraiser.beneficiary.into_string()
        })
    }

    fn query_donation_amount(&self, deps: Deps, address: String) -> StdResult<DonationAmountResponse> {
        let checked_address = deps.api.addr_validate(&address)?;
        let donation_count = match self.donation.may_load(deps.storage, checked_address)? {
            Some(donations) => {
                let sum = donations.iter().map(|d| d.value.u128()).sum();
                Uint128::new(sum)
            },
            None => Uint128::zero()
        };
        Ok(DonationAmountResponse {amount: donation_count})
    }
}
