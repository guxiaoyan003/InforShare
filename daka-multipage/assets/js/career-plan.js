/* DAKA 统一工作台 · career-plan：AI 职业规划（对话式评估 + 规划报告）
   由第二版单文件 Demo 按菜单拆分生成，业务逻辑与原文件一致。 */

/* ================================================================
   2.2 AI 职业规划（对话式 · 多轮补全 · 报告生成）
   ----------------------------------------------------------------
   沿用牛人端「AI 职业规划」界面：AI 对话规划 / 预约职业顾问 /
   服务进度与结果 三个子页签。
   ================================================================ */
const GW_DIMS = [
  {k:'edu',    label:'学历',     val:'本科 · 全日制',            src:'简历', w:12},
  {k:'major',  label:'专业',     val:'电子信息工程',             src:'简历', w:10},
  {k:'exp',    label:'工作经历', val:'4 年 · B 端产品',          src:'简历', w:16},
  {k:'intent', label:'目标岗位', val:'AI 产品经理',              src:'简历', w:18},
  {k:'city',   label:'期望城市', val:'深圳 / 杭州',              src:'简历', w:8},
  {k:'salary', label:'期望薪资', val:'20-25K',                  src:'简历', w:8},
  {k:'skill',  label:'技能覆盖', val:'8 项核心技能',             src:'简历', w:12},
  {k:'proj',   label:'项目成果', val:'2 个可量化案例',           src:'简历', w:10},
  {k:'age',    label:'年龄',     val:null,                      src:'对话', w:6},
  {k:'manage', label:'带团队经验',val:null,                     src:'对话', w:8},
  {k:'lang',   label:'投入时间', val:null,                      src:'对话', w:6}
];
const GW_QUESTIONS = [
  {k:'age',
   q:'我已经把您的简历读完了，能力画像基本清晰～ 为了让匹配更贴近您的实际阶段，方便透露一下<b>年龄区间</b>吗？<br><span style="font-size: 12px;color:var(--muted)">仅用于校准画像节奏，不会对外展示。</span>',
   chips:['25-30 岁','31-35 岁','36 岁以上','暂不方便透露']},
  {k:'manage',
   q:'好的，记下了～ 再确认一个关键点：在过往经历里，您<b>是否有带过团队或主导跨部门项目</b>的经验呢？这会直接影响我对您下一步的建议方向。',
   chips:['带过 3 人以上团队','主导过跨部门项目','以个人贡献为主']},
  {k:'lang',
   q:'最后一个问题啦：接下来三个月，您<b>每周大概能投入多少时间</b>在能力提升上？我会据此安排成长路径的节奏，让它可执行而不是空谈。',
   chips:['每周 5 小时以上','每周 2-5 小时','时间比较零散']}
];
const GW_ACK = [
  t => '收到～ <b>'+t+'</b>，这个年龄段在 AI 岗位上的成长节奏确实不太一样，我会在后面的建议里考虑进去。',
  t => '明白了，<b>'+t+'</b> 这段经历很关键，我会把协作与带人能力单独纳入评估。',
  t => '好的，按 <b>'+t+'</b> 来安排节奏，我会把任务拆成您能坚持的最小颗粒度。'
];
const GW = { step:-1, ans:{}, busy:false, done:false, token:0, chipWrap:null, started:false };

/* ---- 职业顾问（可预约） ---- */
const GW_ADVISORS = [
  {id:'A001',name:'王旭',dir:'AI 产品 / 职业转型',time:'2026-10-24 15:00',fee:399,status:'可预约'},
  {id:'A002',name:'李铭',dir:'AI 产品经理',time:'2026-10-25 10:30',fee:499,status:'可预约'},
  {id:'A003',name:'孙倩',dir:'AI 运营 / 内容方向',time:'2026-10-26 20:00',fee:299,status:'可预约'},
  {id:'A004',name:'陈昊',dir:'数据分析 / 增长',time:'2026-10-27 19:00',fee:399,status:'可预约'}
];

/* ---- 服务进度与结果 ---- */
const GW_SERVICES = [
  {id:'GS20261012001',content:'AI 能力画像与 12 周成长路径',mode:'AI 对话 + 报告',progress:'报告已生成',time:'2026-10-12 20:14'},
  {id:'GS20261016002',content:'职业顾问 1v1 复盘（王旭）',mode:'视频咨询',progress:'待开始',time:'2026-10-16 15:40'}
];

/* ================================================================
   13.1 AI 职业规划页（对话式规划 + 顾问预约 + 服务进度）
   ================================================================ */
function gwScroll(){
  const el = $('gwMsgs');
  if(el) el.scrollTop = el.scrollHeight;
}
function gwAppend(who, html){
  const wrap = document.createElement('div');
  wrap.className = 'gw-msg ' + (who==='me' ? 'user' : 'ai');
  wrap.innerHTML = (who==='me' ? '<div class="gw-av">我</div>' : '<div class="gw-av">AI</div>')
    + '<div class="gw-bub">' + html + '</div>';
  $('gwMsgs').appendChild(wrap);
  gwScroll();
  return wrap;
}
function gwTyping(){
  const wrap = document.createElement('div');
  wrap.className = 'gw-msg ai';
  wrap.id = 'gwTyping';
  wrap.innerHTML = '<div class="gw-av">AI</div><div class="gw-bub" style="padding:0"><div class="gw-typing"><i></i><i></i><i></i></div></div>';
  $('gwMsgs').appendChild(wrap);
  gwScroll();
}
/* 报告较长：生成后把滚动定位到报告顶部，先看到结论再往下看 */
function gwScrollTo(el){
  const box = $('gwMsgs');
  if(!box || !el) return;
  box.scrollTop = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 8;
}
function gwUntyping(){
  const t = $('gwTyping');
  if(t) t.remove();
}
function gwSay(html, delay){
  const tk = GW.token;
  return new Promise(res=>{
    gwTyping();
    setTimeout(()=>{
      gwUntyping();
      if(tk !== GW.token){ res(); return; }
      gwAppend('ai', html);
      res();
    }, delay||850);
  });
}
function gwMe(text){ gwAppend('me', esc(text)); }
function gwRenderPanel(){
  const got = GW_DIMS.filter(d=>d.val);
  GW.got = got.length;
  GW.miss = GW_DIMS.length - got.length;
  GW.pct = Math.round(got.length / GW_DIMS.length * 100);
}
/* ----------------------------------------------------------------
   报告 · 3 门匹配课程
   指向「AI培训」中的真实课程，点击可查看课程详情并报名
   ---------------------------------------------------------------- */
const GW_MATCH = [
  {id:'T-6004', match:92, tag:'首选', why:'补齐 Agent 编排与工具调用，线上直播不耽误上班'},
  {id:'T-6005', match:85, tag:'推荐', why:'强化指标体系与自动报表，直接补足数据决策短板'},
  {id:'T-6007', match:76, tag:'推荐', why:'短周期见效，先带动团队把 AI 用起来，再反哺产品设计'}
];
function gwMatchCourses(){
  const tm = CORE.find(x=>x.key==='train');
  if(!tm) return [];
  return GW_MATCH.map(g=>{
    const r = tm.records.find(x=>x.id===g.id);
    return r ? {r:r, match:g.match, tag:g.tag, why:g.why} : null;
  }).filter(Boolean);
}
function gwTf(r,k){
  const hit = (r.tfacts||[]).find(p=>p[0]===k);
  return hit ? hit[1] : '';
}

/* ----------------------------------------------------------------
   职业规划内容（报告与「历史记录」共用同一份文案）
   ---------------------------------------------------------------- */
const GW_PLAN = {
  concl:'你的画像指向同一个方向：<b>技术背景 + 4 年 B 端产品 + AI 应用落地</b>。在 AI 产品方向上已有明显优势，短板集中在数据决策与行业纵深，建议按下面的路径分阶段补齐。',
  weeks:8, gaps:2, actions:3,
  phases:[
    ['第 1-4 周 · 补数据决策','把「投递转化率 +23%」拆成可复用的指标体系与实验设计，沉淀 1 套归因框架'],
    ['第 5-8 周 · 补方法体系','系统补齐 RAG / Agent 的效果评测方法，输出 1 套评测集与 1 份效果对比结论'],
    ['第 9-12 周 · 补行业纵深','选 1 个非 SaaS 行业做完整需求调研，形成 1 份行业方案与商业化故事']
  ],
  next:[
    '把当前工作中的「拍脑袋决策」改成「指标 + 实验」，一周内先跑通 1 个最小实验闭环',
    '找一个真实业务问题做评测集，用同一套标准对比 2-3 个模型 / 方案的差异',
    '每月输出 1 篇行业分析，逐步建立「AI 产品 + 行业」的复合标签'
  ],
  hint:'结论基于你的简历与本次对话生成，仅供方向参考；如需更细的落地建议，可预约职业顾问做 1v1 复盘。'
};

/* 评估历史：每次生成规划自动留档；前两条为演示数据 */
const GW_HISTORY = [
  {id:'GE-0002', at:'2026-10-08 19:10', rounds:3, dir:'AI 解决方案顾问', weeks:10, gaps:2, actions:3,
   concl:'售前表达与方案包装能力突出，但缺少可量化的落地案例，建议用 1 个完整项目补齐交付证据。',
   phases:[
     ['第 1-4 周 · 补交付证据','把过往 2 个 AI 项目整理成可对外讲的案例，补齐 ROI 与验收口径'],
     ['第 5-10 周 · 补方案能力','输出 1 套行业解决方案模板，覆盖 3 个高频场景与报价结构']
   ],
   next:[
     '选 1 个老客户做回溯复盘，产出 1 份带数据的案例材料',
     '把方案模板沉淀成可复用的演示脚本，支撑 3 场以上客户沟通'
   ],
   hint:'结论基于当时的简历版本与对话记录生成，仅供方向参考。'},

  {id:'GE-0001', at:'2026-09-18 20:32', rounds:3, dir:'AI 产品经理', weeks:12, gaps:3, actions:3,
   concl:'画像偏向「执行层产品经理」，AI 项目经验集中在需求侧，建议先补工程理解，再谈行业纵深。',
   phases:[
     ['第 1-4 周 · 补工程理解','跟着 1 个 RAG 项目走完从数据处理到上线的完整链路'],
     ['第 5-8 周 · 补评测能力','建立 1 套场景评测集，学会用数据判断模型效果'],
     ['第 9-12 周 · 补行业认知','选定 1 个行业做深度调研，输出行业 AI 机会地图']
   ],
   next:[
     '先在现有岗位争取 1 个 AI 模块的完整负责权',
     '每两周输出 1 份效果复盘，积累可量化的项目证据'
   ],
   hint:'结论基于当时的简历版本与对话记录生成，仅供方向参考。'}
];

/* ---------- 评估历史：列表 / 详情 ---------- */
function gwHistCount(){ return GW_HISTORY.length; }
function gwSyncHistCount(){
  const el = $('gwHistCount');
  if(el) el.textContent = GW_HISTORY.length;
}
function gwHistListHTML(){
  return GW_HISTORY.map((h,i)=>
    '<div class="gh-item">'
    + '<div class="gh-top">'
    +   '<span class="gh-no">第 '+(GW_HISTORY.length-i)+' 次</span>'
    +   '<span class="gh-at">'+esc(h.at)+'</span>'
    +   '<span class="tag blue" style="font-size: 12px;padding:1px 7px">'+h.rounds+' 轮对话</span>'
    +   '<span class="spacer"></span>'
    +   '<span class="gh-wk">建议周期 '+h.weeks+' 周</span>'
    + '</div>'
    + '<div class="gh-con">'+esc(h.concl)+'</div>'
    + '<div class="gh-meta">方向：'+esc(h.dir)+' · 主要短板 '+h.gaps+' 项 · 下一步动作 '+h.actions+' 条</div>'
    + '<div class="gh-more"><span class="row-act" data-ghd="'+esc(h.id)+'">查看完整规划 ›</span></div>'
    + '</div>').join('');
}
function gwHistDetailHTML(h){
  if(!h) return '<div class="gw-hintbox">该记录已不存在。</div>';
  return '<div class="gh-detail">'
    + '<div class="gh-dm">'+esc(h.at)+' · 方向「'+esc(h.dir)+'」· '+h.rounds+' 轮对话</div>'
    + '<div class="gw-text">'+esc(h.concl)+'</div>'
    + '<div class="gw-stats">'
    +   '<div class="gw-stat"><div class="gv">'+h.weeks+' 周</div><div class="gl">建议提升周期</div></div>'
    +   '<div class="gw-stat"><div class="gv">'+h.gaps+' 项</div><div class="gl">主要能力短板</div></div>'
    +   '<div class="gw-stat"><div class="gv">'+h.actions+' 条</div><div class="gl">下一步动作</div></div>'
    + '</div>'
    + ((h.phases&&h.phases.length)
        ? '<div class="gw-sec-t" style="margin-top:14px">阶段规划</div><div class="gw-text" style="line-height:2">'
          + h.phases.map(p=>'<b>'+esc(p[0])+'</b>：'+esc(p[1])).join('；<br>') + '</div>'
        : '')
    + ((h.next&&h.next.length)
        ? '<div class="gw-sec-t" style="margin-top:14px">下一步建议</div><div class="gw-text" style="line-height:2">'
          + h.next.map(t=>'· '+esc(t)).join('；<br>') + '</div>'
        : '')
    + '<div class="gw-hintbox">'+esc(h.hint||'')+'</div>'
    + '</div>';
}
function gwHistRender(){
  const body = $('gwHistBody');
  if(!body) return;
  body.innerHTML = GW.histId ? gwHistDetailHTML(GW_HISTORY.find(x=>x.id===GW.histId)) : gwHistListHTML();
  $('gwHistBadge').textContent = GW_HISTORY.length + ' 次';
  $('gwHistHint').textContent = '共 ' + GW_HISTORY.length + ' 次评估记录 · 最新在前';
  $('gwHistBack').style.display = GW.histId ? '' : 'none';
  body.querySelectorAll('[data-ghd]').forEach(el=>{
    el.addEventListener('click', ()=>{ GW.histId = el.dataset.ghd; gwHistRender(); body.scrollTop = 0; });
  });
}
function openGwHistory(){
  GW.histId = null;
  gwHistRender();
  $('gwHistOverlay').classList.add('show');
}
function gwReportHTML(){
  /* 仅输出职业规划内容（结论 / 关键指标 / 阶段规划 / 下一步建议），暂不推荐任何课程链接 */
  return '<div class="gw-rep">'
    + '<div class="gw-rep-head">'
    +   '<div class="rh-t">王旭 · AI 职业规划结论</div>'
    +   '<div class="rh-s">基于在线简历解析 + 3 轮对话补充 · 生成于 '+nowStamp()+'</div>'
    + '</div>'
    + '<div class="gw-rep-body">'
    +   '<div class="gw-text">'+GW_PLAN.concl+'</div>'
    +   '<div class="gw-stats">'
    +     '<div class="gw-stat"><div class="gv">'+GW_PLAN.weeks+' 周</div><div class="gl">建议提升周期</div></div>'
    +     '<div class="gw-stat"><div class="gv">'+GW_PLAN.gaps+' 项</div><div class="gl">主要能力短板</div></div>'
    +     '<div class="gw-stat"><div class="gv">'+GW_PLAN.actions+' 条</div><div class="gl">下一步动作</div></div>'
    +   '</div>'
    +   '<div class="gw-sec-t" style="margin-top:16px">阶段规划<span class="st-sub">先补短板，再做行业纵深</span></div>'
    +   '<div class="gw-text" style="line-height:2">'
    +     GW_PLAN.phases.map(p=>'<b>'+p[0]+'</b>：'+p[1]).join('；<br>')
    +   '</div>'
    +   '<div class="gw-sec-t" style="margin-top:16px">下一步建议<span class="st-sub">主要缺口：数据驱动决策、商业 / 行业纵深</span></div>'
    +   '<div class="gw-text" style="line-height:2">'
    +     GW_PLAN.next.map(t=>'· '+t).join('；<br>')
    +   '</div>'
    +   '<div class="gw-hintbox">'+GW_PLAN.hint+'</div>'
    + '</div>'
    + '<div class="gw-rep-foot">'
    +   '<span class="hf">想换个方向或补充信息，可以重新评估</span>'
    +   '<button class="btn" id="gwRestart2">重新评估</button>'
    + '</div>'
    + '</div>';
}

function gwReset(){
  GW.token++;
  GW.step = -1; GW.ans = {}; GW.busy = false; GW.done = false; GW.chipWrap = null;
  GW.started = false;
  $('gwMsgs').innerHTML = '';
  GW_DIMS.forEach(d => { if(d.src === '对话') d.val = null; });
  gwUntyping();
  gwRenderPanel();
  $('gwHero').classList.remove('hide');
  $('gwHero').parentElement.classList.add('empty');
}
function gwHideHero(){
  $('gwHero').classList.add('hide');
  $('gwHero').parentElement.classList.remove('empty');
  GW.started = true;
}
function gwStart(){
  gwHideHero();
  gwMe('用我的简历开始规划');
  gwSay('好嘞～ 我先把您的在线简历读一遍，抓取其中的能力标签，再针对<b>简历里没能确认的关键信息</b>向您追问几轮。')
    .then(()=> gwParse(false, true));
}
function gwParse(withFile, skipMe){
  const wrap = document.createElement('div');
  wrap.className = 'gw-msg user';
  wrap.innerHTML = '<div class="gw-av">我</div><div class="gw-bub">'
    + (withFile ? '把简历加进来吧' : '直接用我在线简历里的信息解析就好')
    + '</div>';
  if(!skipMe){ $('gwMsgs').appendChild(wrap); gwScroll(); }
  gwSay('收到 ✅ 正在解析简历中的能力标签：学历、专业、工作经历、项目成果、目标岗位、期望城市、期望薪资、技能覆盖…')
    .then(()=> gwSay('解析完成 · 共抓到 <b>8</b> 个可用维度，还有 <b>3</b> 个维度需要向您确认，我会一个一个问您。'))
    .then(()=> gwNext());
}
function gwNext(){
  GW.step++;
  if(GW.step >= GW_QUESTIONS.length){ gwFinish(); return; }
  const q = GW_QUESTIONS[GW.step];
  const tk = GW.token;
  gwSay(q.q).then(()=>{
    if(tk !== GW.token) return;
    const wrap = document.createElement('div');
    wrap.className = 'gw-msg ai';
    wrap.innerHTML = '<div class="gw-av">AI</div><div class="gw-bub">'
      + '<div class="gw-quick">' + q.chips.map(c=>'<button class="gw-qbtn" data-gwans="'+esc(c)+'">'+esc(c)+'</button>').join('') + '</div>'
      + '</div>';
    $('gwMsgs').appendChild(wrap);
    gwScroll();
    GW.chipWrap = wrap;
    wrap.querySelectorAll('[data-gwans]').forEach(b=>{
      b.onclick = ()=> gwAnswer(b.dataset.gwans);
    });
  });
}
function gwAnswer(text){
  if(GW.busy) return;
  GW.busy = true;
  const q = GW_QUESTIONS[GW.step];
  GW.ans[q.k] = text;
  const dim = GW_DIMS.find(d=>d.k===q.k);
  if(dim) dim.val = text === '暂不方便透露' ? '按 25-30 岁保守估算' : text;
  if(GW.chipWrap){
    GW.chipWrap.querySelectorAll('.gw-qbtn').forEach(b=>{ b.disabled = true; b.style.opacity = '.45'; b.style.cursor = 'default'; });
    GW.chipWrap = null;
  }
  gwMe(text);
  gwRenderPanel();
  gwSay(GW_ACK[GW.step] ? GW_ACK[GW.step](text) : '好的，记下了。').then(()=>{
    GW.busy = false;
    gwNext();
  });
}
function gwFinish(){
  GW.done = true;
  gwSay('所有关键信息都齐了 ✅ 我正在把简历解析结果与您刚才的回答做交叉计算…')
    .then(()=> gwSay('方案已生成。核心结论是：您的画像<b>「技术背景 + B 端产品 + AI 应用落地」三重叠加</b>，在 AI 产品方向上有明显优势，短板集中在数据决策与行业纵深。我把方向与下一步动作整理成了一份规划 👇'))
    .then(()=>{
      const wrap = document.createElement('div');
      wrap.className = 'gw-msg ai gw-wide';
      wrap.innerHTML = '<div class="gw-av">AI</div><div style="min-width:0;width:100%">'+gwReportHTML()+'</div>';
      $('gwMsgs').appendChild(wrap);
      gwScrollTo(wrap);
      /* 推荐课程：点卡片进入课程详情，底部按钮为「报名课程」 */
      wrap.querySelectorAll('[data-gwcourse]').forEach(el=>{
        el.addEventListener('click', ()=>{
          const tm = CORE.find(x=>x.key==='train');
          const rec = tm && tm.records.find(x=>x.id === el.dataset.gwcourse);
          if(rec) openDrawer(tm, rec, {cta:'报名课程', ctaDone:'已报名'});
        });
      });
      /* 本次评估留档，可在「历史记录」回看 */
      GW_HISTORY.unshift({
        id:'GE-'+String(GW_HISTORY.length+1).padStart(4,'0'),
        at:nowStamp({full:true}), rounds:3, dir:'AI 产品经理',
        weeks:GW_PLAN.weeks, gaps:GW_PLAN.gaps, actions:GW_PLAN.actions,
        concl:GW_PLAN.concl.replace(/<[^>]+>/g,''),
        phases:GW_PLAN.phases.map(x=>x.slice()), next:GW_PLAN.next.slice(), hint:GW_PLAN.hint
      });
      gwSyncHistCount();
      const rst = $('gwRestart2');
      if(rst) rst.onclick = ()=>{ gwReset(); };
    });
}

/* ---------- AI 规划页渲染 ---------- */
function renderAiPlanPage(){
  const box = $('pageBox');
  box.innerHTML = `
    <div class="page-head">
      <div>
        <div class="page-title">AI职业规划</div>
        <div class="page-desc">提交个人背景与职业诉求 · 基于画像给出方向建议与成长路径</div>
      </div>
      <div class="spacer"></div>
      <div class="head-ops">
        <button class="btn" id="btnGwHistory">历史记录<span class="gw-hcount" id="gwHistCount">0</span></button>
      </div>
    </div>

      <div class="gw-wrap">
        <div class="gw-chat">
          <div class="gw-chat-head">
            <div class="gw-orb">
              <svg width="19" height="19" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2.6" y="4.6" width="10.8" height="8" rx="2.4"/><path d="M8 2.4v2.2"/><circle cx="8" cy="2.2" r=".9"/><path d="M6 8.2v1.2M10 8.2v1.2"/></svg>
            </div>
            <div>
              <div class="gh-t">AI 职业规划</div>
              <div class="gh-s">已接入「我的简历」· 解析维度随对话实时更新</div>
            </div>
          </div>
          <div class="gw-body empty" id="gwBody">
            <div class="gw-hero" id="gwHero">
              <div class="gw-hero-orb">
                <svg width="40" height="40" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.6" y="4.6" width="10.8" height="8" rx="2.4"/><path d="M8 2.4v2.2"/><circle cx="8" cy="2.2" r=".9"/><path d="M6 8.2v1.2M10 8.2v1.2"/></svg>
              </div>
              <h2>你好，想让我帮你规划什么？</h2>
              <p>AI 职业规划已接入你的在线简历 · 可基于简历生成能力画像与成长路径</p>
              <div class="gw-hero-quick">
                <button class="gw-hero-chip" data-gwstart="resume">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.1 1.9H4.4a1.5 1.5 0 0 0-1.5 1.5v9.2a1.5 1.5 0 0 0 1.5 1.5h7.2a1.5 1.5 0 0 0 1.5-1.5V6.1z"/><path d="M9.1 1.9v2.7a1.5 1.5 0 0 0 1.5 1.5h2.6"/><path d="M5.6 9.4h4.8M5.6 11.4h3.2"/></svg>
                  <span>用我的简历开始规划</span>
                </button>
                <button class="gw-hero-chip" data-gwstart="ask">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9.4a2.1 2.1 0 0 1-2.1 2.1H5.6L2.6 13.9V4.5A2.1 2.1 0 0 1 4.7 2.4h7.2A2.1 2.1 0 0 1 14 4.5z"/><path d="M5.9 6.6h4.2M5.9 9h2.8"/></svg>
                  <span>直接和我说说我的情况</span>
                </button>
              </div>
            </div>
            <div class="gw-msgs" id="gwMsgs"></div>
          </div>
          <div class="gw-foot">
            <div class="gw-input">
              <textarea id="gwInput" rows="4" placeholder="说说你的求职方向、遇到的问题，或点上方快捷选项…"></textarea>
              <button class="gw-send" id="gwSend" title="发送">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V3.6"/><path d="M3.8 7.8L8 3.4l4.2 4.4"/></svg>
              </button>
            </div>
            <div class="gw-foot-tip">AI 只追问简历中缺失或置信度低的维度，答案仅用于本次职业规划</div>
          </div>
        </div>
      </div>
  `;

  /* 对话入口 */
  $('gwHero').querySelectorAll('[data-gwstart]').forEach(b=>{
    b.addEventListener('click', ()=>{
      if(b.dataset.gwstart === 'resume'){
        gwStart();
      }else{
        gwHideHero();
        gwMe('我先说说我的情况');
        gwSay('好的呀～ 那我们从简历之外的信息开始。我需要确认几个关键点，才能给出贴合你的规划：')
          .then(()=> gwNext());
      }
    });
  });
  $('btnGwHistory').addEventListener('click', openGwHistory);
  gwSyncHistCount();
  $('gwSend').addEventListener('click', ()=>{
    const ta = $('gwInput');
    const v = ta.value.trim();
    if(!v) return;
    ta.value = '';
    if(!GW.started){
      gwHideHero();
      gwMe(v);
      gwSay('收到～ 那我先按你的在线简历做一次基础解析，再问几个关键问题补全画像。')
        .then(()=> gwParse(false, true));
      return;
    }
    if(GW.done){ gwMe(v); gwSay('收到。补充信息已并入画像，如需重新出一版方案，可以点「重新评估」。'); return; }
    if(GW.step >= GW_QUESTIONS.length) return;
    gwAnswer(v);
  });
  $('gwInput').addEventListener('keydown', e=>{
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); $('gwSend').click(); }
  });

}

