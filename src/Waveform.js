import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
// import style from "./wave.module.css";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";
import { Icon } from "@iconify/react";



const Waveform = forwardRef((props, ref) => {
    const color = props.color
    useEffect(()=>{
        console.log(color)
    },[])
    const formWaveSurferOptions = (ref) => ({
        container: ref,
      
        
      
        splitChannels: false,
        splitChannelsOptions: {
          overlay: false,
          
          normalize: true,
      
          filterChannels: [
                            3
          ],
      
       
        
        channelColors: {
            0: color
        }},
      
        // waveColor: "#eee",
        // progressColor: "#67b3e2",
        cursorColor: "OrangeRed",
        barWidth: 5,
        barRadius: 2,
        responsive: true,
        height: 100,
        normalize: true,
        partialRender: true,
        interact: true,
        plugins: [
          CursorPlugin.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              'background-color': '#000',
              color: '#fff',
              padding: '2px',
              'font-size': '10px'
            }
        })
        ]
      });

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const url = props.src

  //추가
  let [currentTime, setCurrentTime] = useState('');
  let [min, setMin] = useState(0);
  let [sec, setSec] = useState(0);
  let [totalTime, setTotalTime] = useState('');
  let [tMin, setTMin] = useState(0);
  let [tSec, setTSec] = useState(0);

  //추추가
  // let [pauseTime, setPauseTime] = useState(0);
  // let [pMin, setPMin] = useState(0);
  // let [pSec, setPSec] = useState(0);

  //import 해서 사용 //.current.함수 로 사용하기 위해 선언
  useImperativeHandle(ref, () => ({
    // 부모 컴포넌트에서 사용할 함수를 선언
    PlayAll,handlePlayPause
  }))
  // useHandle(ref , ()=>({
  //   handlePlayPause
  // }))

  function PlayAll() {
    setPlay(!playing);
    wavesurfer.current.playPause();
    console.log("abc")
  }

  useEffect(() => {
    // setPlay(false);


    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    console.log(url);
    wavesurfer.current.load(url);


    // wavesurfer.current.on("seek", function () {
    //   pauseTime = wavesurfer.current.getCurrentTime();
    //   setPauseTime(pauseTime);
    //   pMin = Math.floor(pauseTime / 60);
    //   setPMin(pMin);
    //   pSec = Math.round(pauseTime % 60);
    //   setPSec(pSec);
    // })

    wavesurfer.current.on("ready", function () {
      totalTime = wavesurfer.current.getDuration();
      setTotalTime(totalTime);
      tMin = Math.floor(totalTime / 60);
      setTMin(tMin);
      tSec = Math.round(totalTime - (tMin * 60));
      setTSec(tSec);

      // pauseTime = wavesurfer.current.getDuration();
      // setPauseTime(pauseTime);
    })

    wavesurfer.current.on("audioprocess", function () {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
        currentTime = wavesurfer.current.getCurrentTime();
        setCurrentTime(currentTime);
        min = Math.floor(currentTime / 60);
        setMin(min);
        sec = Math.round(currentTime % 60);
        setSec(sec);
      }
    });
    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = e => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  // const [hover, setHover] = useState<string>('');

  // 멈춰 !!!!
  // let a = pMin + ":" + pSec
  // const [isHovering, setIsHovering] = useState(false);

  // const handleMouseOver = () => {
  //   setIsHovering(true);
  // };

  // const handleMouseOut = () => {
  //   setIsHovering(false);
  // };
  const test = () => {
    console.log(waveformRef.current)
  }
  return (
    <>
      <div>

        {/* <span className={style.pauseTime}> {a}</span> */}

        <div><button onClick={handlePlayPause}>{!playing ? <Icon icon="mdi:play" color="#6091eb" width="24" /> : <Icon icon="mdi:pause" color="#6091eb" width="24" />}</button>{" "}
        <span>{min}:{sec}</span> - <span>{tMin}:{tSec}</span>
        </div> 

       


        <div id="waveform" ref={waveformRef} />
        {/* <p className ={style.explain} >{a}</p>  */}

        
        <div style={{float:'right'}}>
          {/* <button onClick={handlePlayPause}>{!playing ? "Play" : "Pause"}</button> */}
          {/* <button onClick={test}>asdasd</button> */}
          <label htmlFor="volume"><Icon icon="material-symbols:volume-down-rounded" color="#6091eb" width="18" /></label>
          {" "}
          <input
            type="range"
            id="volume"
            name="volume"
            min="0.01"
            max="1"
            step=".025"
            onChange={onVolumeChange}
            defaultValue={volume}
            color="#3523d2"
          />
          {/* <label htmlFor="volume">Volume</label> */}
        </div>
      </div>

    </>
  );
}); 

export default Waveform;