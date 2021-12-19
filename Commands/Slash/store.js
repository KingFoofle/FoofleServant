const { SlashCommandBuilder } = require('@discordjs/builders'),
	StoreMenu = require('../../Tools/menu.js'),
	PRODUCTS_PER_PAGE = 2;

exports.data = new SlashCommandBuilder()
	.setName('store')
	.setDescription('Opens the Interactive Store');


exports.execute = async (client, interaction) => {
	const { productSchema: storeDB } = client.database,

		// Grab all the Products, sorted by the filter
		products = await storeDB.find({}).sort({ _id:1 }),

		// The Store Pages
		pages = [],

		// How many pages there should be
		pageCount = Math.ceil(products.length / PRODUCTS_PER_PAGE);


	// Build the pages
	for (let i = 0; i < pageCount; i++) {
		// Grab 10 items from products
		const index = i * PRODUCTS_PER_PAGE,
			productSlice = products.slice(index, index + PRODUCTS_PER_PAGE);

		let productNames = '', productPrices = '';

		// Build the names and prices
		for (const product of productSlice) {
			productNames = productNames.concat(`[] - *${product._id}*\n`);
			productPrices = productPrices.concat(`${product.price}\n`);
		}

		const page = client.tools.createEmbed()
			.setTitle('The Foof Store')
			.addField('Name', productNames, true)
			.addField('Price', productPrices, true)
			.setFooter(`Page ${i + 1} of ${pageCount}`);

		pages.push(page);
	}

	new StoreMenu({

		// The client
		client: client,

		// The Channel to send the Store Embed to
		interaction: interaction,

		// The Store Pages
		pages: pages,

		// What Products are in store
		products: products,

		// How much idle time is allowed before the Embed stops listening to reactions
		time: 60 * 1000,

		// Our logger
		customCatch: client.logger.error,

		// How many products per page are there
		productsPerPage: PRODUCTS_PER_PAGE,
	});
};