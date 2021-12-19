// * This File is to be ran when an update to the store is made

const Product = require('./Database/Schema/Product.js');
const fs = require('fs');
const mongoose = require('mongoose');

// Importing this allows you to access the environment variables of the running node process
require('dotenv').config();

async function update() {
	console.log('Connecting to Mongoose...');
	await mongoose.connect(process.env.MONGO_URI);
	console.log('Connected to Mongoose!');
	console.log('======================\nUpdating Products...');

	for (const product of products) {
		// Update, or create a new product
		await Product.findByIdAndUpdate(product._id, product, { upsert:true });

		// Create the file if it does not exist
		// ! The execute() method that should be ran when the user purchases
		// ! the product should go in that file
		fs.appendFile(`./Commands/Product/${product._id}.js`,
			'module.exports.execute = async (client, interaction, product) => {\nconst {member} = interaction\n}',
			function(err) {if (err) throw err;});
	}

	console.log(`Updated ${products.length} products`);
	setTimeout(() => process.exit(), 5000);
}

/**
 * Generate a Product for each color in the parameter
 * @param {String[]} colors
 * @returns {Product[]}
 */
function generateColorProducts(colors) {
	const toReturn = [];
	colors.forEach(color => toReturn.push(
		new Product({
			_id: `${color}Nickname`,
			description: `Give your nickname a vibrant ${color} color!`,
			price: 1000,
		}),
	));

	return toReturn;
}

const colors = ['red', 'blue', 'green', 'purple'];

// * Products * //
const products = [


].concat(generateColorProducts(colors));

update();

