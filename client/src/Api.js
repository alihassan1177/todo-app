const BASE_URL = "http://localhost:8000"

export async function getTodos(userID){
	const response = await fetch(`${BASE_URL}/todos/${userID}`)
	const data = await response.json()
	return data
}

export async function getSingleTodo(userID, todoID){
	const response = await fetch(`${BASE_URL}/todos/${userID}/${todoID}`)
	const data = await response.json()
	return data
}

export async function login(data){
	const response = await fetch(`${BASE_URL}/login`, {
		method : "POST",
		body : data
	})
	const data = await response.json()
	return data
}

export async function register(data){
	const response = await fetch(`${BASE_URL}/register`, {
		method : "POST",
		body : data
	})
	const data = await response.json()
	return data
}