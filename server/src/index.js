const express=require("express")
const cookieParser=require("cookie-parser")
const session=require("express-session")
const cors=require("cors")
const crypto = require('crypto')
const fs=require("fs")
const path = require('path')
const app=express()
const PORT=8000
app.use(cors({origin:"http://localhost:5173", credentials:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const lifeTime=60*60*1000*24
app.use(cookieParser())
app.use(session(
     {
       secret:"AASJDHEYBaklshuAHDDYRLSNDHBBah123jqhqWOPjaDHD",
       resave:false,
       saveUninitialized:false,
       cookie:{maxAge:lifeTime,secure:false},
  
 }))


const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./data/database.sqlite',(err) => {
    if (err) {
      console.error(`Error opening database file: ${err.message}`)
    } else {
      console.log(`Database opened`)

     // Create a new table named "users"
      db.run(`CREATE TABLE IF NOT EXISTS users (
              username TEXT PRIMARY KEY,
              name TEXT,
              email TEXT,
              phone TEXT,
              DOB TEXT,
              password Text
            )`, (err) => {
            if (err) {
                console.error(`Error creating table: ${err.message}`)
             } else {
                console.log(`Table "users" created successfully`)
    }
  })


  db.run(` CREATE TABLE IF NOT EXISTS imgd (
            name TEXT,
            data BLOB
  )`,(err)=>{
    if (err) {
        console.error(`Error creating table: ${err.message}`)
     } else {
        console.log(`Table "imgd" created successfully`)
  }})


  db.run(`CREATE TABLE IF NOT EXISTS userq (
          question TEXT,
          answer TEXT,
          username TEXT
  )`,(err)=>{
    if (err) {
      console.error(`Error creating table: ${err.message}`)
   } else {
      console.log(`Table "userq" created successfully`)
}
})

db.run(`CREATE TABLE IF NOT EXISTS seqimg (
         username TEXT PRIMARY KEY,
         imgname TEXT
      )`,(err)=>{
     if (err) {
      console.error(`Error creating table: ${err.message}`)
      } else {
      console.log(`Table "seqimg" created successfully`)
      }
})

db.run(`CREATE TABLE IF NOT EXISTS patientsrecord (
         username TEXT ,
         date TEXT,
         bslb TEXT,
         bm   TEXT,
         lm   TEXT,
         dm   TEXT,
         bsld TEXT
      )`,(err)=>{
     if (err) {
      console.error(`Error creating table: ${err.message}`)
      } else {
      console.log(`Table "patientsrecord" created successfully`)
      }
})

db.run(`CREATE TABLE IF NOT EXISTS resetPassword(
        username TEXT PRIMARY KEY,
        token TEXT
   )`, (err)=>{
     if (err) {
      console.error(`Error creating table: ${err.message}`)
      } else {
      console.log(`Table "resetPassword" created successfully`)
    }
})
   /* fs.readdir("./verificationImages",(err,files)=>{
        if(err){
            console.log(` an error occured ${err}`)
            return
        }
        var entry=path.join(path.join( __dirname,".."),"verificationImages")
         const data=files.map(value=> path.join(entry,value))
       
         async function uploadData(){
            try {
            
                for (const image of data) {
                  
                  // Read the image file into a buffer
                  const buffer =  fs.readFileSync(image)
                  
                  // Prepare the SQL statement with a placeholder for the blob data
                  const stmt = db.prepare('INSERT INTO imgd (name, data) VALUES (?, ?)')
            
                  // Execute the statement with the image name and buffer as parameters
                  await stmt.run(image, buffer)
            
                  console.log(`Inserted row with ID ${stmt.lastID}`)
                }
            
              
              } catch (err) {
                console.error(err.message)
              }
         }

         uploadData()
            
        
    })*/


}
 })

//generates a random token used for password reset
 function generateToken(length) {
  return crypto.randomBytes(length).toString('hex')
}

app.get("/",(req,res)=>{
    // console.log(req.session)
    res.send(req.session.userid)
})

const insertToUsers=(userData, res)=>{
  const query1=`INSERT INTO users (username,name,email,phone,DOB,password)
                 SELECT ?, ?, ?, ?, ?, ?
                  WHERE NOT EXISTS(SELECT * FROM users WHERE username = ?)
    `
    db.run(query1,[userData.username,userData.name,userData.email,
        userData.phone,userData.DOB,userData.password,userData.username],function(err){
        if(err){
            console.log(`Error creating user ${err.message}`)
            return
        }
        if(this.changes===0){
            res.status(202).send("user Already created!")
        }else{
            Promise.all([insertToseqimg(userData),insertTouserq(userData)]).then((value)=>{
              res.status(200).send("user created successfully")
            })
        }
     })
}

const insertToseqimg= async (userData)=>{
  return new Promise((resolve, reject)=>{
    const sql = `INSERT INTO seqimg (username, imgname) VALUES (?, ?)`;
    db.run(sql, [userData.username, userData.securityImage], function(err) {
      if (err) {
        console.error(err.message)
         reject(err.message)
      }else
         resolve(this.lastID)
   //  console.log(`A row has been inserted with rowid ${this.lastID}`)
    })
  })
 
}


const insertTouserq= async (userData)=>{
 return new Promise((resolve,reject)=>{
 
  const query = `INSERT INTO userq (question, answer,username) VALUES (?,?,?)`
  const sql = `DELETE FROM userq WHERE username = ?`
  // delete previous data of the associate username 
  db.run(sql, [userData.username], function(err) {
    if (err) {
       console.error(err.message)
       reject(err.message)
    }else{
      console.log(`Rows deleted: ${this.changes}`)
      // insert new elements in the user question table
      userData.questions.forEach(element => {
        db.run(query, [element.question,element.answer,userData.username], function(err) {
          if (err) {
             console.error(err.message)
          }
          //console.log(`Rows inserted: ${this.changes}`)
        })
      })
      resolve(userData.questions.length)
    }
 })
 })
}

// update queries
const updateUserData = (userData, req,res) => {
  const username=req.session.user.username

  if(!username){
    res.send("session not available")
    return
  
  }
  const query = `
    UPDATE users 
    SET name = ?, email = ?, phone = ?, DOB = ?, password = ? 
    WHERE username = ?
  `
  db.run(query, [
    userData.name,userData.email,userData.phone,userData.DOB,userData.password,username
  ], function(err) {
    if (err) {
      console.log(`Error updating user ${err.message}`)
      return
    }
    if (this.changes === 0) {
      res.status(404).send("User not found")
    } else {
      Promise.all([updateSeqImg(userData,req), updateUserq(userData,req)])
        .then((value) => {
          res.status(200).send("User updated successfully")
        })
    }
  })
}

const updateSeqImg = async (userData,req) => {
  const username=req.session.user.username
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE seqimg 
      SET imgname = ? 
      WHERE username = ?
    `
    db.run(query, [userData.securityImage, username], function(err) {
      if (err) {
        console.error(err.message)
        reject(err.message)
      } else {
        resolve(this.changes)
        // console.log(`A row has been updated with rowid ${this.lastID}`);
      }
    })
  })
}

const updateUserq = async (userData,req) => {
  const username=req.session.user.username
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO userq (question, answer, username) VALUES (?, ?, ?)`
    const deleteQuery = `DELETE FROM userq WHERE username = ?`

    db.run(deleteQuery, [username], function(err) {
      if (err) {
        console.error(err.message)
        reject(err.message)
      } else {
        console.log(`Rows deleted: ${this.changes}`)
        userData.questions.forEach((element) => {
          db.run(query, [element.question, element.answer, username], function(err) {
            if (err) {
              console.error(err.message)
            }
            //console.log(`Rows inserted: ${this.changes}`)
          })
        })
        resolve(userData.questions.length)
      }
    })
  })
}


app.post("/login/password",(req,res)=>{
     const user=req.body
     const query="SELECT * FROM users WHERE username=? AND password=?"
     db.all(query,[user.username,user.password],function(err,row){
        if(err){
          console.log(err.message,"Wrong password or username ")
          return
        }

        if(row.length>0){
          req.session.userid=user.username
          req.session.user=row[0]
          req.session.save()
          res.send(req.session.user)
        //  console.log(req.session.userid,"Logged In")
        }
     })
})

app.get("/session",(req,res)=>{
 // console.log(req.session.user)
   res.send(req.session.user)
})


// checks if all verification steps have been completed 
const verified=()=>{
  return req.session?.user?.vq&req.session?.user?.vi
}

//returns the questions and image verification steps flags
app.get("/verified",(req, res)=>{
    res.send([req.session?.user?.vq?true:false,
      req.session?.user?.vi?true:false])
})

// verifies the user questions 
app.post("/login/verify/questions",(req,res)=>{
     const user=req.body
     const query=`SELECT * FROM userq WHERE username= ?`
     db.all(query,[req.session.user.username],(err,row)=>{
            if(err){
              console.log(`Error fetching questions for user ${username}`)
              return
            }
            // filters out any value that is not equal to the corresponding row value
          if(user.questions.length===row.length){
            const count=row.filter((value,index)=>user.questions[index]===value)
            req.session.user.vq=count==0
            req.session.save()
            res.status(200).send(count==0)
          }
           
     } )
})

// verifies the security images 
app.post("/login/verify/securityImage",(req,res)=>{
  const imgname=req.body.imgname
  const query=`SELECT * FROM seqimg WHERE username=? AND imgname=?`
  db.all(query,[req.session.user.username, imgname],(err,row)=>{
    if(err){
      console.log(`Error fetching questions for user ${username}`)
      return
    }
    req.session.user.vi=row.length!=0
    req.session.save()
    res.status(200).send(row.length!=0)  
} )

})

// fetchs the login qeustion 
app.get("/login/questions",(req, res)=>{
   const username=req.session.userid
   const query=`SELECT username, question FROM userq WHERE username= ?`
   db.all(query,[username],(err,row)=>{
          if(err){
            console.log(`Error fetching questions for user ${username}`)
            return
          }
          res.status(200).send(row)
         
   } )
})

// resets the user password credentials 
app.post("/resetPassword",(req,res)=>{
    const token=req.body.token
    const username=req.body.username
    const newPassword=req.body.password
    console.log(username)
    const deleteTokenQuery = `DELETE FROM resetPassword WHERE username=? AND token=?`

db.run(deleteTokenQuery, [username,token], function(err){
  if (err) {
    console.error(`Error deleting row: ${err.message}`)
    res.send({message:"Invalid Token or Username",success:false})
  } else {
    const numRowsAffected = this.changes
    console.log(this.changes)
    if (numRowsAffected > 0) {
      console.log(`Row deleted successfully`)
      const updateSql = `UPDATE users SET password = ? WHERE username = ?`
      db.run(updateSql, [newPassword, username], function(err){
        if (err) {
          console.error(`Error updating password: ${err.message}`)
        } else {
          const numRowsAffected = this.changes
          console.log(`Password updated for ${username}. Rows affected: ${numRowsAffected}`)
          res.send({message:"success password updated!",success:numRowsAffected>0})
        }
      })
    } else {
      console.log(`No rows deleted`)
      res.send({message:"Invalid Token or Username",success:false})
    }
  }
})
})

// reset the users password 
app.get("/get/resetPassword/:username",(req,res)=>{
  const username = req.params.username

  const fetchEmailQuery = `SELECT email FROM users WHERE username = ?`
  
  db.get(fetchEmailQuery, [username], (err, row) => {
    if (err) {
      console.error(`Error selecting email: ${err.message}`)
    } else if (!row) {
      console.error(`No user found with username ${username}`)
    } else {
      const email = row.email;
      const token = generateToken(16)
  
      const insertTokenQuery = `INSERT INTO resetPassword (username, token)
                   VALUES (?, ?)`
      
      db.run(insertTokenQuery, [username, token], (err) => {
        if (err) {
          console.error(`Error inserting row: ${err.message}`)
          res.send({email,token,pending:true})
        } else {
          console.log(`Row inserted successfully`)
           res.send({email,token,pending:false})
        }
      })
    }
  })
 
 
})
app.post("/register",(req, res)=>{
    const userData=req.body
    insertToUsers(userData,res)
})


app.put("/update",(req,res)=>{
   const userData=req.body
   if(req.session?.user)
      updateUserData(userData,req,res)

})

app.post("/insert/diabetes/record",(req,res)=>{
  const data=req.body
  const username=req.session.userid
  console.log(data)
  // if no session exists return 
  if(!username&data){
    res.send(false)
    return
  }

  db.run(`INSERT INTO patientsrecord (username, date, bslb, bm, lm, dm, bsld) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [username, data.date, data.bslb, data.bm, data.lm, data.dm, data.bsld],
        (err) => {
            if (err) 
                console.error(`Error inserting data: ${err.message}`)
              else 
                res.send(this.changes!=0)
        })
})


app.get("/get/diabetes/record",(req,res)=>{
  const username=req.session.userid
  console.log(req.session.user)
  if(!username&&!verified()){
    res.send(undefined)
    return 
  }
  db.all(`SELECT * FROM patientsrecord WHERE username = ?`, [username], (err, rows) => {
    if (err) {
      console.error(`Error selecting data: ${err.message}`)
    } else {
      console.log(`Selected data successfully`)
      console.log(rows)
      res.send(rows)
    }
  })
})

// uploads the verification images 
app.get("/verification/images",(req, res)=>{   
       db.all("SELECT * FROM imgd",(err,row)=>{
        const toBuffer=(value)=>{
            const obj={data:Buffer.from(value.data,'binary'),name:value.name}
            return obj
        }
        const bufferList=  row.map(value=>toBuffer(value))
        res.send(bufferList)
       })

})

app.get("/logout",(req,res)=>{
  req.session.destroy()
  res.send(true)
})


app.listen(PORT,()=>{
  console.log("Server Started!")

})