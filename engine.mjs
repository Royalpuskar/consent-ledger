
function obj(v){if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Expected an object');return v;}
function arr(v,label='array'){if(!Array.isArray(v)||v.length>500)throw Error(label+' must be an array with at most 500 items');return v;}
function str(v){if(typeof v!=='string'||!v.trim()||v.length>100000)throw Error('Expected nonempty text (max 100000 characters)');return v;}
function num(v,label='number',min=-1e12){if(typeof v!=='number'||!Number.isFinite(v)||v<min||Math.abs(v)>1e12)throw Error(label+' must be a finite number in range');return v;}
function bool(v){if(typeof v!=='boolean')throw Error('Expected a boolean');return v;}
function date(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))throw Error('Expected YYYY-MM-DD');const t=Date.parse(v+'T00:00:00Z');if(!Number.isFinite(t)||new Date(t).toISOString().slice(0,10)!==v)throw Error('Invalid calendar date');return t;}
export function run(x){obj(x);if(JSON.stringify(x).length>200000)throw Error('Input exceeds 200 KB limit');

num(x.now,'now'); const events=arr(x.events,'events'), requests=arr(x.requests,'requests');
const grants=new Map(); let previous=-Infinity;
for(const e of events){num(e.at,'event time'); if(e.at<previous)throw Error('Events must be chronological');previous=e.at; str(e.subject);str(e.scope); if(!['grant','revoke'].includes(e.action))throw Error('Unknown action');if(e.action==='grant')num(e.expires,'expiry');if(e.at<=x.now)grants.set(JSON.stringify([e.subject,e.scope]),e);}
const rows=requests.map(q=>{str(q.subject);str(q.scope);const e=grants.get(JSON.stringify([q.subject,q.scope]));const allowed=!!e&&e.action==='grant'&&x.now<e.expires;return {subject:q.subject,scope:q.scope,decision:allowed?'allow':'deny',reason:!e?'no grant':e.action==='revoke'?'revoked':x.now>=e.expires?'expired':'active grant'};});
return {metrics:{allowed:rows.filter(r=>r.decision==='allow').length,denied:rows.filter(r=>r.decision==='deny').length},rows};

}
