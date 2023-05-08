import { useRef } from "react"



function Prompt({title,callback}){

    const nameRef=useRef()
     return <div className="prompt-container">
            <div className="prompt">
               <div className="d-flex flex-column ">
                  <div className="row justify-content-center">
                    <form className="col-sm-3  bg-white rounded d-block shadow-lg p-3 border border-3" style={{marginTop:"10%"}}>
                    <label htmlFor="name" className="form-label text-start p-2 fs-3 fw-bold">{title}</label>
                    <input ref={nameRef} type='text' id='name' className='form-control bg-white' name="name" placeholder="question"></input>
                    <div className="m-3"></div>
                    <div className="d-flex  justify-content-between ">
                    <button className="btn btn-primary m-1" height="30px" onClick={()=>{callback("")}}>Cancel</button>
                    <button  className="btn btn-primary m-1" height="30px" onClick={()=>{callback(nameRef.current.value)}}>Okay</button>
                    </div>
                    
                    </form>
                  </div>
               </div>
            </div>
     </div>
}


export default Prompt