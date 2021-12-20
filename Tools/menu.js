const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class StoreMenu {
	constructor(opts = {}) {
		const {
			client,
			interaction,
			productsPerPage,
			pages = [],
			products = [],
			page = 0,
			time = 120000,
			reactions = { up: '🔼', down: '🔽', back: '◀️', next: '▶️', select: '⏺️', stop: '❌' },
			customCatch = console.error,
		} = opts;

		// Assigning Values
		this.client = client;
		this.interaction = interaction;
		this.channel = interaction.channel;
		this.member = interaction.member;
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

		// The message to reply to the initial interaction with
		const message =
		(this.reactions.up ? `${this.reactions.up}: Move your selection up\n` : '') +
		(this.reactions.down ? `${this.reactions.down}: Move your selection down\n` : '') +
		(this.reactions.select ? `${this.reactions.select}: Confirm your selection\n` : '') +
		(this.reactions.back ? `${this.reactions.back}: Move a page back\n` : '') +
		(this.reactions.next ? `${this.reactions.next}: Move a page forward\n` : '') +
		(this.reactions.stop ? `${this.reactions.stop}: Close the Foof Store\n` : '\nYou can close the Foof Store by not reacting for a minute');

		// Create and Send the embed
		const storeEmbed = this.client.tools.createEmbed()
			.setTitle('Welcome to the Foof Store')
			.addField('Guide', message);
		this.interaction.reply({ embeds: [storeEmbed], ephemeral:true });


		// Send the embed
		this.channel.send({ embeds: [this.getCurrentPage()] })
			.then(msg => {
				this.msg = msg;
				this.select(page);
				this.addReactions();
				this.createCollector(this.member.id);
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
		// TODO: Improve. Wtf is even this
		const replace_nth = function(str, n) {
			// From the given string s, replace f with r of zero-based nth occurrence
			// Replace all \n with [newline]. Reason for this is because '.' in regex matches everything except [] :D
			return str.replace(/\n/g, '[newline]')
				.replace(RegExp('^(?:.*?[[]]){' + n + '}'), x => x.replace(RegExp('[[]]$'), '[✓]'))
				.replace(/\[newline\]/g, '\n');
		};
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
		const collector = this.msg.createReactionCollector({ filter: (r, u) => u.id == uid, idle: this.time });
		this.collector = collector;

		// Assign all of the collector events
		collector.on('end', () => {
			// Delete the message
			this.msg.delete().catch(this.catch);
		})
			.on('collect', r => {
			// 🔼
				if (r.emoji.name === this.reactions.up) {if (this.currentSelection > 0) this.shift(-1);}

				// 🔽
				else if (r.emoji.name === this.reactions.down) {
					const index = this.page * this.productsPerPage,
						productsOnPage = this.products.slice(index, index + this.productsPerPage).length;

					if (this.currentSelection < productsOnPage) this.shift(1);
				}

				// ◀️
				else if (r.emoji.name === this.reactions.back) {if (this.page != 0) this.select(this.page - 1);}

				// ▶️
				else if (r.emoji.name === this.reactions.next) {if (this.page < this.pages.length - 1) this.select(this.page + 1);}

				// ⏺️
				else if (r.emoji.name === this.reactions.select) {
				// Obtain the chosen Product
					const productNumber = this.page * this.productsPerPage + this.currentSelection,
						product = this.products.at(productNumber);

					if (product) {
					// Create the button collector
						this.channel.createMessageComponentCollector({

							// Filter by button name, and user id
							filter: i =>
								(i.customId === 'confirm' || i.customId === 'no') &&
							i.user.id === uid,

							// Only collect buttons
							componentType: 'BUTTON',

							// Only collect one Interaction
							max: 1,

							// Wait 15 seconds
							time: 15 * 1000,
						})

						// Assign Button Events
							.on('collect', async (i) => {
							// * The 'onPurchase' event should reply to the interaction *
								if (i.customId === 'confirm') {this.client.emit('onPurchase', i, product);}
								else {
								// Create an embed to reply to the interaction with
									const embed = this.client.tools.createEmbed()
										.addField('Purchase Cancelled', 'You have not been charged.');

									// Reply to the user.
									i.reply({ embeds: [embed], ephemeral:true });
								}

							// Confirmation embed is deleted in the 'end' event
							})
							.on('end', async (collected) => {
							// They did not confirm
								if (!collected.size) {
									const embed = this.client.tools.createEmbed()
										.addField('Purchase Cancelled', 'No confirmation given.');

									// Update the embed and remove the buttons
									this.confirmMsg.edit({ embeds:[embed], components:[] });
								}

								// Delete the message. They confirmed
								else {this.confirmMsg.delete();}
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
										.setStyle('SUCCESS'))

								.addComponents(
									new MessageButton()
										.setCustomId('no')
										.setLabel('On second thought...')
										.setStyle('DANGER'),
								);

						// Send the message to the channel
						this.channel.send({
							embeds: [embedConfirmationMessage],
							components: [row],
						}).then((msg) => this.confirmMsg = msg);
					}
				}
				// ❌
				else if (r.emoji.name == this.reactions.stop) {collector.stop();}

				// Remove the reaction so the user can use it again
				r.users.remove(uid).catch(this.catch);
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
