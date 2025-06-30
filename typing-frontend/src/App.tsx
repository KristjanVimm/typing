import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import NavigationBar from './components/NavigationBar'
import NotFound from './pages/NotFound'
import Typing from './pages/typing/Typing'
import { useContext } from 'react'
import { AuthContext } from './store/AuthContext'
import AdminHome from './pages/admin/AdminHome'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Persons from './pages/auth/Persons'
import EditPreference from './pages/EditPreference'
import LessonTextChoice from './pages/typing/LessonTextChoice'
import BookChoice from './pages/typing/BookChoice'
import CustomTextChoice from './pages/typing/CustomTextChoice'
import PrevLessons from './pages/typing/PrevLessons'

function App() {

  const {loggedIn, role, loading} = useContext(AuthContext);

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      <NavigationBar />

      <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/' element={<Typing />}/>
          <Route path='/prev-lessons' element={<PrevLessons />}/>
          <Route path='/lesson-text' element={<LessonTextChoice />}>
            <Route path='/lesson-text' element={<BookChoice />}/>
            <Route path='/lesson-text/custom-text' element={<CustomTextChoice />}/>
          </Route>

          {loggedIn == true && 
          <>
            <Route path='preference' element={<EditPreference />}/>
          </>}
          
          {loggedIn === true && (role === "ADMIN" || role === "SUPERADMIN") ?
          <>
            <Route path='/admin' element={<AdminHome />}/>
            {/* <Route path='/admin/categories' element={<ManageCategories />}/>
            <Route path='/admin/add-category' element={<AddCategory />}/>
            <Route path='/admin/products' element={<ManageProducts />}/>
            <Route path='/admin/add-product' element={<AddProduct />}/> */}
          </> :
          <Route path="/admin/*" element={<Navigate to="/login"/>}/>
          }

          {loggedIn === true && role === "SUPERADMIN" ?
          <>
            <Route path='/superadmin/persons' element={<Persons />}/>
          </> :
          <Route path="/superadmin/*" element={<Navigate to="/login"/>}/>
          }
          <Route path='*' element={<NotFound />}/>
        </Routes>
    </>
  )
}

export default App
