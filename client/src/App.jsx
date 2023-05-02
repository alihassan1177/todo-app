import { useRef } from "react"
import { Route, Routes } from "react-router-dom"
import { useTodos } from "./Todo"

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/registration" element={<RegistrationComponent />} />
        <Route path="/" element={<HomeComponent />} />
      </Routes>
    </>
  )
}

function RegistrationComponent() {
  return <h1>Registration</h1>
}

function LoginComponent() {
  return <h1>Login</h1>
}

function HomeComponent() {
  const { todos, addTodo, updateTodo } = useTodos()
  const inputRef = useRef()

  function handleSubmit(e) {
    e.preventDefault()
    addTodo(inputRef.current.value)
    inputRef.current.value = ""
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo, index) => {
          todo.toggleCompleted = function () {
            updateTodo(todo.id)
          }
          return <Todo key={index} todo={todo} />
        })}
      </ul>
    </div>)
}

function Todo({ todo }) {
  return <li><span>{todo.text}</span>
    <input checked={todo.completed} onChange={todo.toggleCompleted} type="checkbox" />
  </li>
}

export default App
