const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const cors = require("cors");

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

app.use(
	cors({
		origin: "http://localhost:5173",
	})
);

app.use((req, res, next) => {
	res.append("Content-Type", "application/json");
	next();
});

async function getTodos(req, res) {
	const userID = req.params.userID;
	const todos = await query(
		"SELECT * FROM `todos` WHERE `user_id` = " + userID + ";"
	);
	res.send(JSON.stringify(todos));
	return;
}

app.get("/:userID", getTodos);
app.get("/todos/:userID", getTodos);

app.get("/todos/:userID/:todoID", async (req, res) => {
	const userID = req.params.userID;
	const todoID = req.params.todoID;
	const singleTodo = await query(
		"SELECT * FROM `todos` WHERE `user_id` = ? AND `id` = ? ;",
		[userID, todoID]
	);
	res.send(JSON.stringify(singleTodo));
	return;
});

app.post("/todos/:userID", async (req, res) => {
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
});

app.post("/register", async (req, res) => {
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
});

app.post("/login", async (req, res) => {
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
});

app.listen(8000, (error) => {
	if (error) {
		console.log(error);
	}

	console.log(`Server started at http://localhost:8000`);
});
