use cosmwasm_std::{Deps, StdResult, Binary, Env, to_binary, StdError};
use crate::msg::{GetFundraisersResponse, QueryMsg};
use crate::state::FundraiserFactoryContract;

const MAX_LIMIT: u64 = 20;

impl<'a> FundraiserFactoryContract<'a> {
    pub fn query(&self, deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
        match msg {
            QueryMsg::GetFundraisers { limit, offset } => to_binary(&self.get_fundraisers(deps, limit, offset)?)
        }
    }
}

impl<'a> FundraiserFactoryContract<'a> {
    fn get_fundraisers(
        &self,
        deps: Deps,
        limit: u64,
        offset: u64
    ) -> StdResult<GetFundraisersResponse> {
        let fundraisers = self.fundraisers.load(deps.storage)?;

        if offset as usize > fundraisers.addrs.len() {
            return Err(StdError::generic_err("offset must be smaller than num of fundraisers"))
        };

        let mut size = fundraisers.addrs.len() as u64 - offset;
        size = if size > limit {
            limit
        } else {
            size
        };

        size = if size > MAX_LIMIT {
            MAX_LIMIT
        } else {
            size
        };

        // @todo find the clean way
        let mut addrs: Vec<String> = Vec::with_capacity(size as usize);

        for i in 0..size {
            addrs.push(fundraisers.addrs[(offset+i) as usize].to_string());
        }

        //let addrs: Vec<String> = fundraisers.addrs.iter().collect();

        Ok(
            GetFundraisersResponse {
               addrs
            }
        )
    }
}
