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

        if offset as usize > fundraisers.len() {
            return Err(StdError::generic_err("offset must be smaller than num of fundraisers"))
        };

        let mut size = fundraisers.len() as u64 - offset;
        size = if size < MAX_LIMIT {
            if size < limit {
                limit
            } else {
                size
            }
        } else {
            MAX_LIMIT
        };

        // @todo find the clean way
        let mut addrs: Vec<String> = Vec::with_capacity(size as usize);

        for i in 0..size {
            addrs[i as usize] = fundraisers[(offset+i) as usize].to_string();
        }
        //let addrs: Vec<String> = fundraisers.iter().map(|addr| addr.to_string()).collect();

        Ok(
            GetFundraisersResponse {
                addrs
            }
        )
    }
}
