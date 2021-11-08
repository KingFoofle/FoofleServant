function giveRole(interaction, roleID) {
	interaction.member.roles.add(roleID);
}

module.exports = {
	giveRole: giveRole,
};
