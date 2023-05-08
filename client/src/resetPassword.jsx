import { useState } from "react"
import Axios from "axios"
import { useNavigate } from "react-router"

function ResetPassword(){
     const [userData, setUserData]=useState({username:"",token:"",password:""})
     const axios=Axios.create({withCredentials:true})
      const navigate=useNavigate()
     const updateUserData=(event)=>{
        const name=event.target.name
        const value=event.target.value
        setUserData({...userData,[name]:value})
     }

      const updatePassword=()=>{
         axios.post("http://localhost:8000/resetPassword",userData)
         .then((response)=>{
            //redirect to login page 
            if(response.data.success)
                navigate("/login")  
            alert(response.data.message)
         })
      }
    return <div className="container-fluid row justify-content-center">
        <div className="col-sm-6 shadow-lg p-3 rounded rounded-3" style={{marginTop:"10%"}}>
     <form className='register-form ' >
     <h6 className="form-label text-start p-2 fs-3 fw-bold text-center">Reset Password</h6>
     <div className="mb-3 d-flex ">
       <label htmlFor="username" className="form-label text-start p-2">Username</label>
       <input type='text' id='username' className='form-control' name ="username" 
       value={userData.username} onChange={updateUserData} required></input>
     </div>
     <div className="mb-3 d-flex ">
       <label htmlFor="name" className="form-label text-start p-2 " style={{fontSize:"12px"}}>Token</label>
       <input type='password' id='token' className='form-control' name ="token"
       value={userData.token} onChange={updateUserData} required></input>
     </div>
     <div className="mb-3 d-flex ">
       <label htmlFor="name" className="form-label text-start p-2 " style={{fontSize:"11px"}}>New Password</label>
       <input type='password' id='password' className='form-control' name ="password"
       value={userData.password} onChange={updateUserData} required></input>
     </div>
    
      </form>
      <button type="submit" className="btn btn-success" onClick={()=>{updatePassword()}}>Reset</button>
      </div>
     
    </div>
}


export default ResetPassword