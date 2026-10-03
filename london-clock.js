(function(root){'use strict';
  const TIME_ZONE='Europe/London';
  const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  function parts(value){const d=value instanceof Date?value:new Date(value);const out={};for(const p of formatter.formatToParts(d))if(p.type!=='literal')out[p.type]=p.value;return{year:+out.year,month:+out.month,day:+out.day,weekday:out.weekday,hour:+out.hour,minute:+out.minute,second:+out.second}}
  function key(value){const p=value instanceof Date?parts(value):typeof value==='string'?parseKey(value):value;return p.year+'-'+String(p.month).padStart(2,'0')+'-'+String(p.day).padStart(2,'0')}
  function parseKey(value){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);if(!m)throw new Error('Use a YYYY-MM-DD London date.');return{year:+m[1],month:+m[2],day:+m[3]}}
  function wallTimeToInstant(date,time){const p=parseKey(date),t=/^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(time);if(!t)throw new Error('Use a 24-hour London time, such as 19:00.');const target=Date.UTC(p.year,p.month-1,p.day,+t[1],+t[2],+(t[3]||0));let guess=target;for(let i=0;i<6;i++){const got=parts(new Date(guess)),represented=Date.UTC(got.year,got.month-1,got.day,got.hour,got.minute,got.second),delta=target-represented;if(delta===0)break;guess+=delta}return new Date(guess)}
  function addDays(date,days){const p=parseKey(date),d=new Date(Date.UTC(p.year,p.month-1,p.day+days));return key({year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate()})}
  function weekday(date){const p=parseKey(date);return new Date(Date.UTC(p.year,p.month-1,p.day)).getUTCDay()}
  function weekBounds(value){const d=value instanceof Date?value:new Date(value),p=parts(d),k=key(p),daysSinceSunday=weekday(k);let startKey=addDays(k,-daysSinceSunday),start=wallTimeToInstant(startKey,'19:00');if(d<start){startKey=addDays(startKey,-7);start=wallTimeToInstant(startKey,'19:00')}const endKey=addDays(startKey,7),end=wallTimeToInstant(endKey,'19:00');return{start,end,startKey,endKey}}
  function isGoalWindow(value){const p=parts(value);return weekday(key(p))===0&&(p.hour>19||p.hour===19)&&(p.hour<23)}
  function weekNumber(value){const p=parts(value),d=new Date(Date.UTC(p.year,p.month-1,p.day)),yearStart=new Date(Date.UTC(p.year,0,1)),day=Math.floor((d-yearStart)/86400000);return Math.ceil((day+yearStart.getUTCDay()+1)/7)}
  const api={timeZone:TIME_ZONE,parts,key,parseKey,wallTimeToInstant,addDays,weekday,weekBounds,isGoalWindow,weekNumber};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GJLeagueClock=api;
})(typeof globalThis!=='undefined'?globalThis:this);
