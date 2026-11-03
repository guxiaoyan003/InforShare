/* DAKA 原型 · 通用 CRUD 逻辑（列表 / 表单 / 删除 / 导出）
   由 _build.py 从 _assets.JS_CRUD 生成，请勿手工修改 */

/* ===================== 通用 CRUD 页面引擎 ===================== */
let PAGE = null;
let crudState = { page:1, size:10, kw:'', filters:{} };

function fieldOf(k){ return PAGE.fields.find(f => f.k === k) || {k:k, label:k, type:'text'}; }
function filteredRows(){
  let rs = rows(PAGE.table).slice();
  const kw = crudState.kw.trim().toLowerCase();
  if(kw && PAGE.search.length){
    rs = rs.filter(r => PAGE.search.some(k => String(r[k] == null ? '' : r[k]).toLowerCase().includes(kw)));
  }
  Object.keys(crudState.filters).forEach(k=>{
    const v = crudState.filters[k];
    if(v !== '' && v != null) rs = rs.filter(r => String(r[k] == null ? '' : r[k]) === String(v));
  });
  return rs;
}
function cellHtml(f, r){
  const v = r[f.k];
  if(v == null || v === '') return '<span style="color:var(--muted)">—</span>';
  if(f.options) return badgeFor(f, v);
  let s = String(v);
  if(s.length > 34) s = s.slice(0,34)+'…';
  return '<span class="ellip" title="'+esc(String(v))+'">'+esc(s)+'</span>';
}
function renderCrud(){
  const all = filteredRows();
  const total = all.length;
  const maxPage = Math.max(1, Math.ceil(total / crudState.size));
  if(crudState.page > maxPage) crudState.page = maxPage;
  const start = (crudState.page-1)*crudState.size;
  const pageRows = all.slice(start, start+crudState.size);
  const cols = PAGE.cols.map(fieldOf);
  let h = '';
  /* 页头 */
  h += '<div class="page-head"><div class="ph-txt"><div class="page-title">'+esc(PAGE.title)+
       '<span class="tbl-code">'+esc(PAGE.table)+'</span></div></div>'+
       '<button class="btn btn-primary" onclick="openForm(null)">＋ 新增记录</button></div>';
  /* 工具栏 */
  h += '<div class="card"><div class="toolbar">'+
       '<div class="search"><span class="s-ico">⌕</span><input id="crudSearch" placeholder="搜索 '+esc(PAGE.search.map(k=>fieldOf(k).label).join(' / '))+'" value="'+esc(crudState.kw)+'"></div>'+
       '<div class="filters">';
  PAGE.filters.forEach(k=>{
    const f = fieldOf(k);
    const opts = f.options || [];
    h += '<select data-filter="'+k+'"><option value="">全部'+esc(f.label)+'</option>'+
      opts.map(o=>'<option value="'+esc(o[0])+'"'+(String(crudState.filters[k]||'')===String(o[0])?' selected':'')+'>'+esc(o[1])+'</option>').join('')+'</select>';
  });
  h += '</div><div class="spacer"></div>'+
       '<button class="btn btn-sm" onclick="renderCrud()">↻ 刷新</button>'+
       '<button class="btn btn-sm" onclick="exportView()">导出 CSV</button></div>';
  /* 表格 */
  if(!pageRows.length){
    h += '<div class="empty"><span class="e-ico">▤</span>暂无数据，点击右上角「新增记录」开始添加</div>';
  }else{
    h += '<div class="table-wrap"><table><thead><tr>';
    cols.forEach(f=>{ h += '<th'+(['num','money'].includes(f.type)?' class="num"':'')+'>'+esc(f.label)+'</th>'; });
    h += '<th style="min-width:'+(PAGE.audit?'230px':'150px')+'">操作</th></tr></thead><tbody>';
    pageRows.forEach(r=>{
      h += '<tr>';
      cols.forEach(f=>{
        const cls = ['num','money'].includes(f.type) ? ' class="num"' : (f.k===PAGE.pk ? ' class="cell-main"' : '');
        h += '<td'+cls+'>'+cellHtml(f,r)+'</td>';
      });
      h += '<td><div class="row-actions">'+
        '<button class="btn btn-sm btn-link" onclick="openDetail(\''+esc(r[PAGE.pk])+'\')">详情</button>'+
        '<button class="btn btn-sm btn-link" onclick="openForm(\''+esc(r[PAGE.pk])+'\')">编辑</button>';
      if(PAGE.audit){
        const st = String(r.publish_status||'');
        if(st === 'pending' || st === 'draft'){
          h += '<span class="sep"></span>'+
            '<button class="btn btn-sm btn-link" style="color:var(--green)" onclick="rowAudit(\''+esc(r[PAGE.pk])+'\',\'approve\')">通过</button>'+
            '<button class="btn btn-sm btn-link danger" onclick="rowAudit(\''+esc(r[PAGE.pk])+'\',\'reject\')">驳回</button>';
        } else if(st === 'published'){
          h += '<span class="sep"></span><button class="btn btn-sm btn-link warn" onclick="rowAudit(\''+esc(r[PAGE.pk])+'\',\'offline\')">下架</button>';
        } else if(st === 'rejected' || st === 'offline'){
          h += '<span class="sep"></span><button class="btn btn-sm btn-link" onclick="rowAudit(\''+esc(r[PAGE.pk])+'\',\'reopen\')">重新开放</button>';
        }
      }
      h += '<span class="sep"></span>'+
        '<button class="btn btn-sm btn-link danger" onclick="askDelete(\''+esc(r[PAGE.pk])+'\')">删除</button>'+
        '</div></td></tr>';
    });
    h += '</tbody></table></div>';
  }
  /* 分页 */
  h += '<div class="pager"><span class="p-info">共 <b>'+total+'</b> 条 · 第 '+crudState.page+' / '+maxPage+' 页 · 每页 '+crudState.size+' 条</span>'+
    '<button '+(crudState.page<=1?'disabled':'')+' onclick="goPage(1)">«</button>'+
    '<button '+(crudState.page<=1?'disabled':'')+' onclick="goPage('+(crudState.page-1)+')">上一页</button>';
  for(let p=Math.max(1,crudState.page-2); p<=Math.min(maxPage,crudState.page+2); p++){
    h += '<button class="'+(p===crudState.page?'cur':'')+'" onclick="goPage('+p+')">'+p+'</button>';
  }
  h += '<button '+(crudState.page>=maxPage?'disabled':'')+' onclick="goPage('+(crudState.page+1)+')">下一页</button>'+
    '<button '+(crudState.page>=maxPage?'disabled':'')+' onclick="goPage('+maxPage+')">»</button></div></div>';
  $('content').innerHTML = h;
  const si = $('crudSearch');
  if(si){
    si.oninput = (e)=>{ crudState.kw = e.target.value; crudState.page = 1; const pos = e.target.selectionStart;
      renderCrud(); const n = $('crudSearch'); if(n){ n.focus(); n.setSelectionRange(pos,pos); } };
  }
  document.querySelectorAll('[data-filter]').forEach(sel=>{
    sel.onchange = (e)=>{ crudState.filters[e.target.getAttribute('data-filter')] = e.target.value; crudState.page = 1; renderCrud(); };
  });
}
function goPage(p){ crudState.page = p; renderCrud(); window.scrollTo(0,0); }

/* ---------- 详情 ---------- */
function openDetail(pkVal){
  const r = rows(PAGE.table).find(x => String(x[PAGE.pk]) === String(pkVal));
  if(!r){ toast('记录不存在','err'); return; }
  let h = '<div class="detail-grid">';
  PAGE.fields.forEach(f=>{
    const v = r[f.k];
    h += '<div class="di"><span class="dk">'+esc(f.label)+'</span><span class="dv">'+
      (f.options ? badgeFor(f, v) : esc(v == null || v === '' ? '—' : String(v)))+'</span></div>';
  });
  h += '</div>';
  openModal({ size:'lg', title:PAGE.title+' · 记录详情', sub:PAGE.pk+' = '+pkVal, body:h,
    footer:'<button class="btn" onclick="closeModal()">关闭</button>'+
      '<button class="btn btn-primary" onclick="closeModal();openForm(\''+esc(pkVal)+'\')">编辑此记录</button>' });
}

/* ---------- 新增 / 编辑表单 ---------- */
function formField(f, r, isNew){
  const v = r && r[f.k] != null ? r[f.k] : (f.def != null ? f.def : '');
  const dis = (f.type === 'pk' && !isNew) ? ' disabled' : '';
  const req = f.required ? '<span class="req">*</span>' : '';
  let ctrl;
  if(f.type === 'area'){
    ctrl = '<textarea id="fld_'+f.k+'"'+dis+'>'+esc(v)+'</textarea>';
  } else if(f.options){
    ctrl = '<select id="fld_'+f.k+'"'+dis+'>'+f.options.map(o=>
      '<option value="'+esc(o[0])+'"'+(String(v)===String(o[0])?' selected':'')+'>'+esc(o[1])+'</option>').join('')+'</select>';
  } else {
    const t = f.type === 'date' ? 'date' : (['num','money'].includes(f.type) ? 'number' : 'text');
    const step = f.type === 'money' ? ' step="0.01"' : '';
    const ph = f.type === 'pk' && isNew ? ' placeholder="新增时自动生成"' : '';
    ctrl = '<input id="fld_'+f.k+'" type="'+t+'"'+step+' value="'+esc(v)+'"'+dis+ph+'>';
  }
  const hint = f.type === 'pk' && isNew ? '<span class="hint">主键由系统自动分配</span>' : '';
  return '<div class="fi'+(f.wide||f.type==='area'?' wide':'')+'"><label>'+esc(f.label)+req+'</label>'+ctrl+hint+'</div>';
}
function openForm(pkVal){
  const isNew = pkVal == null;
  const r = isNew ? null : rows(PAGE.table).find(x => String(x[PAGE.pk]) === String(pkVal));
  if(!isNew && !r){ toast('记录不存在','err'); return; }
  const body = '<div class="info-box"><b>'+(isNew?'新增':'编辑')+'</b> '+esc(PAGE.table)+' 表记录'+
    (isNew?'，带 <span class="req">*</span> 为必填项，主键自动生成。':'，修改后点击保存即写回数据表。')+'</div>'+
    '<div class="form-grid">'+PAGE.fields.map(f=>formField(f,r,isNew)).join('')+'</div>';
  openModal({ size:'lg', title:(isNew?'新增':'编辑')+' · '+PAGE.title, sub:PAGE.table, body:body,
    footer:'<button class="btn" onclick="closeModal()">取消</button>'+
      '<button class="btn btn-primary" onclick="saveForm('+(isNew?'true':'false')+',\''+esc(pkVal||'')+'\')">保存</button>' });
}
function saveForm(isNew, pkVal){
  const obj = {};
  for(const f of PAGE.fields){
    const el = $('fld_'+f.k);
    if(!el) continue;
    let v = el.value;
    if(f.required && String(v).trim() === '' && f.type !== 'pk'){
      toast('「'+f.label+'」为必填项','err'); el.focus(); return;
    }
    if(['num','money'].includes(f.type) && v !== '') v = Number(v);
    if(f.type === 'pk' && isNew) continue;
    obj[f.k] = v;
  }
  const db = loadDB();
  if(isNew){
    obj[PAGE.pk] = nextIdIn(db, PAGE.table, PAGE.pk);
    if(PAGE.fields.some(f=>f.k==='created_at')) obj.created_at = nowStr();
    if(PAGE.fields.some(f=>f.k==='updated_at')) obj.updated_at = nowStr();
  }else{
    obj[PAGE.pk] = Number(pkVal) || pkVal;
    if(PAGE.fields.some(f=>f.k==='updated_at')) obj.updated_at = nowStr();
  }
  const ok = writeRow(PAGE.table, PAGE.pk, obj, isNew);
  if(!ok){ toast('保存失败：记录不存在','err'); return; }
  closeModal(); toast((isNew?'新增':'修改')+'成功 · '+PAGE.pk+'='+obj[PAGE.pk],'ok'); renderCrud();
}

/* ---------- 物理删除 ---------- */
function askDelete(pkVal){
  const r = rows(PAGE.table).find(x => String(x[PAGE.pk]) === String(pkVal));
  const name = r ? (r.title || r.menu_name || r.config_name || r.nickname || r.real_name || r.rule_name || r.item_name || (PAGE.pk+'='+pkVal)) : pkVal;
  openConfirm({ title:'物理删除确认', okText:'确认物理删除', danger:true,
    body:'<div class="warn-box"><b>⚠ 此操作非常危险，可能导致不可逆的数据丢失！</b><br>'+
      '将执行 <b>DELETE FROM '+esc(PAGE.table)+' WHERE '+esc(PAGE.pk)+' = '+esc(pkVal)+'</b>，'+
      '记录会被<b>彻底移除</b>（非逻辑删除标记），且不可恢复。</div>'+
      '<div class="kv"><span class="k">目标记录</span><span>'+esc(String(name))+'</span></div>'+
      '<div class="kv"><span class="k">所属数据表</span><span>'+esc(PAGE.table)+'</span></div>'+
      '<div class="kv"><span class="k">主键</span><span>'+esc(String(pkVal))+'</span></div>',
    onOk:()=>{
      const ok = physicalDelete(PAGE.table, PAGE.pk, pkVal);
      if(ok){ toast('已物理删除 '+PAGE.table+' #'+pkVal+'（不可恢复）','warn'); renderCrud(); }
      else toast('删除失败：记录不存在','err');
    }});
}

/* ---------- 行内审批 ---------- */
function rowAudit(pkVal, action){
  const r = rows(PAGE.table).find(x => String(x[PAGE.pk]) === String(pkVal));
  if(!r){ toast('记录不存在','err'); return; }
  const bizType = {'biz_project':'project','biz_job':'job','biz_ai_course':'course'}[PAGE.table] || 'project';
  openAuditDialog({ module:'content', bizType:bizType, bizId:pkVal, action:action,
    title:r.title, bizName:PAGE.title, from:r.publish_status, onDone:renderCrud });
}

/* ---------- 导出当前视图（CSV） ---------- */
function exportView(){
  const cols = PAGE.cols.map(fieldOf);
  const rs = filteredRows();
  const lines = [cols.map(f=>f.label).join(',')];
  rs.forEach(r=> lines.push(cols.map(f=>{
    const v = f.options ? optLabel(f, r[f.k]) : (r[f.k] == null ? '' : r[f.k]);
    return '"'+String(v).replace(/"/g,'""')+'"';
  }).join(',')));
  const blob = new Blob(['\ufeff'+lines.join('\n')], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = PAGE.table+'_'+Date.now()+'.csv'; a.click();
  URL.revokeObjectURL(a.href); toast('已导出 '+rs.length+' 条记录','ok');
}

function initCrud(cfg){
  PAGE = cfg;
  const s = guard(cfg.file);
  if(!s) return;
  renderCrud();
  window.addEventListener('storage', ()=>renderCrud());
}
