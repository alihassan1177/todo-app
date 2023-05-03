const BASE_URL = "http://localhost:8000";

export async function getTodos(userID) {
	const req = await fetch(`${BASE_URL}/todos/${userID}`);
	const res = await req.json();
	return res;
}

export async function getSingleTodo(userID, todoID) {
	const req = await fetch(`${BASE_URL}/todos/${userID}/${todoID}`);
	const res = await req.json();
	return res;
}

export async function login(data) {
	const isFormData = data instanceof FormData;
	let requestBody = data;
	if (!isFormData) {
		requestBody = JSON.stringify(data);
	}

	const req = await fetch(`${BASE_URL}/login`, {
		method: "POST",
		body: requestBody,
	});
	const res = await req.json();
	return res;
}

export async function register(data) {
	const isFormData = data instanceof FormData;
	let requestBody = data;
	if (!isFormData) {
		requestBody = JSON.stringify(data);
	}
	
	const req = await fetch(`${BASE_URL}/register`, {
		method: "POST",
		body: requestBody,
	});
	const res = await req.json();
	return res;
}
