import type { CombatNotice, Engagement, Projectile, Unit, UnitType } from '../models/game'
import { createPath } from './MovementSystem'
import { AMMO_USE, createUnitSupply, supplyCombatFactor } from './SupplySystem'

export type Weapon={range:number;damage:number;cooldown:number;accuracy:number;penetration:number;projectileSpeed:number}
export const WEAPONS:Record<UnitType,Weapon>={
  보병:{range:150,damage:32,cooldown:2.5,accuracy:.68,penetration:1,projectileSpeed:520},
  기계화:{range:210,damage:45,cooldown:3,accuracy:.72,penetration:4,projectileSpeed:620},
  기갑:{range:280,damage:90,cooldown:4,accuracy:.8,penetration:8,projectileSpeed:760},
  포병:{range:520,damage:105,cooldown:7.5,accuracy:.58,penetration:5,projectileSpeed:430},
  정찰:{range:135,damage:20,cooldown:2.2,accuracy:.65,penetration:1,projectileSpeed:560},
  공병:{range:120,damage:26,cooldown:2.8,accuracy:.64,penetration:2,projectileSpeed:500},
}

const damageAfterArmor=(damage:number,penetration:number,armor:number)=>Math.max(4,Math.round(damage*Math.max(.18,.55+penetration*.08-armor*.07)))

export function updateCombat(units:Unit[],engagements:Engagement[],projectiles:Projectile[],dt:number,time:number,environmentFactor=1){
  const notices:CombatNotice[]=[]
  let nextUnits=units.map(u=>({...u,combatState:u.combatState==='disengaging'&&!u.path.length?'none' as const:u.combatState,movementPriority:!!u.movementPriority&&u.path.length>0,supply:u.supply??createUnitSupply(u.type,time),attackCooldown:Math.max(0,u.attackCooldown-dt)}))
  const nextProjectiles:Projectile[]=[]
  projectiles.forEach(p=>{const progress=Math.min(1,p.progress+p.speed*dt/Math.max(30,Math.hypot(p.targetX-p.x,p.targetY-p.y)));if(progress<1){nextProjectiles.push({...p,progress});return}const target=nextUnits.find(u=>u.id===p.targetId);if(!target||target.combatState==='destroyed')return;if(p.hit){const strength=Math.max(0,target.strength.current-p.damage),destroyed=strength<=0;nextUnits=nextUnits.map(u=>u.id===target.id?{...u,strength:{...u.strength,current:strength},combatState:destroyed?'destroyed':'underFire',path:destroyed?[]:u.path,status:destroyed?'대기':u.status}:u);notices.push({type:destroyed?'destroyed':'hit',unitId:p.attackerId,targetId:p.targetId,damage:p.damage})}else notices.push({type:'miss',unitId:p.attackerId,targetId:p.targetId})})

  const nextEngagements:Engagement[]=[]
  nextUnits.forEach(attacker=>{
    if(attacker.combatState==='destroyed'||attacker.movementPriority||!attacker.combatTargetId)return
    const target=nextUnits.find(u=>u.id===attacker.combatTargetId&&u.combatState!=='destroyed')
    if(!target){nextUnits=nextUnits.map(u=>u.id===attacker.id?{...u,combatTargetId:undefined,combatState:'none'}:u);return}
    const distance=Math.hypot(target.x-attacker.x,target.y-attacker.y),weapon=WEAPONS[attacker.type]
    const existing=engagements.find(e=>e.attackerId===attacker.id&&e.defenderId===target.id)
    const state=distance<=weapon.range?'active':distance<=attacker.detectionRange?'engaging':'detecting'
    nextEngagements.push(existing?{...existing,distance,state}:{id:`eng-${attacker.id}-${target.id}`,attackerId:attacker.id,defenderId:target.id,startedAt:time,distance,state})
    if(!existing)notices.push({type:'detected',unitId:attacker.id,targetId:target.id})
    if(distance>weapon.range){const stopDistance=weapon.range*.82,ratio=Math.max(0,(distance-stopDistance)/distance),destination={x:attacker.x+(target.x-attacker.x)*ratio,y:attacker.y+(target.y-attacker.y)*ratio};nextUnits=nextUnits.map(u=>u.id===attacker.id?{...u,combatState:'approaching',path:createPath(u,destination),status:'이동 중'}:u);return}
    nextUnits=nextUnits.map(u=>u.id===attacker.id?{...u,combatState:u.attackCooldown<=0?'attacking':'engaging',path:[],status:'위치 사수'}:u)
    if(attacker.attackCooldown>0||attacker.supply.ammunition<AMMO_USE[attacker.type])return
    const effectiveness=supplyCombatFactor(attacker),hit=Math.random()<weapon.accuracy*effectiveness*environmentFactor,damage=Math.max(1,Math.round(damageAfterArmor(weapon.damage,weapon.penetration,target.armor)*effectiveness))
    nextProjectiles.push({id:`shot-${attacker.id}-${time}-${Math.random()}`,attackerId:attacker.id,targetId:target.id,x:attacker.x,y:attacker.y,targetX:target.x,targetY:target.y,progress:0,speed:weapon.projectileSpeed,hit,damage,kind:attacker.type})
    nextUnits=nextUnits.map(u=>u.id===attacker.id?{...u,attackCooldown:weapon.cooldown,supply:{...u.supply,ammunition:Math.max(0,u.supply.ammunition-AMMO_USE[u.type])}}:u);notices.push({type:'fired',unitId:attacker.id,targetId:target.id})
    if(!target.combatTargetId&&!target.movementPriority&&target.faction!==attacker.faction)nextUnits=nextUnits.map(u=>u.id===target.id?{...u,combatTargetId:attacker.id,combatState:'engaging'}:u)
  })
  return{units:nextUnits,engagements:nextEngagements,projectiles:nextProjectiles.slice(-120),notices}
}
