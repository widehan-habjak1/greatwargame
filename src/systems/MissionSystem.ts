import type { MissionEvaluation, Objective, Scenario, StrategicSite, TimeOfDay, Unit, Weather } from '../models/game'

export const IRON_DAWN:Scenario={
  id:'iron-dawn',name:'철의 새벽',briefing:'서부 교두보를 방어하면서 아른하임 지휘소와 칼슈타트 탄약창을 확보하고 적 기동단을 무력화하십시오.',duration:3600,
  objectives:[
    {id:'defend-hq',type:'DEFEND',label:'서부 전선 지휘소 방어',description:'주 지휘소를 적에게 빼앗기지 마십시오.',targetSiteId:'west-hq',required:true,completed:false,failed:false},
    {id:'capture-arnheim',type:'CAPTURE',label:'아른하임 전쟁기지 점령',description:'적 전선 지휘의 중심을 확보하십시오.',targetSiteId:'arnheim-cp',required:true,completed:false,failed:false},
    {id:'capture-ammo',type:'CAPTURE',label:'칼슈타트 탄약창 점령',description:'적 전선의 탄약 보급을 차단하십시오.',targetSiteId:'kalstadt-ammo',required:true,completed:false,failed:false},
    {id:'destroy-mobile',type:'DESTROY',label:'적 기동단 무력화',description:'적 전차·정찰 기동부대를 전투 불능으로 만드십시오.',targetUnitIds:[103,105],required:true,completed:false,failed:false},
  ]
}

const weatherAt=(time:number):Weather=>Math.floor(time/420)%3===2?'RAIN':'CLEAR'
const timeOfDayAt=(time:number):TimeOfDay=>{const hour=Math.floor(time/60)%24;return hour<6||hour>=20?'NIGHT':hour<10?'MORNING':hour<17?'DAY':'EVENING'}

export function evaluateMission(scenario:Scenario,units:Unit[],sites:StrategicSite[],time:number):MissionEvaluation{
  const elapsed=Math.max(0,time-390),objectives:Objective[]=scenario.objectives.map(objective=>{if(objective.type==='DEFEND'){const site=sites.find(s=>s.id===objective.targetSiteId),failed=site?.owner==='enemy';return{...objective,completed:!failed,failed}}if(objective.type==='CAPTURE'){const site=sites.find(s=>s.id===objective.targetSiteId);return{...objective,completed:site?.owner==='player',failed:false}}if(objective.type==='DESTROY'){const targets=units.filter(u=>objective.targetUnitIds?.includes(u.id));return{...objective,completed:targets.length>0&&targets.every(u=>u.combatState==='destroyed'),failed:false}}return objective}),playerAlive=units.some(u=>u.faction==='player'&&u.combatState!=='destroyed'),required=objectives.filter(o=>o.required),victory=required.every(o=>o.completed),defeat=!playerAlive||required.some(o=>o.failed)||elapsed>=scenario.duration
  return{state:victory?'VICTORY':defeat?'DEFEAT':'ACTIVE',objectives,weather:weatherAt(time),timeOfDay:timeOfDayAt(time),remaining:Math.max(0,scenario.duration-elapsed)}
}

export function frontlinePoints(units:Unit[]){const alive=units.filter(u=>u.combatState!=='destroyed'),points:{x:number;y:number}[]=[];for(let y=250;y<=4750;y+=500){const band=alive.filter(u=>Math.abs(u.y-y)<600),friendly=band.filter(u=>u.faction==='player'),enemy=band.filter(u=>u.faction==='enemy');if(!friendly.length||!enemy.length)continue;const fx=friendly.reduce((s,u)=>s+u.x,0)/friendly.length,ex=enemy.reduce((s,u)=>s+u.x,0)/enemy.length;points.push({x:(fx+ex)/2,y})}return points}
