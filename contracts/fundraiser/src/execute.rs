use crate::state::{Donation, FundraiserContract};

use cosmwasm_std::{DepsMut, Env, MessageInfo, Response, Addr, Uint128, BankMsg};
use crate::msg::{ExecuteMsg, InstantiateMsg};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::state::{Fundraiser};
use crate::util::{must_pay};

// version info for migration info
const CONTRACT_NAME: &str = "fundraiser";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
const ULUNA: &str = "uluna";

impl<'a> FundraiserContract<'a> {
    pub fn instantiate(
        &self,
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        msg: InstantiateMsg,
    ) -> Result<Response, ContractError> {
        let checked_beneficiary: Addr = deps.api.addr_validate(&msg.beneficiary)?;
        let checked_custodian: Addr = deps.api.addr_validate(&msg.custodian)?;
        let fundraiser =  Fundraiser {
            name: msg.name.clone(),
            url: msg.url,
            image_url: msg.image_url,
            description: msg.description,
            owner: checked_custodian,
            beneficiary: checked_beneficiary,
        };
        set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
        self.fundraiser.save(deps.storage, &fundraiser)?;
        self.total_donations.save(deps.storage, &Uint128::zero())?;

        Ok(Response::new()
            .add_attribute("method", "instantiate")
            .add_attribute("owner", info.sender)
            .add_attribute("name", msg.name))
    }

    pub fn execute(
        &self,
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        msg: ExecuteMsg,
    ) -> Result<Response, ContractError> {
        match msg {
            ExecuteMsg::SetBeneficiary { beneficiary } => self.set_beneficiary(deps, info, beneficiary),
            ExecuteMsg::Donate {} => self.donate(deps, info),
            ExecuteMsg::Withdraw {} => self.withdraw(deps, env, info)
        }
    }
}

impl<'a> FundraiserContract<'a> {
    fn set_beneficiary(&self, deps: DepsMut, info: MessageInfo, new_beneficiary: String) -> Result<Response, ContractError> {
        let checked_beneficiary: Addr = deps.api.addr_validate(&new_beneficiary)?;
        self.fundraiser.update(deps.storage, |mut fundraiser| -> Result<_, ContractError> {
            if info.sender != fundraiser.owner {
                return Err(ContractError::Unauthorized {});
            }
            fundraiser.beneficiary = checked_beneficiary;
            Ok(fundraiser)
        })?;

        Ok(Response::new().add_attribute("method", "set_beneficiary"))
    }

    fn donate(&self, deps: DepsMut, info: MessageInfo) -> Result<Response, ContractError> {
        // currently we assume fund is luna
        let payment = must_pay(&info, ULUNA)?;
        let donation = Donation {
            value: payment,
            date: Uint128::new(instant::Instant::now().elapsed().as_millis())
        };

        self.total_donations.update(deps.storage, |total| -> Result<_, ContractError> {
            Ok(total+payment)
        })?;

        self.donation.update(deps.storage, info.sender, |donation_opt: Option<Vec<Donation>>| -> Result<_, ContractError> {
            match donation_opt {
                Some(mut donation_map) => {
                    donation_map.push(donation);
                    Ok(donation_map)
                }
                None => {
                    Ok(vec![donation])
                }
            }
        })?;

        Ok(Response::new().add_attribute("method", "donate"))
    }

    fn withdraw(&self, deps: DepsMut, env: Env, info: MessageInfo) -> Result<Response, ContractError> {
        let fundraiser = self.fundraiser.load(deps.storage)?;

        if fundraiser.owner != info.sender {
            return Err(ContractError::Unauthorized {});
        }

        let balance = deps.querier.query_balance(env.contract.address.to_string(), ULUNA)?;

        let amount = vec![balance];

        let send = BankMsg::Send {
            to_address: fundraiser.beneficiary.to_string(),
            amount,
        };

        Ok(Response::new()
            .add_message(send)
            .add_attribute("action", "with_draw")
            .add_attribute("owner", fundraiser.owner.to_string())
            .add_attribute("fundraiser", fundraiser.name.to_string()))
    }
}
