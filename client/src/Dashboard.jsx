import { useEffect, useState } from "react"
import DiabetesPrompt from "./DiabetesData"
import Axios from "axios"

function Dashboard(){

    const [showPrompt,setShowPrompt]=useState(false)
    const [data,setData]=useState([])
    const [session,setSession]=useState(undefined)
    const axios=Axios.create({withCredentials:true})
    const tableListItems=(value,index)=>{

       
        return <tr>
            <td>{index+1}</td>
            <td>{value.date}</td>
            <td>{value.bslb}</td>
            <td>{value.bm}</td>
            <td>{value.lm}</td>
            <td>{value.dm}</td>
            <td>{value.bsld}</td>
        </tr>
    }
   
    useEffect(()=>{

        axios.get('http://localhost:8000/get/diabetes/record')
        .then(response=>{
            if(response.data){
                setData(response.data)
              
            }
        })
        
        axios.get('http://localhost:8000/session')
        .then(response=>{
            setSession(response.data)
        })
    },[])
   
    const uploadForm=(formData)=>{
        axios.post('http://localhost:8000/insert/diabetes/record',formData)
        .then(response=>{
            if(response.data){
               data.push(formData)
               setData(data)
            }
        })
    }

    const logout=()=>{
        axios.get('http://localhost:8000/logout')
        .then(response=>{
            setSession(undefined)
        })
    }
   return <><div className="container-fluid">

      {
        showPrompt?(<DiabetesPrompt  callback={(value)=>{
            if(value)
             uploadForm(value)
          setShowPrompt(!showPrompt)
        }
       }/>):<></>
      }
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <a href="#" className="navbar-brand">
                <img src="/logo.png" height="28" alt="CoolBrand"></img>
            </a>
            <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse text-success" id="navbarCollapse">
                <div className="navbar-nav">
                    <a href="#" className="nav-item  text-success nav-link active">Home</a>
                    <a onClick={()=>{setShowPrompt(true)}} className={`nav-item nav-link ${session?"enabled":"disabled"}`} style={{cursor:"pointer"}}> Add Data</a>
                    <a href="/security" className={`nav-item nav-link ${session?"enabled":"disabled"}`}>Update Details</a>
                </div>
                <div className="navbar-nav ms-auto">
                    <a href="/login" className={`nav-item nav-link text-danger ${session?"enabled":"disabled"}`} onClick={()=>{logout()}}>Log Out</a>
                </div>
            </div>
        </div>
    </nav>

    <div className="container-fluid">
       <table className="table table-sm text-center text-success table-striped d-history">
       <thead>
        <tr>
            <th className="border">#</th>
            <th className="border">DATE</th>
            <th className="border">BLOOD SUGAR LEVEL IN AM</th>
            <th className="border">BREAKFAST MENU</th>
            <th className="border">LUNCH MENU</th>
            <th className="border">DINNER MENU</th>
            <th className="border">BLOOD SUGAR LEVEL IN AM</th>
            
        </tr>
        </thead>
        <tbody>
             {
                data.map((value,index)=>{
                  return tableListItems(value,index)
                })
             }
        </tbody>
    
          </table>
    </div>
   </div>
   </>
}

export default Dashboard