const { task } = require("@iboss/terrain");
const {saveConfig} = require("@iboss/terrain/lib/config");

task(async ({ wallets, refs, config, client }) => {
    const fundraiser_id = refs.fundraiser.codeId;
    const new_config = config();
    new_config.instantiation.instantiateMsg.fundraiser_code_id=parseInt(fundraiser_id);
    saveConfig(["_global", "_base"], new_config, "config.terrain.json");
});
