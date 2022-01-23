use crate::error::ContractError;
use cosmwasm_std::{MessageInfo, Coin, Uint128};

// copy from the cw-util which supports from tersions above cosmos-std v1.0.0-beta3
pub fn must_pay(info: &MessageInfo, denom: &str) -> Result<Uint128, ContractError> {
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
