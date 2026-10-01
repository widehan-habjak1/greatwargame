import type { MissionEvaluation, StrategicSite, Unit } from '../models/game'
import { createUnitSupply } from './SupplySystem'

export function awardReinforcements(units:Unit[],sites:StrategicSite[],mission:MissionEvaluation,rewarded:string[],time:number){
  const base=sites.find(s=>s.id==='western-command'&&s.owner==='player')??sites.find(s=>s.kind==='command_post'&&s.owner==='player')
  const objectives=mission.objectives.filter(o=>o.type==='CAPTURE'&&o.completed&&!rewarded.includes(o.id))
  if(!base||!objectives.length)return{units,rewarded,awards:[] as string[]}
  let id=Math.max(200,...units.map(u=>u.id))+1
  const reinforcements:Unit[]=objectives.flatMap((o,index)=>['보병','기계화'].map((type,slot)=>{
    const unitType=type as '보병'|'기계화',number=rewarded.length+index+1
    return{id:id++,name:`제${number}증원${type}대대`,callSign:`RESERVE ${number}-${slot+1}`,type:unitType,size:'대대' as const,x:base.x+(slot?65:-65),y:base.y+60+index*85,path:[],status:'대기' as const,baseSpeed:slot?39:21,terrain:'plain' as const,strength:{current:800,max:800},faction:'player' as const,combatState:'none' as const,attackCooldown:0,armor:slot?4:1,detectionRange:390,supply:createUnitSupply(unitType,time),reinforcementObjectiveId:o.id}
  }))
  return{units:[...units,...reinforcements],rewarded:[...rewarded,...objectives.map(o=>o.id)],awards:objectives.map(o=>o.id)}
}
