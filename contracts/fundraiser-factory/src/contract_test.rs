#![cfg(test)]

use cosmwasm_std::{DepsMut, attr, SubMsg, ReplyOn, WasmMsg, to_binary};
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use crate::msg::ExecuteMsg::CreateFundraiser;
use crate::msg::InstantiateMsg;
use crate::state::FundraiserFactoryContract;

fn setup_contract(deps: DepsMut) -> FundraiserFactoryContract<'static> {
    let contract = FundraiserFactoryContract::default();
    let fundraiser_code_id = 1 as u64;
    let msg = InstantiateMsg {
        fundraiser_code_id
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
fn create_fundraiser() {
    let mut deps = mock_dependencies(&[]);

    let contract = setup_contract(deps.as_mut());

    let info = mock_info("creator", &[]);
    let name = String::from("Beneficiary Name");
    let url = String::from("beneficiaryname.org");
    let image_url = String::from("https://placekitten.com/600/350");
    let description = String::from("Beneficiary description");
    let beneficiary = String::from("beneficiaryaddr");

    let msg = CreateFundraiser {
        name: name.clone(),
        url: url.clone(),
        image_url: image_url.clone(),
        description: description.clone(),
        beneficiary: beneficiary.clone(),
    };

    let res = contract.execute(deps.as_mut(), mock_env(), info, msg).unwrap();

    assert_eq!(
        res.attributes,
        vec![
            attr("action", "create_fundraiser"),
            attr("name", name.clone())
        ]
    );
    assert_eq!(
        res.messages,
        vec![SubMsg {
            id: 1,
            gas_limit: None,
            reply_on: ReplyOn::Success,
            msg: WasmMsg::Instantiate {
                msg: to_binary(&fundraiser::msg::InstantiateMsg {
                    name: name.clone(),
                    url: url.clone(),
                    image_url: image_url.clone(),
                    description: description.clone(),
                    beneficiary: beneficiary.clone(),
                    custodian: "creator".to_string()
                }).unwrap(),
                code_id: 1,
                funds: vec![],
                label: "".to_string(),
                admin: None
            }.into()
        }]
    )
}
