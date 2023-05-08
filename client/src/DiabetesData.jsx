import { useState } from "react"

function DiabetesPrompt({callback}){
    const [data, setData]=useState({date:"",bslb:"",bm:"",lm:"",dm:"",bsld:""})
     const updateData=(event)=>{
         const name=event.target.name
         const value=event.target.value
         setData({...data,[name]:value})
     }
     return <div className="prompt-container">
            <div className="prompt">
               <div className="d-flex flex-column ">
                  <div className="row justify-content-center">
                    <form className="col-sm-8  bg-white rounded d-block shadow-lg p-3 border border-3 text-center" style={{marginTop:"5%"}}>
                    <label  className="form-label text-start p-2 fs-3 fw-bold text-success"  >Add Data </label>
                    <div className="mb-3 d-flex ">
                        <label htmlFor="date" className="form-label text-start p-2" style={{width:"150px"}} >Date</label>
                           <input type='date' id='date' className='form-control' value={data.date} onChange={updateData}  name="date"></input>
                        </div>
                        
                        <div className="mb-3 d-flex ">
                        <label htmlFor="bslb" className="form-label text-start p-2" style={{width:"150px"}} >Bood Sugar Level</label>
                           <input type='text' id='bslb' className='form-control' value={data.bslb} onChange={updateData}  name="bslb"></input>
                        </div>
                        <div className="mb-3 d-flex ">
                        <label htmlFor="bm" className="form-label text-start p-2" style={{width:"150px"}} >Breakfast Menu</label>
                           <input type='text' id='bm' className='form-control' value={data.bm} onChange={updateData}  name="bm"></input>
                        </div>

                        <div className="mb-3 d-flex ">
                        <label htmlFor="lm" className="form-label text-start p-2" style={{width:"150px"}} >Lunch Menu</label>
                           <input type='text' id='lm' className='form-control' value={data.lm} onChange={updateData}  name="lm"></input>
                        </div>

                        <div className="mb-3 d-flex ">
                        <label htmlFor="dm" className="form-label text-start p-2" style={{width:"150px"}} >Dinner Menu</label>
                           <input type='text' id='dm' className='form-control' value={data.dm} onChange={updateData}  name="dm"></input>
                        </div>

                        <div className="mb-3 d-flex ">
                        <label htmlFor="bsld" className="form-label text-start p-2" style={{width:"150px"}} >Blood Sugar Level</label>
                           <input type='text' id='bsld' className='form-control' value={data.bsld} onChange={updateData} name="bsld"></input>
                        </div>
                    <div className="m-3"></div>
                    <div className="d-flex  justify-content-between ">
                    <button className="btn btn-success m-1" height="30px" onClick={()=>{callback(undefined)}}>Cancel</button>
                    <button  className="btn btn-success m-1" height="30px" onClick={()=>{callback({...data})}}>Okay</button>
                    </div>
                    
                    </form>
                  </div>
               </div>
            </div>
     </div>
}


export default DiabetesPrompt