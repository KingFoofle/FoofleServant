const userSchema = require('./Schema/User.js');
const productSchema = require('./Schema/Product.js');

// TODO: Decide whether to use client.database.schemaName
// or client.schemas.get("schemaName")

exports.userSchema = userSchema;
exports.productSchema = productSchema;