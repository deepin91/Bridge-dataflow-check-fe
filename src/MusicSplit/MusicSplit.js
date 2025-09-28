import { useEffect, useState } from "react";
import axios from "axios";
import Waveform from "../Waveform";
import style from './MusicSplit.module.css';
import musicfile_upload from './icons/MusicFileIcon.png'
import { Icon } from '@iconify/react';

// import Dropzone from 'react-dropzone';




const MusicSplit = () => {

  const [data, setData] = useState([]);
  const [musicUUID, setMusicUUID] = useState('');
  const [files, setFiles] = useState([]);

  const [clicked, setClicked] = useState(false);

  //컨테이너 true 면 loading
  const [isLoading, setIsLoading] = useState(false);
  //컨테이너 false 면 completed
  const [isSplitCompleted, setIsSplitCompleted] = useState(false);
  const [music, setMusic] = useState('');





  // 분리할 음원 파일 업로드
  const musicSubmit = (e) => {
    e.preventDefault();
    let files = music;
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    axios({
      method: 'POST',
      url: `http://localhost:8080/api/insertMusicForSplit/1`,
      headers: { 'Content-Type': 'multipart/form-data;' },
      data: formData
    }).then((response) => {
      console.log("축 성공");
      let musicInfo = { musicTitle: response.data.fileNames, musicUUID: response.data.uuid }
      setData([...data, musicInfo]);
      console.log(response.data.uuid);
      setMusicUUID(response.data.uuid);
      alert(`업로드가 성공했습니다. 분리 시작 버튼을 눌러주세요.`)
    }).catch(() => {
      alert(`업로드 중 오류가 발생했습니다.`);
    });
  };

  // 분리 확인 버튼 연결 핸들러
  const handleCheck = (e) => {
    e.preventDefault();
    console.log(musicUUID);
    //
    axios.get(`http://localhost:8080/api/splitedMusic/${musicUUID}`)
      .then(response => {
        const fileNames = response.data;
        if (fileNames.length === 0) {
          alert('분리된 음악 파일이 존재하지 않습니다.');
        } else {
          console.log(fileNames);
          setFiles(fileNames);
          setClicked(true);
        }
      })
      .catch(error => {
        console.log(error);
      });

  };

  // 분리 시작 버튼 클릭시 함수2개 호출
  const startSplit = () => {
    handleMusicSplit();
    handleIsRunning();
  }
  // 음원 분리 컨테이너 실행
  const handleMusicSplit = () => {
    axios.get(`http://localhost:8080/api/docker/${musicUUID}`)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
        console.log("분리 오류 url ==> " + `/api/docker/${musicUUID}`);
        alert(`오류가 발생했습니다 (${error.message})`);
      });
  };

  //컨테이너 동작 확인 버튼 핸들러
  const handleIsRunning = () => {
    setIsLoading(true);
    setIsSplitCompleted(false);

    const interval = setInterval(() => {
      axios.get(`http://localhost:8080/api/IsDockerRun`)
        .then(response => {
          if (response.data === false) {
            clearInterval(interval);
            setIsLoading(false);
            setIsSplitCompleted(true);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, 1000);
  };

  
  useEffect(() => {
    console.log(files)
  }, [])





  return (

    <>

      <section className={style.Page}>
        <div className={style.above_title}>
          <div className={style.music_title}>
            <div className={style.music_title2}>


              {/* 분리할 음원 파일 제출하는 form  */}
              {/* <div className={style.form_submit}> */}
              {/* <form className={style.download} onSubmit={(e) => musicSubmit(e)}> */}
              <button className={style.arrow} type='button' data-button='true'>
                {/* <div className={style.button_inner}>
                                    <span className={style.button_lable}>
                            <img src={musicfile_upload} className={style.music_upload} alt="음악 파일 첨부"></img>
                                    </span> */}

                {/* </div> */}
              </button>


              <div className={style.form_submit}>
                {/* <div className={style.download}> */}

                {/* <div className={style.button_inner}>
                                    <span className={style.button_lable}>
                            <img src={musicfile_upload} className={style.music_upload} alt="음악 파일 첨부"></img>
                                    </span> */}

                {/* <div className={style.download}> */}
                <div className={style.button_inner}>
                  <div className={style.download}>
                    <span className={style.button_lable}>

                      <img src={musicfile_upload} className={style.music_upload} alt="음악 파일 첨부"></img>

                    </span>


                    <div className={style.fileName}>
                      <input className={style.upload_file} type="file" name="profile_files" multiple="multiple" onChange={(e) => setMusic(e.target.files)} />
                      {isLoading && <div className={style.splitStatus}> 분리 중 입니다.</div>}
                      {isSplitCompleted && <div className={style.splitStatus}> 분리가 완료되었습니다.</div>}
                    </div>


                    <button className={style.upload_submit} onClick={musicSubmit} >제출</button>

                    {/* <button className={style.upload_submit} onClick={musicSubmit} > 갯수 선택 </button>

                    <select className={style.upload_submit} onChange={handlerInstrument}>
                        <option value="" disabled selected> 갯수 선택 </option>
                        <option value="2"> MR / Voice </option>
                        <option value="4"> Drums / Bass / Others / Vocals </option>
                        <option value="5"> Drums / Bass / Others / Vocals / Piano </option>
                    </select> */}


                    <button className={style.split} onClick={startSplit}>분리 시작</button>






                    {/* {isLoading && <div className={style.splitStatus}> 분리중입니다.</div>}
            {isSplitCompleted && <div className={style.splitStatus}> 분리가 완료되었습니다.</div>} */}

                    {/* <div className={style.download}>
              <button  className={style.upload_submit} type="submit" >제출</button>
              <button className={style.split} onClick={startSplit}>분리 시작</button> */}
                  </div>
                </div>
              </div>
              {/* </form> */}

            </div>
          </div>
        </div>



        <div>

          {!clicked && <div className='container clearfix'>
            <div className={style.info}>
              <h2>음원 분리</h2>
              <h3>Music Split</h3>
              <p>1. '선택된 파일 없음'을 클릭해 파일을 넣는다.</p><br />
              <p>2. 제출버튼을 클릭해 확인한다.</p><br />
              <p>3. 분리 시작 버튼을 누른 뒤 잠시 기다린다.</p><br />
              <p>4. '분리가 완료되었습니다.'라는 문장이 나오면 분리 확인 버튼을 누른다.</p><br />
            </div>
          </div>}


          <ul className={style.splitIng}>
            {/* 분리 상태 메세지 */}
            {/* {isLoading && <div> 분리중입니다.</div>}
          {isSplitCompleted && <div> 분리가 완료되었습니다.</div>} */}

            {/* 분리확인 버튼 클릭시 만들어진 map 이 화면에 보여짐 */}
            <div className={style.checkSplit}>
              {!clicked && <button onClick={handleCheck}>분리 확인</button>}
            </div>

            {/* 분리된 음원파일 다운로드 링크 및 재생 파형 만드는 Map */}
            {
              files && files.map((fn, idx) => {
                const url = `http://localhost:8080/api/downloadSplitedMusic/${musicUUID}/${fn}`;

                return (
                  <>
                    <div className={style.inst_list}>
                      <li className={style.instruments}><a style={{ marginTop: '40px', fontWeight: '600', letterSpacing: '0.5px' }} href={url}>{fn}<br /><br /><Icon icon="bx:download" color="#141515" width="18" /></a>



                      </li>
                      {/* <Waveform   src={`http://localhost:8080/api/getSplitedMusic/${musicUUID}/${fn}`} /> */}
                      {
                        idx == 0 && <Waveform color={{ waveColor: "#eee", progressColor: "#67b3e2" }} src={`http://localhost:8080/api/getSplitedMusic/${musicUUID}/${fn}`} />
                      }
                      {
                        idx == 1 && <Waveform color={{ waveColor: "#eee", progressColor: "#df923f" }} src={`http://localhost:8080/api/getSplitedMusic/${musicUUID}/${fn}`} />
                      }

                      {
                        idx == 2 && <Waveform color={{ waveColor: "#eee", progressColor: "#dcd44c" }} src={`http://localhost:8080/api/getSplitedMusic/${musicUUID}/${fn}`} />
                      }

                      {
                        idx == 3 && <Waveform color={{ waveColor: "#eee", progressColor: "#76c654" }} src={`http://localhost:8080/api/getSplitedMusic/${musicUUID}/${fn}`} />
                      }

                      {
                        idx == 4 && <Waveform color={{ waveColor: "#eee", progressColor: "#947AF0" }} src={`http://localhost:8080/api/getSplitedMusic/${musicUUID}/${fn}`} />
                      }


                    </div>
                  </>
                )
              })
            }
          </ul>

        </div>


      </section>
    </>
  );
};


export default MusicSplit;