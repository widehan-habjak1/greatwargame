import type { Faction, StrategicSite, Unit } from '../models/game'

export type SiteNotice={siteId:string;faction:Faction;previousOwner:StrategicSite['owner'];points:number;lootPoints:number}

export function updateStrategicSites(sites:StrategicSite[],units:Unit[],delta:number):{sites:StrategicSite[];notices:SiteNotice[]}{
  const notices:SiteNotice[]=[]
  const next=sites.map(site=>{
    const nearby=units.filter(u=>u.combatState!=='destroyed'&&Math.hypot(u.x-site.x,u.y-site.y)<=site.captureRadius)
    const player=nearby.filter(u=>u.faction==='player'),enemy=nearby.filter(u=>u.faction==='enemy')
    if((player.length&&enemy.length)||(!player.length&&!enemy.length))return site.captureProgress>0?{...site,captureProgress:Math.max(0,site.captureProgress-delta*2)}:site
    const faction:Faction=player.length?'player':'enemy'
    if(site.owner===faction)return site.captureProgress?{...site,captureProgress:0,capturingFaction:undefined}:site
    const force=(player.length?player:enemy).reduce((sum,u)=>sum+(u.type==='공병'?2:1),0)
    const progress=site.capturingFaction&&site.capturingFaction!==faction?0:site.captureProgress
    const captureProgress=Math.min(100,progress+delta*(5.8+force*1.7))
    if(captureProgress<100)return{...site,captureProgress,capturingFaction:faction}
    const previousOwner=site.owner,canLoot=previousOwner!=='neutral'&&previousOwner!==faction&&!site.lootedBy.includes(faction),lootPoints=canLoot?site.lootValue:0,points=site.value+lootPoints
    notices.push({siteId:site.id,faction,previousOwner,points,lootPoints})
    return{...site,owner:faction,captureProgress:0,capturingFaction:undefined,lootedBy:canLoot?[...site.lootedBy,faction]:site.lootedBy}
  })
  return{sites:next,notices}
}
