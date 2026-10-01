import type { GameEvent } from '../models/game'

const time=(value:number)=>{const m=Math.floor(value%1440);return`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`}
export function EventLog({events,title='작전 이벤트',feed='LIVE FEED'}:{events:GameEvent[];title?:string;feed?:string}){
  return <aside className="event-log"><header><span>{title}</span><small>{feed}</small></header><div>{events.slice(0,8).map(e=><p key={e.id} className={e.type}><time>{time(e.timestamp)}</time><span>{e.message}</span></p>)}</div></aside>
}
