import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SIgnUp'
import Login from './pages/Login'
import Transfer from './pages/Transfer'
import Receipt from './pages/Receipt'
import Dashboard from './pages/Dashboard'
import Authguard from './auth/Authguard'
import Notfound from './pages/Notfound'
import AdminDashboard from './pages/AdminDashboard'
import AllUsers from './pages/AllUsers'
import AllReceipts from './pages/AllReceipts'
import ReceiptDetails from './pages/ReceiptDetails'
import UserDetails from './pages/UserDetails'
import Withdraw from './pages/Withdraw'


const App = () => {

  return (
    <>

      <Routes>

        <Route index element={<Home></Home>}></Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Authguard />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path='transfer' element={<Transfer />} />
            <Route path='withdraw' element={<Withdraw />} />
            <Route path='receipt'>
              <Route index element={<Receipt />} />
              <Route path=':id' element={<ReceiptDetails />} />
            </Route>
            <Route path='userDetails' element={<UserDetails />} />
          </Route>
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route path='transfer' element={<Transfer />} />
            <Route path='receipt'>
              <Route index element={<Receipt />} />
              <Route path=':id' element={<ReceiptDetails />} />
            </Route>
            <Route path='allUser' element={<AllUsers />} />
            <Route path='allReceipt' element={<AllReceipts />} />
            <Route path='userDetails' element={<UserDetails />} />
          </Route>
        </Route>

        <Route path="*" element={<Notfound />} />
      </Routes >
    </>
  )
}

export default App