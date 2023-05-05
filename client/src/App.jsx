import { useRef, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { useTodos } from "./Todo";
import { login, register } from "./Api.js";
import { useUser } from "./User.jsx"

function App() {
  const {user} = useUser()
  return (
    <>
      <Routes>
        {
          !user && 
        <>          
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegistrationComponent />} />
        </>
        }
        <Route path="/" element={<HomeComponent />} />
      
      </Routes>
    </>
  );
}

async function handleFormSubmit(e, data, endpoint) {
  e.preventDefault();

  const {saveUserInfo} = useUser()

  const navigate = useNavigate()
  switch (endpoint) {
    case "/register":
      const registerStatus = await register(data);
      if(registerStatus?.status){
        navigate("/login")
      }else{
        console.log("Something went wrong")
      }
      break;
    case "/login":
      const loginStatus = await login(data);
      if(loginStatus?.status){
        navigate("/")
        saveUserInfo(loginStatus.user)
      }else{
        console.log("User Credentials not Matched")
      }
      break;
    default:
      console.log("No endpoint Provided");
      break;
  }
}

function RegistrationComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const data = { name, email, password };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={(e) => handleFormSubmit(e, data, "/register")}>
        <label>Name</label>
        <input onChange={(e) => setName(e.target.value)} type="text" />
        <label>Email</label>
        <input onChange={(e) => setEmail(e.target.value)} type="email" />
        <label>Password</label>
        <input onChange={(e) => setPassword(e.target.value)} type="password" />
        <button>Sign Up</button>
      </form>
      <Link to="/login">Already have an Account</Link>
    </div>
  );
}

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const data = { email, password };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => handleFormSubmit(e, data, "/login")}>
        <label>Email</label>
        <input onChange={(e) => setEmail(e.target.value)} type="email" />
        <label>Password</label>
        <input onChange={(e) => setPassword(e.target.value)} type="password" />
        <button>Sign In</button>
      </form>
      <Link to="/register">Create an Account</Link>
    </div>
  );
}

function HomeComponent() {
  const { todos, addTodo, updateTodo } = useTodos();
  const inputRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    addTodo(inputRef.current.value);
    inputRef.current.value = "";
  }

  return (
    <div>
      <Link
        to="/register"
      >
        Save your todos Online
      </Link>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text" />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo, index) => {
          todo.toggleCompleted = function () {
            updateTodo(todo.id);
          };
          return <Todo key={index} todo={todo} />;
        })}
      </ul>
    </div>
  );
}

function Todo({ todo }) {
  return (
    <li>
      <span>{todo.text}</span>
      <input
        checked={todo.completed}
        onChange={todo.toggleCompleted}
        type="checkbox"
      />
    </li>
  );
}

export default App;
