const mysql = require("mysql2/promise");


async function getConnection() {
	try {
		const connection = await mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "todo_app",
		});
		return connection;
	} catch (e) {
		console.log(e);
	}
}

async function query(query, values = []) {
	try {
		const conn = await getConnection();
		const [rows] = await conn.execute(query, values);
		await conn.end();
		return rows;
	} catch (error) {
		console.log(error);
	}
}

async function getTodos(req, res) {
	const userID = req.params.userID;
	const todos = await query(
		"SELECT * FROM `todos` WHERE `user_id` = " + userID + ";"
	);
	res.send(JSON.stringify(todos));
	return;
}

async function getSingleTodo(req, res) {
	const userID = req.params.userID;
	const todoID = req.params.todoID;
	const singleTodo = await query(
		"SELECT * FROM `todos` WHERE `user_id` = ? AND `id` = ? ;",
		[userID, todoID]
	);
	res.send(JSON.stringify(singleTodo));
	return;
}

async function getTodosByUserID(req, res) {
	const userID = req.params.userID;
	const parts = [];
	req.on("data", (chunk) => {
		parts.push(chunk.toString());
	});

	req.on("end", async () => {
		const requestBody = JSON.parse(parts.join(""));
		const newTodo = await query(
			"INSERT INTO `todos`(`text`, `completed`, `user_id`) VALUES (?, ?, ?)",
			[requestBody.text, requestBody.completed, userID]
		);
		res.send(JSON.stringify(newTodo));
		return;
	});
}

async function registerUser (req, res) {
	const parts = [];
	req.on("data", (chunk) => {
		parts.push(chunk.toString());
	});

	req.on("end", async () => {
		const requestBody = JSON.parse(parts.join(""));
		const newUser = await query(
			"INSERT INTO `users`(`name`, `email`, `password`) VALUES (?, ?, ?);",
			[requestBody.name, requestBody.email, requestBody.password]
		);
		res.send(
			JSON.stringify({
				message: "New User Created Successfully",
				status: true,
			})
		);
		return;
	});
}

async function loginUser(req, res) {
	const parts = [];
	req.on("data", (chunk) => {
		parts.push(chunk.toString());
	});

	req.on("end", async () => {
		const requestBody = JSON.parse(parts.join(""));
		const loginUser = await query(
			"SELECT * FROM `users` WHERE `email` = ? AND `password` = ?",
			[requestBody.email, requestBody.password]
		);
		if (loginUser.length > 0) {
			delete loginUser[0].password
			res.send(
				JSON.stringify({
					message: "Login Successfull",
					status: true,
					user: loginUser[0],
				})
			);
			return;
		}
		res.send(JSON.stringify({ message: "User Credentials not Matched" }));
		return;
	});
}


module.exports = {
    loginUser,
    registerUser,
    getConnection,
    getSingleTodo,
    getTodos,
    getTodosByUserID,
    query
}