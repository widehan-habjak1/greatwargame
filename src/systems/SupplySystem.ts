import type { Faction, StrategicSite, SupplyNotice, SupplyPriority, SupplyRoute, SupplyState, Unit, UnitSupply, UnitType } from '../models/game'

const NETWORK_RANGE=2500
export const AMMO_USE:Record<UnitType,number>={보병:1,기계화:2,기갑:2.5,포병:5,정찰:.7,공병:1.2}
export const FUEL_USE:Record<UnitType,number>={보병:.002,기계화:.014,기갑:.021,포병:.012,정찰:.013,공병:.008}
export const createUnitSupply=(type:UnitType,time=390):UnitSupply=>{const ammunition=type==='포병'?160:type==='기갑'?130:100,fuel=type==='보병'?70:type==='기갑'?150:type==='기계화'?135:100;return{ammunition,maxAmmunition:ammunition,fuel,maxFuel:fuel,state:'SUPPLIED',priority:'normal',connected:true,lastResupplyTime:time}}
export const supplySpeedFactor=(unit:Unit)=>!unit.supply?1:unit.supply.fuel<=0?(unit.type==='보병'?.35:0):unit.supply.state==='LOW_SUPPLY'?.9:unit.supply.state==='CRITICAL_SUPPLY'?.75:unit.supply.state==='OUT_OF_SUPPLY'?.45:1
export const supplyCombatFactor=(unit:Unit)=>!unit.supply?1:unit.supply.state==='LOW_SUPPLY'?.9:unit.supply.state==='CRITICAL_SUPPLY'?.75:unit.supply.state==='OUT_OF_SUPPLY'?.55:1

const eligible=(site:StrategicSite,faction:Faction)=>site.owner===faction&&['command_post','supply_depot','ammo_depot','fuel_depot','rail_station'].includes(site.kind)
const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y)

export function calculateSupplyRoutes(sites:StrategicSite[],faction:Faction){
  const nodes=sites.filter(site=>eligible(site,faction)),sources=nodes.filter(site=>site.kind==='supply_depot'),connected=new Set(sources.map(s=>s.id)),routes:SupplyRoute[]=[]
  let changed=true
  while(changed){changed=false;nodes.filter(n=>!connected.has(n.id)).forEach(node=>{const parent=nodes.filter(n=>connected.has(n.id)).sort((a,b)=>distance(a,node)-distance(b,node))[0];if(parent&&distance(parent,node)<=NETWORK_RANGE){connected.add(node.id);routes.push({id:`${faction}-${parent.id}-${node.id}`,faction,from:parent,to:node,fromName:parent.name,toName:node.name,connected:true});changed=true}})}
  nodes.filter(n=>!connected.has(n.id)).forEach(node=>{const parent=nodes.filter(n=>connected.has(n.id)).sort((a,b)=>distance(a,node)-distance(b,node))[0];if(parent)routes.push({id:`${faction}-${parent.id}-${node.id}`,faction,from:parent,to:node,fromName:parent.name,toName:node.name,connected:false})})
  return{nodes,connected,routes}
}

const stateFor=(unit:Unit,connected:boolean,time:number):SupplyState=>{
  const ammo=unit.supply.ammunition/unit.supply.maxAmmunition,fuel=unit.supply.fuel/unit.supply.maxFuel,disconnectedFor=unit.supply.disconnectedSince===undefined?0:time-unit.supply.disconnectedSince
  if(!connected&&disconnectedFor>=25)return'OUT_OF_SUPPLY'
  if(ammo<.2||fuel<.2)return'CRITICAL_SUPPLY'
  if(ammo<.5||fuel<.5||!connected)return'LOW_SUPPLY'
  return'SUPPLIED'
}

export function updateSupply(units:Unit[],sites:StrategicSite[],dt:number,time:number,efficiency=1){
  const player=calculateSupplyRoutes(sites,'player'),enemy=calculateSupplyRoutes(sites,'enemy'),notices:SupplyNotice[]=[]
  const next=units.map(rawUnit=>{const unit=rawUnit.supply?rawUnit:{...rawUnit,supply:createUnitSupply(rawUnit.type,time)}
    if(unit.combatState==='destroyed')return unit
    const network=unit.faction==='player'?player:enemy,available=network.nodes.filter(n=>n.kind==='supply_depot'&&network.connected.has(n.id)).sort((a,b)=>distance(a,unit)-distance(b,unit)),source=available.find(n=>distance(n,unit)<=n.captureRadius)??available[0],sourceDistance=source?distance(source,unit):Infinity,connected=!!source&&sourceDistance<=source.captureRadius
    const wasConnected=unit.supply.connected,wasState=unit.supply.state,wasAmmo=unit.supply.ammunition/unit.supply.maxAmmunition,wasFuel=unit.supply.fuel/unit.supply.maxFuel
    let ammunition=unit.supply.ammunition,fuel=unit.supply.fuel,lastResupplyTime=unit.supply.lastResupplyTime,status=unit.status
    const activelyResupplying=connected&&!unit.path.length&&(ammunition<unit.supply.maxAmmunition||fuel<unit.supply.maxFuel||unit.strength.current<unit.strength.max)
    if(activelyResupplying){const modifier=(unit.supply.priority==='urgent'?1.45:unit.supply.priority==='high'?1.2:1)*efficiency;ammunition=Math.min(unit.supply.maxAmmunition,ammunition+9*modifier*dt);fuel=Math.min(unit.supply.maxFuel,fuel+7*modifier*dt);lastResupplyTime=time;if(status==='대기')status='재보급 중'}
    else if(status==='재보급 중')status='대기'
    const disconnectedSince=connected?undefined:unit.supply.disconnectedSince??time
    const strength=activelyResupplying?{...unit.strength,current:Math.min(unit.strength.max,unit.strength.current+12*dt*efficiency)}:unit.strength
    const draft={...unit,strength,supply:{...unit.supply,ammunition,fuel,connected,lastResupplyTime,disconnectedSince,sourceId:source?.id,sourceName:source?.name,distance:Number.isFinite(sourceDistance)?sourceDistance:undefined},status}
    const state=stateFor(draft,connected,time),ammoRatio=ammunition/unit.supply.maxAmmunition,fuelRatio=fuel/unit.supply.maxFuel,priority:SupplyPriority=state==='CRITICAL_SUPPLY'||state==='OUT_OF_SUPPLY'?'urgent':state==='LOW_SUPPLY'?'high':'normal'
    if(wasConnected&&!connected)notices.push({unitId:unit.id,type:'disconnected'});if(!wasConnected&&connected)notices.push({unitId:unit.id,type:'connected'})
    if(wasAmmo>=.5&&ammoRatio<.5)notices.push({unitId:unit.id,type:'low_ammo'});if(wasFuel>=.5&&fuelRatio<.5)notices.push({unitId:unit.id,type:'low_fuel'});if(wasState!=='CRITICAL_SUPPLY'&&state==='CRITICAL_SUPPLY')notices.push({unitId:unit.id,type:'critical'})
    if(unit.status!=='재보급 중'&&status==='재보급 중')notices.push({unitId:unit.id,type:'resupply_started'});if(unit.status==='재보급 중'&&status==='대기'&&ammoRatio>=.99&&fuelRatio>=.99)notices.push({unitId:unit.id,type:'resupply_completed'})
    return{...draft,supply:{...draft.supply,state,priority}}
  })
  return{units:next,routes:[...player.routes,...enemy.routes],notices}
}

export function nearestSupplyPoint(unit:Unit,sites:StrategicSite[]){const network=calculateSupplyRoutes(sites,unit.faction);return network.nodes.filter(n=>n.kind==='supply_depot'&&network.connected.has(n.id)).sort((a,b)=>distance(a,unit)-distance(b,unit))[0]}
