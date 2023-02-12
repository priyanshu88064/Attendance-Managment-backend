require('dotenv').config();

const section = "L";

const week = {
    "sunday":0,
    "monday":1,
    "tuesday":2,
    "wednesday":3,
    "thursday":4,
    "friday":5,
    "saturday":6,
}

//   "compilerDesign monday 11 5",
//   "compilerDesign tuesday 12 55",
//   "compilerDesignLab ......",
//   "computerNetwork......",
//   "fullStack",
//   "fullStackLab",
//   "elective",
//   "careerSkill",
//   "careerSkillLab",
//   "softwareEngLab",

// Sample Subjects
//   "sample1 monday 11 5",
//   "sample2 tuesday 16 5",
//   "sample2 tuesday 16 5",
//   "sample1 sunday 17 55",

const subjects = [
  "sample1 monday 11 5",
  "sample2 tuesday 16 5",
  "sample2 tuesday 16 5",
  "sample1 sunday 17 55",
];

const jobs = subjects.map(item=>{

    const arr = item.split(' ');
    
    return {"job":{
        "url":process.env.THIS+section+"/"+arr[0],
        "enabled":"true",
        "saveResponses":false,
        "schedule":{"timezone":"Asia/Kolkata","hours":[Number(arr[2])],"mdays":[-1],"minutes":[Number(arr[3])],"months":[-1],"wdays":[week[arr[1]]]}
    }}
});

jobs.forEach(item=>{

    setTimeout(() => {
        const option = {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + process.env.TOKEN,
                "Content-Type": "application/json",
            },
            body:JSON.stringify(item)
        }
        fetch(process.env.CRON_SERVER+"/jobs",option).then(res=>console.log(res).then(res=>console.log(res)));
    }, 13000);  
});

