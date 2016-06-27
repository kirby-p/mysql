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
console.log("Welcome!  Our store has the supplies you need to start your own Ghostbusters franchise.");

// Will run program as long as there are no errors
connection.connect(function(err) {
    if (err) throw err;
    storeInventory();
});

// storeInventory function will display all items and prices
var storeInventory = function() {
	connection.query("SELECT * FROM Products", function(err, res){
		console.log("");
		console.log("Here\'s what we have in stock:");
		console.log("*******************************");
		if(err) throw err;
		// Displays all products listed in database
		for(var i = 0; i < res.length; i++){
			console.log("Item ID: " + res[i].ItemID);
			console.log("Product: " + res[i].ProductName);
			console.log("Price: \$" + res[i].Price);
			console.log("*******************************");
		}
		// Call idInput function once program finishes listing all products
		if(i = res.length){
			idInput();
		}
	})
};

// Asks user the item # and the quantity of what they would like to purchase.
var idInput = function(){	
	inquirer.prompt([{
		name: "idInput",
		type: "input",
		message: "Please input the ID number of the product you would like to purchase"
	}, {
		name: "quantity",
		type: "input",
		message: "How many would you like?"
	}]).then(function(answer){
		// Checks database for product that matches ID number 
		connection.query('SELECT * FROM Products WHERE ?', {ItemID: answer.idInput}, function(err, res){
				var reqAmount = answer.quantity;
				var stock = res[0].StockQuantity;
				var prod = res[0].ProductName;

				// Checks to see if requested amount is less than what is in stock, then will complete order
				if(reqAmount <= stock){
					console.log("Thank you for your order.");
					console.log("Order Summary: " + reqAmount + "x " + prod);
					console.log("Total: " + "$" + (res[0].Price * reqAmount));
					connection.query("UPDATE Products SET ? WHERE ?", 
						[{StockQuantity: (stock - reqAmount)},{ProductName: prod}], function(err,res){});

					// Calls shopAgain function
					shopAgain();
				}

				// If customer asks for quantity more than what is available, order will not continue
				// and will ask if user would like to continue shopping																																																																																																																																						// 
				else{
					console.log("Insufficient quantity.");
					shopAgain();		
				}
		})
	})
};

// Asks user if they would like to continue shopping or to exit the program
var shopAgain = function() {
	inquirer.prompt({
		name: "continue",
		type: "confirm",
		message: "Would you like to continue shopping?"
	}).then(function(response){
		if(response.continue == true){
			storeInventory();
		}
		else if(response.continue == false){
			console.log("Thank you for shopping with us!")
			process.exit();
		}
	})
}