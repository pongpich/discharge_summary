import React, { useState, useEffect } from "react";
import LoGo from "../kkr.png";
import { useParams } from "react-router";
import axios from "axios";
import BaseUrl from "../api/BaseUrl";
import ReactLoading from "react-loading";
import Barcode from "react-barcode";
import {
  formatYearMonthDayTime,
  formatDayMonthYearTimeThai,
  currentYearMonthDay,
} from "../utils/utils.js";
import urlencode from "urlencode";
import { nl2br } from 'react-js-nl2br';

function Report() {
  const [header, setHeader] = useState([]);
  const [patient, setPatient] = useState([]);
  const [done, setDone] = useState(true);
  const [ocr, setOcr] = useState([]);
  const { ocmnum, chtnum, seq, user } = useParams();
  const nl2br = require('react-nl2br');
  const [bigdatastate, setBigdatastate] = useState([]);
  const [vs, setVS] = useState([]);
  // const [patient2, setPatient2] = useState([]);
  const [homemet, setHomemet] = useState([]);

  let bigdata = [];
  let setData = [];
  let dataList = [];

  useEffect(() => {
    getPatientInfo();
  }, []);

  const getPatientInfo = async () => {

    const request_Patient_Report = {
      params: {
        dbServiceName: "HSPatientInfo",
        ocmnum: ocmnum,
      },
    };
    await axios
      .get(
        `${BaseUrl.ram_internet_discharge_summary_newborn_patient_DBService_JSON_path}`,
        request_Patient_Report
      )
      .then((response) => {
        const responseData = response.data.result;
        // setPatient2(patientinfo);

        setPatient(response.data.result);
        // console.log("patienttest", patientinfo);

        console.log("patient", responseData);
        getHistory();
      })
      .catch((error) => {
        console.error(error);
      });

  };

  const getHistory = async () => {
    let setRequst = [];

    for (let i = 1; i <= 20; i++) {
      if (i >= 10) {
        const requestBody = {
          params: {
            dbServiceName: "SWPatientPhysicalExam",
            ocmnum: ocmnum,
            type: "DSCSUM",
            topic: "DSC0" + [i],
          }
        };
        setRequst.push(
          await axios
            .get(
              `${BaseUrl.ram_internet_discharge_summary_newborn_patient_DBService_JSON_path}`,
              requestBody
            )
            .then((response) => {
              const responseData = response.data.result;

              // if (((response.data.result[0]['dataType']) === "IMAGE")) {
              //   if (response.data.result[0]['seq']) {
              //     if ((response.data.result[0]['seq'] != "0")) {


              //       axios.get('http://10.150.212.182:8080/Report/DBService_JSON?dbServiceName=SWPhysicalExamImageList&seq='+response.data.result[0]['seq'])
              //         .then(res => {
              //           const imageFullPath = res.data.result[0]['imageFullPath'];
              //         })
              //     }
              //   }

              // console.log(responseData, 'response2');
              // }
              bigdata.push(responseData);
            })
            .catch((error) => console.error(error))
        );
      } else {
        const requestBody = {
          params: {
            dbServiceName: "SWPatientPhysicalExam",
            ocmnum: ocmnum,
            type: "DSCSUM",
            topic: "DSC00" + [i],
          }
        };
        setRequst.push(
          await axios
            .get(
              `${BaseUrl.ram_internet_discharge_summary_newborn_patient_DBService_JSON_path}`,
              requestBody
            )
            .then((response) => {
              const responseData2 = response.data.result;
              // console.log(responseData2, 'response1');
              bigdata.push(responseData2);
            })
            .catch((error) => console.error(error))
        );
      }
    }
    console.log(bigdata, 'bigdata');
    // console.log(bigdatastate, 'bigdata2');
    // getVS();

    setBigdatastate(bigdata);

  }

  function ocrheader() {
    // if (setData.length > 0) {
    console.log("Body", setData);
    getOcrNumber();
    // getData();
    // setDone(true);
    // }
  }
  const getOcrNumber = () => {

    if (user.trim()) {


      const request_config = {
        params: {
          prm_ocm: urlencode(ocmnum.trim()), //ocm
          prm_date: urlencode(currentYearMonthDay()), //date
          prm_type: urlencode("ACC15"), //รหัสเอกสาร
          prm_user: urlencode(user), //user ใช้งาน
        },
      };

      axios
        .get(
          `http://10.154.212.181/AWSqlConnect/RequestOCR.php`,
          request_config
        )
        .then(async (response) => {
          try {
            let responseData = await response.data;
            console.log(responseData, 'ocrdata');
            await setOcr(responseData);
            await setTimeout(() => {
              window.print();
            }, 2000);
            console.log('You clicked window print.');
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const getData = () => {
    setData.map((body, i) => {
      body.map((list, i) => {
        dataList.push(list);
      });
    });

    console.log("list", dataList);

  };

  return (
    <>
      {(bigdatastate.length)
        ?
        <div className=" ">
          {!done ? null : (
            <div className=" px-5 py-2 w-screen text-3xl font-bold shadow-lg items-center bg-slate-50 flex space-x-6 mb-3">
              {/* <img src={LoGo} className=" " width="300" alt="" /> */}
              <p classname="">Discharge Summary</p>
              <button
                onClick={() => {
                  // getOcrNumber();
                  window.print();
                }}
                className=" border-black rounded-md hover:bg-indigo-900 h-10  hover:text-white border parafont2 px-5 "
              >
                Print
              </button>
            </div>
          )}
          <div >
            <page
              size="A4"
              id="section-to-print"
              className="div-container-print "
            >


              <thead>

                <p style={{ textAlign: "center", fontSize: "35px" }}><b>โรงพยาบาลธนบุรี-ชุมพร</b></p>
                <p style={{ textAlign: "center", fontSize: "35px", marginTop: "-15px" }}><b>In-patient summary record</b></p>

              </thead>
              <tbody>
                <header className="grid grid-cols-1 parafont" style={{marginTop:"30px", marginBottom: "10px", lineHeight: "normal" }}>
                  <div className="header-1 ">
                    {patient.map((data, i) => (
                      <>
                        <div className="border border-black   border-b-0 pl-1 place-items-center">
                          {/* <div>
                      ............................................................................................................................................................................................
                    </div> */}

                          <div className=" grid grid-cols-4 gap-3 " style={{}}>
                            <div className=" col-span-2">
                              <b>Patient Name:</b>&nbsp;{data.name}
                            </div>
                            <div className=" col-span-1">
                              <b>HN:</b>&nbsp;{data.chtnum}
                            </div>
                            <div className=" col-span-1">
                              <b>AN:</b>&nbsp;{data.AN_VN}
                            </div>
                          </div>
                          <div className=" grid grid-cols-5 gap-3 " style={{}}>
                            <div className=" col-span-1">
                              <b>Date of Birth:</b>&nbsp;{data.BirthDte}
                            </div>
                            <div className=" col-span-1">
                              <b>Age:</b>&nbsp;{data.age}
                            </div>
                            <div className=" col-span-1">
                              <b>Sex:</b>&nbsp;{data.gender}
                            </div>
                            <div className=" col-span-1">
                              <b>Marltal Status:</b>
                            </div>
                            <div className=" col-span-1">
                              <b>ID No:</b>&nbsp;{data.ocmnum}
                            </div>
                          </div>


                          <div className=" grid grid-cols-4 gap-3 " style={{}}>
                            <div className=" col-span-3">
                              <b>Address:</b>&nbsp;{data.AddressCurrent}
                            </div>
                            <div className=" col-span-1">
                              <b>Occupation:</b>
                            </div>
                          </div>
                          <div className=" grid grid-cols-4 gap-3 " style={{}}>
                            <div className=" col-span-1">
                              <b>Ethnic Group:</b>
                            </div>
                            <div className=" col-span-1">
                              <b>Religion:</b>&nbsp;{data.Religion}
                            </div>
                            <div className=" col-span-2">
                              <b>Person To be:</b>
                            </div>
                          </div>
                          <div className=" grid grid-cols-4 gap-3 " style={{}}>
                            <div className=" col-span-1">
                              <b>ความสัมพันธ์:</b>
                            </div>
                            <div className=" col-span-3">
                              <b>Address Person To be:</b>
                            </div>
                          </div>
                          <div className=" grid grid-cols-2 gap-3 " style={{}}>
                            <div className=" col-span-1">
                              <b>สิทธิ์ที่ใช้:</b>
                            </div>
                            <div className=" col-span-1">
                              <b>Tel:</b>&nbsp;{data.Phone}
                            </div>
                          </div>

                        </div>


                        <div className="border border-black   border-b-0 pl-1 place-items-center">
                          <div className=" grid grid-cols-6 gap-3 " style={{}}>
                            <div className=" col-span-2">
                              <b>Date Time of Admission:</b>&nbsp;{data.VisitDte}
                            </div>
                            <div className=" col-span-2">
                              <b>Date Time of Discharge:</b>&nbsp;{data.DCDte}
                            </div>
                            <div className=" col-span-1">
                              <b>Ward:</b>
                            </div>
                            <div className=" col-span-1">
                              <b>Room:</b>&nbsp;{data.room}
                            </div>
                          </div>
                        </div>
                        <div className="border border-black   border-b-0 pl-1 place-items-center">
                          <div className=" grid grid-cols-3 gap-3 " style={{}}>
                            <div className=" col-span-1">
                              <b>Department:</b>&nbsp;{data.departmentCode}
                            </div>
                            <div className=" col-span-1">
                              <b>Length of Stay: Days</b>&nbsp;{data.admitDay}
                            </div>
                            <div className=" col-span-1">
                              <b>Birth Weight:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gms</b>
                            </div>
                          </div>
                        </div>
                      </>))}

                    <div className=" grid grid-cols-12  border border-black   border-b-0 tableborder">

                      <div className="col1 col-span-1 border border-black  border-y-0 border-l-0  pl-1" >

                        18
                      </div>
                      <div className="tobleft col-span-6 border border-black border-l-0 border-y-0 border-r-0 pl-1 lab" >
                        <p><b>DIAGNOSIS</b></p>
                        {bigdatastate[9].map((data, i) => (
                          <>

                            {(i < 5) && (data.codeValue === "Y")
                              ? (
                                <p style={{}}>({i + 1})&#10004;{data.title}: {data.textValue}</p>
                              )

                              : (i < 5) && (data.codeValue != "Y") ? (
                                <p style={{}}>({i + 1}){data.title}:</p>
                              )
                                : <div>

                                </div>
                            }
                            {/* {i < 5 &&
                              <p style={{}}>({i + 1}){data.title}</p>
                            } */}
                          </>))}
                      </div>
                      <div className=" col-span-5 border border-black  border-y-0 border-r-0 pl-1 lab" >
                        {bigdatastate[9].map((data, i) => (
                          <>
                            {(i == 5) ? (
                              <p>{data.title}: {data.textValue}</p>
                            )
                              : (i > 5) ? (<p className="border border-black border-r-0 ">{data.title}: {data.textValue}</p>
                              )
                                : <div></div>
                            }
                          </>
                        ))}
                      </div>
                    </div>

                    <div className=" grid grid-cols-12  border border-black   border-b-0 tableborder">
                      <div className="col1 col-span-1 border border-black  border-y-0 border-l-0 border-r-0 pl-1" >
                        19
                      </div>
                      <div className="tobleft2 col-span-11 border border-black  border-y-0 border-r-0 pl-1 lab" >
                        <div className=" grid grid-cols-10 gap-1 " style={{}}>
                          <div className=" col-span-7">
                            <p><b>OPERATION</b></p>
                            <p>OPERATING ROOM PROCEDURES</p>
                          </div>
                          <div className="cen col-span-1">
                            <br />
                            <p>DATE</p>
                          </div>
                          <div className="cen col-span-1">
                            <br /> <p>TIME IN</p>
                          </div>
                          <div className="cen col-span-1">
                            <br /> <p>TIMEOUT</p>
                          </div>
                        </div>
                        <div className=" grid grid-cols-10 gap-1 " style={{}}>
                          <div className=" col-span-7">
                            <p>1....................................................................................................................................................................................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                        </div>
                        <div className=" grid grid-cols-10 gap-1 " style={{}}>
                          <div className=" col-span-7">
                            <p>2....................................................................................................................................................................................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                        </div>
                        <div className=" grid grid-cols-10 gap-1 " style={{}}>
                          <div className=" col-span-7">
                            <p>3....................................................................................................................................................................................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                        </div>
                        <div className=" grid grid-cols-10 gap-1 " style={{}}>
                          <div className=" col-span-7">
                            <p>4....................................................................................................................................................................................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                          <div className=" col-span-1">
                            <p>........................</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" grid grid-cols-12  border border-black   border-b-0 tableborder">
                      <div className="col1 col-span-1 border border-black  border-y-0 border-l-0 border-r-1 pl-1" >
                        20
                      </div>
                      <div className="tobleft col-span-6 border border-black  border-y-0 border-l-0 border-r-0 pl-1 lab" >
                        <p className=""><b>IMPORTANT NON OPERATING ROOM PROCEDURES</b></p>
                        <p>1...........................................................................................................................................</p>
                        <p>2...........................................................................................................................................</p>
                        <p>3...........................................................................................................................................</p>
                      </div>
                      <div className=" col-span-5 border border-black  border-y-0 border-r-0 pl-1 lab" >
                        <p>DIAGNOSIS ICD CODING BY CODER: ......................................................</p>
                        <div className="border border-black border-r-0" >
                          <p>MAIN (มีได้รหัสเดียว)</p><br />
                        </div>
                      </div>
                    </div>
                    <div className=" grid grid-cols-12  border border-black   border-b-0 tableborder">
                      <div className="col1 col-span-1 border border-black  border-y-0 border-l-0 pl-1" >
                        21
                      </div>
                      <div className="tobleft col-span-11 border border-black  border-l-0 border-y-0 border-r-0 pl-1 lab" >
                        <p className=""><b>Clinic Summary (สาเหตุ/ปัญหา, Investigate, Threatment, pian, HM)</b></p>
                        <p>.......................................................................................................................................................................................................................................................................</p>
                        <p>.......................................................................................................................................................................................................................................................................</p>
                        <p>.......................................................................................................................................................................................................................................................................</p>
                        <p>.......................................................................................................................................................................................................................................................................</p>
                      </div>

                    </div>
                    <div className=" grid grid-cols-12  border border-black   border-b-0 tableborder">
                      <div className=" col-span-7 border border-black  border-y-0 border-l-0 border-r-0 pl-1 lab" >
                        <p><b>22. DISCHARGE STATUS</b></p>
                      </div>
                      <div className=" col-span-5 border border-black  border-y-0 border-r-0 pl-1 lab" >
                        <p><b>23. DISCHARGE TYPE</b></p>
                      </div>
                    </div>
                    <div className=" grid grid-cols-12  border border-black   border-b-0 tableborder">
                      <div className=" col-span-7 border border-black  border-y-0 border-l-0 border-r-0 pl-1 lab" >
                        <div className=" grid grid-cols-2 gap-3 " style={{}}>
                          {bigdatastate[1].map((data, i) => (
                            <>
                              {data.codeValue === "Y"
                                ?
                                <div className=" col-span-1">
                                  <p>{i + 1}.&#10004;{data.title} [{data.textValue}] </p>
                                </div>

                                : <div className=" col-span-1">
                                  <p>{i + 1}.{data.title}</p>
                                </div>
                              }
                            </>
                          ))}
                        </div>
                      </div>
                      <div className=" col-span-5 border border-black  border-y-0 border-r-0 pl-1 lab" >
                        <div className=" grid grid-cols-2 gap-3 " style={{}}>
                          {bigdatastate[2].map((data, i) => (
                            <>
                              {data.codeValue === "Y" && i <= 6
                                ?
                                <div className=" col-span-1">
                                  <p>{i + 1}.&#10004;{data.title} [{data.textValue}] </p>
                                </div>

                                : (data.codeValue != "Y" && i <= 6) &&
                                <div className=" col-span-1">
                                  <p>{i + 1}.{data.title}</p>
                                </div>
                              }
                            </>
                          ))}
                        </div>
                        <br />
                        <div className=" grid grid-cols-5 gap-1 " style={{}}>
                          <div className=" col-span-2">
                            ชื่อสถานพยาบาลที่ส่งต่อ
                          </div>
                          <div className=" col-span-3">
                            {bigdatastate[2].map((data, i) => (
                              <>
                                {data.title === "ชื่อสถานพยาบาลที่ส่งต่อ" &&
                                  <div className=" col-span-1">
                                    {data.textValue}
                                  </div>
                                }
                              </>
                            ))}
                          </div>
                        </div>
                        <div className=" grid grid-cols-5 gap-1 " style={{}}>
                          <div className=" col-span-2">
                            เหตุผลในการส่งต่อ
                          </div>
                          <div className=" col-span-3">
                            {bigdatastate[2].map((data, i) => (
                              <>
                                {data.title === "เหตุผลการส่งต่อ" &&
                                  <div className=" col-span-1">
                                    {data.textValue}
                                  </div>
                                }
                              </>
                            ))}
                          </div>
                        </div>
                        <div className=" grid grid-cols-3 " style={{}}>

                          {bigdatastate[2].map((data, i) => (
                            <>
                              {(i >= 9) && (data.codeValue === "Y") ?
                                <div className=" col-span-1">
                                  (&#10004;){data.title}
                                </div>
                                : (i >= 9) && (data.codeValue != "Y") &&
                                <div className=" col-span-1">
                                  (&nbsp;&nbsp;&nbsp;){data.title}
                                </div>

                              }
                            </>
                          ))}

                        </div>
                      </div>
                    </div>
                    <div className="border border-black pl-1 place-items-center tableborder">
                      <div className="grid grid-cols-2 gap-3 " style={{ marginTop: "40px" }}>
                        <div className=" col-span-1" >
                          <p style={{ marginLeft: "88px" }}>ATTENDING</p>
                          <p style={{ marginLeft: "88px", marginTop: "20px" }}>PHYSICIAN ...............................................................</p>
                          <p style={{ textAlign: "center" }}>SIGNATURE</p>
                        </div>
                        <div className=" col-span-1" >
                          <p style={{ marginLeft: "88px" }}>APPROVED</p>
                          <p style={{ marginLeft: "88px", marginTop: "20px" }}>BY ...............................................................</p>
                          <p style={{ textAlign: "center" }}>SIGNATURE</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </header>
                <div className="w-full grid grid-cols-3" style={{ marginTop: "30px" }}>
                  <div className="hidden w-80"><b></b></div>
                  <div className="hidden text-center w-60 "><b></b></div>
                  <div className="hidden text-right w-71" style={{ marginRight: "25px", fontSize: "23px" }}>F-IPD-001-00</div>
                </div>
              </tbody>

            </page>
          </div>
        </div>
        : <div className="justify-center flex mt-96 content-center ">
          <ReactLoading
            type={"spin"}
            color={"#3c4187"}
            height={100}
            width={100}
          />
        </div>
      }

    </>
  );
}

export default Report;