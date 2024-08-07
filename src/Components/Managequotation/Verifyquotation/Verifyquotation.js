import React, {useContext, useEffect, useState } from "react";
import './Verifyquotation.css';
// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";

// import {  createquotes } from "../../../Data/Docs";
import {runTransaction, writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";
import { doc } from "firebase/firestore";
//importing the notifications
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// just checking the ckeditor is working or not
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


import { useNavigate, useParams } from "react-router-dom";
import Error from "../../../Error/Error";

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { v4 as uuidv4 } from 'uuid';
import { GCP_API_ONE_TO_ONE } from "../../../Data/Docs";

function Verifyquotation(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);//get a new write batch
    const navigate = useNavigate();
    const {quoteid} = useParams();
     //backdrop loading toggle
     const[showloading,setshowloading] = useState(false);
     const [token,setToken] = useState('');
     const [temquot,settempquot] = useState({
        tempstatus:'',
        tempcomment:''
     })
     // adding notifications 
     const loginsuccess = () =>toast.success('Successfully updated the Quotation');
     const loginerror = () =>toast.error('Getting Error while updating Quotation');
     const loginformerror = () => toast.info('please fill the form correctly');
    //create quotation all required fields comes here
    const [quotinfo,setquotinfo] = useState({
        quotcountry:'',
        quotstate:'',
        quotcustname:'',
        // quotlead:'',
        quottype:'',
        quotcompanyname:'',
        quotmachinetype:'',
        quotprodtype:'',
        quotcap:'',//also known as chutes
        quotprice:'',
        quotdim:'',
        quotcon:'',
        quotunits:'',
        quotpayment:'',
        quotclearing:'',
        quotdestination:'',
        quotwarranty:'',
        quotaddinfo:'',
        quotstatus:'open',
        quotperfomaiorquot:'',
        withgstornot:'',
        //common for both usd and gst
        // custcompanyname:'',
        ofdcty:'',
        contperson:'',
        businesstype:'',
        //extra fields for gst
        // ofdst:'',//state
        ofddst:'',//district
        ofdpinc:'',//pincode
        contmobilenum:'',//mobile number
        altcontmobile:''//alternative mobile number
    })
    //create all states
    
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    
    //send notification
    async function handleSendMsgToAdmin(data , notifyID , notmsg){
        try{
            
            await runTransaction(db,async(transaction)=>{
                const notifyDoc = await transaction.get(doc(db,"notifications",notifyID));
                if(!notifyDoc.exists()){
                    return "Document does not exist!!";
                }
                const dataset = notifyDoc.data();
                const newNotify = notifyDoc.data().notify;
                if(Object.prototype.hasOwnProperty.call(dataset,'token')){
                    setToken(dataset.token);
                }
                const now = new Date();
                const options ={
                    timeZone:'Asia/Kolkata',
                    day:'2-digit',
                    month:'2-digit',
                    year:'numeric'
                }
                const formattedDate = now.toLocaleDateString('en-GB',options).split('/').join('-');
                const options2 = {
                    timeZone:'Asia/Kolkata',
                    hour:'2-digit',
                    minute:'2-digit',
                    second:'2-digit',
                    hour12:false
                }
                const formattedTime = now.toLocaleTimeString('en-GB',options2);
                const nuid = uuidv4();
                // console.log(newNotify);
                transaction.update(doc(db,"notifications",notifyID),{
                    notify:[
                        {
                            time:formattedTime,
                            date:formattedDate,
                            title:notmsg,
                            body:data.msg.body,
                            nid:nuid,
                            seen:false
                        },
                        ...newNotify
                        ]
                    })
                })
            // console.log('updated the lead',data);
            if(token!==''){
                const newData={
                    ...data,
                    regToken:token
                }
                const response = await fetch(`${GCP_API_ONE_TO_ONE}/send-single-notification`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(newData)
                });
                console.log(await response.json());
            }

        }catch(e){
            console.log('you got an error while send msg to adim..',e);
        }
    }
    

    // here handling the submitdata
    async function handlesubmitdata(){
        setshowloading(true);
        try{
            if(
                quotinfo.quotcountry!=='' &&
                quotinfo.quotstate!=='' &&
                quotinfo.quotcustname!=='' &&
                // quotinfo.quotlead!=='' &&
                quotinfo.quotmachinetype!=='' &&
                quotinfo.quotprodtype!=='' &&
                quotinfo.quotcap!=='' &&
                quotinfo.quotprice!=='' &&
                quotinfo.quotpayment!=='' &&
                quotinfo.quotwarranty!=='' &&
                ((temquot.tempstatus==='rework' && temquot.tempcomment!=='')||(temquot.tempstatus!=='rework'))
            ){
            if(quoteid!==0){
                if(sharedvalue.quotesdata[quoteid].quotstatus!==temquot.tempstatus){
                    const data={
                        regToken:'',
                        msg:{
                            title:`${sharedvalue.role} Verified the Quotation`,
                            body:`${sharedvalue.workersdata[sharedvalue.uid].name} Verified the Quotation and changed the  Status to ${temquot.tempstatus}.[ID${quoteid}]`
                        }
                    }
                    const notmsg = "Quotation verified";
                    await handleSendMsgToAdmin(data,sharedvalue.quotesdata[quoteid].quotcreatedby,notmsg)
                }
                await batch.update(doc(db,"quotes",`${sharedvalue.quotesdata[quoteid].docid}`),{
                    [quoteid]:{
                        ...sharedvalue.quotesdata[quoteid],
                        quotstatus:temquot.tempstatus,
                        quotadmincommt:temquot.tempcomment
                    }
                })
                await batch.commit();//commit all baches
                window.scrollTo({top:0,behavior:'smooth'});
                loginsuccess();//success notification
            }
        }else{
            loginformerror();
        }
        }catch(e){
            console.log('you got an error while adding the quotation',e);
            loginerror();
        }
        setshowloading(false);
    }

    useEffect(()=>{
        if(sharedvalue.quoteskeys.length>0 && sharedvalue.quoteskeys.includes(quoteid) ){
            setquotinfo(prev => ({
                ...prev,
                quotcountry:sharedvalue.quotesdata[quoteid].quotcountry,
                quotstate:sharedvalue.quotesdata[quoteid].quotstate,
                quotcustname:sharedvalue.quotesdata[quoteid].quotcustname,
                // quotlead:sharedvalue.quotesdata[quoteid].quotlead,
                quottype:sharedvalue.quotesdata[quoteid].quottype,
                quotcompanyname:sharedvalue.quotesdata[quoteid].quotcompanyname,
                quotmachinetype:sharedvalue.quotesdata[quoteid].quotmachinetype,
                quotprodtype:sharedvalue.quotesdata[quoteid].quotprodtype,
                quotcap:sharedvalue.quotesdata[quoteid].quotcap,
                quotprice:sharedvalue.quotesdata[quoteid].quotprice,
                quotdim:sharedvalue.quotesdata[quoteid].quotdim,
                quotcon:sharedvalue.quotesdata[quoteid].quotcon,
                quotunits:sharedvalue.quotesdata[quoteid].quotunits,
                quotpayment:sharedvalue.quotesdata[quoteid].quotpayment,
                quotclearing:sharedvalue.quotesdata[quoteid].quotclearing,
                quotdestination:sharedvalue.quotesdata[quoteid].quotdestination,
                quotwarranty:sharedvalue.quotesdata[quoteid].quotwarranty,
                quotaddinfo:sharedvalue.quotesdata[quoteid].quotaddinfo,
                quotperfomaiorquot:Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "quotperfomaiorquot")?sharedvalue.quotesdata[quoteid].quotperfomaiorquot:'',
                withgstornot:Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "withgstornot")?sharedvalue.quotesdata[quoteid].withgstornot:'',
                //common for both usd and gst
                // custcompanyname:'',
                ofdcty:sharedvalue.quotesdata[quoteid].ofdcty,
                contperson:sharedvalue.quotesdata[quoteid].contperson,
                businesstype:sharedvalue.quotesdata[quoteid].businesstype,
                //extra fields for gst
                // ofdst:sharedvalue.quotesdata[quoteid].,//state
                ofddst:sharedvalue.quotesdata[quoteid].ofddst,//district
                ofdpinc:sharedvalue.quotesdata[quoteid].ofdpinc,//pincode
                contmobilenum:sharedvalue.quotesdata[quoteid].contmobilenum,//mobile number
                altcontmobile:sharedvalue.quotesdata[quoteid].altcontmobile//alternative mobile number
            }));
            settempquot(prev=>({
                ...prev,
                tempstatus:sharedvalue.quotesdata[quoteid].quotstatus,
                tempcomment:sharedvalue.quotesdata[quoteid].quotadmincommt
            }))
            
            
             //useffect states function call
            // function handleuseeffectstatesbycountries(country){
            //     setquotinfo(prev=>({
            //         ...prev,
            //         quotcountry:country
            //     }));
            //     var temparr = sharedvalue.leadskeys.filter(item=>sharedvalue.leadsdata[item].ofdcountry===country).map((item)=>sharedvalue.leadsdata[item].ofdst).filter((value, index, self) => {
            //         return self.indexOf(value) === index;
            //     });
            //     setallstates(temparr);
            // }
            // handleuseeffectstatesbycountries(sharedvalue.quotesdata[quoteid].quotcountry)
        }
    },[sharedvalue.quoteskeys , sharedvalue.quotesdata,quoteid ,sharedvalue.leadsdata ,sharedvalue.leadskeys ]);

    return(
        <>
        {(sharedvalue.quoteskeys.length>0 && sharedvalue.quoteskeys.includes(quoteid)===true && sharedvalue.role==='admin' && sharedvalue.quotesdata[quoteid].quotstatus!=='closed') ===true? 
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
                    {/* your createmanager starts from here */}
                    <div className='create-lead-con'>
                        
                        <div className='create-lead-head'>
                            <h1>Verify Quotation</h1>
                        </div>
                        <div className='create-lead-head-button-comes-here updatequote-backwards'>
                            <button onClick={()=>navigate(-1)}>
                                <ChevronLeftIcon/>
                                Go Back
                            </button>
                        </div>
                        {/* form starts here */}
                        <div className="create-quotation-form-starts-here">
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                <div>
                                    <label>Quotation Type</label>
                                    <input value={quotinfo.quotperfomaiorquot} readOnly/>
                                </div>
                                <div>
                                    <label>GST or Not</label>
                                    <input value={quotinfo.withgstornot} readOnly/>
                                </div>
                                {/* country */}
                                <div>
                                    <label>country</label>
                                    <input value={quotinfo.quotcountry} readOnly/>
                                </div>
                                {/* state */}
                                {quotinfo.quotcountry!=='' && 
                                <div>
                                    <label>state</label>
                                    <input value={quotinfo.quotstate} readOnly/>
                                </div>
                                }
                                
                                {/* customer name */}
                                {quotinfo.quotcountry!=='' && quotinfo.quotstate!=='' && 
                                <div>
                                    <label>customer name</label>
                                    <input value={quotinfo.quotcustname} readOnly/>
                                </div>
                                }
                                {/* lead id */}
                                {/* {quotinfo.quotcountry!=='' && quotinfo.quotstate!=='' && quotinfo.quotcustname!=='' && 
                                    <div>
                                        <label>lead</label>
                                        <input value={quotinfo.quotlead} readOnly/>
                                        
                                    </div>
                                } */}
                                {/* quotation type */}
                                <div>
                                    <label>quotation type</label>
                                    <input value={quotinfo.quottype} readOnly/>
                                    
                                </div>
                                {quotinfo.quottype==='GST' &&
                                <div>
                                    <label>district<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={quotinfo.ofddst} readOnly/>
                                    
                                </div>
                                }

                                {(quotinfo.quottype==='USD'||quotinfo.quottype==='GST')===true &&<>
                                <div>
                                    <label>city<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={quotinfo.ofdcty} readOnly/>
                                    
                                </div>
                                <div>
                                    <label>contact person name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={quotinfo.contperson}  readOnly/>
                                    
                                </div>
                                <div>
                                    <label>businesstype<span style={{color:'red'}}>*</span></label>
                                    <input value={quotinfo.businesstype} readOnly/>
                                    
                                </div>
                                </>
                                }
                                {/* pincode ,mobile number and alternative mobile number */}
                                {quotinfo.quottype==='GST' &&
                                    <>
                                        <div>
                                            <label>pincode<span style={{color:'red'}}>*</span></label>
                                            <input  value={quotinfo.ofdpinc} readOnly/>
                                            
                                        </div>
                                        <div>
                                            <label>mobile number<span style={{color:'red'}}>*</span></label>
                                            <input value={quotinfo.contmobilenum} readOnly/>
                                            
                                        </div>
                                        <div>
                                            <label>alternate mobile number</label>
                                            <input type="number" value={quotinfo.altcontmobile} />
                                        </div>
                                    </>
                                }
                                {/* company name */}
                                {(quotinfo.quottype==='GST' || quotinfo.quottype ==='HSS') && 
                                <div>
                                    <label>Company Name</label>
                                    <input value={quotinfo.quotcompanyname} readOnly/>
                                </div>
                                }
                                {/* select machine type */}
                                <div>
                                    <label>Machine Type</label>
                                    <input value={quotinfo.quotmachinetype} readOnly/>
                                </div>
                                {/* product type */}
                                <div>
                                    <label>product type</label>
                                    <input value={quotinfo.quotprodtype} readOnly/>
                                </div>
                                {/* capacity here it is also known as chutes*/}
                                <div>
                                    <label>No.of Chutes</label>
                                    <input value={quotinfo.quotcap} readOnly/>
                                </div>
                                {/* price */}
                                <div>
                                    <label>price</label>
                                    <input  value={quotinfo.quotprice} readOnly/>
                                </div>
                                {/* dimension */}
                                {quotinfo.quottype==='USD' && 
                                <div>
                                    <label>dimension</label>
                                    <input  value={quotinfo.quotdim} readOnly/>
                                </div>
                                }
                                {/* Conversion */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='GST') && 
                                <div>
                                    <label>conversion</label>
                                    <input  value={quotinfo.quotcon} readOnly/>
                                </div>
                                }
                                {/* units */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='GST') && 
                                <div>
                                    <label>units</label>
                                    <input  value={quotinfo.quotunits} readOnly/>
                                </div>
                                }
                                {/* payment */}
                                <div>
                                    <label>Payment</label>
                                    <input value={quotinfo.quotpayment} readOnly/>
                                </div>
                                {/* clearing expenses at port and transportation */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='GST') && 
                                <div>
                                    <label>clearing expenses at port and transportation</label>
                                    <input value={quotinfo.quotclearing} readOnly/>
                                </div>
                                }
                                {/* destination port */}
                                {(quotinfo.quottype==='HSS'  || quotinfo.quottype==='USD') && 
                                <div>
                                    <label>destination port</label>
                                    <input  value={quotinfo.quotdestination} readOnly/>
                                </div>
                                }
                                
                            </div>
                            {/* create lead requirements all fields ends here */}
                            {/* this div is for open and closed leads for last 6 months */}
                            <div className="create-quotation-payment-term-div">
                                <label>Payment Term</label>
                                {/* <CKEditor
                                    editor={ClassicEditor}
                                    data={sharedvalue.quotesdata[quoteid].quotpayterm}
                                    // onReady={(editor) => {
                                    //     // You can store the "editor" and use it when needed.
                                    //     setEditorData(sharedvalue.quotesdata[quoteid].quotpayterm)
                                    // }}
                                /> */}
                                <textarea value={sharedvalue.quotesdata[quoteid].quotpayterm} readOnly/>
                            </div>
                            {/* this div is for open and closed tickets for last 6 months */}

                            {/* lets transfer warrenty and additional info at bottom */}
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* warranty */}
                                <div>
                                    <label>warranty</label>
                                    <input value={quotinfo.quotwarranty} readOnly/>
                                </div>
                                
                                {/* additional info */}
                                <div>
                                    <label>Additional info</label>
                                    <textarea value={quotinfo.quotaddinfo} readOnly/>
                                </div>
                            </div>

                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* warranty */}
                                <div>
                                    <label>status*</label>
                                    <select value={temquot.tempstatus} onChange={(e)=>settempquot(prev=>({
                                        ...prev,
                                        tempstatus:e.target.value
                                    }))}>
                                        <option value=''>Select Status</option>
                                        <option value='open'>Open</option>
                                        <option value='rework'>Rework</option>
                                        <option value='approved'>Approved</option>
                                    </select>
                                </div>
                                
                                {/* additional info */}
                                <div>
                                    <label>comment*</label>
                                    <textarea value={temquot.tempcomment} placeholder="write at least one comment" onChange={(e)=>settempquot(prev=>({
                                        ...prev,
                                        tempcomment:e.target.value
                                    }))}/>
                                </div>
                            </div>
                            
                            <button className="creatquotation-final-button" onClick={()=>handlesubmitdata()}>
                                verify quote
                            </button>
                        </div>
                        {/* form ends here */}
                    </div>
                </div>
            </div>:<Error/>}
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Verifyquotation;