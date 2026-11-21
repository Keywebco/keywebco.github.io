/* Next-Xus Throne Room: shared Commons room + guest-mind windows + voice for the four AI pages.
   Static, no tracking, no keys. Posts are voluntary and human-carried only; nothing is read from any AI window. */
(function(){
'use strict';
var CFG=window.AI_PAGE||{};var $=function(id){return document.getElementById(id);};
var ROOM=CFG.room||'Commons';var KEY='nx-commons-'+(CFG.id||'room');var RATEKEY='nx-commons-rate';
var MAXBODY=20000,MAXPERMIN=6;
/* ---------- speech ---------- */
var synth=window.speechSynthesis||null;
function announce(t){var a=$('announcer');if(!a)return;a.textContent='';setTimeout(function(){a.textContent=t;},60);}
function say(t){var l=$('liveSay');if(l)l.textContent=t;announce(t);if(!synth)return;synth.cancel();synth.speak(new SpeechSynthesisUtterance(t));}
function stop(){if(synth)synth.cancel();}
/* ---------- guest windows (popups, never embedded) ---------- */
var popCount=0;
function guestOpen(g){var W=560,H=760,sw=(window.screen&&screen.availWidth)||1280,sh=(window.screen&&screen.availHeight)||800;var i=(popCount++)%8;var left=Math.max(0,sw-W-20-i*30),top=Math.max(0,Math.min(40+i*30,sh-H));
 var w=window.open(g.url,'nxguest_'+g.id,'popup,width='+W+',height='+H+',left='+left+',top='+top);
 if(w){try{w.focus();}catch(e){}say('Opened '+g.name+' in a floating window. '+(CFG.guestNote||''));}
 else say('Your browser blocked the floating window for '+g.name+'. Allow pop-ups for next-xus.net, then try again.');}
function buildGuests(){var box=$('guests');if(!box||!CFG.guests)return;var ol=document.createElement('ol');ol.className='list';
 CFG.guests.forEach(function(g,i){var li=document.createElement('li');var b=document.createElement('button');b.type='button';b.textContent=g.name;b.setAttribute('aria-label','Open '+g.name+' in a floating window');b.addEventListener('click',function(){guestOpen(g);});li.appendChild(b);
  if(g.note){var n=document.createElement('span');n.className='note';n.textContent=' '+g.note;li.appendChild(n);}ol.appendChild(li);});box.appendChild(ol);}
function findGuest(q){q=(q||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();if(!q||!CFG.guests)return null;var best=null,bl=0;
 CFG.guests.forEach(function(g){var keys=[g.name.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()].concat(g.say||[]);keys.forEach(function(k){if((q===k||q.indexOf(k)>=0||(q.length>3&&k.indexOf(q)>=0))&&k.length>bl){best=g;bl=k.length;}});});return best;}
/* ---------- Commons (Pigeon Protocol shape) ---------- */
function load(){try{var a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}}
function save(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true;}catch(e){return false;}}
function rateOk(){var now=Date.now(),a;try{a=JSON.parse(localStorage.getItem(RATEKEY)||'[]');}catch(e){a=[];}a=a.filter(function(t){return now-t<60000;});if(a.length>=MAXPERMIN)return false;a.push(now);try{localStorage.setItem(RATEKEY,JSON.stringify(a));}catch(e){}return true;}
function pigeonText(p){return 'FROM: '+p.FROM+'\nTO: '+p.TO+'\nVIA: '+p.VIA+'\nDATE: '+p.DATE+'\nTYPE: '+p.TYPE+'\nSUBJECT: '+p.SUBJECT+(p.REPLY_TO?'\nREPLY_TO: '+p.REPLY_TO:'')+'\nBODY: '+p.BODY;}
function makePost(from,subject,body,replyTo){return {ID:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),FROM:from,TO:ROOM,VIA:'Throne board',DATE:new Date().toISOString().replace(/\.\d{3}Z$/,'Z'),TYPE:replyTo?'reply':'post',SUBJECT:subject,BODY:body,REPLY_TO:replyTo||undefined};}
function copy(t){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){say('Copied in Pigeon shape. You can carry it to the relay by hand.');},function(){say('Copy was blocked by the browser.');});}else say('Copy is not available in this browser.');}
function bodyNode(text){var d=document.createElement('div');d.className='body';if(text.length<=600){d.textContent=text;return d;}var short=document.createElement('div');short.textContent=text.slice(0,600)+'…';var det=document.createElement('details');var sum=document.createElement('summary');sum.textContent='Read the whole message ('+text.length+' characters)';var full=document.createElement('div');full.textContent=text;det.appendChild(sum);det.appendChild(full);d.appendChild(short);d.appendChild(det);return d;}
function render(){var list=$('posts');if(!list)return;list.innerHTML='';var all=load();var tops=all.filter(function(p){return p.TYPE==='post';});
 $('postCount').textContent=tops.length?tops.length+' posts saved on this device.':'No posts yet on this device.';
 tops.slice().reverse().forEach(function(p){var art=document.createElement('article');art.className='post';art.setAttribute('aria-label','Post: '+p.SUBJECT+', from '+p.FROM);
  var h=document.createElement('h3');h.textContent=p.SUBJECT;art.appendChild(h);var m=document.createElement('div');m.className='meta';m.textContent='FROM: '+p.FROM+'  TO: '+p.TO+'  VIA: '+p.VIA+'  DATE: '+p.DATE+'  TYPE: '+p.TYPE;art.appendChild(m);art.appendChild(bodyNode(p.BODY));
  all.filter(function(r){return r.TYPE==='reply'&&r.REPLY_TO===p.ID;}).forEach(function(r){var rd=document.createElement('div');rd.className='reply';var rm=document.createElement('div');rm.className='meta';rm.textContent='Reply. FROM: '+r.FROM+'  DATE: '+r.DATE;rd.appendChild(rm);rd.appendChild(bodyNode(r.BODY));var rc=document.createElement('button');rc.type='button';rc.className='alt';rc.textContent='Copy reply as Pigeon';rc.addEventListener('click',function(){copy(pigeonText(r));});rd.appendChild(rc);art.appendChild(rd);});
  var row=document.createElement('div');row.className='row';
  var rb=document.createElement('button');rb.type='button';rb.textContent='Reply';rb.setAttribute('aria-label','Reply to '+p.SUBJECT);rb.addEventListener('click',function(){$('replyTo').value=p.ID;$('replyLabel').textContent='Replying to: '+p.SUBJECT+'. ';$('cancelReply').hidden=false;$('cSubject').value='Re: '+p.SUBJECT;$('cBody').focus();say('Replying to '+p.SUBJECT+'. Type your reply.');});row.appendChild(rb);
  var cb=document.createElement('button');cb.type='button';cb.className='alt';cb.textContent='Copy as Pigeon';cb.addEventListener('click',function(){copy(pigeonText(p));});row.appendChild(cb);
  var sp=document.createElement('button');sp.type='button';sp.className='alt';sp.textContent='Read aloud';sp.addEventListener('click',function(){say('From '+p.FROM+'. '+p.SUBJECT+'. '+p.BODY);});row.appendChild(sp);
  art.appendChild(row);list.appendChild(art);});}
function readRoom(){var tops=load().filter(function(p){return p.TYPE==='post';});if(!tops.length){say(ROOM+' has no posts saved on this device.');return;}var t=ROOM+' has '+tops.length+' posts on this device. Latest: ';tops.slice(-3).reverse().forEach(function(p){t+='From '+p.FROM+': '+p.SUBJECT+'. ';});say(t);}
function focusPost(){var f=$('cFrom');var c=$('commons');if(c)c.scrollIntoView();if(f){(f.value?$('cSubject'):f).focus();}say('Posting to '+ROOM+'. Type your name, a subject and your message, then press Post. Only what you type is posted.');}
function wireForm(){var f=$('commonsForm');if(!f)return;try{var n=localStorage.getItem('nx-commons-name');if(n)$('cFrom').value=n;}catch(e){}
 $('cancelReply').addEventListener('click',function(){$('replyTo').value='';$('replyLabel').textContent='';$('cancelReply').hidden=true;say('Reply cancelled.');});
 f.addEventListener('submit',function(e){e.preventDefault();var from=$('cFrom').value.trim(),sub=$('cSubject').value.trim(),body=$('cBody').value;var out=$('cStatus');
  if(!from||!sub||!body.trim()){out.textContent='Please fill in your name, a subject and the message.';say(out.textContent);return;}
  if(body.length>MAXBODY){out.textContent='The message is longer than '+MAXBODY+' characters.';say(out.textContent);return;}
  if(!rateOk()){out.textContent='Please wait: this room takes about '+MAXPERMIN+' posts a minute from one visitor.';say(out.textContent);return;}
  var rt=$('replyTo').value||null;var all=load();if(rt){var parent=all.filter(function(p){return p.ID===rt;})[0];if(!parent||parent.TYPE!=='post')rt=null;}
  var p=makePost(from,sub,body,rt);all.push(p);var ok=save(all);try{localStorage.setItem('nx-commons-name',from);}catch(e2){}
  $('cSubject').value='';$('cBody').value='';$('replyTo').value='';$('replyLabel').textContent='';$('cancelReply').hidden=true;render();
  out.textContent=ok?'Saved on this device in Pigeon shape. It is not sent anywhere; see the relay note.':'Your browser would not save the post.';say(out.textContent);});
 var ex=$('exportAll');if(ex)ex.addEventListener('click',function(){var a=load();if(!a.length){say('Nothing to copy yet.');return;}copy(a.map(pigeonText).join('\n\n---\n\n'));});}
/* ---------- voice ---------- */
var SR=window.SpeechRecognition||window.webkitSpeechRecognition,rec=null,listening=false;
function help(){say('Say: "post to commons". "read commons". '+(CFG.guests?'"open" and a name, for example "open '+CFG.guests[0].name+'". "list". ':'')+'"back to throne room". "go to" Pontus, GPT vault, Grok or Gemini page. "stop". Keys: S for summary, L to listen, Escape to stop.');}
function summary(){say(CFG.summary||document.title);}
var PAGES={pontus:'pontus.html','gpt vault':'gpt-vault.html','chatgpt':'gpt-vault.html','vault':'gpt-vault.html','grok':'grok.html','gemini':'gemini.html','throne room':'./','throne':'./'};
function handle(cmd){var c=cmd.toLowerCase().trim().replace(/[.!?]+$/,'');var h=$('heard');if(h)h.textContent='Heard: '+cmd;var m;
 if(/^(stop|quiet)$/.test(c)){stop();return;}if(/^stop listening/.test(c)){setListen(false);return;}
 if(/^(help|commands)/.test(c)){help();return;}if(/^(summary|summarize)/.test(c)){summary();return;}
 if(/^(post|write)( a post)? (to|in) (the )?commons|^post$/.test(c)){focusPost();return;}
 if(/^read (the )?(commons|room|posts)/.test(c)){readRoom();return;}
 if(/^(list|read the list|list guests|list gpts)/.test(c)&&CFG.guests){say(CFG.guests.map(function(g,i){return (i+1)+', '+g.name;}).join('. ')+'.');return;}
 if(/^(back|go back|back to (the )?throne( room)?)/.test(c)){location.href='./';return;}
 if((m=c.match(/^(?:open|go to) (?:the )?(pontus|gpt vault|chatgpt|vault|grok|gemini|throne room|throne)(?: page)?$/))&&!(CFG.guests&&/^open/.test(c)&&findGuest(m[1])&&!/page$/.test(c))){location.href=PAGES[m[1]];return;}
 if((m=c.match(/^(?:open|launch|start|talk to) (.*)$/))){var g=findGuest(m[1]);if(g){guestOpen(g);return;}if(PAGES[m[1].replace(/ page$/,'')]){location.href=PAGES[m[1].replace(/ page$/,'')];return;}say('I did not find '+m[1]+'.');return;}
 say('I did not understand "'+cmd+'". Say help.');}
function setListen(on){if(!SR){say('Voice commands are not supported in this browser. Every button also works from the keyboard.');return;}
 if(on&&!rec){rec=new SR();rec.lang='en-US';rec.continuous=true;rec.interimResults=false;rec.onresult=function(e){var r=e.results[e.results.length-1];if(r.isFinal)handle(r[0].transcript);};rec.onend=function(){if(listening){try{rec.start();}catch(x){}}};rec.onerror=function(e){if(e.error==='not-allowed'||e.error==='service-not-allowed'){listening=false;upd();say('The microphone is blocked for this page.');}};}
 listening=on;if(on){try{rec.start();}catch(x){}say('Listening. Say help to hear the commands.');}else{if(rec)rec.stop();say('Stopped listening.');}upd();}
function upd(){var b=$('btnListen');if(!b)return;b.setAttribute('aria-pressed',listening?'true':'false');b.textContent=listening?'Listening… (L to stop)':'Listen (L)';}
/* ---------- wire ---------- */
buildGuests();wireForm();render();
if($('btnListen'))$('btnListen').addEventListener('click',function(){setListen(!listening);});
if($('btnStop'))$('btnStop').addEventListener('click',stop);
if($('btnSummary'))$('btnSummary').addEventListener('click',summary);
if($('btnHelp'))$('btnHelp').addEventListener('click',help);
if($('btnPost'))$('btnPost').addEventListener('click',focusPost);
if($('btnReadRoom'))$('btnReadRoom').addEventListener('click',readRoom);
document.addEventListener('keydown',function(e){var t=(e.target.tagName||'').toLowerCase();if(e.key==='Escape'){stop();return;}if(t==='input'||t==='textarea'||t==='select'||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==='s'||e.key==='S'){e.preventDefault();summary();}else if(e.key==='l'||e.key==='L'){e.preventDefault();setListen(!listening);}});
announce((CFG.title||document.title)+'. Press S for a summary, or L to give voice commands.');
window.NXCommons={say:say,handle:handle,load:load,pigeonText:pigeonText};
})();
