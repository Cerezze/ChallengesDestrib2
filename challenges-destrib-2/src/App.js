import { challengeBucket } from "./DB/challengeBucket";
import { user } from "./DB/user";
import { useEffect, useState } from "react";

function App() {
  const [u, setUser] = useState({});
  const [cb, setChallengeBucket] = useState([]);
  const [dayTasks, setDayTasks] = useState([]);
  const [cBL, setChallengeBucketLength] = useState(0);
  const [time, setTime] = useState();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(()=>{
    if(localStorage.getItem('user') !== null && localStorage.getItem('challengeBucket') !== null){
      setUser({...JSON.parse(localStorage.getItem('user'))});
      setChallengeBucket([...JSON.parse(localStorage.getItem('challengeBucket'))]);
      setDayTasks([...JSON.parse(localStorage.getItem('user')).challengeOneDays.dayTasks]);
      setChallengeBucketLength(JSON.parse(localStorage.getItem('challengeBucket')).length);
    }
    const interval = setInterval(() => {
        var now = new Date().getTime();
        var distance = JSON.parse(localStorage.getItem('user')).challengeOneDays.continousTimer - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if(distance < 0){
          setTimer();
          setDays(0);
          setHours(0);
          setMinutes(0);
          setSeconds(0);
        }else{
          setDays(days);
          setHours(hours);
          setMinutes(minutes);
          setSeconds(seconds);
        }
      }, 1000);
      return ()=> clearInterval(interval);
  }, [time]);

  //this function sets the timer. It is called above in set Interval.
  //this function will run the unlockNextDay function for each interval of time
    const setTimer = () =>{
    let user = JSON.parse(localStorage.getItem('user'));
    let newTime = +new Date + 10000;
    user.challengeOneDays.continousTimer = newTime;
    localStorage.setItem('user', JSON.stringify(user));
    setTime(newTime);
    unlockNextDay(JSON.parse(localStorage.getItem('user')).challengeOneDays.incrementCounter);
  }

  //gets one random task from the challenge bucket.
  //because this method mutates the challenge Bucket, therefore it is required to be copied
  //and related to a user.
  const getOneRandomTask = (i) =>{
      let chalBuck = cb;
      let randomNumber = Math.floor(Math.random() * 6);
      let user = u;
      let filteredArr = chalBuck.filter((i, index)=>{
        return index === randomNumber;
      });

      user.challengeOneDays.dayTasks[i].taskName = filteredArr[0].taskName;
      user.challengeOneDays.dayTasks[i].lockStatus = 'active';

      localStorage.setItem('user', JSON.stringify(user));
      setDayTasks([...user.challengeOneDays.dayTasks]);
     
      const firstArr = chalBuck.slice(0, chalBuck.indexOf(chalBuck[randomNumber]));
      const secondArr = chalBuck.slice(chalBuck.indexOf(chalBuck[randomNumber]) + 1);
      chalBuck = [...firstArr, ...secondArr];

      localStorage.setItem("challengeBucket", JSON.stringify(chalBuck));
      setChallengeBucket(chalBuck);
      setChallengeBucketLength(prevState => prevState - 1);
  }

  //runs onClick to finish a task
  const finishTaskHandler = (i) =>{
    let user = u;

    user.challengeOneDays.dayTasks[i].lockStatus = 'Finished';
    localStorage.setItem('user', JSON.stringify(user));
    setDayTasks([...user.challengeOneDays.dayTasks]);
  }

  // function to unlock the next day and make it active
  const unlockNextDay = (i) =>{
    let user = JSON.parse(localStorage.getItem('user'));
    user.challengeOneDays.dayTasks[i].lockStatus = 'unlock';
    i++;
    user.challengeOneDays.incrementCounter = i;
    localStorage.setItem('user', JSON.stringify(user));
    setDayTasks([...user.challengeOneDays.dayTasks]);
  }

  //Sets the demo storage for the duration of the component life
  const setMockStorage = () =>{
    localStorage.setItem('challengeBucket', JSON.stringify(challengeBucket));
    localStorage.setItem('user', JSON.stringify(user));
  }
  //deletes the demo local Storage
  const deleteMockStorage = () =>{
    localStorage.removeItem('challengeBucket');
    localStorage.removeItem('user');
  }

  return (
    <div>
      <button onClick = {setMockStorage}>Set Storage</button>
      <button onClick = {deleteMockStorage}>Delete Storage</button>
      {/*<button onClick = {() =>unlockNextDay(increment)}>unlockNextDay</button>*/}
      {dayTasks.map(i => {
        return (
          <div key={Math.random()}>
            <span>
             Day {i.day}
            </span>
            <button onClick={()=>getOneRandomTask(i.day - 1)} 
            disabled = {i.lockStatus === "locked" || 
            i.lockStatus === "active" || 
            i.lockStatus === "Finished"?true: false}>
             {i.lockStatus}
            </button>
            <span>
             {i.taskName}
            </span>
            {i.taskName !== '' && i.lockStatus !== 'Finished'? <button onClick = {()=>finishTaskHandler(i.day - 1)}>Finish</button> : null}
          </div>
        )
      })}
      {days+" "+hours+" "+minutes+" "+seconds}
      {/*<button onClick={setTimer}>Set Timer</button>*/}
    </div>
  );
}

export default App;
