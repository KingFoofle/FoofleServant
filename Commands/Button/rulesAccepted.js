module.exports.execute = async (client, interaction) => {
	const { giveRole } = client.tools;
	const { userSchema } = client.database;
	const { member } = interaction;
	const message = 'Thank you for confirming!\nWelcome to the server!';
	giveRole(member, 'Member');
	interaction.reply({ content: message, ephemeral: true });

	// Register the User to MongoDB
	const username = member.user.username;
	const data = { _id: member.id, username:username };
	client.logger.log(`Registering ${username} to MongoDB...`);
	const foundUser = await userSchema.findByIdAndUpdate(member.id, data, { upsert:true, setDefaultsOnInsert: true });
	if (foundUser) {
		client.logger.warn(`${username} is already registered.`);
	}

	else {
		client.logger.success(`${username} has been registered.`);
	}


};
