#![cfg(test)]
use cosmwasm_std::{BankMsg, CosmosMsg};
use cosmwasm_std::{DepsMut, Coin, Uint128, from_binary, coins};
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};

use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, FundraiserResponse, DonationAmountResponse};
use crate::state::{FundraiserContract};

fn setup_contract(deps: DepsMut) -> FundraiserContract<'static> {
    let contract = FundraiserContract::default();
    let name = String::from("Beneficiary Name");
    let url = String::from("beneficiaryname.org");
    let image_url = String::from("https://placekitten.com/600/350");
    let description = String::from("Beneficiary description");
    let beneficiary = String::from("beneficiaryaddr");
    let custodian = String::from("creator");

    let msg = InstantiateMsg {
        name: name.clone(),
        url: url.clone(),
        image_url: image_url.clone(),
        description: description.clone(),
        beneficiary: beneficiary.clone(),
        custodian: custodian.clone()
    };

    let info = mock_info("creator", &[]);

    let res = contract.instantiate(deps, mock_env(), info, msg).unwrap();

    assert_eq!(0, res.messages.len());
    contract
}

#[test]
fn proper_initialization() {
    let mut deps = mock_dependencies(&[]);
    setup_contract(deps.as_mut());
}

#[test]
fn set_beneficiary() {
    let mut deps = mock_dependencies(&[]);

    let contract = setup_contract(deps.as_mut());

    let info = mock_info("creator", &[]);
    let new_beneficiary = String::from("newbeneficiaryaddr");
    let _res = contract.execute(deps.as_mut(), mock_env(), info, ExecuteMsg::SetBeneficiary{ beneficiary: new_beneficiary.clone() });

    let res = contract.query(deps.as_ref(), mock_env(), QueryMsg::GetFundraiser{}).unwrap();
    let value: FundraiserResponse = from_binary(&res).unwrap();
    assert_eq!(new_beneficiary, value.beneficiary);
}

#[test]
fn donation() {
    let mut deps = mock_dependencies(&[]);

    let contract = setup_contract(deps.as_mut());

    let info = mock_info("creator", &coins(100, "uluna"));
    let res = contract.execute(deps.as_mut(), mock_env(), info, ExecuteMsg::Donate {}).unwrap();
    assert_eq!(0, res.messages.len());

    let res = contract.query(deps.as_ref(), mock_env(), QueryMsg::DonationAmount{ address: "creator".to_string()}).unwrap();
    let value: DonationAmountResponse = from_binary(&res).unwrap();
    assert_eq!(Uint128::new(100), value.amount);
}


#[test]
fn withdraw() {
    let mut deps = mock_dependencies(&[]);

    let contract = setup_contract(deps.as_mut());

    let info = mock_info("creator", &coins(100, "uluna"));
    let res = contract.execute(deps.as_mut(), mock_env(), info.clone(), ExecuteMsg::Donate {}).unwrap();
    assert_eq!(0, res.messages.len());

    let res = contract.query(deps.as_ref(), mock_env(), QueryMsg::DonationAmount{ address: "creator".to_string()}).unwrap();
    let value: DonationAmountResponse = from_binary(&res).unwrap();
    assert_eq!(Uint128::new(100), value.amount);

    let res = contract.execute(deps.as_mut(), mock_env(), info.clone(), ExecuteMsg::Withdraw {}).unwrap();
    assert_eq!(1, res.messages.len());
}
