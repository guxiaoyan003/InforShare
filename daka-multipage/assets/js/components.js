/* DAKA 统一工作台 · components：通用 UI 构件（抽屉 / 弹窗 / 确认框 / 页头 / tabs）
   由第二版单文件 Demo 按菜单拆分生成，业务逻辑与原文件一致。 */

/* ================================================================
   11. 通用表单弹窗 / 确认框
   ================================================================ */
let curForm = null;
function openFormModal(title, sub, fields, onOk, okTxt){
  $('fmTitle').textContent = title;
  $('fmSub').textContent = sub || '';
  $('fmBody').innerHTML = '<div class="grid">' + fields.map(f=>`
    <div class="field row ${f.full!==false?'col-2':''} ${f.type==='txa'?'ta':''}">
      <label class="lb">${esc(f.label)}${f.req?'<i class="req">*</i>':''}</label>
      ${f.type==='txa'
        ? `<textarea class="txa" data-fk="${f.k}" placeholder="${esc(f.ph||'')}">${esc(f.value||'')}</textarea>`
        : f.type==='sel'
          ? `<select class="sel" data-fk="${f.k}">${f.opts.map(o=>`<option ${o===f.value?'selected':''}>${esc(o)}</option>`).join('')}</select>`
          : `<input class="ipt" data-fk="${f.k}" value="${esc(f.value||'')}" placeholder="${esc(f.ph||'')}">`}
    </div>`).join('') + '</div>';
  curForm = { onOk };
  $('fmOk').textContent = okTxt || '确定';
  $('formOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeFormModal(){
  $('formOverlay').classList.remove('show');
  document.body.style.overflow = '';
  curForm = null;
}
function formVals(){
  const o = {};
  document.querySelectorAll('#fmBody [data-fk]').forEach(el=>o[el.dataset.fk]=el.value.trim());
  return o;
}
$('fmClose').addEventListener('click', closeFormModal);
$('fmCancel').addEventListener('click', closeFormModal);
$('fmOk').addEventListener('click', ()=>{
  if(curForm) curForm.onOk(formVals());
});
$('formOverlay').addEventListener('click', e=>{ if(e.target===e.currentTarget) closeFormModal(); });

/* ---------- 职业规划：历史记录弹窗 ---------- */
$('gwHistClose').addEventListener('click', ()=> $('gwHistOverlay').classList.remove('show'));
$('gwHistOk').addEventListener('click', ()=> $('gwHistOverlay').classList.remove('show'));
$('gwHistOverlay').addEventListener('click', e=>{ if(e.target===e.currentTarget) e.currentTarget.classList.remove('show'); });
$('gwHistBack').addEventListener('click', ()=>{ GW.histId = null; gwHistRender(); });

let cfCb = null;
function askConfirm(title, msg, okTxt, cb, style){
  $('cfTitle').textContent = title;
  $('cfMsg').textContent = msg;
  $('cfOk').textContent = okTxt || '确认';
  $('cfOk').style.background = style==='danger' ? '#E5484D' : '';
  $('cfOk').style.boxShadow = style==='danger' ? '0 6px 16px rgba(229,72,77,.28)' : '';
  const ico = $('cfIco');
  ico.className = 'c-ico' + (style==='ok' ? ' on-ok' : style==='info' ? ' on-info' : '');
  ico.innerHTML = style==='ok'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6.5 9.5 17 4 11.5"/></svg>'
    : style==='info'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 10.8v5"/><path d="M12 7.8h.01"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 20H3L12 4.5Z"/><path d="M12 10v4.2M12 17.2h.01"/></svg>';
  cfCb = cb;
  $('cfOverlay').classList.add('show');
}
$('cfOk').addEventListener('click', ()=>{
  $('cfOverlay').classList.remove('show');
  if(cfCb) cfCb();
  cfCb = null;
});
$('cfCancel').addEventListener('click', ()=>{ $('cfOverlay').classList.remove('show'); cfCb = null; });
$('cfOverlay').addEventListener('click', e=>{ if(e.target===e.currentTarget){ $('cfOverlay').classList.remove('show'); cfCb = null; } });

function pageHead(title, desc, ops){
  return `<div class="page-head">
    <div><div class="page-title">${title}</div><div class="page-desc">${desc}</div></div>
    <div class="spacer"></div><div class="head-ops">${ops||''}</div>
  </div>`;
}
function statHtml(n, label, extra){
  return `<div class="stat"><div class="s-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9.5M10 19V4.5M16 19v-8M22 19v-4"/></svg></div>
    <div><div class="s-num">${n}</div><div class="s-label">${label}</div>${extra?`<div class="s-extra">${extra}</div>`:''}</div></div>`;
}
function stPill(pair){ return `<span class="st ${pair[1]}">${pair[0]}</span>`; }
function simpleTable(cols, rowsHtml, minW){
  return `<div class="panel"><div class="table-scroll"><table class="tbl" style="min-width:${minW||900}px">
    <thead><tr>${cols.map(c=>`<th ${c.w?`style="width:${c.w}"`:''}>${c.t}</th>`).join('')}</tr></thead>
    <tbody>${rowsHtml}</tbody></table></div></div>`;
}
function emptyRow(cols, t, s){
  return `<tr><td colspan="${cols}"><div class="empty-state"><b>${t}</b><span>${s||''}</span></div></td></tr>`;
}

/* ================================================================
   简历公开授权：列出所有已授权企业
   ================================================================ */
/* ================================================================
   16.9 通用 UI 构件
   ================================================================ */
function subTabs(id, items, active){
  return `<div class="subtabs" id="${id}">${items.map(it=>
    `<button class="sub-tab${it[0]===active?' active':''}" data-k="${it[0]}">${it[1]}</button>`
  ).join('')}</div>`;
}
function bindSubTabs(root, id, setter, rerender){
  const wrap = root.querySelector('#'+id);
  if(!wrap) return;
  wrap.querySelectorAll('.sub-tab').forEach(b=>{
    b.addEventListener('click', ()=>{ setter(b.dataset.k); rerender(); });
  });
}
function blkBox(title, sub, ops, body){
  return `<div class="blk"><div class="blk-head"><h2>${title}</h2>`
    + (sub?`<span class="sub">${sub}</span>`:'')
    + `<span class="spacer"></span>${ops||''}</div><div class="blk-body">${body}</div></div>`;
}
function pbarHtml(pct, ok){
  return `<div class="pbar${ok?' ok':''}"><i style="width:${Math.max(0,Math.min(100,pct))}%"></i></div>`;
}
function kvGrid(pairs){
  return `<div class="kv-grid">${pairs.map(p=>
    `<div class="kv${p[2]?' full':''}"><div class="k">${esc(p[0])}</div><div class="v${p[3]?' strong':''}">${p[1]}</div></div>`
  ).join('')}</div>`;
}
function tipbar(txt, kind, lnk, actId){
  const ico = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 8.2v.01M12 11v5"/></svg>';
  return `<div class="tipbar${kind?' '+kind:''}">${ico}<span>${txt}</span><span class="spacer"></span>`
    + (lnk?`<span class="lnk" id="${actId||'tipLnk'}">${lnk}</span>`:'') + `</div>`;
}
function certStatePill(st){ return stPill(CERT_ST[st]); }
/* 工单阶段标签：直接取阶段名，避免与里程碑条不一致 */
function tkPill(t){
  const txt = t.stages[t.stage-1] || '已结项';
  const cls = t.stage>=6 ? 'on' : (t.stage===1 ? 'draft' : 'info');
  return `<span class="st ${cls}">${esc(txt)}</span>`;
}

/* ---------- 大表单弹窗（分节 + 多行 + 标签多选 + 上传） ---------- */
let curBig = null;
function bigField(f){
  const cls = f.type==='txa' ? 'ta' : '';
  const span = f.half ? '' : ' col-2';
  let ctrl = '';
  if(f.type==='sel'){
    ctrl = `<select class="sel" data-fk="${f.k}">${f.opts.map(o=>
      `<option${String(o)===String(f.value||'')?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
  }else if(f.type==='txa'){
    ctrl = `<textarea class="txa" data-fk="${f.k}" placeholder="${esc(f.ph||'')}" style="min-height:${f.h||76}px">${esc(f.value||'')}</textarea>`;
  }else if(f.type==='chips' || f.type==='slots'){
    const cur = Array.isArray(f.value) ? f.value.slice() : [];
    ctrl = `<div class="${f.type==='chips'?'chip-pick':'slot-row'}" data-arr="${f.k}">${(f.opts||[]).map(o=>{
      const on = cur.indexOf(o)>-1;
      const dis = f.type==='slots' && (f.busy||[]).indexOf(o)>-1;
      return `<button type="button" class="${f.type==='chips'?'chip':'slot'}${on&&!dis?' on':''}${dis?' dis':''}" data-v="${esc(o)}" ${dis?'disabled':''}>${esc(o)}</button>`;
    }).join('')}</div>`;
  }else{
    ctrl = `<input class="ipt" data-fk="${f.k}" value="${esc(f.value||'')}" placeholder="${esc(f.ph||'')}">`;
  }
  return `<div class="field row${f.half?'':' col-2'} ${cls}"><label class="lb">${esc(f.label)}${f.req?'<i class="req">*</i>':''}</label>${ctrl}`
    + (f.tip?`<div style="flex-basis:100%;font-size: 12px;color:var(--muted);line-height:1.6">${f.tip}</div>`:'')
    + `</div>`;
}
function openBigForm(title, sub, sections, onOk, okTxt, size){
  $('fmTitle').innerHTML = title;
  $('fmSub').textContent = sub || '';
  $('fmBody').innerHTML = sections.map(s=>
    `<div class="sec"><div class="sec-head"><span class="bar"></span><b>${s.t}</b>`
    + (s.note?`<span style="margin-left:auto;font-size: 12px;color:var(--muted)">${s.note}</span>`:'')
    + `</div><div class="grid">${s.fields.map(bigField).join('')}</div>`
    + (s.after?`<div style="margin-top:12px">${s.after}</div>`:'')
    + `</div>`
  ).join('');
  /* 标签多选交互 */
  $('fmBody').querySelectorAll('.chip-pick,.slot-row').forEach(w=>{
    w.querySelectorAll('button').forEach(b=>{
      b.addEventListener('click', ()=>{
        if(w.classList.contains('slot-row')){
          w.querySelectorAll('button').forEach(x=>x.classList.remove('on'));
          b.classList.add('on');
        }else{
          b.classList.toggle('on');
        }
      });
    });
  });
  const modal = $('formOverlay').querySelector('.modal');
  modal.className = 'modal ' + (size||'lg');
  curBig = { onOk, sections };
  /* 复用原有的 fmOk 按钮事件：把读取逻辑换成支持数组 / 标签多选的版本 */
  curForm = { onOk: ()=> onOk(readBigForm()) };
  $('fmOk').textContent = okTxt || '确定';
  $('formOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function readBigForm(){
  const v = {};
  $('fmBody').querySelectorAll('[data-fk]').forEach(el=>{
    if(el.tagName==='INPUT' || el.tagName==='TEXTAREA' || el.tagName==='SELECT') v[el.dataset.fk] = el.value.trim();
  });
  $('fmBody').querySelectorAll('[data-arr]').forEach(w=>{
    const on = [...w.querySelectorAll('button.on')].map(b=>b.dataset.v);
    if(w.classList.contains('slot-row')) v[w.dataset.arr] = on[0] || '';
    else v[w.dataset.arr] = on;
  });
  return v;
}

