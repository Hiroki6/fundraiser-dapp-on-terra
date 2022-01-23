use cosmwasm_std::{DepsMut, Env, MessageInfo, Reply, Response, StdError, SubMsg, to_binary, WasmMsg};
use cw2::set_contract_version;
use protobuf::Message;
use crate::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg};
use crate::response::MsgInstantiateContractResponse;
use crate::state::{Config, FundraiserFactoryContract};

const CONTRACT_NAME: &str = "fundraiser factory";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

impl<'a> FundraiserFactoryContract<'a> {
    pub fn instantiate(
        &self,
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        msg: InstantiateMsg,
    ) -> Result<Response, ContractError> {
        let config = Config {
            owner: deps.api.addr_validate(info.sender.as_str())?,
            fundraiser_code_id: msg.fundraiser_code_id
        };
        set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

        self.config.save(deps.storage, &config)?;

        Ok(Response::new())
    }

    pub fn execute(
        &self,
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        msg: ExecuteMsg,
    ) -> Result<Response, ContractError> {
        match msg {
            ExecuteMsg::CreateFundraiser {
                name,
                url,
                image_url,
                description,
                beneficiary,
                custodian
            } => self.create_fundraiser(
                deps,
                info,
                name,
                url,
                image_url,
                description,
                beneficiary,
                custodian
            ),
        }
    }

    pub fn reply(
        &self,
        deps: DepsMut,
        _env: Env,
        msg: Reply
    ) -> Result<Response, ContractError> {
        match msg.id {
            1 => self.handle_instantiate_fundraiser(deps, msg),
            id => Err(ContractError::InvalidReplyId(id)),
        }
    }
}

impl<'a> FundraiserFactoryContract<'a> {
    fn create_fundraiser(
        &self,
        deps: DepsMut,
        _info: MessageInfo,
        name: String,
        url: String,
        image_url: String,
        description: String,
        beneficiary: String,
        custodian: String
    ) -> Result<Response, ContractError> {
        let config = self.config.load(deps.storage)?;

        let fundraiser_instantiate_msg = fundraiser::msg::InstantiateMsg {
            name: name.clone(),
            url,
            image_url,
            description,
            beneficiary,
            custodian
        };

        Ok(Response::new()
            .add_attribute("action", "create_fundraiser")
            .add_attribute("name", name.clone())
            .add_submessages(vec![SubMsg::reply_on_success(
                WasmMsg::Instantiate {
                    code_id: config.fundraiser_code_id,
                    funds: vec![],
                    admin: None,
                    label: "".to_string(),
                    msg: to_binary(&fundraiser_instantiate_msg)?
                },
                1
            )])
        )
    }

    fn handle_instantiate_fundraiser(
        &self,
        deps: DepsMut,
        msg: Reply
    ) -> Result<Response, ContractError> {
        let res: MsgInstantiateContractResponse = Message::parse_from_bytes(
            msg.result.unwrap().data.unwrap().as_slice(),
            )
            .map_err(|_| {
                ContractError::Std(StdError::parse_err(
                    "MsgInstantiateContractReponse",
                    "failed to parse data",
                ))
            })?;

        let contract_addr = deps.api.addr_validate(&res.contract_address)?;

        self.fundraisers.update(deps.storage, |mut addrs| -> Result<_, ContractError> {
            addrs.push(contract_addr);
            Ok(addrs)
        })?;

        Ok(Response::new())
    }
}
