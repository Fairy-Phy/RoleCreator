const fs = require("fs/promises");
const request = require("request-promise");
const Config = require("./config.json");

if (Config.action_id) {
	console.log("既に追加されています。");
	process.exit();
}

const register = {
	name: "createrole",
	description: "ロールを追加します",
	options: [
		/*{
			type: 3,
			name: "regist_type",
			description: "どの形式で登録するかを指定します",
			required: true,
			choices: [
				{
					name: "プレイヤー(参加者)",
					value: "Player"
				},
				{
					name: "スペクテイター(観戦者)",
					value: "Spectator"
				}
			],
		},*/
		{
			type: 3,
			name: "role_name",
			description: "ロール名",
			required: true
		},
		{
			type: 3,
			name: "color_hex",
			description: "ロールの色(Hex)(任意)",
			required: false
		},
	]
};

// サーバー用
const api_url = `https://discord.com/api/v8/applications/${Config.bot_id}/guilds/${Config.guild_id}/commands`;
// 全体用
//const api_url = `https://discord.com/api/v8/applications/${Config.bot_id}/commands`;

/*

CommandIDの保存を忘れずに！！！！！！！

*/


(async () => {
	const response = await request(api_url, {
		method: "POST",
		body: JSON.stringify(register),
		headers: {
			"Authorization": 'Bot ' + Config.token,
			"Content-Type": "application/json"
		}
	});
	const res_json = JSON.parse(response);
	console.log(response);

	Config.action_id = res_json.id;
	await fs.writeFile("./config.json", JSON.stringify(Config, null, "    "), { encoding: "utf-8", flag: "w" });
})();
