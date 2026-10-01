import type { AIDecision, BattlefieldSnapshot, EnemyCommander, Engagement, Formation, Order, Point, StrategicSite, Unit } from '../models/game'
import { WORLD } from '../data/battlefield'
import { nearestSupplyPoint } from './SupplySystem'

const power=(u:Unit)=>u.combatState==='destroyed'?0:(u.strength.current/u.strength.max)*({보병:1,기계화:1.35,기갑:1.65,포병:1.25,정찰:.55,공병:.75}[u.type])*(u.supply.state==='SUPPLIED'?1:u.supply.state==='LOW_SUPPLY'?.9:u.supply.state==='CRITICAL_SUPPLY'?.7:.5)
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y)

export const INITIAL_ENEMY_FORMATIONS:Formation[]=[
  {id:'enemy-line',name:'적 전선단',unitIds:[101,102],type:'line',status:'위치 사수',center:{x:1560,y:740},heading:Math.PI},
  {id:'enemy-armor',name:'적 기동단',unitIds:[103,105],type:'wedge',status:'위치 사수',center:{x:1770,y:670},heading:Math.PI},
  {id:'enemy-support',name:'적 지원단',unitIds:[104,106],type:'column',status:'위치 사수',center:{x:1935,y:940},heading:Math.PI},
]

export const createEnemyCommander=():EnemyCommander=>({id:'enemy-command-west',state:'idle',objective:{type:'defend_position',label:'아른하임 방어',position:{x:1850,y:1030}},decisionInterval:3,lastDecisionTime:387})

export function observeBattlefield(units:Unit[],engagements:Engagement[],objective:Point):BattlefieldSnapshot{
  const friendlyUnits=units.filter(u=>u.faction==='enemy'&&u.combatState!=='destroyed'),hostileUnits=units.filter(u=>u.faction==='player'&&u.combatState!=='destroyed')
  const friendlyPower=friendlyUnits.reduce((sum,u)=>sum+power(u),0),hostilePower=hostileUnits.reduce((sum,u)=>sum+power(u),0)
  const nearestThreatDistance=hostileUnits.length?Math.min(...hostileUnits.map(u=>distance(u,objective))):Infinity
  const activeEngagements=engagements.filter(e=>friendlyUnits.some(u=>u.id===e.attackerId||u.id===e.defenderId))
  const contactDetected=activeEngagements.length>0||friendlyUnits.some(enemy=>hostileUnits.some(hostile=>distance(enemy,hostile)<=enemy.detectionRange))
  return{friendlyUnits,hostileUnits,activeEngagements,forceRatio:friendlyPower/Math.max(.1,hostilePower),nearestThreatDistance,objectiveThreatened:nearestThreatDistance<720,contactDetected}
}

const preferredTarget=(members:Unit[],hostiles:Unit[])=>{
  if(!members.length||!hostiles.length)return undefined
  const lead=members[0],preferred=lead?.type==='기갑'?hostiles.filter(u=>u.type==='기갑'||u.type==='기계화'):lead?.type==='포병'?hostiles.filter(u=>u.type==='포병'||u.type==='기갑'):hostiles
  const pool=preferred.length?preferred:hostiles
  return [...pool].sort((a,b)=>distance(lead,a)-distance(lead,b))[0]
}

export function decideEnemyAction(snapshot:BattlefieldSnapshot,formations:Formation[],commander:EnemyCommander):AIDecision{
  formations=formations.filter(f=>snapshot.friendlyUnits.some(u=>f.unitIds.includes(u.id)))
  if(!snapshot.friendlyUnits.length)return{state:'idle',score:0,reason:'가용 전투 부대 없음',priority:'normal'}
  const pressured=formations.find(f=>f.unitIds.some(id=>snapshot.activeEngagements.some(e=>e.attackerId===id||e.defenderId===id)))
  const reserve=formations.find(f=>f.id==='enemy-armor'&&!pressured?.unitIds.some(id=>f.unitIds.includes(id)))
  if(pressured&&reserve&&snapshot.forceRatio<.8)return{state:'reinforcing',score:82,reason:`${pressured.name} 교전 지원`,formationId:reserve.id,destination:pressured.center,priority:'high'}
  if(snapshot.objectiveThreatened||snapshot.contactDetected){const active=formations.find(f=>f.id==='enemy-armor')??formations[0],members=active?snapshot.friendlyUnits.filter(u=>active.unitIds.includes(u.id)):snapshot.friendlyUnits,target=preferredTarget(members,snapshot.hostileUnits);if(target?.intelligenceState&&target.intelligenceState!=='visible')return{state:'pursuing',score:71,reason:'마지막 확인 위치 수색',formationId:active?.id,destination:{x:target.x,y:target.y},priority:'high'};return{state:'attacking',score:76,reason:snapshot.objectiveThreatened?'방어권 내 적 위협 제거':'정찰 접촉 · 선제 교전',formationId:active?.id,targetUnitId:target?.id,priority:'high'}}
  return{state:'patrolling',score:58,reason:'방어 구역 불규칙 순찰',destination:commander.objective.position,priority:'normal'}
}

export function ordersForDecision(decision:AIDecision,formations:Formation[],snapshot:BattlefieldSnapshot,time:number):Order[]{
  const targets=decision.formationId?formations.filter(f=>f.id===decision.formationId):formations
  const formationOrders=targets.flatMap((formation,index)=>{
    const members=snapshot.friendlyUnits.filter(u=>formation.unitIds.includes(u.id));if(!members.length)return[]
    let type:Order['type']='hold',destination=decision.destination
    const targetUnitId=decision.targetUnitId
    if(decision.state==='attacking'&&targetUnitId)type='attack'
    else if(decision.state==='retreating'||decision.state==='reinforcing'||decision.state==='defending'||decision.state==='patrolling'||decision.state==='pursuing'){
      type='move'
      if(decision.state==='defending')destination={x:decision.destination!.x-180+index*150,y:decision.destination!.y-170+(index%2)*190}
      if(decision.state==='patrolling'){
        const roll=Math.random(),maxDistance=formation.id==='enemy-support'?1200:1800
        const travelDistance=Math.min(maxDistance,roll<.3?80+Math.random()*260:roll<.75?340+Math.random()*650:990+Math.random()*900)
        const angle=Math.random()*Math.PI*2,center={x:members.reduce((sum,u)=>sum+u.x,0)/members.length,y:members.reduce((sum,u)=>sum+u.y,0)/members.length}
        destination={x:Math.max(120,Math.min(WORLD.width-120,center.x+Math.cos(angle)*travelDistance)),y:Math.max(120,Math.min(WORLD.height-120,center.y+Math.sin(angle)*travelDistance))}
      }
    }
    const order:Order={id:`ai-${time.toFixed(1)}-${formation.id}`,type,issuerId:'enemy_commander',targetUnitIds:members.map(u=>u.id),formationId:formation.id,destination,targetUnitId,status:'executing',createdAt:time,phaseStartedAt:time,startedAt:time,transmissionDuration:0,preparationDuration:0,priority:decision.priority}
    return[order]
  })
  const assignedIds=new Set(formations.flatMap(f=>f.unitIds)),independent=snapshot.friendlyUnits.filter(unit=>!assignedIds.has(unit.id))
  const independentOrders=independent.map((unit,index)=>{
    let type:Order['type']='hold',destination=decision.destination,targetUnitId=decision.targetUnitId
    if(decision.state==='attacking'){
      const target=preferredTarget([unit],snapshot.hostileUnits);type='attack';targetUnitId=target?.id
    }else if(decision.state==='patrolling'){
      type='move';const roll=Math.random(),maxDistance=unit.type==='정찰'?2100:unit.type==='포병'?900:1500,travelDistance=Math.min(maxDistance,roll<.35?70+Math.random()*280:roll<.8?350+Math.random()*650:1000+Math.random()*1000),angle=Math.random()*Math.PI*2
      destination={x:Math.max(120,Math.min(WORLD.width-120,unit.x+Math.cos(angle)*travelDistance)),y:Math.max(120,Math.min(WORLD.height-120,unit.y+Math.sin(angle)*travelDistance))}
    }else if(decision.state==='retreating'||decision.state==='reinforcing'||decision.state==='defending'||decision.state==='pursuing'){
      type='move';destination=decision.state==='defending'?{x:commanderlessDefensePoint(index).x,y:commanderlessDefensePoint(index).y}:decision.destination
    }
    return{id:`ai-${time.toFixed(1)}-unit-${unit.id}`,type,issuerId:'enemy_commander' as const,targetUnitIds:[unit.id],destination,targetUnitId,status:'executing' as const,createdAt:time,phaseStartedAt:time,startedAt:time,transmissionDuration:0,preparationDuration:0,priority:decision.priority}
  })
  return[...formationOrders,...independentOrders]
}

const commanderlessDefensePoint=(index:number)=>({x:2100+(index%2)*170,y:900+Math.floor(index/2)*190})

export function updateEnemyCommander(commander:EnemyCommander,units:Unit[],formations:Formation[],engagements:Engagement[],time:number,sites:StrategicSite[]=[]){
  if(time-commander.lastDecisionTime<commander.decisionInterval)return{commander,orders:[] as Order[],changed:false}
  const snapshot=observeBattlefield(units,engagements,commander.objective.position)
  // Keep retreat slots until recovery, so repeated decisions cannot send the entire army back.
  const recovered=(u:Unit)=>u.strength.current/u.strength.max>=.9&&u.supply.ammunition/u.supply.maxAmmunition>=.9&&u.supply.fuel/u.supply.maxFuel>=.9
  const retreaters=snapshot.friendlyUnits.filter(u=>commander.resupplyingUnitIds?.includes(u.id)&&!recovered(u)&&nearestSupplyPoint(u,sites)).slice(0,2)
  const candidates=snapshot.friendlyUnits.filter(u=>!retreaters.some(r=>r.id===u.id)&&(u.strength.current/u.strength.max<.5||u.supply.ammunition/u.supply.maxAmmunition<.2||u.supply.fuel/u.supply.maxFuel<.2)&&nearestSupplyPoint(u,sites)).sort((a,b)=>a.strength.current/a.strength.max-b.strength.current/b.strength.max)
  retreaters.push(...candidates.slice(0,2-retreaters.length))
  const resupplyingUnitIds=retreaters.map(u=>u.id)
  const combatSnapshot={...snapshot,friendlyUnits:snapshot.friendlyUnits.filter(u=>!resupplyingUnitIds.includes(u.id))}
  // Split partially unavailable formations into independent units for this decision.
  const combatFormations=formations.filter(f=>f.id.startsWith('enemy-')&&!f.unitIds.some(id=>resupplyingUnitIds.includes(id)))
  const patrolMoving=snapshot.friendlyUnits.some(unit=>unit.path.length>0)
  if(!retreaters.length&&!commander.resupplyingUnitIds?.length&&commander.state==='patrolling'&&!snapshot.contactDetected&&!snapshot.objectiveThreatened&&commander.plan&&patrolMoving&&time-commander.plan.createdAt<75)return{commander:{...commander,lastDecisionTime:time,snapshot},orders:[] as Order[],changed:false}
  const decision=decideEnemyAction(combatSnapshot,combatFormations,commander)
  const orders=ordersForDecision(decision,combatFormations,combatSnapshot,time)
  retreaters.forEach(u=>{const depot=nearestSupplyPoint(u,sites)!;if(!u.path.length&&distance(u,depot)<=depot.captureRadius)return;orders.push({id:`ai-${time.toFixed(1)}-resupply-${u.id}`,type:'resupply',issuerId:'enemy_commander',targetUnitIds:[u.id],destination:{x:depot.x,y:depot.y},status:'executing',createdAt:time,phaseStartedAt:time,startedAt:time,transmissionDuration:0,preparationDuration:0,priority:'urgent'})})
  return{commander:{...commander,resupplyingUnitIds,state:decision.state,lastDecisionTime:time,lastDecision:decision,snapshot,plan:{summary:decision.reason,issuedOrderIds:orders.map(o=>o.id),createdAt:time}},orders,changed:commander.state!==decision.state||commander.lastDecision?.reason!==decision.reason}
}
