import { createContext, useState, useContext } from "react";

const Context = createContext()

export function useTodos() {
    return useContext(Context)
}

export default function TodoContext({ children }) {

    const TODOS_KEY = "todos"
    const [todos, setTodos] = useState(JSON.parse(localStorage.getItem(TODOS_KEY)) || [])

    function addTodo(value) {
        const todo = {
            text: value,
            completed: false,
            id: Date.now()
        }
        const newTodos = JSON.parse(JSON.stringify(todos))
        newTodos.push(todo)
        localStorage.setItem(TODOS_KEY, JSON.stringify(newTodos))
        setTodos(() => newTodos)
    }

    function updateTodo(id) {
        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i];
            if (todo.id == id) {
                todo.completed = !todo.completed
                setTodos(() => [...todos])
                return
            }
        }
    }

    return <Context.Provider value={{ todos, setTodos, addTodo, updateTodo }}>
        {children}
    </Context.Provider>
}
