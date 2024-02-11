import React, {useContext, useState } from "react";
import './Viewexpense.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
// import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import { writeBatch} from "firebase/firestore";
import { updateDoc, deleteField } from "firebase/firestore";
import { db } from "../../../Firebase";
import { createexpense } from "../../../Data/Docs";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
function Viewexpense(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const batch = writeBatch(db);//get a new write batch
    //backdrop loading toggle
    const[showloading,setshowloading] = useState(false);
    
    async function handleDeleteClosedExp(expid){
        setshowloading(true)
        try{
            await updateDoc(createexpense, {
                [expid]: deleteField()
            });
            await batch.commit();
        }catch(e){
            console.log('you got an error while updating ',e);
        }
        setshowloading(false);
    }
    
    
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    // search bar input 
    const [searchworker,setsearchworker]=useState('');
    
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    
    
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
                            <SearchIcon onClick={()=>navigate('/search')}/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* table view part starts from here!!! */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>View Expense</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Customer/ExpID" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div>
                            {/* table starts from here */}
                            <div className="view-list-table-con">
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
                                            <th>Exp.ID</th>
                                            <th>
                                                <p>from</p>
                                                <p>date /time/ place</p>
                                            </th>
                                            <th>
                                                <p>to</p>
                                                <p>date /time/ place</p>
                                            </th>
                                            <th>mode</th>
                                            <th>Transport cost</th>
                                            <th>food cost</th>
                                            <th>purpose</th>
                                            <th>customer name</th>
                                            <th>Created by</th>
                                            <th>finance manager</th>
                                            <th>remark</th>
                                            <th>amount paid</th>
                                            <th>amount pending</th>
                                            <th>final amount</th>
                                            <th>status</th>
                                            <th>date added</th>
                                            <th>Admin comment</th>
                                            <th>Finance Comment</th>
                                            <th>action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.expenseskeys.length>0 && sharedvalue.workerskeys.length>0 &&
                                            sharedvalue.expenseskeys.filter(prod=>(sharedvalue.expensesdata[prod].expcreatedbyid===sharedvalue.uid || sharedvalue.expensesdata[prod].expfinanceid===sharedvalue.uid || sharedvalue.role==='admin')).filter(item=>(sharedvalue.expensesdata[item].expcustomername.includes(searchworker)||JSON.stringify(item).includes(searchworker))).map((expense,idx)=>(
                                                <tr key={idx}>
                                                    {/* 1 expense ID */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {expense}
                                                        </p>
                                                    </td>
                                                    {/* 2 from date/time/place */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].fromdate}
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].fromtime}
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].fromplace}
                                                        </p>
                                                    </td>
                                                    {/* 3 to date/time/place */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].todate}
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].totime}
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].toplace}
                                                        </p>
                                                    </td>
                                                    {/* 4 mode */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].expmode}
                                                        </p>
                                                    </td>
                                                    {/* 5 transport cost */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {Number(sharedvalue.expensesdata[expense].exptransportcost)}
                                                        </p>
                                                    </td>
                                                    {/* foodcost */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {Number(sharedvalue.expensesdata[expense].expfoodcost)}
                                                        </p>
                                                    </td>
                                                    {/* purpose */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].exppurpose}
                                                        </p>
                                                    </td>
                                                    {/* customer name */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].expcustomername}
                                                        </p>
                                                    </td>
                                                    {/* created by */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.workersdata[sharedvalue.expensesdata[expense].expcreatedbyid].name}
                                                        </p>
                                                    </td>
                                                    {/* finance manager */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].expfinanceid!==''?sharedvalue.workersdata[sharedvalue.expensesdata[expense].expfinanceid].name:'-'}
                                                        </p>
                                                    </td>
                                                    {/* remark */}
                                                    <td>
                                                        {/* <div className='view-manager-list-acttion-icon'>
                                                            <a href={sharedvalue.expensesdata[expense].fileurl} rel="noreferrer" target="_blank">
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small"/>
                                                            </a>
                                                        </div> */}
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].expremarks}
                                                        </p>
                                                    </td>
                                                    {/* amount paid */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {Number(sharedvalue.expensesdata[expense].expamountpaid)}
                                                        </p>
                                                    </td>
                                                    {/* amount pending */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {Number(sharedvalue.expensesdata[expense].expamountpending)}
                                                        </p>
                                                    </td>
                                                     {/* final amount */}
                                                     <td >
                                                        {/* <p className="view-manager-list-role">
                                                            {Number(sharedvalue.expensesdata[expense].expamountpending)}
                                                        </p> */}
                                                        <p className="view-manager-list-name">
                                                            {Number(sharedvalue.expensesdata[expense].expfinalamount)}
                                                        </p>
                                                    </td>
                                                    {/* open/closed */}
                                                    <td>
                                                    <p className={`view-manager-list-name ${sharedvalue.expensesdata[expense].expstatus==='open'?'open-active':sharedvalue.expensesdata[expense].expstatus==='closed'?'closed-active':sharedvalue.expensesdata[expense].expstatus==='approved'?'approved-active':'rejected-active'}`}>
                                                            {sharedvalue.expensesdata[expense].expstatus==='open'?'open':sharedvalue.expensesdata[expense].expstatus==='closed'?'closed':sharedvalue.expensesdata[expense].expstatus==='approved'?'approved':'rejected'}
                                                        </p>
                                                    </td>
                                                     {/* date added */}
                                                     <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].expaddeddate}
                                                        </p>
                                                    </td>
                                                    {/* latest comment */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].explatestcomment!==''?sharedvalue.expensesdata[expense].explatestcomment:'-'}
                                                        </p>
                                                    </td>
                                                    {/* finance comment */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.expensesdata[expense].expcloseremarks!==''?sharedvalue.expensesdata[expense].expcloseremarks:'-'}
                                                        </p>
                                                    </td>
                                                     {/* action */}
                                                     <td>
                                                        <div className='view-manager-list-acttion-icon'>
                                                             {sharedvalue.expensesdata[expense].expcreatedbyid===sharedvalue.uid && (sharedvalue.expensesdata[expense].expstatus==='open'||sharedvalue.expensesdata[expense].expstatus==='rejected') && <EditIcon sx={{color:'green',cursor:'pointer'}} fontSize="small" onClick={()=>navigate(`/manageexpense/editexpense/${expense}`)}/>}
                                                            {sharedvalue.role==='admin' && sharedvalue.expensesdata[expense].expstatus!=='closed' && <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small" onClick={()=>navigate(`/manageexpense/verifyexpense/${expense}`)}/>}
                                                            {/* */}
                                                            {sharedvalue.role==='finance' && sharedvalue.expensesdata[expense].expfinanceid===sharedvalue.uid && sharedvalue.expensesdata[expense].expstatus==='approved' && <p className="view-expense-finance-close" onClick={()=>navigate(`/manageexpense/financeverify/${expense}`)}>close</p>}
                                                            {sharedvalue.role==='admin' && sharedvalue.expensesdata[expense].expstatus==='closed' && <DeleteOutlineRoundedIcon sx={{color:'red',cursor:'pointer'}} fontSize="small" onClick={()=>handleDeleteClosedExp(expense)}/> }
                                                            
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                         </div>
                    </div>
                    {/* table view part ends here */}

                </div>
                {/* mange con inner ends here */}
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Viewexpense;