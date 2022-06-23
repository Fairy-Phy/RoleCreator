// Copyright 2022 (Fairy)Phy
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Discord = require("discord.js");
const Config = require("./config.json");

const hex_reg = /^#?([0-9a-f]{3}){1,2}$/i;
const debug = true;

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
		Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_BANS,
		Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
		Discord.Intents.FLAGS.GUILD_INVITES,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Discord.Intents.FLAGS.GUILD_PRESENCES,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
		Discord.Intents.FLAGS.GUILD_WEBHOOKS
	]
});

process.on("exit", () => {
	console.log("Exiting...");
	client.destroy();
});

process.on("SIGINT", () => {
	process.exit(0);
});

client.on('ready', async event_client => {
	event_client.user.setPresence({ activities: [{ name: "/createrole でロールを作成します！" }] });
	console.log("ready");
});

client.on("interactionCreate", async interaction => {
	//console.log(interaction);
	if (!interaction.isCommand()) return;

	try {
		if (interaction.commandName != "createrole") return;

		const message_embed = new Discord.MessageEmbed();
		message_embed.setFooter(`${client.user.username} Bot`, client.user.avatar ? client.user.avatarURL() : client.user.defaultAvatarURL);
		message_embed.setAuthor(`失敗`);
		message_embed.setColor("#FF4B00");

		if (!interaction.inGuild()) {
			message_embed.setDescription(`DMでは実行できません`);
			message_embed.setTimestamp();
			await interaction.reply({ embeds: [message_embed], ephemeral: !debug });
			return;
		}

		if (interaction.guildId !== Config.guild_id) return;

		//console.log(interaction);
		//console.log(interaction.commandName);
		const role_name = interaction.options.getString("role_name");
		const color_hex = interaction.options.getString("color_hex");
		let role_info = {
			name: role_name
		};

		if (color_hex != null) {
			if (!hex_reg.test(color_hex)) {
				message_embed.setDescription(`color_hexが正しくありません!`);
				message_embed.setTimestamp();
				await interaction.reply({ embeds: [message_embed], ephemeral: !debug });
				return;
			}

			if (color_hex.length <= 4) {
				let hex = color_hex;
				if (color_hex.startsWith("#")) hex = color_hex.replace("#", "");
				let convert_color = "";
				for (let i = 0; i < hex.length; i++)
					convert_color += hex[i].repeat(2);
				role_info.color = convert_color;
			}
			else role_info.color = color_hex;
			console.log(role_info.color);
		}

		const maked_role = await interaction.guild.roles.create(role_info);

		await interaction.member.roles.add(maked_role);

		message_embed.setAuthor(`成功`);
		message_embed.setColor(color_hex != null ? maked_role.color : "#00B06B");
		message_embed.setDescription(`追加しました!`);
		message_embed.addField("ID", maked_role.id, true);
		message_embed.addField("名前", maked_role.name, true);
		message_embed.setTimestamp();
		await interaction.reply({ embeds: [message_embed], ephemeral: !debug });
	}
	catch (error) {
		await interaction.channel.send({ content: `エラーが発生しました\n${String(error)}`, ephemeral: false });

		console.log(error);
	}
});

client.login(Config.token);
