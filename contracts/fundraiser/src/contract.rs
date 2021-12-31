#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr, Coin, Uint128};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, FundraiserResponse, DonationAmountResponse};
use crate::state::{FUNDRAISER, Fundraiser, DONATION, Donation};
//use std::time::{SystemTime};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:counter";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
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
        owner: info.sender.clone(),
        beneficiary: checked_beneficiary,
        custodian: checked_custodian,
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    FUNDRAISER.save(deps.storage, &fundraiser)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("name", msg.name))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::SetBeneficiary { beneficiary } => set_beneficiary(deps, info, beneficiary),
        ExecuteMsg::Donate {} => donate(deps, info)
    }
}

pub fn set_beneficiary(deps: DepsMut, info: MessageInfo, new_beneficiary: String) -> Result<Response, ContractError> {
    let checked_beneficiary: Addr = deps.api.addr_validate(&new_beneficiary)?;
    FUNDRAISER.update(deps.storage, |mut fundraiser| -> Result<_, ContractError> {
        if info.sender != fundraiser.owner {
            return Err(ContractError::Unauthorized {});
        }
        fundraiser.beneficiary = checked_beneficiary;
        Ok(fundraiser)
    })?;

    Ok(Response::new().add_attribute("method", "set_beneficiary"))
}

fn donate(deps: DepsMut, info: MessageInfo) -> Result<Response, ContractError> {
    let payment = must_pay(&info, "uluna")?;
    // currently we assume fund is luna
    //let donation = Donation {
    //    value: payment,
    //    date: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis()
    //};
    DONATION.update(deps.storage, info.sender, |donation_opt: Option<Uint128>| -> Result<_, ContractError> {
        match donation_opt {
            Some(donation) => {
              Ok(donation+payment)
            }
            None => Ok(payment)
        }
    })?;

    Ok(Response::new().add_attribute("method", "donate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetFundraiser {} => to_binary(&query_fundraiser(deps)?),
        QueryMsg::DonationAmount { address } => to_binary(&query_donation_amount(deps, address)?)
    }
}

fn query_fundraiser(deps: Deps) -> StdResult<FundraiserResponse> {
    let fundraiser = FUNDRAISER.load(deps.storage)?;
    Ok(FundraiserResponse { 
        name: fundraiser.name,
        url: fundraiser.url,
        image_url: fundraiser.image_url,
        description: fundraiser.description,
        owner: fundraiser.owner.into_string(),
        beneficiary: fundraiser.beneficiary.into_string(),
        custodian: fundraiser.custodian.into_string(),
    })
}

fn query_donation_amount(deps: Deps, address: String) -> StdResult<DonationAmountResponse> {
    let checked_address = deps.api.addr_validate(&address)?;
    let donation_count = match DONATION.may_load(deps.storage, checked_address)? {
        Some(donation) => donation,
        None => Uint128::zero()
    };
    Ok(DonationAmountResponse {amount: donation_count})
}

// copy from the cw-util which supports from tersions above cosmos-std v1.0.0-beta3
fn must_pay(info: &MessageInfo, denom: &str) -> Result<Uint128, ContractError> {
    let coin = one_coin(info)?;
    if coin.denom != denom {
        Err(ContractError::PaymentError {})
    } else {
        Ok(coin.amount)
    }
}

// copy from the cw-util which supports from versions above cosmos-std v1.0.0-beta3
fn one_coin(info: &MessageInfo) -> Result<Coin, ContractError> {
    match info.funds.len() {
        0 => Err(ContractError::PaymentError {}),
        1 => {
            let coin = &info.funds[0];
            if coin.amount.is_zero() {
                Err(ContractError::PaymentError {})
            } else {
                Ok(coin.clone())
            }
        }
        _ => Err(ContractError::PaymentError {}),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary};

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies(&[]);

        let name = String::from("Beneficiary Name");
        let url = String::from("beneficiaryname.org");
        let image_url = String::from("https://placekitten.com/600/350");
        let description = String::from("Beneficiary description");
        let beneficiary = String::from("beneficiaryaddr");
        let custodian = String::from("custodianaddr");
        let msg = InstantiateMsg { 
            name: name.clone(),
            url: url.clone(),
            image_url: image_url.clone(),
            description: description.clone(), 
            beneficiary: beneficiary.clone(), 
            custodian: custodian.clone() 
        };
        let info = mock_info("creator", &coins(1000, "earth"));

        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetFundraiser{}).unwrap();
        let value: FundraiserResponse = from_binary(&res).unwrap();
        assert_eq!(value.name, name);
    }

    #[test]
    fn set_beneficiary() {
        let mut deps = mock_dependencies(&[]);

        let name = String::from("Beneficiary Name");
        let url = String::from("beneficiaryname.org");
        let image_url = String::from("https://placekitten.com/600/350");
        let description = String::from("Beneficiary description");
        let beneficiary = String::from("beneficiaryaddr");
        let custodian = String::from("custodianaddr");
        let msg = InstantiateMsg { 
            name: name.clone(),
            url: url.clone(),
            image_url: image_url.clone(),
            description: description.clone(), 
            beneficiary: beneficiary.clone(), 
            custodian: custodian.clone() 
        };
        let info = mock_info("creator", &coins(1000, "earth"));

        let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(0, res.messages.len());

        let new_beneficiary = String::from("newbeneficiaryaddr");
        let _res = execute(deps.as_mut(), mock_env(), info, ExecuteMsg::SetBeneficiary{ beneficiary: new_beneficiary.clone() });

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetFundraiser{}).unwrap();
        let value: FundraiserResponse = from_binary(&res).unwrap();
        assert_eq!(value.beneficiary, new_beneficiary);
    }

    #[test]
    fn donation() {
        let mut deps = mock_dependencies(&[]);

        let name = String::from("Beneficiary Name");
        let url = String::from("beneficiaryname.org");
        let image_url = String::from("https://placekitten.com/600/350");
        let description = String::from("Beneficiary description");
        let beneficiary = String::from("beneficiaryaddr");
        let custodian = String::from("custodianaddr");
        let msg = InstantiateMsg { 
            name: name.clone(),
            url: url.clone(),
            image_url: image_url.clone(),
            description: description.clone(), 
            beneficiary: beneficiary.clone(), 
            custodian: custodian.clone() 
        };
        let info = mock_info("creator", &coins(1000, "uluna"));

        let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(0, res.messages.len());

        let info2 = mock_info("creator", &coins(100, "uluna"));
        let res2 = execute(deps.as_mut(), mock_env(), info2, ExecuteMsg::Donate {}).unwrap();
        assert_eq!(0, res2.messages.len());
        
        let res = query(deps.as_ref(), mock_env(), QueryMsg::DonationAmount{ address: "creator".to_string()}).unwrap();
        let value: DonationAmountResponse = from_binary(&res).unwrap();
        assert_eq!(value.amount, Uint128::new(100));
    }
}
