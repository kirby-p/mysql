// Require packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// Connect to MySQL - localhost
var connection = mysql.createConnection({
	host:'localhost',
    port: 3306,
    user:'root',
    password:'',
    database: 'Bamazon'
});

// Welcome text when program first starts
console.log("");
console.log("Welcome to the Manager View.");

// Will run program as long as there are no errors
connection.connect(function(err) {
    if (err) throw err;
    managerView();
});

var managerView = function(){	
	inquirer.prompt({
		name: "manageChoice",
		type: "list",
		message: "What would you like to do today?",
		choices: [
			"View Products For Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product"]
	}).then(function(answer){
		switch(answer.manageChoice){
			case "View Products For Sale":
				viewProducts();
				break;
			case "View Low Inventory":
				lowInventory();
				break;
			case "Add to Inventory":
				addInventory();
				break;
			case "Add New Product":
				addProduct();
				break;
		}
	})
}

var viewProducts = function(){
	console.log("You chose to view products for sale");
	managerView();
};
var lowInventory = function(){
	console.log("You chose to view low inventory");
	managerView();
}
var addInventory = function(){
	console.log("You chose to add inventory");
	managerView();
}
var addProduct = function(){
	console.log("You chose to add a new product");
	managerView();
}