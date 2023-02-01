import { challengeBucket } from "./DB/challengeBucket";
import { user } from "./DB/user";
import { useEffect, useState } from "react";

function App() {
  const [u, setUser] = useState({});
  const [cb, setChallengeBucket] = useState([]);
  const [cBL, setChallengeBucketLength] = useState(6);
  const [userObj, setUserObj] = useState({});
  const [taskList, setTaskList] = useState([]);

  useEffect(()=>{
    if(localStorage.getItem('user') !== null && localStorage.getItem('challengeBucket') !== null){
      setUser({...JSON.parse(localStorage.getItem('user'))});
      setChallengeBucket([...JSON.parse(localStorage.getItem('challengeBucket'))]);
    }
  },[]);

  const getOneRandomTask = () =>{
    if(cBL > 0){
      let i = 0;
      let chalBuck;
      let randomNumber;
      let filteredArr;
      let newUserObj;
      let taskListArr;
      while(i < 3){
      chalBuck = cb;
      randomNumber = Math.floor(Math.random() * cBL);
      //console.log(randomNumber);

      filteredArr = chalBuck.filter((i, index)=>{
        return index === randomNumber;
      });

      let oldUserObj = {
        status: "Not Complete",
        timeRemaining: +new Date()
      };

      newUserObj = {
        ...filteredArr[0],
        ...oldUserObj
      };

      // /console.log(newUserObj);

      const firstArr = chalBuck.slice(0, chalBuck.indexOf(chalBuck[randomNumber]));
      const secondArr = chalBuck.slice(chalBuck.indexOf(chalBuck[randomNumber]) + 1);
      chalBuck = [...firstArr, ...secondArr];

      //console.log(chalBuck);

      taskListArr = [];

      taskListArr.push(newUserObj);

        i++;
      }
      //console.log(cb);

      setTaskList(prevState => prevState.concat(taskListArr));
      setChallengeBucket([...chalBuck]);
      setChallengeBucketLength(prevState => prevState - 1);
      setUserObj({...newUserObj});
    }
  }

  console.log(cBL, cb, userObj, taskList);

  const setMockStorage = () =>{
    localStorage.setItem('challengeBucket', JSON.stringify(challengeBucket));
    localStorage.setItem('user', JSON.stringify(user));
  }

  const deleteMockStorage = () =>{
    localStorage.removeItem('challengeBucket');
    localStorage.removeItem('user');
  }

  return (
    <div>
      <button onClick = {setMockStorage}>Set Storage</button>
      <button onClick = {deleteMockStorage}>Delete Storage</button>
      <button onClick = {getOneRandomTask}>Get One Random Task</button>
    </div>
  );
}

export default App;
