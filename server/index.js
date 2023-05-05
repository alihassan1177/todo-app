const express = require("express");
const app = express();
const cors = require("cors");
const {getSingleTodo, getTodos, getTodosByUserID, registerUser, loginUser} = require("./methods.js")

app.use(
	cors({
		origin: "http://localhost:5173",
	})
);

app.use((req, res, next) => {
	res.append("Content-Type", "application/json");
	next();
});

app.get("/:userID", getTodos);
app.get("/todos/:userID", getTodos);
app.get("/todos/:userID/:todoID", getSingleTodo);
app.post("/todos/:userID", getTodosByUserID);
app.post("/register", registerUser);
app.post("/login", loginUser);

app.listen(8000, (error) => {
	if (error) {
		console.log(error);
	}

	console.log(`Server started at http://localhost:8000`);
});
