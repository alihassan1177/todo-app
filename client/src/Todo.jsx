import { createContext, useState, useContext } from "react";

const Context = createContext()

export function useTodos() {
    return useContext(Context)
}

export default function TodoContext({ children }) {

    const [todos, setTodos] = useState([])

    function addTodo(value) {
        const todo = {
            text: value,
            completed: false,
            id: Date.now()
        }
        setTodos(() => [...todos, todo])
    }

    function updateTodo(id) {
        console.log(id)
        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i];
            if (todo.id == id) {
                todo.completed = !todo.completed
                setTodos(() => [...todos])
                console.log(todos)
                return
            }
        }
    }

    return <Context.Provider value={{ todos, setTodos, addTodo, updateTodo }}>
        {children}
    </Context.Provider>
}
