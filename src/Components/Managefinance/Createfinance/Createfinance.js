import React, {useContext, useState } from "react";
import './Createfinance.css';
// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";

//import from here on words for other components
import {createUserWithEmailAndPassword,signOut } from "firebase/auth";
import { secondauth } from "../../../Firebase";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { writeBatch, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../Firebase";
import { v4 as uuidv4 } from 'uuid';
import { workerscountid } from "../../../Data/Docs";
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

function Createfinance(){
    const sharedvalue = useContext(MyContext);
    // const navigate = useNavigate();
    const batch = writeBatch(db);// Get a new write batch
    const [showprogress,setshowprogress]=useState(false);
    const [formdetails,setformdetails]=useState({//form details will take here
        name:'',
        email:'',
        phnnumber:'',
        password:'',
        cnfpassword:'',
        role:'finance'
    })
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully Created Finance Manager');
    const loginerror = () =>toast.error('please check your credientials');
    const loginformerror = () => toast.warn('please fill the form correctly');
    const invalidmail = () => toast.error('Invalid Mail');
    const emailalreadyexists = () =>toast.error('email already exists');
    const notcreated = () => toast.error('you got an error while creating the finance manager');

    //generating the docid and count
    const fetchworkerid = async() =>{
        try{
            return new Promise((resolve,reject)=>{
                onSnapshot(workerscountid,(docs)=>{
                    const tempworkerid = docs.data();
                    resolve({
                        ...tempworkerid,
                        count:tempworkerid.count+1,
                    });
                })
            })
        }catch(err){
            console.log("you got an error while fetching the cuistomer workerid: ",err);
        }
    }
    //form registration start's here
    async function handleregistration(){
        setshowprogress(true);
        try{
            if(formdetails.email.trim()!=='' && formdetails.name.trim()!=='' && formdetails.password.trim()!=='' && formdetails.cnfpassword.trim()!=='' && formdetails.password===formdetails.cnfpassword){
                //const userCredential = await createUserWithEmailAndPassword(auth, formdetails.email, formdetails.password);
                const secondusercredential = await createUserWithEmailAndPassword(secondauth, formdetails.email, formdetails.password)
                // Signed up
                const user = secondusercredential.user;
                //we have to take user.email,user.uid
                // Update the workers of 'lms'
                if(user){
                    const result = fetchworkerid();
                    setDoc(doc(db,"notifications",user.uid),{
                        notify:[],
                        token:''
                    })
                    // const sfRef = doc(db,'workers','yWXH2DQO8DlAbkmQEQU4');
                    if(result.count<=340){
                        batch.update(doc(db,"workers",`${result.docid}`), {[user.uid]:{
                            "uid":user.uid,
                            "name":formdetails.name,
                            "email":formdetails.email,
                            "phnnumber":formdetails.phnnumber,
                            "role":formdetails.role,
                            "password":formdetails.password,
                            "disable":false,
                            "managerid":'',
                            "docid":result.docid
                        }});
                        await batch.update(workerscountid,{
                            ...result
                        });
                        await batch.commit();
                    }else{
                        const id = uuidv4();
                        await setDoc(doc(db,"workers",`${id}`), {[user.uid]:{
                            "uid":user.uid,
                            "name":formdetails.name,
                            "email":formdetails.email,
                            "phnnumber":formdetails.phnnumber,
                            "role":formdetails.role,
                            "password":formdetails.password,
                            "disable":false,
                            "managerid":'',
                            "docid":id
                        }});
                        await batch.update(workerscountid,{
                            ...result,
                            docid:id,
                            count:0
                        })
                        await batch.commit();
                    }
                }
                await signOut(secondauth)
                loginsuccess();
                setformdetails({
                    name:'',
                    email:'',
                    phnnumber:'',
                    password:'',
                    cnfpassword:'',
                    role:'finance'
                });
            }else{
                loginformerror();
            }
        }
        catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            if(errorCode==='auth/email-already-exists'){
                emailalreadyexists();
            }else if(errorCode==='auth/invalid-credential'){
                loginerror();
            }else if(errorCode==='invalid-email'){
                invalidmail();
            }else if(errorCode==='auth/email-already-in-use'){
                emailalreadyexists();
            }
            else{
                notcreated();
            }
        }
        setshowprogress(false);
    }
    //form registyration completed here
    return(
        <>
            <div className='manlead-con'>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            {/* <SearchIcon onClick={()=>navigate('/search')}/> */}
                            <Notify/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createfinance starts from here */}
                    <div className="createmanager-innner-form-con">
                        <div className="createmanager-innner-form">
                            <div className="create-manager-form-header">
                                <h1>create finance profile</h1>
                                <p>enter email and password to create profile</p>
                            </div>
                            <div>
                                <label>manager name<span>*</span></label>
                                <input type='text' value={formdetails.name} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    name:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>manager email<span>*</span></label>
                                <input type='email' value={formdetails.email} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    email:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>manager phone number<span>*</span></label>
                                <input type='number' value={formdetails.phnnumber} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    phnnumber:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>password<span>*</span></label>
                                <input type='password' value={formdetails.password} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    password:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>confirm password<span>*</span></label>
                                <input type='password' value={formdetails.cnfpassword} onChange={(e)=>setformdetails(prev=>({
                                    ...prev,
                                    cnfpassword:e.target.value
                                }))}/>
                            </div>
                            <button onClick={()=>handleregistration()}>Create finance profile</button>

                        </div>
                        {/* form completed here */}
                    </div>
                </div>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showprogress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* adding the notifications */}
            <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    limit={1}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme="light"
                    />
        </>
    );
}

export default Createfinance