const { MessageActionRow, MessageButton } = require('discord.js');

// TODO: Improve. Wtf is even this
// Replace all \n with [newline]. Reason for this is because '.' in regex matches everything except [] :D
const replace_nth = function(str, n) {
	// From the given string s, replace f with r of zero-based nth occurrence
	return str.replace(/\n/g, '[newline]')
		.replace(RegExp('^(?:.*?[[]]){' + n + '}'), x => x.replace(RegExp('[[]]$'), '[✓]'))
		.replace(/\[newline\]/g, '\n');
};

module.exports = class StoreMenu {

	constructor(opts = {}) {
		const {
			interaction,
			client,
			member,
			reactions = { up: '🔼', down: '🔽', back: '◀️', next: '▶️', select: '⏺️' },
			pages = [],
			page = 0,
			time = 120000,
			customCatch = console.error,
			products = [],
			productsPerPage,
		} = opts;

		this.client = client;
		this.interaction = interaction;
		this.channel = interaction.channel;
		this.member = member;
		this.productsPerPage = productsPerPage;

		// The array of Embeds
		this.pages = pages;

		// The Reactions to use
		this.reactions = reactions;

		// Idle time
		this.time = time;

		// Starting Page Number
		this.page = page;

		// The products
		this.products = products;

		// Zero-Based index of what choice the user has made
		this.currentSelection = 0;

		// How errors should be handled
		this.catch = customCatch;


		// Send the embed
		this.channel.send({ embeds: [this.getCurrentPage()] }).then(msg => {
			this.msg = msg;
			this.select(page);
			this.addReactions();
			this.createCollector(member.id);
		}).catch(customCatch);
	}

	select(pg = 0) {
		// Set the current page to pg
		this.page = pg;

		// Checkmark the first product by default
		this.currentSelection = 0;
		this.shift(0);
	}

	// Shift the [] or [✓] num spaces up or down
	shift(num) {
		this.currentSelection += num;

		// Grab the current page
		const currentPage = this.getCurrentPage(),

			// Replace the nth [] with [✓]
			value = replace_nth(
				// Remove All Checkmarks with [] before calling the function
				currentPage.fields[0].value.replace(/\[✓\]/g, '[]'),
				this.currentSelection + 1);

		// Update the Products (fields[0]) section
		currentPage.fields[0].value = value;

		// Update the embed
		this.msg.edit({ embeds: [currentPage] }).catch(this.catch);
	}

	getCurrentPage() {
		return this.pages[this.page];
	}

	createCollector(uid) {
		// Create the reaction collector
		const collector = this.msg.createReactionCollector({ filter: (r, u) => u.id == uid, time: this.time });
		this.collector = collector;

		// Assign all of the collector events
		collector.on('collect', r => {
			// 🔼
			if (r.emoji.name === this.reactions.up) {
				if (this.currentSelection > 0) this.shift(-1);
			}

			// 🔽
			else if (r.emoji.name === this.reactions.down) {
				const index = this.page * this.productsPerPage,
					productsOnPage = this.products.slice(index, index + this.productsPerPage).length;

				if (this.currentSelection < productsOnPage) this.shift(1);
			}

			// ◀️
			else if (r.emoji.name === this.reactions.back) {
				if (this.page != 0) this.select(this.page - 1);
			}

			// ▶️
			else if (r.emoji.name === this.reactions.next) {
				if (this.page < this.pages.length - 1) this.select(this.page + 1);
			}

			// ⏺️
			else if (r.emoji.name === this.reactions.select) {
				// Obtain the chosen Product
				const productNumber = this.page * this.productsPerPage + this.currentSelection,
					product = this.products.at(productNumber);
				if (product) {
					// Create the button collector
					this.channel.createMessageComponentCollector({

						// Filter by button name, and user id
						filter: i => i.customId === 'confirm' && i.user.id === uid,

						// Only collect buttons
						componentType: 'BUTTON',

						// Only collect one Interaction
						max: 1,

						// Wait 15 seconds
						time: 15 * 1000,
					})

					// Assign Button Events
						.on('collect', (i) => {
							this.client.emit('onPurchase', i, product);
						})
						.on('end', (collected) => {
							// They did not confirm
							if (!collected.size) {this.channel.send(`<@${uid}>: No confirmation given.`);}
						});

					// Create the Confirmation Embed
					const embedConfirmationMessage = this.client.tools.createEmbed()
							.setTitle('Confirmation')
							.addField(`Would you like to purchase: *${product._id}*?`,
								`__Name__: _${product._id}_\n` +
								`__Price__: ${product.price}\n` +
								`__Description__: _${product.description}_`,
							),

						// Create the Message Button
						row = new MessageActionRow()
							.addComponents(
								new MessageButton()
									.setCustomId('confirm')
									.setLabel('Yes. I would like to buy it')
									.setStyle('SUCCESS'),
							);

					// Send the message to the channel
					this.channel.send({
						embeds: [embedConfirmationMessage],
						components: [row],
					});
				}
			}
			// ❌
			else if (r.emoji.name == this.reactions.stop) {collector.stop();}

			// Remove the reaction so the user can use it again
			r.users.remove(uid).catch(this.catch);
		})
			.on('end', () => {
				// Remove all of the reactions
				this.msg.reactions.removeAll().catch(this.catch);
			});
	}
	async addReactions() {
		try {
			if (this.reactions.up) await this.msg.react(this.reactions.up);
			if (this.reactions.down) await this.msg.react(this.reactions.down);
			if (this.reactions.select) await this.msg.react(this.reactions.select);
			if (this.reactions.back) await this.msg.react(this.reactions.back);
			if (this.reactions.next) await this.msg.react(this.reactions.next);
			if (this.reactions.stop) await this.msg.react(this.reactions.stop);
		}
		catch (e) {this.catch(e);}
	}
};
