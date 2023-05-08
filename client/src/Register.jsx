import { useEffect, useRef, useState } from "react"
import Axios from "axios"
import {Buffer} from 'buffer'
import Prompt from "./Prompt"
import { useNavigate } from "react-router"
function Register(){
    const detailsRef=useRef()
    
    const [passwordQuestions, setPasswordQuestions]=useState([])
    const axios=Axios.create({withCredentials:true})
    const [userData,setUserData]=useState({username:"",name:"", email:"",phone:"", DOB:"", password:"", questions:[], securityImage:""}) 
    const [imagePasswordData, setImagePasswordData]=useState([])
    const [showPrompt,setShowPrompt]=useState(false)
    const [currentTab,setCurrentTab]=useState(1)
    const navigate=useNavigate()
    useEffect(()=>{
      const array=[]
      array.push({question:'What is the name of a college you applied to but didn’t attend?',
                  answer:''})
      array.push({question:'What was the name of the first school you remember attending?',
                  answer:''})  
      array.push({question:'Where was the destination of your most memorable school field trip?',
                  answer:''})   
      setPasswordQuestions(array)       

      axios.get('http://localhost:8000/verification/images')
       .then(response => {
        const copyObj=(value)=>{
         return {...value,["chosen"]:false}
        }
        const array=response.data.map(value=>copyObj(value))
       setImagePasswordData(array)
  })
  .catch(error => {
    console.error(error);
  })
    },[])
  
    const submit=()=>{
    
       axios.post("http://localhost:8000/register",userData)
       .then((res)=>{
          console.log(res.data)
          navigate("/login")
       }).catch(error=>console.log(error))
    }

    const nextTab=(index)=>{
       setCurrentTab(index) 
    }

    const updateUserData=(event)=>{
          const name=event.target.name
          const value=event.target.value
          setUserData({...userData,[name]:value})
    }
   
    const updateQuestions=(event, index)=>{
      passwordQuestions[index].answer=event.target.value
      setPasswordQuestions(passwordQuestions)  
      const questions=passwordQuestions.filter((value)=> value.answer!="")
      setUserData({...userData,["questions"]:questions})
    }

   
    const createQuestion=(question)=>{
      if(question==="") return 
      passwordQuestions.push({question:question,answer:''})
      setPasswordQuestions(passwordQuestions)
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
   
    return <div className="container-fluid">
      {
        showPrompt?(<Prompt title={"Create Question?"} callback={(value)=>{
          createQuestion(value)
          setShowPrompt(!showPrompt)
        }
       }/>):<></>
      }
           
    <div className='row justify-content-center '>

        <div className="col-sm-5 shadow-lg p-5 m-1">
    <h3 className="text-center">Register With Us Today</h3>
    <ul className="nav nav-tabs m-2" id="myTab">
        <li className="nav-item">
            <a  href="#personalDetails" className={`nav-link active ${currentTab>=1?"enabled":"disabled"}`} data-bs-toggle="tab">Personal Details</a>
        </li>
        <li className="nav-item">
            <a  href="#passwordForm1" className={`nav-link ${currentTab>=2?"enabled":"disabled"}`} data-bs-toggle="tab">Password 1</a>
        </li>
        <li className="nav-item">
            <a  href="#passwordForm2" className={`nav-link ${currentTab>=3?"enabled":"disabled"}`} data-bs-toggle="tab">Password 2</a>
        </li>
        <li className="nav-item">
            <a  href="#passwordForm3" className={`nav-link ${currentTab>=4?"enabled":"disabled"}` }data-bs-toggle="tab">Password 3</a>
        </li>
    </ul>
    
    <div className="tab-content">
    <div className="tab-pane fade show active" id="personalDetails">
    <form ref={detailsRef} className='register-form'>
     
       <div className="mb-3 d-flex ">
       <label htmlFor="username" className="form-label text-start p-2">Username</label>
       <input type='text' id='username' className='form-control' name ="username" 
       value={userData.username} onChange={updateUserData} required></input>
     </div>
      <div className="mb-3 d-flex ">
       <label htmlFor="name" className="form-label text-start p-2">Name</label>
       <input type='text' id='name' className='form-control' name="name"
        value={userData.name} onChange={updateUserData}  required></input>
     </div>
     <div className="mb-3 d-flex  ">
       <label htmlFor="email" className="form-label text-start p-2">Email</label>
       <input type='email' id='email' className='form-control' name="email"
       value={userData.email} onChange={updateUserData}  required></input>
     </div>
     <div className="mb-3 d-flex  ">
       <label htmlFor="phone" className="form-label text-start p-2">Phone</label>
       <input type='phone' id='phone' className='form-control' name="phone" 
       value={userData.phone} onChange={updateUserData}  required></input>
     </div>
     <div className="mb-3 d-flex  ">
       <label htmlFor="date" className="form-label text-start p-2">D.O.B</label>
       <input type='date' id='date' className='form-control' name="DOB"
        value={userData.DOB} onChange={updateUserData}  required></input>
     </div>
     </form> 
     <div  className="row justify-content-between">
     <button  className="btn btn-success col-2" onClick={()=>{  nextTab(2) }} >Next</button>
     <a  href="/login" className="nav-link col-8 align-self-end text-success" onClick={submit}>Already have an account? click to Login</a>
     </div>
    
     </div>

     <div className="tab-pane fade show " id="passwordForm1">
     <form  className='register-form'>
     <div className="mb-3 d-flex ">
       <label htmlFor="name" className="form-label text-start p-2 " style={{fontSize:"12px"}}>Enter Password</label>
       <input type='password' id='password1' className='form-control' name="password" 
       value={userData.password} onChange={updateUserData}  required></input>
     </div>
     <div className="mb-3 d-flex ">
       <label htmlFor="name" className="form-label text-start p-2 " style={{fontSize:"12px"}}>Confirm Password</label>
       <input type='password' id='password1confirm' className='form-control' required></input>
     </div>
      </form>
      <button type="submit" className="btn btn-success" onClick={()=>{nextTab(3)}}>Next</button>
      </div>

      <div className="tab-pane fade show " id="passwordForm2">
      <p>Pick at least 3 questions and provide answers as password, leave blank to ignore field</p>
           <div className="row justify-content-between">
           <button  className="btn btn-success col-sm-4"  onClick={()=>{setShowPrompt(!showPrompt)}}>Create Question</button>
           <button  className="btn btn-success col-sm-4" onClick={()=>{nextTab(4)}}>Next</button>
           </div>
        <form className='register-form'>
           <div className='mb-3 d-flex flex-column'>
           
           
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
      </div>
        </form>
      </div>
      <div className="tab-pane fade show " id="passwordForm3">
      <p>choose a single image as a security password</p>
          <form className='register-form border rounded '>
           <div className="scrollview">
           <table class="table table-sm  ">
             <tbody>
              {
                imageView({rows:9,columns:9})
              }
             </tbody>
             </table>
             </div>
             <button type="submit" className="btn btn-success m-2" onClick={submit}>Submit</button>
          </form>
         
          </div>
    </div>
</div>

</div>
</div> 
}


export default Register