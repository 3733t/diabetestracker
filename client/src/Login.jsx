import { useEffect, useState } from "react"
import Axios from "axios"
import {Buffer} from 'buffer'
import { useNavigate } from "react-router"

function Login(){
    const [passwordQuestions, setPasswordQuestions]=useState([])
    const axios=Axios.create({withCredentials:true})
    const [userData,setUserData]=useState({username:"", password:"", questions:[], securityImage:""}) 
    const [imagePasswordData, setImagePasswordData]=useState([])
    const [session,setSession]=useState(null)
    const [verified, setVerified]=useState([false,false])
    const navigate=useNavigate()
    useEffect(()=>{
     
      axios.get('http://localhost:8000/verification/images')
      .then(response => {
       const copyObj=(value)=>{
        return {...value,["chosen"]:false}
       }
       const array=response.data.map(value=>copyObj(value))
      setImagePasswordData(array)
    })
     .catch(error => {
       console.error(error)
 })

 // if there's an active session fetch the questions 
    axios.get("http://localhost:8000/login/questions")
     .then(response=>{
     setPasswordQuestions(response.data)
   })

   // fetch the current session if available
   axios.get("http://localhost:8000/session")
   .then(response=>{
      setSession(response.data)
 })

   axios.get("http://localhost:8000/verified")
   .then(response=>{
    const res_verified=response.data
     setVerified(res_verified)
     if(res_verified[0]&res_verified[1]){
       navigate("/dashboard")
     }

   })
    },[])

    const updateUserData=(event)=>{
      const name=event.target.name
      const value=event.target.value
      setUserData({...userData,[name]:value})
   }

     const loginUser=()=>{
        axios.post("http://localhost:8000/login/password",userData)
        .then(response=>{
            setSession(response.data)
            // fetch the questions once the user login 
          axios.get("http://localhost:8000/login/questions")
            .then(response=>{
            setPasswordQuestions(response.data)
          })
        })
     }
     const updateQuestions=(event, index)=>{
      passwordQuestions[index].answer=event.target.value
      setPasswordQuestions(passwordQuestions)  
      setUserData({...userData,["questions"]:passwordQuestions})

    }

    console.log(passwordQuestions)
     const verifyQuestions=()=>{
         axios.post("http://localhost:8000/login/verify/questions",userData)
         .then(response=>{
           verified[0]=response.data
           setVerified(verified)
         })
     }

     const verifySecurityImage=()=>{
      axios.post("http://localhost:8000/login/verify/securityImage",{imgname:userData.securityImage})
      .then(response=>{
        verified[1]=response.data
        setVerified(verified)
      })
     }
  
    console.log(userData.securityImage)
    console.log(verified)

    const forgotPassword=()=>{
      if(!userData.username){
        alert("input username")
        return

      }
      axios.get(`http://localhost:8000/get/resetPassword/${userData.username}`)
      .then((response)=>{
       
        if(response.data.pending){
          alert("check email Password Reset Already sent!")
          return
        }
        Email.send({
          SecureToken:"9b524f25-6eda-42f8-9d70-7aec8e8d117b",
          Username : "mailerdiatr@gmail.com",
          To : `${response.data.email}`,
          From : "mailerdiatr@gmail.com",
          Subject : `New Reset Password `,
          Body : `You new password is ${response.data.token} go to  <a href="http://localhost:5173/resetpassword"> link</a> to reset`
      }).then(
        message => alert("check email password reset sent!")
      )
      })
     
    }

    const imageView=(props)=>{
      const rows = props.rows
      const columns = props.columns
      const grid = []
      for (let i = 0; (i < rows)&imagePasswordData.length>0; i++) {
        const row = []
        for (let j = 0; j < columns; j++) {
          const index=i*columns+j
          const imgBuffer=imagePasswordData[index]
          const imageData = Buffer.from(imgBuffer.data, 'binary')
          const dataURL = 'data:image/png;base64,' + imageData.toString('base64')
          row.push(<td key={`images ${i*columns+j}`} onClick={()=>{
            setUserData({...userData,["securityImage"]:imagePasswordData[index].name})
           }}> {<img className={`border  ${imgBuffer.name===userData.securityImage?"border-success":""} border-3`} 
            width="50px" height="50px" src={dataURL}></img>}</td>)
        }
        grid.push(<tr key={i}>{row}</tr>)
      }
    
      return grid
     }

     console.log(session)
   return  <div className='row justify-content-center'>
     <div className="col-sm-5 shadow-lg p-5 m-1 ">
    <h3 className="text-center text-success">Login</h3>
    <ul className="nav nav-tabs m-2" id="myTab">

        <li className="nav-item ">
            <a href="#passwordForm1" className={`nav-link  ${session?"disabled ":"enabled text-success"} `} data-bs-toggle="tab">Password 1</a>
        </li>
        <li className="nav-item">
            <a href="#passwordForm2" className={`nav-link  ${(session?true:false)&!verified[0]?"enabled active text-success":"disabled"}`} data-bs-toggle="tab">Password 2</a>
        </li>
        <li className="nav-item">
            <a href="#passwordForm3" className={`nav-link ${(session?true:false&!verified[1])?"enabled text-success":"disabled"}` }data-bs-toggle="tab">Password 3</a>
        </li>
    </ul>
    <div className="tab-content">
    <div className={`tab-pane fade show  ${session?"":"active"} `} id="passwordForm1">
     <form className='register-form'>
     <div className="mb-3 d-flex ">
       <label htmlFor="username" className="form-label text-start p-2">Username</label>
       <input type='text' id='username' className='form-control' name ="username" 
       value={userData.username} onChange={updateUserData} required></input>
     </div>
     <div className="mb-3 d-flex ">
       <label htmlFor="name" className="form-label text-start p-2 " style={{fontSize:"12px"}}>Password</label>
       <input type='password' id='password1' className='form-control' name ="password"
       value={userData.password} onChange={updateUserData} required></input>
     </div>
     <div className="d-flex justify-content-between">
     <button type="submit" className="btn btn-success" onClick={()=>{loginUser()}}>Login</button>
     <a className="nav-link align-self-end  text-success" onClick={()=>{forgotPassword() } } style={{cursor:"pointer"}}>Click here to reset password</a>
    
     </div>
   
      </form>
     
      </div>

      <div className={`tab-pane fade show  ${(session?true:false)&!verified[0]?"active":""} `} id="passwordForm2">
        <form className='register-form'>
           <div className='  d-flex flex-column'>
           <div className="scrollview border-top mt-2">
              
              {
                passwordQuestions.map((value,index)=>{
                  return <div height={"50px"} key={index} className="mb-1 dropdown-item" >
                   <p style={{fontSize:"12px"}} className="form-label text-start p-1">{`${index}) ${value.question}`}</p>
                  <input type='text' id='name' className='form-control' name="questions" onChange={(event)=>{updateQuestions(event,index)}}></input>
                </div>
                })
              }
       </div>
           <div >
           <button type="submit" className="btn btn-success" onClick={()=>{verifyQuestions()}} >Next</button>
           </div>
        
           </div>
        </form>
      </div>
      <div className={`tab-pane fade show ${(session?true:false)&verified[0]?"active":""} `} id="passwordForm3">
      <p>Pick security password</p>
          <form className='register-form border rounded'>
           
          <div className="scrollview">
           <table class="table table-sm  ">
             <tbody>
              {
                imageView({rows:9,columns:9})
              }
             </tbody>
             </table>
             </div>
             <button type="submit" className="btn btn-success"  onClick={verifySecurityImage}>Login</button>
          </form>
         
          </div>

        </div>
     </div>
     </div>

}

export default Login