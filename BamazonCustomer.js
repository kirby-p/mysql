var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host:'localhost',
    port: 3306,
    user:'root',
    password:'',
    database: 'Bamazon'
});

console.log("");
console.log("Welcome!  Our store has the supplies you need to start your own Ghostbusters franchise.");

connection.connect(function(err) {
    if (err) throw err;
    storeInventory();
});

var storeInventory = function() {
// var query = "SELECT ItemID, ProductName, Price FROM Products";
	connection.query("SELECT * FROM Products", function(err, res){
		console.log("");
		console.log("Here\'s what we have in stock:");
		console.log("*******************************");
		if(err) throw err;
		for(var i = 0; i < res.length; i++){
			console.log("Item ID: " + res[i].ItemID);
			console.log("Product: " + res[i].ProductName);
			console.log("Price: \$" + res[i].Price);
			console.log("*******************************");
		}
		if(i = res.length){
			idInput();
		}
	})
};

var idInput = function(){	
	inquirer.prompt([{
		name: "idInput",
		type: "input",
		message: "Please input the ID number of the product you would like to purchase"
		// validate: function(answer){
		// 	if(answer.idInput !== res[0].ItemID){
		// 		console.log("nope");
		// 	}
		// }
	}, {
		name: "quantity",
		type: "input",
		message: "How many would you like?"
	}]).then(function(answer){
		connection.query('SELECT * FROM Products WHERE ?', {ItemID: answer.idInput}, function(err, res){
				console.log("You requested " + answer.quantity + " " + res[0].ProductName + "s.");
		})
	})
};