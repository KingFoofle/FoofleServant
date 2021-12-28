/**
 * The different types of Commands
 */
exports.commandTypes = {
	SLASH: 'Slash',
	COMMAND: 'Command',
	BUTTON: 'Button',
	VOICE: 'Voice',
	PRODUCT: 'Product',
};

/**
 * All flairable unicode emojis
 */
exports.emojiToRoleName = {
	'🎉': 'Events',
	'🧏': 'Podcasts',
	'🏆': 'Tournaments',
};

/**
 * All flairable custom emojis
 */
exports.customEmojiIdToRoleName = {
	// None
};

exports.colors = ['red', 'blue', 'green', 'purple', 'cyan'];

/**
 * The command types that Users can use
 */
exports.acceptedCommandTypes = [this.commandTypes.COMMAND, this.commandTypes.VOICE];