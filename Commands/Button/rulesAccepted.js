module.exports.execute = async (client, interaction) => {
	const { giveRole } = client.tools,
		{ userSchema: userDB } = client.database,
		{ logger } = client,
		{ member } = interaction,
		{ username } = member.user;

	// Give the Member role to whoever triggered the interaction
	giveRole({ member:member, roleName:'Member' });
	interaction.reply({ content: 'Thank you for confirming!\nWelcome to the server!', ephemeral: true });

	// Register the User to MongoDB
	logger.log(`Registering ${username} to MongoDB...`);
	const data = { _id: member.id, username:username },
		foundUser = await userDB.findByIdAndUpdate(member.id, data, { upsert:true, setDefaultsOnInsert: true });

	if (foundUser) {
		logger.warn(`${username} is already registered.`);
	}

	else {
		logger.success(`${username} has been registered.`);
	}


};
