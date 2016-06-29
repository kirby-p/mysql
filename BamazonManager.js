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
	connection.query("SELECT * FROM Products", function(err, res){
		console.log("");
		console.log("*******************************");
		if(err) throw err;
		// Displays all products listed in database
		for(var i = 0; i < res.length; i++){
			console.log("Item ID: " + res[i].ItemID);
			console.log("Product: " + res[i].ProductName);
			console.log("Price: \$" + res[i].Price);
			console.log("Quantity: " + res[i].StockQuantity);
			console.log("*******************************");
		}
		// Call idInput function once program finishes listing all products
		if(i = res.length){
			managerView();
		}
	})

};

var lowInventory = function(){
	console.log("You chose to view low inventory");
	connection.query("SELECT * FROM Products", function(err, res){
		console.log("");
		console.log("*******************************");
		if(err) throw err;
		// Displays all products listed in database
		for(var i = 0; i < res.length; i++){
			if(res[i].StockQuantity < 5){
				console.log("Item ID: " + res[i].ItemID);
				console.log("Product: " + res[i].ProductName);
				console.log("Price: \$" + res[i].Price);
				console.log("Quantity: " + res[i].StockQuantity);
				console.log("*******************************");
			}
		}
		// Call idInput function once program finishes listing all products
		if(i = res.length){
			managerView();
		}
	})
}

var addInventory = function(){
	console.log("You chose to add inventory");
	inquirer.prompt([{
		name: "productID",
		type: "input",
		message: "Enter the product ID of the product you would like to add"
	}, {
		name: "quantity",
		type: "input",
		message: "Enter the amount you would like to add"
	}]).then(function(answer){
		connection.query("SELECT * FROM Products WHERE ?", {ItemID: answer.productID}, function(err, res){
			var stock = Number(res[0].StockQuantity);
			var reqAmount = Number(answer.quantity);
			var product = res[0].ProductName;
			var newQuantity = stock + reqAmount;

			connection.query("UPDATE Products SET ? WHERE ?",[{StockQuantity: (stock + reqAmount)},{ItemID: answer.productID}],function(err,res){
				console.log("You have added: " + answer.quantity + "x " + product + ".");
			});
				console.log("*******************************");
				console.log("Item ID: " + res[0].ItemID);
				console.log("Product: " + product);
				console.log("Price: \$" + res[0].Price);
				console.log("New Quantity: " + newQuantity);
				console.log("*******************************");
			managerView();
		});
	})
}

var addProduct = function(){
	console.log("You chose to add a new product");
	inquirer.prompt([{
		name: "newProductID",
		type: "input",
		message: "Enter a new product ID"
	}, {
		name: "newProductName",
		type: "input",
		message: "Enter the new product name"
	}, {
		name: "newDepartment",
		type: "input",
		message: "Enter the new product's department"
	}, {
		name: "newPrice",
		type: "input",
		message: "Enter the new product's price"
	}, {
		name: "newProdQuantity",
		type: "input",
		message: "Enter how many you would like to add"
	}]).then(function(answer){
		connection.query("INSERT INTO Products SET ?", {
				ItemID: answer.newProductID, 
				ProductName: answer.newProductName,
				DepartmentName: answer.newDepartment,
				Price: answer.newPrice,
				StockQuantity: answer.newProdQuantity
				}, function(err, res){
					console.log(res);
				// console.log("*******************************");
				// console.log("Item ID: " + res[0].ItemID);
				// console.log("Product: " + product);
				// console.log("Price: \$" + res[0].Price);
				// console.log("New Quantity: " + newQuantity);
				// console.log("*******************************");
			managerView();
		});
	})
}