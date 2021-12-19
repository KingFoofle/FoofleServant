module.exports.execute = async (client, interaction) => {
	const { giveRole } = client.tools,
		{ userSchema } = client.database,
		{ logger } = client,
		{ member } = interaction,
		{ username } = member.user;

	// Give the Member role to whoever triggered the interaction
	giveRole({ member:member, roleName:'Member' });

	// Register the User to MongoDB
	logger.log(`Registering ${username} to MongoDB...`);
	const newUser = new userSchema({
		_id: member.id,
		username: username,
		inventory: [],
	});

	newUser.save()
		.then(() => {
			logger.success(`${username} has been registered.`);
			interaction.reply({ content: 'Thank you for confirming!\nWelcome to the server!', ephemeral: true });
		})
		.catch((err) => {
			logger.error(err);
			interaction.reply({ content:'Something wrong happened. \nSuggestion: You don\'t need to accept the rules again, friend', ephemeral:true });
		});
};
