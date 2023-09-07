"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Verified from "public/verified.svg";
import Cancelled from "public/cancelled.png";
import Pending from "public/pending.png";
import Cross from "public/cross.svg";
import Delete from "public/delete.svg";
import EDIT from "public/edit.svg";
import Assign from "public/user-pending.svg";
import Assigned from "public/user-success.svg";
import ViewVerification from"public/verified-view.svg";
import ProceedVerification from "public/proceedv.svg";
import Supporter from "public/thumbsup.svg";
import Refuter from "public/thumbsdown.svg";
import Search from "public/search.svg";
import Clear from "public/clear.svg";


import Link from "next/link";
import Loader from "../loading";

const Dashboard = () => {
  const session = useSession();
  const [urlValue, setUrlValue] = useState("");
  const [supporturlValue, setSupportUrlValue] = useState("");
  const [refuterurlValue, setRefuterUrlValue] = useState("");
  const [title, setTitle] = useState("");
  const [titleByEditor, setTitleByEditor] = useState("");
  const [supporterUrlByEditor, setsupporterUrlByEditor] = useState("");
  const [refuterUrlByEditor, setrefuterUrlByEditor] = useState("");


  const [summary, setSummary] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  
  const [editId, setEditId] = useState('');

  const [isEditByEditor, setIsEditByEditor] = useState(false);
  const [editIdByEditor, setEditIdByEditor] = useState('');

  const [urlHelperText, setUrlHelperText] = useState("");
  const [supporturlHelperText, setsupportUrlHelperText] = useState("");
  const [refuterurlHelperText, setrefuterUrlHelperText] = useState("");
  const [editorFromErrorText, seteditorFromErrorText] = useState("");
  const [searchText, setSearchText] = useState("");



  const router = useRouter();
  
  //NEW WAY TO FETCH DATA
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    `/api/claim?id=${session?.data?.user?.email}`,
    fetcher
  );
  const fetcher2 = (...args) => fetch(...args).then((res) => res.json());
  const {data: userData, isLoading: userDataLoading}  = useSWR(
    `/api/user?id=${session?.data?.user?.email}`,
    fetcher2
  );

  const verifiedDataFetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: verifiedData } = useSWR(
    `/api/claim/verified?id=${session?.data?.user?.email}`,
    verifiedDataFetcher
  );
  if (userData){
    window.localStorage.setItem('role', userData.role)
    window.localStorage.setItem('email', userData.email)
    window.localStorage.setItem('id', userData._id)
  }

  if (session.status === "loading") {
    return <Loader />;
  }

  if (session.status === "unauthenticated") {
    router?.push("/dashboard/login");
  }

  const handleUrlChange = (event) => {
    setUrlValue(event.target.value);
  };

  const handleSupportUrlChange = (event) => {
    setSupportUrlValue(event.target.value);
  };

  const handleRefuterUrlChange = (event) => {
    setRefuterUrlValue(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTitleChangeByEditor = (event) => {
    setTitleByEditor(event.target.value);
  }

  const handleSupportUrlChangeByEditor = (event) => {
    setsupporterUrlByEditor(event.target.value);
  }

  const handleRefuterUrlChangeByEditor = (event) => {
    setrefuterUrlByEditor(event.target.value);
  }

  const handleSummaryChange = (event) => {
    setSummary(event.target.value);
  };

  const handleSearchTextChange = (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let helperText = "";
  
    if (!urlValue) {
      helperText = "Please enter a URL";
    } else if (!isUrlValid(urlValue)) {
      helperText = "Entered URL value is incorrect";
    }

    setUrlValue('')
    setRefuterUrlValue('')
    setSupportUrlValue('')
    setTitle('')
    setSummary('')

    if (helperText.length > 0) {
      setUrlHelperText(helperText);
      return;
    }
  
  
    const title = e.target[1].value;
    const url = e.target[2].value;
    const supportUrl = e.target[3].value;
    const refuterUrl = e.target[4].value;
    const summary = e.target[5].value;


    try {
      if (isEdit){
        await fetch(`/api/claim/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title,
            url,
            supportUrl,
            refuterUrl,
            summary,
          }),
        });
        mutate();
        setEditId('');
        setIsEdit(false);
        e.target.reset()
      }else {
        await fetch("/api/claim", {
          method: "POST",
          body: JSON.stringify({
            title,
            url,
            supportUrl,
            refuterUrl,
            summary,
            user: session?.data?.user?.email,
          }),
        });
        mutate();
        e.target.reset()
      }
      setIsShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitEditorForm = async (e) => {
    e.preventDefault();

    if (supporterUrlByEditor.length > 0 && !isUrlValid(supporterUrlByEditor)) {
      const helperText = "Please Provide a valid URL";
      setsupportUrlHelperText(helperText)
      return
    }
    if (refuterUrlByEditor.length >0 && !isUrlValid(refuterUrlByEditor)) {
      const helperText = "Please Provide a valid URL";
      setrefuterUrlHelperText(helperText)
      return
    }

    setrefuterUrlByEditor('')
    setsupporterUrlByEditor('')
    setTitleByEditor('')

    const supportUrl = e.target[2].value;
    const refuterUrl = e.target[3].value;

    if (supportUrl.length === 0 && refuterUrl.length === 0){
      seteditorFromErrorText('Please Fill Support Or Refuter URL.')
      return
    }

    try {

      await fetch(`/api/claim/update/${editIdByEditor}`, {
        method: 'PATCH',
        body: JSON.stringify({
          supportUrl,
          refuterUrl,
        }),
      });
      mutate();
      setEditIdByEditor('');
      setIsEditByEditor(false);
      setIsShowForm(false);
      e.target.reset()
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/claim/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (id, claim) => {
    setIsShowForm(true)
    setEditId(claim._id)
    setIsEdit(true);
    setUrlValue(claim.url);
    setRefuterUrlValue(claim.refuterUrl);
    setSupportUrlValue(claim.supportUrl);
    setSummary(claim.summary)
    setTitle(claim.title);
  };

  const handleSearchFromElastic = async () => {
    router.push(`/search?query=${searchText}`)
  }

  const handleSearchFormClear = async () => {
    setSearchText('');
  }

  const handleAssignEditor = async (id) => {
    try {
      await fetch(`/api/claim/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          assignedTo: '64ef35d8ddf76320cd0d3c4b',
        }),
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  }


  const handleProceedForVerification = async (id) => {
    router?.push(`/verify/${id}`);
  }

  const handleAddSupporterRefuterLink = async (id, claim) => {
    setIsShowForm(true)
    // open Form to Add a Supporter And Refuter Link
    setEditIdByEditor(id)
    setIsEditByEditor(true);
    setTitleByEditor(claim.title)
    setsupporterUrlByEditor(claim.supportUrl)
    setrefuterUrlByEditor(claim.refuterUrl)
    
  }
  
  const isUrlValid = (value) => {
    const regex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return regex.test(value);
  };  

  const openAddForm = () => {
    setIsShowForm(true);
  } 

  const handleFormClose = () => {
    setIsShowForm(false);
  }


  if (session.status === "authenticated") {
    
    return (
      <div style={{ minHeight: '650px', backgroundColor:'#EEEEEE', padding: "40px 60px" }}> 
      <div style={{padding: "20px 60px"}} className="bg-white border rounded-lg">


        <div className="flex flex-row justify-between py-2">
          <h1 className="text-5xl py-5">{ (userData && userData?.role && userData?.role === 'user') ? 'My Claims' : 'Pending Claims List' } </h1>
          <div className=" flex flex-row self-center">
            <div className="flex flex-row self-center pr-5">
              <form className="flex flex-row self-center justify-evenly">
                <input
                  className="border"
                  value={searchText}
                  onChange={handleSearchTextChange}
                  placeholder="Search any term"
                  style={{ height:'40px',width:'280px',borderRadius:"10px", paddingLeft:"5px", paddingRight:"5px"}}
                  title='Search bar'
                  required
                />
                <button type="button" onClick={handleSearchFormClear} className="">
                  <Image disabled={searchText.length === 0} className="transition-transform duration-300 transform hover:scale-110" src={Clear} alt="clear" width={30} height={30}>
                  </Image>
                </button>
                <button disabled={searchText.length === 0} type="button" onClick={handleSearchFromElastic} className="">
                  <Image className="transition-transform duration-300 transform hover:scale-110" src={Search} alt="search" width={30} height={30}>
                  </Image>
                </button>
              </form>
            </div>
           
            {userData && userData.role === 'user' && <div className="self-center mx-1">
              <button
                onClick={openAddForm}  
                className={`rounded-sm bg-teal-500 text-white px-4 py-2 hover:bg-teal-800 ...`}>
                Add New Claim
              </button>
            </div>}
          </div>
        </div>
      <div className={ (userData && userData?.role && userData?.role === 'user' ) && isShowForm ? styles.container: styles.containerfull}>
        <div className={ isShowForm ? styles.claims : styles.claimsfull }>
            <table className="border-collapse table-fixed w-full bg-slate-500 break-words text-center border-spacing-2 border border-slate-500 rounded-md shadow-md">
              <thead>
                <tr>
                  <th className=" py-4 bg-slate-700 text-white">Title</th>
                  <th className=" bg-slate-700  text-white">Url</th>
                  <th className=" bg-slate-700  text-white">Summary</th>
                  <th className=" bg-slate-700  text-white">Support Url</th>
                  <th className=" bg-slate-700  text-white">Refuter Url</th>
                  <th className=" bg-slate-700  text-white">Action</th>
                  {
                    userData && userData?.role && userData.role !== 'editor' && 
                    <th className=" bg-slate-700  text-white">Assigned To</th>
                  }
                    <th className=" bg-slate-700  text-white">Status</th>
                  
                  
                </tr>
              </thead>
              <tbody>
              {isLoading && userDataLoading
                ? <tr>
                  <td colSpan="7">
                    <div className="flex flex-row justify-center p-1 m-1">
                      <div class={styles.dot_spinner} >
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                        <div class={styles.dot_spinner__dot}></div>
                    </div>
                    </div>
                  
                  </td>
                  </tr>
                : data?.map((claim) => (
                  <>
                    <tr className="border border-separate border-spacing-5 border-slate-950">
                    <td className="text-xs bg-white p-1"><Link href={{ pathname: `/view/${claim._id}` }}>{claim.title}</Link></td>
                    <td className="text-xs  bg-white px-2 py-1"><a className="hover:font-bold underline underline-offset-1" href={claim.url} target="_blank">{claim.url}</a></td>
                    <td className="text-xs  bg-white px-2 py-1">{claim.summary}</td>
                    <td className="text-xs  bg-white p-1">
                        <div className={styles.tooltip}> 
                          <a className="flex justify-center hover:text-lime-400 font-bold underline underline-offset-1" href={claim.supportUrl ? claim.supportUrl : '#'} target="_blank">
                          <Image className={claim.supportUrl.length > 0 ? `transition-transform duration-300 transform hover:scale-110`: ''} alt="supporter" src={Supporter} height={30} width={30}></Image></a>
                          {claim.supportUrl.length> 0 && <span className={styles.tooltiptext}>Go to Supporter Link</span>}
                        </div> 
                        
                    </td>
                    <td className="text-xs  bg-white p-1">
                      <div className={styles.tooltip}> 
                        <a className="flex justify-center hover:text-orange-700 font-bold underline underline-offset-1" href={claim.refuterUrl ? claim.refuterUrl : '#'} target="_blank"> 
                          <Image className={claim.refuterUrl.length > 0 ? `transition-transform duration-300 transform hover:scale-110`: ''} alt="refuter" src={Refuter} height={30} width={30}></Image>
                        </a>
                        {claim.refuterUrl.length> 0 && <span className={styles.tooltiptext}>Go to Refuter Link</span>}
                        </div>
                    </td>
                    <td className="text-xs  bg-white p-1"> 
                    {
                      userData && userData?.role && userData.role !== 'editor' &&
                      <>
                         <div className={styles.tooltip}> 
                          <button 
                            disabled={claim?.assignedTo?.email?.length > 0}
                            onClick={() => {handleUpdate(claim._id, claim)}}
                            className={` m-1 ${
                              claim?.assignedTo?.email?.length > 0 ? 'cursor-not-allowed' : ''
                            } ...`}>
                            <Image className={claim?.assignedTo?.email === undefined ? `transition-transform duration-300 transform hover:scale-110`: ''} src={EDIT} height={30} width={30} alt="edit"></Image>
                          </button> 
                         { claim?.assignedTo?.email === undefined && <span className={styles.tooltiptext}> Edit Claim</span>}
                        </div> 
                        
                        <div className={styles.tooltipdelete}> 
                          <button 
                            disabled={claim?.assignedTo?.email?.length > 0}
                            onClick={() => {handleDelete(claim._id)}} 
                            className={` text-white  m-1 ${
                              claim?.assignedTo?.email?.length > 0 ? 'cursor-not-allowed' : ''
                            } ...`}>
                              <Image className={claim?.assignedTo?.email === undefined ? `transition-transform duration-300 transform hover:scale-110`: ''} src={Delete} height={30} width={30} alt="delete"></Image>
                          </button>
                          { claim?.assignedTo?.email === undefined && <span className={styles.tooltiptextdelete}> Delete Claim</span>}
                        </div> 
                        
                      </>
                      }
                      {
                      userData && userData?.role && userData.role === 'editor' &&
                      <div className="flex flex-row justify-center">
                        <div className="m-1">
                          <div className={styles.tooltip}> 
                            <button 
                              onClick={() => {handleAddSupporterRefuterLink(claim._id, claim)}} 
                              className={`  ...`}>
                              <Image className="transition-transform duration-300 transform hover:scale-110" src={EDIT} height={30} width={30} alt="update"></Image>
                            </button>
                          <span className={styles.tooltiptext}> Update URL</span>
                          </div> 
                         
                        </div>
                        <div className="m-1">
                          <div className={styles.tooltip}> 
                            <button 
                              onClick={() => {handleProceedForVerification(claim._id)}} 
                              className={`  ...`}>
                              <Image className="transition-transform duration-300 transform hover:scale-110" src={ProceedVerification} height={30} width={30} alt="proceed-for-verify"></Image>
                            </button>
                          <span className={styles.tooltiptext}> Proceed For Verification </span>
                          </div> 

                         
                        </div>
                      </div>
                      }
                    </td>
                    { userData && userData?.role && userData.role !== 'editor' && 
                      <td className="text-xs  bg-white p-1">
                      {claim?.assignedTo ?
                      <div className={styles.tooltip}> 
                          <div className="flex justify-center items-center"> <Image src={Assigned} height={30} width={30} alt="assign"></Image> {claim.assignedTo.name}</div>
                        <span className={styles.tooltiptext}> Assigned</span>
                        </div>
                        : 
                         <div className={styles.tooltip}> 
                          <div className="flex justify-center items-center">
                            <button 
                              onClick={() => {handleAssignEditor(claim._id)}}
                              className=" text-black m-2 ...">
                                <div className="flex justify-center">
                                  <Image className="transition-transform duration-300 transform hover:scale-110" src={Assign} height={30} width={30} alt="assign"></Image>
                                </div>
                                <div> Assign to Editor</div>
                             
                            </button>
                            </div>
                         <span className={styles.tooltiptext}> Assign to Editor</span>
                        </div> 
                         }
                      </td>
                    }
                      <td className="text-xs  bg-white p-1">
                        <div className="flex justify-center">
                          <div className={styles.tooltip}>
                              {claim?.isGenuine === 'true' ? <Image src={Verified} width={30} height={30} alt="Verified" /> : 
                              claim?.isGenuine === 'false' ? <Image src={Cancelled} width={30} height={30} alt="Cancelled" /> : 
                              <Image src={Pending} width={30} height={30} alt="Pending" />}
                              <span className={styles.tooltiptext}>{claim?.isGenuine === 'true' ? 'Approved':  claim?.isGenuine === 'false' ? 'Rejected' : 'Pending'}</span>
                            </div>
                        </div>
                      </td>
                    </tr>
                  </>
                  ))}
                
              </tbody>
            </table>
        </div>

       { userData && userData?.role && userData?.role === 'user' && isShowForm && <div className={styles.claimsform}>
          <form className={styles.new} onSubmit={handleSubmit}>
            <div className="flex flex-row-reverse">
              <button onClick={handleFormClose}><Image className="h-5 w-5" alt="cross" src={Cross}></Image></button>
            </div>
            <h1 className="font-extrabold">{isEdit? 'Update URL Verification Data': 'Add New URL Verification'}</h1>
            <label htmlFor="title" className={styles.label}>Title</label>
            <input title="Title" type="text" onChange={handleTitleChange} value={title} required placeholder="Title" className={styles.input} />
            <label htmlFor="url" className={styles.label}>URL</label>
            <input title="Url" type="text" onChange={handleUrlChange} required  placeholder="https://someone.com" value={urlValue} className={styles.input}
              onBlur={() => {
                if (urlHelperText.length === 0 || !isUrlValid(urlValue)) {
                  const helperText = urlValue.length !== 0 && !isUrlValid(urlValue) ? "Please Provide a valid URL" : urlValue.length ===0 ? "Please Enter Url ": ""
                  setUrlHelperText(helperText)
                }
                else {
                  setUrlHelperText('')
                }
              }}
            />
            {urlHelperText && <span className={styles.helpertext}>{urlHelperText}</span>}
            <label htmlFor="supportUrl" className={styles.label}>Supporter URL</label>
            <input type="text" placeholder="https://someone.com" onChange={handleSupportUrlChange} value={supporturlValue} className={styles.input}
            onBlur={() => {
              if (supporturlHelperText.length === 0 || !isUrlValid(supporturlValue)) {
                const helperText = supporturlValue.length !== 0 && !isUrlValid(supporturlValue) ? "Please Provide a valid URL" : ""
                setsupportUrlHelperText(helperText)
              }
              else {
                setsupportUrlHelperText('')
              }
            }} />
            {supporturlHelperText && <span className={styles.helpertext}>{supporturlHelperText}</span>}
            <label htmlFor="refuterURL" className={styles.label}>Refuter Url</label>
            <input type="text" placeholder="https://someone.com" onChange={handleRefuterUrlChange} value={refuterurlValue}  className={styles.input}
            onBlur={() => {
              if (refuterurlHelperText.length === 0 || !isUrlValid(refuterurlValue)) {
                const helperText = refuterurlValue.length !== 0 && !isUrlValid(refuterurlValue) ? "Please Provide a valid URL" : ""
                setrefuterUrlHelperText(helperText)
              }
              else {
                setrefuterUrlHelperText('')
              }
            }}
            />
            {refuterurlHelperText && <span className={styles.helpertext}>{refuterurlHelperText}</span>}
            <label htmlFor="summary" className={styles.label}>Summary</label>
            <textarea
              placeholder="Summary"
              className={styles.textArea}
              cols="30"
              rows="5"
              onChange={handleSummaryChange}
              value={summary}
            ></textarea>
            <div className="flex flex-row justify-around m-2">
              <button className={`rounded-sm bg-teal-500 text-white px-4 py-2 hover:bg-teal-800 ...`} onClick={handleFormClose}>Close</button>
              <button className={`rounded-sm bg-teal-500 text-white px-4 py-2 hover:bg-teal-800 ...`}>{isEdit? 'Update' : 'Add'}</button>
            </div>
            
          </form>
        </div>}

        { userData && userData?.role && userData?.role === 'editor' && isShowForm && isEditByEditor && <div className={styles.claimsform}>
          <form className={styles.new} onSubmit={handleSubmitEditorForm}>
            <div className="flex flex-row-reverse">
              <button onClick={handleFormClose}><Image className="h-5 w-5" alt="cross" src={Cross}></Image></button>
            </div>
            <h1 className="font-extrabold">Update URL</h1>
            <label htmlFor="title" className={styles.label}>Title</label>
            <input title="title" type="text" onChange={handleTitleChangeByEditor} value={titleByEditor} disabled required placeholder="Title" className={styles.inputdisabled} />
            <label htmlFor="supportUrl" className={styles.label}>Add Supporter URL</label>
            <input type="text" placeholder="https://someone.com" onChange={handleSupportUrlChangeByEditor} value={supporterUrlByEditor} className={styles.input}
            onBlur={() => {
              if (supporturlHelperText.length === 0 || !isUrlValid(supporterUrlByEditor)) {
                const helperText = supporterUrlByEditor.length !== 0 && !isUrlValid(supporterUrlByEditor) ? "Please Provide a valid URL" : ""
                setsupportUrlHelperText(helperText)
              }
              else {
                setsupportUrlHelperText('')
              }
              seteditorFromErrorText('')
            }} />
            {supporturlHelperText && <span className={styles.helpertext}>{supporturlHelperText}</span>}
            <label htmlFor="refuterURL" className={styles.label}>Add Refuter Url</label>
            <input type="text" placeholder="https://someone.com" onChange={handleRefuterUrlChangeByEditor} value={refuterUrlByEditor}  className={styles.input}
            onBlur={() => {
              if (refuterurlHelperText.length === 0 || !isUrlValid(refuterUrlByEditor)) {
                const helperText = refuterUrlByEditor.length !== 0 && !isUrlValid(refuterUrlByEditor) ? "Please Provide a valid URL" : ""
                setrefuterUrlHelperText(helperText)
              }
              else {
                setrefuterUrlHelperText('')
              }
              seteditorFromErrorText('')
            }}
            />
            {refuterurlHelperText && <span className={styles.helpertext}>{refuterurlHelperText}</span>}
            {editorFromErrorText && <span className={styles.helpertext}>{editorFromErrorText}</span>}
            <div className="flex flex-row justify-around m-2">
              <button className={`rounded-sm bg-teal-500 text-white px-4 py-2 hover:bg-teal-800 ...`} onClick={handleFormClose}>Close</button>
              <button  className={`rounded-sm bg-teal-500 text-white px-4 py-2 hover:bg-teal-800 ...`}>Update</button>
            </div>
          </form>
        </div>}
      </div>
     { userData && userData?.role && userData.role === 'editor' && <div> <h1 className="text-5xl py-5">Approved/Rejected Claims List</h1>
        <div className={ (userData && userData?.role && userData?.role === 'user') ? styles.claims : styles.claimsfull}>
              <table className=" border-collapse table-fixed w-full bg-slate-500 break-words text-center border-spacing-2 border border-slate-500 rounded-md shadow-md">
                <thead>
                  <tr>
                    <th className=" py-4 bg-slate-700 text-white">Title</th>
                    <th className="py-4 bg-slate-700  text-white">Url</th>
                    <th className="py-4 bg-slate-700  text-white">Summary</th>
                    <th className="py-4 bg-slate-700  text-white">Support Url</th>
                    <th className="py-4 bg-slate-700  text-white">Refuter Url</th>
                    <th className="py-4 bg-slate-700  text-white">Action</th>
                    {
                      userData && userData?.role && userData.role !== 'editor' && 
                      <th className="py-4 bg-slate-700  text-white">Assigned To</th>
                    }
                      <th className="py-4 bg-slate-700  text-white">Status</th>
                    
                    
                  </tr>
                </thead>
                <tbody>
                {isLoading && userDataLoading
                  ? <tr>
                      <td colSpan="7">
                      <div className="flex flex-row justify-center p-1 m-1">
                        <div class={styles.dot_spinner} >
                          <div class={styles.dot_spinner__dot}></div>
                          <div class={styles.dot_spinner__dot}></div>
                          <div class={styles.dot_spinner__dot}></div>
                          <div class={styles.dot_spinner__dot}></div>
                          <div class={styles.dot_spinner__dot}></div>
                          <div class={styles.dot_spinner__dot}></div>
                          <div class={styles.dot_spinner__dot}></div>
                          <div class={styles.dot_spinner__dot}></div>
                      </div>
                      </div>
                    
                    </td>
                    </tr>
                  : (verifiedData?.length > 0) ? verifiedData?.map((claim) => (
                    <>
                      <tr className="border border-separate border-spacing-5 border-slate-950">
                      <td className="text-xs  bg-white p-1"><Link href={{ pathname: `/view/${claim._id}` }}>{claim.title}</Link></td>
                      <td className="text-xs  bg-white px-2 py-1"><a className="hover:font-bold underline underline-offset-1" href={claim.url} target="_blank">{claim.url}</a></td>
                      <td className="text-xs  bg-white px-2 py-1">{claim.summary}</td>
                      <td className="text-xs  bg-white p-1">
                        <div className={styles.tooltip}> 
                          <a className="flex justify-center hover:text-lime-400 font-bold underline underline-offset-1" href={claim.supportUrl ? claim.supportUrl : '#'} target="_blank">
                          <Image className={claim.supportUrl.length > 0 ? `transition-transform duration-300 transform hover:scale-110`: ''} alt="supporter" src={Supporter} height={30} width={30}></Image></a>
                          {claim.supportUrl.length> 0 &&<span className={styles.tooltiptext}>Go to Supporter Link</span>}
                        </div> 
                        
                      </td>
                      <td className="text-xs  bg-white p-1">
                        <div className={styles.tooltip}> 
                          <a className="flex justify-center hover:text-orange-700 font-bold underline underline-offset-1" href={claim.refuterUrl ? claim.refuterUrl : '#'} target="_blank"> 
                            <Image className={claim.refuterUrl.length > 0 ? `transition-transform duration-300 transform hover:scale-110`: ''} alt="refuter" src={Refuter} height={30} width={30}></Image>
                          </a>
                          {claim.refuterUrl.length> 0 && <span className={styles.tooltiptext}>Go to Refuter Link</span>}
                          </div>
                        </td>
                      <td className="text-xs  bg-white p-1"> 
                        {
                        userData && userData?.role && userData.role === 'editor' &&
                        <>
                         <div className={styles.tooltip}> 
                          <button 
                              onClick={() => {handleProceedForVerification(claim._id)}} 
                              className={`px-4 py-2 ...`}>
                              <Image className="transition-transform duration-300 transform hover:scale-110" src={ViewVerification} height={30} width={30} alt="view-verification"></Image>
                            </button>
                         <span className={styles.tooltiptext}> View Claim</span>
                        </div> 
                        
                         
                        </>
                        }
                      </td>
                        <td className="text-xs  bg-white p-1">
                        <div className="flex justify-center">
                          <div className={styles.tooltip}> 
                          {claim?.isGenuine === 'true' ? <Image src={Verified} width={30} height={30} alt="Verified" /> : 
                            claim?.isGenuine === 'false' ? <Image src={Cancelled} width={30} height={30} alt="Cancelled" /> : 
                            <Image src={Pending} width={30} height={30} alt="Pending" />}
                          <span className={styles.tooltiptext}>{claim?.isGenuine === 'true' ? 'Approved':  claim?.isGenuine === 'false' ? 'Rejected' : 'Pending'}</span>
                          </div> 
                        
                          </div>
                        </td>
                      </tr>
                    </>
                    ))
                  : <tr>
                      <td colSpan="7" className="text-xs  bg-white p-1">
                        No Data Available
                      </td>
                    </tr>}
                  
                </tbody>
              </table>
          </div>
        </div>
      }
      </div>
      </div>
    );
  }
};

export default Dashboard;
