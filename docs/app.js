const baseStages = [
  ['Plan approved','Exact outcome and acceptance are sealed'],
  ['Queued','Dependencies and current base are reconciled'],
  ['Implementation','One isolated writer changes the fictional app'],
  ['Acceptance','Authoritative checks run on the frozen candidate'],
  ['Independent review','A separate reviewer checks risk and completeness'],
  ['Promotion','The verified candidate becomes the product base'],
  ['Complete','Outcome receipt is recorded']
];

const stateDetails = [
  ['Plan approved','The outcome, non-goals and acceptance checks are sealed.','Idle','None','Locked'],
  ['Queued','The controller rendered a current, bounded work packet.','Reserved','None','Locked'],
  ['Implementation','A single writer is producing one isolated candidate.','Active','focusnote-candidate-01','Locked'],
  ['Acceptance','The supervisor—not the writer—is running the declared checks.','Idle','focusnote-candidate-01','Locked'],
  ['Independent review','A read-only reviewer sees the frozen candidate and complete evidence.','Idle','focusnote-candidate-01','Locked'],
  ['Promotion','Evidence passed; the controller is promoting the exact reviewed commit.','Idle','focusnote-candidate-01','Locked'],
  ['Complete','Only promotion satisfied the task and unlocked its dependent outcome.','Idle','promoted: a2c51e7','Unlocked']
];

let current = 0;
let failRequested = false;
let repaired = false;
let events = [{kind:'normal',text:'A human approved the exact fictional outcome and acceptance contract.'}];

const stages = document.querySelector('#stages');
const log = document.querySelector('#log');
const stateName = document.querySelector('#stateName');
const stateDetail = document.querySelector('#stateDetail');
const writer = document.querySelector('#writer');
const candidate = document.querySelector('#candidate');
const dependency = document.querySelector('#dependency');
const eventCount = document.querySelector('#eventCount');
const advance = document.querySelector('#advance');
const inject = document.querySelector('#inject');

function render(){
  stages.innerHTML = baseStages.map((stage,index)=>`<li class="stage ${index<current?'done':''} ${index===current?'active':''}"><span class="num">${index<current?'✓':index+1}</span><span><strong>${stage[0]}</strong><small>${stage[1]}</small></span><span class="pill">${index<current?'passed':index===current?'current':'waiting'}</span></li>`).join('');
  const s=stateDetails[current];
  stateName.textContent=s[0]; stateDetail.textContent=s[1]; writer.textContent=s[2]; candidate.textContent=s[3]; dependency.textContent=s[4];
  log.innerHTML=events.map((event,index)=>`<li class="event ${event.kind}"><time>EVENT ${String(index+1).padStart(2,'0')}</time><p>${event.text}</p></li>`).join('');
  eventCount.textContent=`${events.length} event${events.length===1?'':'s'}`;
  advance.disabled=current===baseStages.length-1;
  inject.disabled=current>3||failRequested;
}

function move(){
  if(current===baseStages.length-1)return false;
  if(current===3&&failRequested&&!repaired){
    events.push({kind:'failure',text:'Acceptance failed: simulated disk-write interruption left a temporary file. Candidate and exact check output were preserved.'});
    events.push({kind:'repair',text:'Controller inserted repair v2: clean the temporary file while keeping the original note unchanged, then rerun the same acceptance.'});
    repaired=true; failRequested=false;
    render();
    stateName.textContent='Versioned repair'; stateDetail.textContent='The approved outcome is unchanged. One bounded repair receives the retained evidence.'; writer.textContent='Active'; candidate.textContent='focusnote-repair-02'; dependency.textContent='Locked';
    return false;
  }
  current+=1;
  const messages=[null,'Dependency graph reconciled; no product choice was invented.','Writer started from the exact promoted base in an isolated candidate.','Candidate frozen; full declared acceptance is now authoritative.','Acceptance passed; independent review received the complete frozen evidence.','Review passed; promotion is the only event allowed to satisfy the task.','Promotion receipt recorded; the dependent outcome is now unlocked.'];
  events.push({kind:'normal',text:messages[current]}); render(); return true;
}

advance.addEventListener('click',move);
document.querySelector('#run').addEventListener('click',()=>{let guard=0;while(current<baseStages.length-1&&guard++<10){if(!move())break;}});
inject.addEventListener('click',()=>{failRequested=true;events.push({kind:'failure',text:'Fault injection armed: the next acceptance run will simulate an interrupted disk write.'});render();});
document.querySelector('#reset').addEventListener('click',()=>{current=0;failRequested=false;repaired=false;events=[{kind:'normal',text:'A human approved the exact fictional outcome and acceptance contract.'}];render();});
render();
