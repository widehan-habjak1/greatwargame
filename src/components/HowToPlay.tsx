import { useEffect, useRef } from 'react'
import { COPY, type Language } from '../i18n'

const steps={ko:[
  ['부대 선택','아군을 클릭하세요. Ctrl / ⌘ + 클릭으로 여러 부대를 선택합니다. 편대 표시 클릭 또는 소속 부대 더블클릭으로 편대 전체를 선택할 수 있습니다.'],
  ['이동과 전투','선택 후 목적지를 우클릭하면 즉시 이동합니다. 공격 버튼을 누르고 적을 클릭하면 공격합니다. Shift를 누른 채 명령하면 대기열에 추가됩니다. 강은 다리로만 건널 수 있습니다.'],
  ['거점과 보급','거점 근처에 부대를 두면 점령이 진행됩니다. 적이 함께 있으면 점령이 멈춥니다. 점령·노획으로 포인트를 얻고, 연결된 보급 거점 가까이에서 멈추면 탄약·연료를 보충합니다.'],
  ['화면과 시간','빈 지도를 드래그해 화면을 이동하고, 휠이나 ＋ / −로 확대·축소하세요. Space로 일시정지하고 상단 배율 버튼으로 속도를 조절합니다. 임무 창에서 저장·불러오기가 가능합니다.'],
],en:[
  ['Select units','Click an ally. Ctrl / ⌘ + click selects multiple units. Click a formation marker or double-click a member to select the whole formation.'],
  ['Move and fight','Right-click a destination to move selected units immediately. Choose Attack, then click an enemy. Hold Shift while issuing orders to queue them. Rivers can only be crossed at bridges.'],
  ['Capture and supply','Keep units near a site to capture it. Capture stops when enemies are also present. Capture and loot earn points. Stop near a connected supply site to replenish ammunition and fuel.'],
  ['Camera and time','Drag empty map space to pan. Use the mouse wheel or ＋ / − to zoom. Space pauses the game; top speed buttons change simulation speed. Save and load from the mission panel.'],
]}

export function HowToPlay({language,onClose,onLanguage}:{language:Language;onClose:()=>void;onLanguage:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null),ko=language==='ko'
  useEffect(()=>{const element=dialog.current;element?.showModal();return()=>element?.close()},[])
  return <dialog ref={dialog} className="how-to-play" aria-labelledby="guide-title" onCancel={onClose}>
    <header><div><small>FIELD MANUAL</small><h1 id="guide-title">{ko?'전장 지휘 안내':'Battlefield Command Guide'}</h1></div><div><button onClick={onLanguage}>{ko?'English':'한국어'}</button><button aria-label={ko?'안내 닫기':'Close guide'} onClick={onClose}>×</button></div></header>
    <p>{ko?'부대를 지휘해 작전 목표를 달성하세요. 안내를 읽는 동안 게임은 멈춥니다.':'Command your units and complete the mission. The game pauses while this guide is open.'}</p>
    <section className="guide-mission"><h2>{ko?'이번 작전':'Your mission'}</h2><p>{COPY[language].briefing}</p><small>{ko?'제한 시간: 게임 시간 3시간 · 지휘소 함락 시 실패':'Time limit: 3 game hours · Losing your command post fails the mission'}</small></section>
    <div className="guide-steps">{steps[language].map(([title,body],index)=><section key={title}><h2>{index+1}. {title}</h2><p>{body}</p></section>)}</div>
    <p className="guide-keys">F · {ko?'부대에 카메라 이동':'Focus units'} |  M · {ko?'지도 모드':'Map mode'} |  L · {ko?'보급망':'Supply network'} |  R · {ko?'재보급':'Resupply'} |  Esc · {ko?'명령 취소 / 선택 해제':'Cancel / clear selection'}</p>
    <p className="guide-tip">{ko?'첫 플레이 팁: 일시정지 후 부대를 나누어 지휘소를 방어하고, 정찰부대로 적과 교량을 확인하세요.':'First game tip: pause, assign units to defend your command post, and scout enemies and bridges with reconnaissance units.'}</p>
    <button className="guide-start" onClick={onClose} autoFocus>{ko?'전장으로':'Enter Battlefield'} →</button>
  </dialog>
}
