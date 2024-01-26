import React, { useContext, useState } from 'react';
import './Eachlead.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from '../Sidenav/Sidenav';
import MyContext from '../../MyContext';
import { useParams } from 'react-router-dom';

function Eachlead(){
    const sharedvalue = useContext(MyContext);
    const {leadid} = useParams();
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    return(
        <>
            {sharedvalue.leadskeys.length>0 &&
            <div className='manlead-con'>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            <SearchIcon />
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createcustomer starts from here */}
                    <div className='create-lead-con'>
                        {/* <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>{sharedvalue.leadsdata[leadid].contperson}-[{leadid}]</h1>
                            </div>
                        </div> */}
                        <div className='each-lead-head-comes-here'>
                            <h1>{sharedvalue.leadsdata[leadid].contperson} - [{leadid}]</h1>
                        </div>
                        {/* header end */}
                        <div className='top-eachlead-buttons'>
                            <div>
                                <p><span className='each-lead-head-comes-here-span-1'>Status :</span>  {sharedvalue.leadsdata[leadid].custstatus}</p>
                            </div>
                            <div className='top-eachlead-buttons-inner'>
                                <button>edit</button>
                                <button>Next Meeting</button>
                            </div>
                        </div>
                        {/* customer inquiry starts here */}
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>CUSTOMER INQUIRY FORM</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                    <div>
                                        <label>Customer Type</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custtype} readOnly/>
                                    </div>
                                    <div>
                                        <label>Customer Status</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custstatus} readOnly/>
                                    </div>
                                    <div>
                                        <label>Start Date</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custstartdate} readOnly/>
                                    </div>
                                    <div>
                                        <label>End Date</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custenddate} readOnly/>
                                    </div>
                                    <div>
                                        <label>Revert Date</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custnextdate} readOnly/>
                                    </div>
                                    <div>
                                        <label>Source of Enquiry</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custsourceofenquiry} readOnly/>
                                    </div>
                                    <div>
                                        <label>Company Name</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custcompanyname} readOnly/>
                                    </div>
                            </div>
                        </div>
                        {/* customer inquiry ends here */}
                        {/* status and edit buttons div ends here */}
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>CONTACT DETAILS</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                <div>
                                    <label>Contact Person</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contperson} readOnly/>
                                </div>
                                <div>
                                    <label>Designation</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contdesignation} readOnly/>
                                </div>
                                <div>
                                    <label>Contact Person Number</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contcountrycode+sharedvalue.leadsdata[leadid].contmobilenum} readOnly/>
                                </div>
                                <div>
                                    <label>Contact Person Email</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contpersonemail} readOnly/>
                                </div>
                            </div>
                        </div>
                        {/* lead contact details end's here */}
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>OFFICE DETAILS</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                <div>
                                    <label>Country</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdcountry} readOnly/>
                                </div>
                                <div>
                                    <label>State</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdst} readOnly/>
                                </div>
                                <div>
                                    <label>District</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofddst} readOnly/>
                                </div>
                                <div>
                                    <label>City</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdcty} readOnly/>
                                </div>
                                <div>
                                    <label>Pincode</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdpinc} readOnly/>
                                </div>
                                <div>
                                    <label>GSTIN</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contdesignation} readOnly/>
                                </div>
                                <div>
                                    <label>IE code</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdiec} readOnly/>
                                </div>
                                <div>
                                    <label>Office Details</label>
                                    <textarea  value={sharedvalue.leadsdata[leadid].ofd} readOnly/>
                                </div>
                            </div>
                        </div>
                        {/* office details ends herfe */}
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>REQUIREMENTS</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                <div>
                                    <label>Requirements</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].businesstype} readOnly/>
                                </div>
                                <div>
                                    <label>Mill Capacity</label>
                                    <input type='number' value={sharedvalue.leadsdata[leadid].millcap} readOnly/>
                                </div>
                                <div>
                                    <label>Chute</label>
                                    <input type='number' value={sharedvalue.leadsdata[leadid].chutes} readOnly/>
                                </div>
                                <div>
                                    <label>Capacity Required (per Hour)</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].capreq} readOnly/>
                                </div>
                                <div>
                                    <label>Machine Required</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].machinereq} readOnly/>
                                </div>
                                <div>
                                    <label>Make</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].make} readOnly/>
                                </div>
                                <div>
                                    <label>Machine Type</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].machinetype} readOnly/>
                                </div>
                                <div>
                                    <label>Type</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].std} readOnly/>
                                </div>
                                <div>
                                    <label>Payment</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].payment} readOnly/>
                                </div>
                                <div>
                                    <label>Assigned Email</label>
                                    <input type='email' readOnly/>
                                </div>
                            </div>
                            <textarea className='eachlead-requirements-textarea' value={sharedvalue.leadsdata[leadid].reqdes} readOnly/>
                        </div>
                        {/* inquiry form ends here */}

                    </div>
                    {/* create customer ends here */}
                </div>
            </div>
            }
        </>
    );
}

export default Eachlead;