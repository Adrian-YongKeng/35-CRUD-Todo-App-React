import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import useLocalStorage from 'use-local-storage'
import { TodoContext } from './contexts/TodoContext';
import { BrowserRouter, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import AddTodo from './pages/AddTodo';
import ErrorPage from './pages/ErrorPage';
import EditTodo from './pages/EditTodo';
import { AuthContext } from './contexts/AuthContext';
import { UserContext } from './contexts/UserContext';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import { useContext } from 'react';

function Layout () {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const users = useContext(UserContext).users;

  function logout(){
    authContext.setToken(null);
    navigate("/");
  }

  return (
    <>
      <Navbar bg="light" variant='light'>
        <Container>
          <Navbar.Brand href='/'>Todos</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href='/add'>Add Todo</Nav.Link>
          </Nav>
          Welcome {users} !
          <Button className="ms-5" variant="danger" onClick={logout}>
            Logout
          </Button>
        </Container>
      </Navbar>
      <Outlet/>
    </>
  )
}

function App() {
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [users, setUsers] = useLocalStorage("users", null);
  const [token, setToken] = useLocalStorage("token", null);

  return (
    <AuthContext.Provider value={{token, setToken}}>
      <UserContext.Provider value={{users, setUsers}}>
        <TodoContext.Provider value={{todos, setTodos}}>
          <BrowserRouter>
            <Routes>
              <Route path='login' element={<Login/>}/>
              <Route path='/' element={<Layout/>}>
                <Route index element={
                  <RequireAuth>
                    <Home/>
                  </RequireAuth>
                  }
                />
                <Route path='add'
                 element={
                    <RequireAuth>
                      <AddTodo/>
                    </RequireAuth>
                  }
                />
                <Route path='*' element={<ErrorPage/>}/>
                <Route path="todo/:id" 
                  element={
                    <RequireAuth>
                      <EditTodo/>
                    </RequireAuth>
                    }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </TodoContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
