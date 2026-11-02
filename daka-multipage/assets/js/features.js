/* DAKA 统一工作台 · features：功能管理页（认证 / 面试 / 申请 / 交易 / 账号等）
   由第二版单文件 Demo 按菜单拆分生成，业务逻辑与原文件一致。 */

function openAuthList(){
  const rows = APPLIES_P.filter(a=>a.resumeAuth);
  const list = rows.length
    ? rows.map(a=>{
        const lv = authLevel(a);
        const x = AUTH_TEXT[lv];
        const src = a.type==='岗位' ? '投递' : (a.type==='项目' ? '项目意向' : '录用');
        return `<div class="auth-company">
          <div class="a-logo">${esc(a.co.slice(0,1))}</div>
          <div class="a-main">
            <div class="a-name">${esc(a.co)}</div>
            <div class="a-meta">通过「${esc(a.obj)}」${src}发起 · ${esc(a.time)} · 有效期 ${a.type==='项目'?'90':'30'} 天</div>
          </div>
          <span class="st ${x.c}">${x.t}</span>
        </div>`;
      }).join('')
    : '<div class="empty-state" style="padding:32px 12px"><b>暂无授权记录</b><span>企业通过初筛后可向你申请查看简历</span></div>';

  openFormModal('简历公开授权', '按企业分别授权 · 共 ' + rows.length + ' 条记录', [], ()=>{ closeFormModal(); return true; }, '关闭');
  $('fmBody').innerHTML =
      '<div style="font-size: 12px;color:var(--text-2);line-height:1.75;margin-bottom:4px">'
    + '授权仅对单家企业生效，其他企业需重新授权。双方均同意后，企业才能查看你的完整简历。</div>'
    + list;
}

function renderExtraPage(key){
  const box = $('pageBox');
  /* 全功能版新增页面优先（见脚本末尾「16. 全功能版新增模块」） */
  if(typeof EXTRA_PAGES === 'object' && EXTRA_PAGES && typeof EXTRA_PAGES[key] === 'function'){
    EXTRA_PAGES[key](box);
    return;
  }
  const F = {
    /* ================= 我的简历（来源：牛人端 my-applications.html） ================= */
    resume(){
      const r = RESUME;
      const pct = 85;
      box.innerHTML = `
        <div class="page-head">
          <div>
            <div class="page-title">我的简历</div>
            <div class="page-desc">企业看到的就是这份简历 · 投递前请确认联系方式与求职意向</div>
          </div>
          <div class="spacer"></div>
          <div class="head-ops">
            <button class="btn" id="rsAuth">公开授权简历</button>
            <button class="btn" id="rsEdit">编辑简历</button>
            <button class="btn btn-primary" id="rsExport">导出简历</button>
          </div>
        </div>
        <div class="resume-layout">
          <div class="rs-card" id="rsCard"></div>
          <div id="rsSections"></div>
        </div>`;

      $('rsCard').innerHTML =
          '<div class="rs-avatar">'+avHTML(7,'m','lg')+'</div>'
        + '<div class="rs-name">'+esc(r.name)+'</div>'
        + '<div class="rs-intent">'+esc(r.intent)+' · '+esc(r.salary)+'</div>'
        + '<div class="rs-state"><span class="st on">'+esc(r.state)+'</span></div>'
        + '<div class="pct-bar" style="margin-top:16px"><i style="width:'+pct+'%"></i></div>'
        + '<div style="display:flex;justify-content:space-between;font-size: 12px;color:var(--muted);margin-top:6px"><span>简历完整度</span><b style="color:var(--blue-600)">'+pct+'%</b></div>'
        + '<div class="rs-div"></div>'
        + '<div class="rs-line"><span class="k">手机号</span><span class="v">'+esc(r.phone)+'</span></div>'
        + '<div class="rs-line"><span class="k">邮箱</span><span class="v">'+esc(r.email)+'</span></div>'
        + '<div class="rs-line"><span class="k">所在城市</span><span class="v">'+esc(r.city)+'</span></div>'
        + '<div class="rs-line"><span class="k">工作年限</span><span class="v">'+esc(r.years)+'</span></div>'
        + '<div class="rs-line"><span class="k">最高学历</span><span class="v">'+esc(r.edu)+' · '+esc(r.eduMode)+'</span></div>'
        + '<div class="rs-line"><span class="k">毕业院校</span><span class="v">'+esc(r.school)+'</span></div>'
        + '<div class="rs-line"><span class="k">毕业时间</span><span class="v">'+esc(r.grad)+'</span></div>'
        + (r.file
          ? '<div class="rs-file">'
            +   '<div class="fi"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 2.5h5.2L12 5.3v8.2H4z"/><path d="M9.2 2.5v3h2.8"/></svg></div>'
            +   '<div class="rs-file-main"><div class="fn">'+esc(r.file.name)+'</div><div class="fs">'+esc(r.file.size)+' · 更新于 '+esc(r.file.time)+'</div></div>'
            + '</div>'
          : '')
        + '<div class="rs-drop" id="rsDrop" tabindex="0" role="button" aria-label="上传简历附件">'
        +   '<div class="rs-drop-ico"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13.6V3.4"/><path d="M5.8 7.6 10 3.4l4.2 4.2"/><path d="M3.4 12.6v2.6a1.4 1.4 0 0 0 1.4 1.4h10.4a1.4 1.4 0 0 0 1.4-1.4v-2.6"/></svg></div>'
        +   '<div class="rs-drop-t">'+(r.file ? '重新上传可替换当前附件' : '点击上传简历附件')+'</div>'
        +   '<div class="rs-drop-d">演示环境：点击即自动添加一份示例简历<br>支持 PDF / DOC / DOCX，单份不超过 10 MB</div>'
        + '</div>'
        + '<div class="rs-tip">'
        +   '<div class="rt-title">简历诊断</div>'
        +   '<div class="rt-item"><i>·</i><span>已上传附件简历「'+esc(r.file.name)+'」，投递时可选择在线简历或附件</span></div>'
        +   '<div class="rt-item"><i>·</i><span>工作经历 '+r.works.length+' 段，项目经历 '+r.projects.length+' 个，均含量化结果</span></div>'
        +   '<div class="rt-item"><i>·</i><span>技能标签覆盖 '+r.skills.length+' 项，与目标岗位匹配度良好</span></div>'
        +   '<div class="rt-item"><i>·</i><span>投递前请确认手机号与邮箱可正常接收面试通知</span></div>'
        + '</div>';

      $('rsSections').innerHTML =
          '<div class="section-card">'
        +   '<div class="sc-head"><h3>求职意向</h3><div class="spacer"></div><span class="row-act" id="rsEdit1">编辑</span></div>'
        +   '<div class="info-row"><span class="k">期望职位</span><span class="v strong">'+esc(r.intent)+'</span></div>'
        +   '<div class="info-row"><span class="k">期望薪资</span><span class="v">'+esc(r.salary)+'</span></div>'
        +   '<div class="info-row"><span class="k">期望城市</span><span class="v">'+esc(r.expectCity)+'</span></div>'
        +   '<div class="info-row"><span class="k">求职状态</span><span class="v">'+esc(r.state)+'</span></div>'
        +   '<div class="info-row"><span class="k">工作年限</span><span class="v">'+esc(r.years)+'</span></div>'
        + '</div>'
        + '<div class="section-card">'
        +   '<div class="sc-head"><h3>教育经历</h3></div>'
        +   '<div class="info-row"><span class="k">毕业院校</span><span class="v strong">'+esc(r.school)+' <span class="tag blue" style="margin-left:4px">'+esc(r.level)+'</span></span></div>'
        +   '<div class="info-row"><span class="k">专业</span><span class="v">'+esc(r.major)+'</span></div>'
        +   '<div class="info-row"><span class="k">学历 / 方式</span><span class="v">'+esc(r.edu)+' · '+esc(r.eduMode)+'</span></div>'
        +   '<div class="info-row"><span class="k">毕业时间</span><span class="v">'+esc(r.grad)+'</span></div>'
        + '</div>'
        + '<div class="section-card">'
        +   '<div class="sc-head"><h3>工作经历</h3><span style="font-size: 12px;color:var(--muted)">共 '+r.works.length+' 段</span></div>'
        +   r.works.map(w=>'<div class="exp-item"><div class="exp-top"><span class="exp-title">'+esc(w.title)+'</span><span class="exp-org">'+esc(w.org)+'</span><span class="exp-time">'+esc(w.time)+'</span></div><div class="exp-desc">'+esc(w.desc)+'</div></div>').join('')
        + '</div>'
        + '<div class="section-card">'
        +   '<div class="sc-head"><h3>项目经历</h3><span style="font-size: 12px;color:var(--muted)">共 '+r.projects.length+' 个</span></div>'
        +   r.projects.map(p=>'<div class="exp-item"><div class="exp-top"><span class="exp-title">'+esc(p.name)+'</span><span class="exp-org">'+esc(p.role)+'</span><span class="exp-time">'+esc(p.time)+'</span></div><div class="exp-desc">'+esc(p.desc)+'</div></div>').join('')
        + '</div>'
        + '<div class="section-card">'
        +   '<div class="sc-head"><h3>技能标签</h3></div>'
        +   '<div class="skill-list">'+r.skills.map(s=>'<span class="skill-tag">'+esc(s)+'</span>').join('')+'</div>'
        + '</div>'
        + '<div class="section-card">'
        +   '<div class="sc-head"><h3>个人优势</h3></div>'
        +   '<div class="ai-note"><div class="ai-tag">AI 生成的牛人介绍</div><div style="line-height:1.85">'+esc(r.aiIntro)+'</div></div>'
        +   '<div style="font-size: 12px;color:var(--muted);margin-top:12px;margin-bottom:6px">我的原始描述</div>'
        +   '<div class="rich-text" style="font-size: 12px">'+esc(r.intro)+'</div>'
        +   '<button class="btn btn-block" style="margin-top:16px" id="rsAi">AI 优化介绍</button>'
        + '</div>';

      /* 附件上传（演示） */
      const drop = $('rsDrop');
      const DEMO_FILES = [
        {name:'王旭-产品经理-2026.pdf', size:'1.2 MB', time:'2026-10-21'},
        {name:'王旭-AI产品经理-终版.pdf', size:'980 KB', time:'2026-10-21'},
        {name:'王旭-简历-20261021.docx', size:'256 KB', time:'2026-10-21'}
      ];
      let demoSeq = 0;
      const attachDemoFile = ()=>{
        const pick = DEMO_FILES[demoSeq % DEMO_FILES.length];
        demoSeq++;
        RESUME.file = {name:pick.name, size:pick.size, time:pick.time};
        F.resume();
        toast('已添加简历「'+pick.name+'」','ok');
      };
      if(drop){
        drop.onclick = attachDemoFile;
        drop.onkeydown = e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); attachDemoFile(); } };
      }
      $('rsEdit').onclick = ()=>openResumeEdit();
      $('rsEdit1').onclick = ()=>openResumeEdit();
      $('rsExport').onclick = ()=>toast('简历 PDF 已导出（演示）','ok');
      $('rsAi').onclick = ()=>toast('AI 已重新优化个人介绍（演示）','ok');
      $('rsAuth').onclick = ()=> openAuthList();
    },

    /* ================= 我的申请 ================= */
    applyP(){
      const cnt = k => APPLIES_P.filter(a=>a.st===k).length;
      box.innerHTML = pageHead('我的申请','来源：牛人端 · 全平台投递记录统一管理 · 岗位 / 项目 / 外包 / 实习 / 培训 / 私教',
          '<button class="btn" id="apExport">导出记录</button><button class="btn btn-primary" id="apGo">去投递</button>')
        + `<div class="stat-row">${statHtml(APPLIES_P.length,'全部申请')}${statHtml(cnt(2),'沟通中')}${statHtml(cnt(5),'企业已通过')}${statHtml(cnt(3),'不合适')}</div>
        <div class="blk">
          ${simpleTable(
            [{t:'申请对象',w:'240px'},{t:'类型',w:'90px'},{t:'薪资 / 预算',w:'130px'},{t:'投递时间',w:'130px'},{t:'进度状态',w:'110px'},{t:'简历授权',w:'100px'},{t:'企业反馈',w:'240px'},{t:'操作',w:'190px'}],
            APPLIES_P.map(a=>{
              const lv = a.resumeAuth ? authLevel(a) : 0;
              const authCell = a.resumeAuth
                ? stPill([AUTH_TEXT[lv].t, AUTH_TEXT[lv].c])
                : stPill(['未授权','draft']);
              /* 企业已通过且尚未授权 → 展示「同意授权」 */
              const needAuth = a.st===5 && a.resumeAuth && !a.resumeAuth.seeker;
              const ops = `<div class="ops-cell">
                <span class="row-act" data-ap="d" data-id="${a.id}">详情</span>
                ${needAuth?`<span class="row-act" data-ap="grant" data-id="${a.id}">同意授权</span>`:''}
                <span class="row-act" data-ap="w" data-id="${a.id}">撤回</span>
              </div>`;
              return `<tr>
              <td><div class="job-name">${esc(a.obj)}<span class="sub">${esc(a.id)} · ${esc(a.co)}</span></div></td>
              <td><span class="tag blue">${esc(a.type)}</span></td>
              <td><span class="salary">${esc(a.salary)}</span></td>
              <td class="t-time">${esc(a.time)}</td>
              <td>${stPill(AP_ST[a.st])}</td>
              <td>${authCell}</td>
              <td><div class="t-req" title="${esc(a.fb)}">${esc(a.fb)}</div></td>
              <td>${ops}</td>
            </tr>`;
            }).join(''),
            1180)}
        </div>`;
      $('apExport').onclick = ()=>toast('申请记录已导出（演示）','ok');
      $('apGo').onclick = ()=>go('job');
      box.querySelectorAll('[data-ap]').forEach(b=>b.onclick=()=>{
        const a = APPLIES_P.find(x=>x.id===b.dataset.id);
        if(b.dataset.ap==='d'){ toast('申请详情为演示占位'); return; }
        if(b.dataset.ap==='grant'){
          askConfirm('同意向「'+a.co+'」公开简历？',
            '同意后该企业可查看你的在线简历，授权仅对该企业生效。',
            '同意授权', ()=>{
              a.resumeAuth.seeker = 1;
              a.auth = 1;
              F.applyP();
              toast('已同意公开简历，企业可查看你的完整简历','ok');
            },'ok');
          return;
        }
        toast('撤回后企业将无法查看该申请（演示）');
      });
    },

    /* ================= 投诉反馈 ================= */
    complaint(){
      box.innerHTML = pageHead('投诉反馈','来源：牛人端 · 遇到虚假职位、薪资不符或骚扰可在此提交 · 平台在 1 个工作日内受理',
          '<button class="btn" id="cpNotice">投诉须知</button><button class="btn btn-primary" id="cpNew">发起投诉</button>')
        + `<div class="note-block" style="margin-bottom:16px">投诉受理范围：虚假职位、薪资不符、骚扰行为、交付纠纷。平台在 <b>1 个工作日内</b>受理，处理结果以站内消息通知。</div>
        <div class="blk"><div class="blk-head"><h2>我的投诉记录</h2><span class="sub">${COMPLAINTS.length} 条</span><span class="spacer"></span><span class="note">处理结果会以站内消息通知</span></div>
          ${simpleTable(
            [{t:'投诉对象',w:'240px'},{t:'投诉类型',w:'120px'},{t:'问题描述',w:'280px'},{t:'提交时间',w:'140px'},{t:'状态',w:'100px'},{t:'操作',w:'130px'}],
            COMPLAINTS.map((c,i)=>`<tr><td class="cell-strong">${c.obj}</td><td><span class="tag">${c.type}</span></td>
              <td>${esc(c.desc)}</td><td class="t-time">${c.time}</td><td>${stPill(CP_ST[c.st])}</td>
              <td><div class="ops-cell"><span class="row-act" data-cp="1">详情</span>${c.st===1?`<span class="row-act" data-cp="2" data-idx="${i}">撤回</span>`:''}</div></td></tr>`).join(''),
            940)}
        </div>`;
      $('cpNotice').onclick = ()=>toast('投诉须知：受理范围、举证要求与处理时限（演示占位）');
      box.querySelectorAll('[data-cp]').forEach(b=>{
        b.onclick = ()=>{
          if(b.dataset.cp==='1'){ toast('投诉详情为演示占位'); return; }
          const c = COMPLAINTS[+b.dataset.idx];
          if(!c) return;
          askConfirm('撤回该投诉？','撤回后平台将不再受理此条投诉，如仍有问题可重新发起。','确认撤回',
            ()=>{
              const i = COMPLAINTS.indexOf(c);
              if(i>-1) COMPLAINTS.splice(i,1);
              F.complaint();
              toast('投诉已撤回');
            },'danger');
        };
      });
      $('cpNew').onclick = ()=> openFormModal('发起投诉','平台在 1 个工作日内受理（来源：牛人端）',
        [
          {k:'obj',label:'投诉对象',req:true,ph:'岗位 / 项目 / 企业名称'},
          {k:'type',label:'投诉类型',type:'sel',opts:['虚假职位','薪资不符','骚扰行为','交付纠纷','其他']},
          {k:'desc',label:'问题描述',type:'txa',ph:'请描述发生时间、经过与期望处理结果'}
        ],
        (v)=>{
          if(!v.obj){ toast('请填写投诉对象','err'); return false; }
          COMPLAINTS.unshift({obj:v.obj,type:v.type,desc:v.desc||'（未填写）',time:nowStamp(),st:1});
          F.complaint();
          toast('投诉已提交，平台将在 1 个工作日内受理','ok');
          closeFormModal();
          return true;
        },'提交投诉');
    },

    /* ================= 收到申请 ================= */
    applyE(){
      const left = QUOTA.total - state.quotaUsed;
      const cnt = k => APPLIES_E.filter(a=>a.st===k).length;
      box.innerHTML = pageHead('收到申请','来源：企业端 · 集中处理大咖投递的岗位 / 项目意向申请，同意后消耗联系次数建立联系',
          `<div class="quota"><span>剩余联系次数</span><b>${left}</b> / ${QUOTA.total}<span class="q-bar"><i style="width:${left/QUOTA.total*100}%"></i></span></div>
           <button class="btn btn-primary" id="aeRecharge">＋ 充值</button>`)
        + `<div class="stat-row">${statHtml(APPLIES_E.length,'全部申请')}${statHtml(cnt(1),'待处理')}${statHtml(cnt(2),'已同意')}${statHtml(cnt(3),'已拒绝')}</div>
        <div class="blk">
          ${simpleTable(
            [{t:'申请人',w:'180px'},{t:'申请类型',w:'110px'},{t:'意向对象',w:'260px'},{t:'申请时间',w:'130px'},{t:'申请留言',w:'260px'},{t:'状态',w:'100px'},{t:'操作',w:'140px'}],
            APPLIES_E.map(a=>`<tr>
              <td><div class="job-name">${a.who}<span class="sub">${a.dir}</span></div></td>
              <td><span class="tag blue">${a.type}</span></td>
              <td>${a.obj}</td><td class="t-time">${a.time}</td>
              <td><div class="t-req" title="${esc(a.msg)}">${esc(a.msg)}</div></td>
              <td>${stPill(AE_ST[a.st])}</td>
              <td><div class="ops-cell">
                ${a.st===1?`<span class="row-act" data-ae="${a.id}" data-to="2">同意</span><span class="row-act red" data-ae="${a.id}" data-to="3">拒绝</span>`:'<span class="row-act" data-ae="'+a.id+'" data-to="0">详情</span>'}
              </div></td></tr>`).join(''),
            1100)}
        </div>`;
      box.querySelectorAll('[data-ae]').forEach(b=>b.onclick=()=>{
        const a = APPLIES_E.find(x=>x.id===b.dataset.ae);
        if(b.dataset.to==='0'){ toast('申请详情为演示占位'); return; }
        if(+b.dataset.to===2){
          askConfirm(`同意「${a.who}」的申请？`,
            '同意后将消耗 1 次联系次数并建立联系，剩余 '+(QUOTA.total-state.quotaUsed-1)+' 次。',
            '同意并建立联系',
            ()=>{
              a.st=2; state.quotaUsed++;
              F.applyE();
              toast('已同意，联系方式已互相开放','ok');
            },'ok');
        }else{
          askConfirm(`拒绝「${a.who}」的申请？`,'拒绝后将通知对方，不消耗联系次数。','确认拒绝',
            ()=>{ a.st=3; F.applyE(); toast('已拒绝'); },'danger');
        }
      });
      $('aeRecharge').onclick = ()=> openFormModal('充值联系次数','演示环境不接入真实支付',
        [{k:'num',label:'充值次数',type:'sel',opts:['10 次 · ¥300','20 次 · ¥560','50 次 · ¥1280']}],
        (v)=>{ state.quotaUsed = Math.max(0, state.quotaUsed - parseInt(v)); F.applyE(); toast('充值成功（演示）','ok'); closeFormModal(); return true; },'确认充值');
    },

    /* ================= 设置 ================= */
    setting(){
      const isPerson = state.acting==='person';
      const isSp = state.acting==='sp';
      const infoTitle = isPerson ? '个人信息' : (isSp ? '机构信息' : '企业信息');
      const rows = isPerson
        ? [['姓名','王旭',0],['手机号','138 0013 6688',0],['所在城市','广东省 深圳市 南山区',0],['求职状态','在职 · 月内到岗',0]]
        : isSp
          ? [['机构名称','深圳智远 AI 咨询有限公司',0],['联系人','周昱',1],['手机号','139****8830',0],['所在地区','广东省 深圳市 南山区',0]]
          : [['公司名称','云启科技有限公司',0],['联系人','李明',1],['手机号','138****6621',0],['所在地区','广东省 深圳市 南山区',0]];
      box.innerHTML = pageHead('设置', isPerson ? '个人端 · 个人信息与账号安全'
            : isSp ? '服务商端 · 机构信息与账号安全' : '企业端 · 企业信息与账号安全',
          '<button class="btn btn-primary" id="stSave">保存设置</button>')
        + `<div class="ov-cols" style="align-items:stretch">
          <div class="blk"><div class="blk-head"><h2>${infoTitle}</h2></div>
            <div class="blk-body">
              ${rows.map((r,i)=>`<div class="field row" style="margin-top:${i?'12px':'0'}"><label class="lb">${r[0]}</label>
                <input class="ipt" ${r[2]?'id="stName"':'disabled'} value="${r[1]}"></div>`).join('')}
            </div></div>
          <div class="blk"><div class="blk-head"><h2>账号与安全</h2></div>
            <div class="blk-body">
              <div class="switch-row"><div><div class="sw-t">登录密码</div><div class="sw-m">上次修改：2026-09-12</div></div><button class="btn btn-sm" id="stPwd">修改密码</button></div>
              <div class="switch-row"><div><div class="sw-t">微信扫码绑定</div><div class="sw-m">已绑定 · 用于扫码登录</div></div>${stPill(['已绑定','on'])}</div>
              <div class="switch-row"><div><div class="sw-t">登录设备</div><div class="sw-m">当前仅 1 台设备在线</div></div><button class="btn btn-sm" id="stDev">查看</button></div>
            </div></div>
        </div>`;
      $('stPwd').onclick = ()=>toast('修改密码为演示占位');
      $('stDev').onclick = ()=>toast('登录设备管理为演示占位');
      $('stSave').onclick = ()=>toast('设置已保存（演示）','ok');
    }
  };
  (F[key] || (()=>{
    box.innerHTML = pageHead('模块建设中','该模块将在后续版本并入统一工作台');
  }))();
}
/* ================================================================
   16.10 认证：企业认证 / 服务商认证
   ================================================================ */
function stepBar(items, cur){
  return `<div class="steps">${items.map((t,i)=>{
    const n = i+1, cls = n<cur ? 'done' : (n===cur ? 'on' : '');
    return `<div class="step ${cls}"><span class="sn">${n<cur?'✓':n}</span><span class="st-txt">${t}</span></div>`;
  }).join('')}</div>`;
}
function readFormIn(scope){
  const v = {};
  scope.querySelectorAll('[data-fk]').forEach(el=>{
    if(el.tagName==='INPUT' || el.tagName==='TEXTAREA' || el.tagName==='SELECT') v[el.dataset.fk] = el.value.trim();
  });
  scope.querySelectorAll('[data-arr]').forEach(w=>{
    const on = [...w.querySelectorAll('button.on')].map(b=>b.dataset.v);
    v[w.dataset.arr] = w.classList.contains('slot-row') ? (on[0]||'') : on;
  });
  return v;
}
function bindPickers(scope){
  scope.querySelectorAll('.chip-pick,.slot-row').forEach(w=>{
    w.querySelectorAll('button:not([disabled])').forEach(b=>{
      b.addEventListener('click', ()=>{
        if(w.classList.contains('slot-row')){
          w.querySelectorAll('button').forEach(x=>x.classList.remove('on'));
          b.classList.add('on');
        }else b.classList.toggle('on');
      });
    });
  });
}
function upBlock(name, hint){
  return `<div class="up-box" data-up="${esc(name)}">
    <div class="ub-t">${name||'点击上传'}</div>
    <div class="ub-d">${hint||'演示环境：点击即视为上传成功'} </div>
  </div>`;
}

/* ---------- 企业认证 ---------- */
function renderCertEnt(box){
  if(CERT_ENT.editing) return renderCertEntWizard(box);
  const st = CERT_ENT.state;
  const cls = st===2?'':st===1?'pending':st===3?'reject':'none';
  const sideBtns = st===2
    ? '<button class="btn btn-sm" id="ceRecert">重新认证</button><button class="btn btn-sm" id="ceReject">模拟驳回</button>'
    : st===1
      ? '<button class="btn btn-sm" id="ceRecert">修改材料</button><button class="btn btn-sm" id="cePass">模拟审核通过</button><button class="btn btn-sm" id="ceReject">模拟驳回</button>'
      : st===3
        ? '<button class="btn btn-sm" id="ceRecert">重新提交</button>'
        : '<button class="btn btn-sm" id="ceRecert">开始认证</button>';

  const logs = CERT_ENT.logs.map(l=>
    `<div class="tl-i ${l.s}"><div class="tl-t">${esc(l.t)}</div><div class="tl-d">${esc(l.d)}</div></div>`
  ).join('');

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">企业认证</div>
      <div class="page-desc">认证通过后才能发布岗位、查看候选人简历、发起面试邀约；证照仅用于平台核验，不对外展示</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="ceRule">认证规则</button>
      ${st===2?'<button class="btn btn-primary" id="ceView">查看认证详情</button>':''}
    </div></div>

    <div class="cert-hero ${cls}">
      <div class="ch-ico">${ICONS.cert}</div>
      <div class="ch-main">
        <div class="ch-t">深圳市云启科技有限公司
          ${st===2?'<span class="lv">企业认证 · 已通过</span>':''}
          ${st===1?'<span class="lv">审核中</span>':''}
          ${st===3?'<span class="lv">已驳回</span>':''}
          ${st===0?'<span class="lv">未提交</span>':''}
        </div>
        <div class="ch-s">${st===2
          ? '统一社会信用代码 91440300MA5FL8X23K · 有效期 2026-09-19 ~ 2027-09-18'
          : st===1
            ? '已提交于 '+CERT_ENT.submitAt+' · 平台将在 1 个工作日内完成审核'
            : st===3
              ? '驳回原因：'+esc(CERT_ENT.rejectReason||'证照信息与工商登记不一致')
              : '尚未提交认证材料，发布与查看简历功能受限'}</div>
      </div>
      <div class="ch-side">${sideBtns}</div>
    </div>

    ${st===3?`<div class="tipbar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 8.2v.01M12 11v5"/></svg>
      <span>认证被驳回：<b>${esc(CERT_ENT.rejectReason||'证照信息与工商登记不一致')}</b>，请修改后重新提交。</span><span class="spacer"></span><span class="lnk" id="ceRecert2">去修改</span></div>`:''}

    <div class="ov-cols">
      <div>
        ${blkBox('主体信息','工商登记口径', '', kvGrid([
          ['企业全称', esc(CERT_ENT.name), false, true],
          ['统一社会信用代码','<span class="t-mono">'+esc(CERT_ENT.code)+'</span>'],
          ['企业类型', esc(CERT_ENT.type)],
          ['成立年份', esc(CERT_ENT.year)],
          ['员工规模', esc(CERT_ENT.size)],
          ['官网', esc(CERT_ENT.site)],
          ['注册地址', esc(CERT_ENT.addr), true],
          ['经营范围', esc(CERT_ENT.scope), true]
        ]))}
        <div style="height:16px"></div>
        ${blkBox('资质证照','平台内部核验，不对外展示', '', `
          <div class="up-file"><div class="uf-ico">${ICONS.resume}</div>
            <div class="uf-n">${esc(CERT_ENT.lic)}</div><span class="st on">已核验</span></div>
          <div class="up-file"><div class="uf-ico">${ICONS.resume}</div>
            <div class="uf-n">${esc(CERT_ENT.authFile)}</div><span class="st on">已核验</span></div>
          <div class="kv-grid" style="margin-top:14px">
            <div class="kv"><div class="k">法定代表人</div><div class="v strong">${esc(CERT_ENT.legal)}</div></div>
            <div class="kv"><div class="k">法人证件号</div><div class="v t-mono">${esc(CERT_ENT.legalId)}</div></div>
          </div>`)}
      </div>
      <div>
        ${blkBox('开票信息','用于培训 / 内训订单开票', '<span class="row-act" id="ceInv">修改</span>', kvGrid([
          ['发票抬头', esc(CERT_ENT.invoice.title), true, true],
          ['纳税人识别号','<span class="t-mono">'+esc(CERT_ENT.invoice.tax)+'</span>'],
          ['开户行', esc(CERT_ENT.invoice.bank)],
          ['银行账号','<span class="t-mono">'+esc(CERT_ENT.invoice.acct)+'</span>']
        ]))}
        <div style="height:16px"></div>
        ${blkBox('认证联系人','接收审核结果与业务通知', '', kvGrid([
          ['联系人', esc(CERT_ENT.contact)+' · '+esc(CERT_ENT.contactTitle)],
          ['手机号','<span class="t-mono">'+esc(CERT_ENT.mobile)+'</span>'],
          ['邮箱', esc(CERT_ENT.email), true]
        ]))}
        <div style="height:16px"></div>
        ${blkBox('审核记录', '', '', `<div class="tl">${logs}</div>`)}
      </div>
    </div>`;

  const startWizard = ()=>{ CERT_ENT.editing = true; state.certStep = 1; renderCertEnt(box); };
  if($('ceRecert')) $('ceRecert').onclick = startWizard;
  if($('ceRecert2')) $('ceRecert2').onclick = startWizard;
  if($('ceView')) $('ceView').onclick = ()=>toast('认证材料已提交平台核验，如需修改请点击「重新认证」');
  $('ceRule').onclick = ()=>askConfirm('企业认证规则',
    '1. 认证主体须与营业执照一致，且营业执照在有效期内；\n2. 一个统一社会信用代码仅可认证一个企业账号；\n3. 认证有效期 12 个月，到期前 30 天站内消息提醒续期；\n4. 提供虚假材料将被永久封禁并追究责任。',
    '知道了', null, 'info');
  $('ceInv').onclick = ()=>toast('开票信息修改入口：随「重新认证」第三步一并提交');
  if($('cePass')) $('cePass').onclick = ()=>{
    CERT_ENT.state = 2; CERT_ENT.passAt = nowStamp({full:true});
    CERT_ENT.logs.push({t:'平台审核通过', d:nowStamp({full:true})+' · 审核人：平台运营（工号 A023）', s:'ok'});
    renderCertEnt(box); toast('认证已通过，发布与查看简历权限已开放','ok');
  };
  if($('ceReject')) $('ceReject').onclick = ()=>{
    CERT_ENT.state = 3;
    CERT_ENT.rejectReason = '营业执照副本缺少年检章，请上传最新版本';
    CERT_ENT.logs.push({t:'平台审核驳回', d:nowStamp({full:true})+' · 原因：营业执照副本缺少年检章', s:'on'});
    renderCertEnt(box); toast('已模拟驳回，可查看驳回原因');
  };
}
function renderCertEntWizard(box){
  const cur = state.certStep, D = CERT_ENT.draft;
  const g = (k, def)=> (D[k]!==undefined && D[k]!=='') ? D[k] : (def||'');
  const steps = ['主体信息','资质证照','经营与开票','联系人验证'];

  const s1 = `<div class="grid">
    ${bigField({k:'cName', label:'企业全称', req:1, value:g('cName',CERT_ENT.name), ph:'须与营业执照完全一致'})}
    ${bigField({k:'cCode', label:'统一社会信用代码', req:1, value:g('cCode',CERT_ENT.code), half:1, ph:'18 位'})}
    ${bigField({k:'cYear', label:'成立年份', value:g('cYear',CERT_ENT.year), half:1, ph:'如 2017'})}
    ${bigField({k:'cType', label:'企业类型', type:'sel', half:1,
      opts:['有限责任公司','股份有限公司','个体工商户','合伙企业','其他'], value:g('cType',CERT_ENT.type)})}
    ${bigField({k:'cSize', label:'员工规模', type:'sel', half:1,
      opts:['20 人以下','20-50 人','50-200 人','200-500 人','500-1000 人','1000 人以上'], value:g('cSize',CERT_ENT.size)})}
    ${bigField({k:'cAddr', label:'注册地址', req:1, value:g('cAddr',CERT_ENT.addr), ph:'省 / 市 / 区 + 详细地址'})}
    ${bigField({k:'cSite', label:'官网', value:g('cSite',CERT_ENT.site), half:1, ph:'选填'})}
    ${bigField({k:'cScope', label:'经营范围', type:'txa', h:70, value:g('cScope',CERT_ENT.scope)})}
  </div>`;

  const s2 = `<div class="grid">
    <div class="field col-2 ta"><label class="lb">营业执照<i class="req">*</i></label>
      <div class="up-box"><div class="ub-t">${esc(g('cLic',CERT_ENT.lic))}</div>
      <div class="ub-d">点击重新上传 · 支持 JPG / PNG / PDF，单份 ≤ 10 MB，需加盖公章</div></div></div>
    ${bigField({k:'cLegal', label:'法定代表人', req:1, value:g('cLegal',CERT_ENT.legal), half:1})}
    ${bigField({k:'cLegalId', label:'法人证件号', req:1, value:g('cLegalId',CERT_ENT.legalId), half:1})}
    <div class="field col-2 ta"><label class="lb">授权委托书</label>
      <div class="up-box"><div class="ub-t">${esc(g('cAuth',CERT_ENT.authFile))}</div>
      <div class="ub-d">非法人办理时必填 · 需法人签字并加盖公章</div></div></div>
  </div>`;

  const s3 = `<div class="grid">
    ${bigField({k:'cInvTitle', label:'发票抬头', value:g('cInvTitle',CERT_ENT.invoice.title)})}
    ${bigField({k:'cInvTax', label:'纳税人识别号', value:g('cInvTax',CERT_ENT.invoice.tax), half:1})}
    ${bigField({k:'cInvBank', label:'开户行', value:g('cInvBank',CERT_ENT.invoice.bank), half:1})}
    ${bigField({k:'cInvAcct', label:'银行账号', value:g('cInvAcct',CERT_ENT.invoice.acct), half:1})}
    ${bigField({k:'cYearHire', label:'预计年招聘量', type:'sel', half:1,
      opts:['10 人以内','10-50 人','50-200 人','200 人以上'], value:g('cYearHire','10-50 人')})}
    ${bigField({k:'cDirs', label:'主要招聘方向', type:'chips', value:D.cDirs||['AI 产品','算法 / 大模型'],
      opts:['AI 产品','算法 / 大模型','AI 运营','数据标注与评测','前端 / 全栈','AI 设计']})}
  </div>`;

  const s4 = `<div class="grid">
    ${bigField({k:'cContact', label:'联系人', req:1, value:g('cContact',CERT_ENT.contact), half:1})}
    ${bigField({k:'cTitle', label:'职务', req:1, value:g('cTitle',CERT_ENT.contactTitle), half:1})}
    ${bigField({k:'cMobile', label:'手机号', req:1, value:g('cMobile',CERT_ENT.mobile), half:1, ph:'用于接收审核结果'})}
    ${bigField({k:'cCode', label:'短信验证码', value:'123456', half:1, ph:'演示环境固定 123456',
      tip:'真实环境点击「获取验证码」后 60 秒内有效'})}
    ${bigField({k:'cEmail', label:'邮箱', req:1, value:g('cEmail',CERT_ENT.email), ph:'接收合同与发票通知'})}
    <div class="field col-2"><div class="tipbar blue" style="margin:0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 8.2v.01M12 11v5"/></svg>
      <span>提交后平台将在 <b>1 个工作日</b>内完成审核，结果以站内消息通知。认证期间可继续编辑，审核开始后不可修改。</span>
    </div></div>
  </div>`;

  const body = [s1,s2,s3,s4][cur-1];
  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">企业认证</div>
      <div class="page-desc">第 ${cur} / 4 步 · ${steps[cur-1]}</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="ceCancel">取消</button>
    </div></div>
    ${stepBar(steps, cur)}
    ${blkBox(steps[cur-1], cur===2?'整份材料仅用于平台核验':(cur===4?'填写后点击提交审核':''), '', body)}
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      ${cur>1?'<button class="btn" id="cePrev">上一步</button>':'<span></span>'}
      <button class="btn" id="ceDraft">保存草稿</button>
      ${cur<4
        ? '<button class="btn btn-primary" id="ceNext" style="height:36px">下一步</button>'
        : '<button class="btn btn-primary" id="ceSubmit" style="height:36px">提交审核</button>'}
    </div>`;

  bindPickers(box);
  box.querySelectorAll('.up-box').forEach(b=>b.addEventListener('click', ()=>toast('演示环境：已重新上传「'+b.querySelector('.ub-t').textContent+'」','ok')));

  const save = ()=>{ Object.assign(CERT_ENT.draft, readFormIn(box)); };
  $('ceCancel').onclick = ()=>{
    if(!confirm('退出后已填写内容会保留在草稿，确认退出？')) return;
    save(); CERT_ENT.editing = false; renderCertEnt(box);
  };
  $('ceDraft').onclick = ()=>{ save(); toast('草稿已保存','ok'); };
  if($('cePrev')) $('cePrev').onclick = ()=>{ save(); state.certStep--; renderCertEnt(box); };
  if($('ceNext')) $('ceNext').onclick = ()=>{
    const v = readFormIn(box);
    if(cur===1 && (!v.cName || !v.cCode)){ toast('请填写企业全称与统一社会信用代码','err'); return; }
    if(cur===2 && (!v.cLegal || !v.cLegalId)){ toast('请填写法定代表人信息','err'); return; }
    save(); state.certStep++; renderCertEnt(box);
  };
  if($('ceSubmit')) $('ceSubmit').onclick = ()=>{
    const v = readFormIn(box);
    if(!v.cContact || !v.cMobile || !v.cEmail){ toast('请完整填写联系人、手机号与邮箱','err'); return; }
    if(!/^\d{6}$/.test(v.cCode||'')){ toast('请输入 6 位短信验证码（演示可填 123456）','err'); return; }
    save();
    CERT_ENT.state = 1;
    CERT_ENT.submitAt = nowStamp({full:true});
    CERT_ENT.logs = [{t:'提交认证申请', d:CERT_ENT.submitAt+' · 提交主体信息、证照 2 份、对公开票信息', s:'ok'},
                     {t:'平台审核中', d:'当前节点：证照核验（预计 1 个工作日内完成）', s:'on'}];
    CERT_ENT.editing = false; CERT_ENT.draft = {}; state.certStep = 1;
    renderCertEnt(box);
    toast('认证材料已提交，平台将在 1 个工作日内完成审核','ok');
  };
}

/* ---------- 服务商认证 ---------- */
function renderCertSp(box){
  if(CERT_SP.editing) return renderCertSpWizard(box);
  const st = CERT_SP.state;
  const cls = st===2?'':st===1?'pending':st===3?'reject':'none';
  const typeTxt = {person:'个人服务商', org:'机构服务商', team:'团队服务商'}[CERT_SP.type] || '机构服务商';
  const sideBtns = st===2
    ? '<button class="btn btn-sm" id="csEdit">更新资质</button><button class="btn btn-sm" id="csReject">模拟驳回</button>'
    : st===1
      ? '<button class="btn btn-sm" id="csEdit">修改材料</button><button class="btn btn-sm" id="csPass">模拟审核通过</button><button class="btn btn-sm" id="csReject">模拟驳回</button>'
      : st===3
        ? '<button class="btn btn-sm" id="csEdit">重新提交</button>'
        : '<button class="btn btn-sm" id="csEdit">开始入驻</button>';
  const logs = CERT_SP.logs.map(l=>
    `<div class="tl-i ${l.s}"><div class="tl-t">${esc(l.t)}</div><div class="tl-d">${esc(l.d)}</div></div>`).join('');

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">服务商认证</div>
      <div class="page-desc">个人 / 机构 / 团队三类主体均可入驻 · 通过后可在承接大厅接单、上架课程与私教服务、结算分成</div>
    </div><div class="spacer"></div><div class="head-ops"><button class="btn" id="csRule">入驻规则</button></div></div>

    <div class="cert-hero ${cls}">
      <div class="ch-ico">${ICONS.cert}</div>
      <div class="ch-main">
        <div class="ch-t">${esc(CERT_SP.name)}
          <span class="lv">${typeTxt}</span>
          ${st===2?'<span class="lv">认证通过</span>':st===1?'<span class="lv">审核中</span>':st===3?'<span class="lv">已驳回</span>':''}
        </div>
        <div class="ch-s">${st===2
          ? '认证等级：'+(CERT_SP.level||'认证服务商')+' · 有效期 2026-10-22 ~ 2027-10-21'
          : st===1
            ? '已提交于 '+CERT_SP.submitAt+' · 平台将在 1 个工作日内完成资质核验'
            : st===3
              ? '驳回原因：'+esc(CERT_SP.rejectReason||'案例材料不足以证明交付能力')
              : '尚未提交入驻申请，暂不能承接项目与上架服务'}</div>
      </div>
      <div class="ch-side">${sideBtns}</div>
    </div>

    ${st===2?tipbar('已具备承接资格，可前往「承接大厅」申请项目，或在「发布端管理」上架课程与服务。','green','去承接大厅','csHall'):''}
    ${st===1?tipbar('审核期间可先完善案例与报价区间，审核通过后立即生效。','blue'):''}
    ${st===3?tipbar('认证被驳回：<b>'+esc(CERT_SP.rejectReason||'案例材料不足以证明交付能力')+'</b>，补充材料后可重新提交。',null,'去补充','csEdit2'):''}

    <div class="ov-cols">
      <div>
        ${blkBox('主体信息', typeTxt, '', kvGrid([
          ['主体名称', esc(CERT_SP.name), false, true],
          ['统一社会信用代码','<span class="t-mono">'+esc(CERT_SP.code)+'</span>'],
          ['负责人', esc(CERT_SP.legal)],
          ['成立年份', esc(CERT_SP.year)],
          ['团队规模', esc(CERT_SP.size)],
          ['所在城市', esc(CERT_SP.addr)],
          ['联系方式', esc(CERT_SP.mobile)+' · '+esc(CERT_SP.email), true]
        ]))}
        <div style="height:16px"></div>
        ${blkBox('能力资质','决定可承接的项目类型与排序权重', '', `
          <div style="font-size: 12px;color:var(--muted);margin-bottom:8px">擅长领域</div>
          <div class="skill-list">${CERT_SP.domain.map(d=>`<span class="skill-tag">${esc(d)}</span>`).join('')}</div>
          <div style="font-size: 12px;color:var(--muted);margin:14px 0 8px">资质证书</div>
          <div style="font-size: 12px;color:var(--text-2);line-height:1.8">${esc(CERT_SP.certs)}</div>
          <div style="font-size: 12px;color:var(--muted);margin:14px 0 6px">案例（${(CERT_SP.cases.match(/^\d\./gm)||[]).length || 3} 个）</div>
          <div class="rich-text" style="font-size: 12px;white-space:pre-line;color:var(--text-2);line-height:1.85">${esc(CERT_SP.cases)}</div>`)}
      </div>
      <div>
        ${blkBox('报价与承接','用于承接大厅的匹配与筛选', '', kvGrid([
          ['报价区间', esc(CERT_SP.price), true],
          ['可承接地域', esc(CERT_SP.region), true],
          ['结算方式', esc(CERT_SP.settle)],
          ['开票能力', esc(CERT_SP.invoice)]
        ]))}
        <div style="height:16px"></div>
        ${blkBox('审核记录', '', '', `<div class="tl">${logs}</div>`)}
      </div>
    </div>`;

  const startWizard = ()=>{ CERT_SP.editing = true; state.spStep = 1; renderCertSp(box); };
  if($('csEdit')) $('csEdit').onclick = startWizard;
  if($('csEdit2')) $('csEdit2').onclick = startWizard;
  if($('csHall')) $('csHall').onclick = ()=>go('hall');
  $('csRule').onclick = ()=>askConfirm('服务商入驻规则',
    '1. 个人服务商需实名认证并至少提供 2 个可验证案例；\n2. 机构服务商需提供营业执照与法人信息；\n3. 平台按「案例质量 + 交付评价 + 响应速度」划分普通 / 认证 / 金牌三级；\n4. 项目成交后平台抽取 8%~10% 服务费，结算周期为验收后 15 个工作日。',
    '知道了', null, 'info');
  if($('csPass')) $('csPass').onclick = ()=>{
    CERT_SP.state = 2; CERT_SP.level = '认证服务商'; CERT_SP.passAt = nowStamp({full:true});
    CERT_SP.logs.push({t:'平台审核通过', d:nowStamp({full:true})+' · 认证等级：认证服务商', s:'ok'});
    renderCertSp(box); toast('服务商认证已通过，可承接项目与上架服务','ok');
  };
  if($('csReject')) $('csReject').onclick = ()=>{
    CERT_SP.state = 3;
    CERT_SP.rejectReason = '案例材料缺少交付结果与客户佐证，请补充 2 个可核验案例';
    CERT_SP.logs.push({t:'平台审核驳回', d:nowStamp({full:true})+' · 案例材料不足以证明交付能力', s:'on'});
    renderCertSp(box); toast('已模拟驳回');
  };
}
function renderCertSpWizard(box){
  const cur = state.spStep, D = CERT_SP.draft;
  const g = (k, def)=> (D[k]!==undefined && D[k]!=='') ? D[k] : (def||'');
  const type = D.spType || CERT_SP.type;
  const steps = ['主体类型','能力资质','结算信息'];

  const typeCard = (k,t,d)=>
    `<div class="pkg${type===k?' on':''}" data-type="${k}" style="cursor:pointer">
      <div class="pk-n">${t}</div><div class="pk-d" style="margin-top:8px">${d}</div></div>`;

  const s1 = `
    <div class="pkg-row" style="margin-bottom:16px">
      ${typeCard('person','个人服务商','以个人身份承接项目与私教，适合独立顾问、自由职业者')}
      ${typeCard('org','机构服务商','以公司主体承接项目与培训，可开票、可签对公合同')}
      ${typeCard('team','团队服务商','以团队名义承接，需指定牵头人，成员可后续添加')}
    </div>
    <div class="grid">
      ${bigField({k:'sName', label:(type==='person'?'真实姓名':(type==='team'?'团队名称':'机构全称')), req:1,
        value:g('sName', CERT_SP.name)})}
      ${type==='person'
        ? bigField({k:'sId', label:'身份证号', req:1, value:g('sId','4403**********1234'), half:1})
        : bigField({k:'sCode', label:'统一社会信用代码', req:1, value:g('sCode', CERT_SP.code), half:1})}
      ${type==='team'
        ? bigField({k:'sLead', label:'牵头人', req:1, value:g('sLead','周昱'), half:1})
        : bigField({k:'sLegal', label:(type==='person'?'所在城市':'法定代表人'), req:1, value:g('sLegal', CERT_SP.legal), half:1})}
      ${bigField({k:'sYear', label:'成立 / 从业年份', value:g('sYear',CERT_SP.year), half:1})}
      ${bigField({k:'sSize', label:'团队规模', type:'sel', half:1,
        opts:['仅本人','2-5 人','5-20 人','20-50 人','50 人以上'], value:g('sSize',CERT_SP.size)})}
      ${bigField({k:'sAddr', label:'所在城市 / 地址', value:g('sAddr',CERT_SP.addr)})}
      ${bigField({k:'sContact', label:'联系人', req:1, value:g('sContact',CERT_SP.contact), half:1})}
      ${bigField({k:'sMobile', label:'手机号', req:1, value:g('sMobile',CERT_SP.mobile), half:1})}
      ${bigField({k:'sEmail', label:'邮箱', req:1, value:g('sEmail',CERT_SP.email)})}
    </div>
    ${type!=='person'?`<div class="grid" style="margin-top:6px"><div class="field col-2 ta"><label class="lb">营业执照<i class="req">*</i></label>
      <div class="up-box"><div class="ub-t">${esc(g('sLic','营业执照-智远AI-2026.pdf'))}</div>
      <div class="ub-d">需加盖公章 · 支持 JPG / PNG / PDF</div></div></div></div>`:''}`;

  const s2 = `<div class="grid">
    ${bigField({k:'sDomain', label:'擅长领域', type:'chips', req:1,
      value:D.sDomain||CERT_SP.domain,
      opts:['大模型应用','AI 产品','数据分析','AI 视觉','Agent 开发','AI 培训','AI 职业规划','流程自动化']})}
    ${bigField({k:'sCerts', label:'资质证书', value:g('sCerts',CERT_SP.certs), ph:'多个证书用顿号分隔'})}
    ${bigField({k:'sCases', label:'案例（至少 2 个）', type:'txa', h:110, req:1, value:g('sCases',CERT_SP.cases),
      tip:'建议按「客户类型 + 做了什么 + 可量化结果 + 年份」写，平台审核会逐条核验'})}
    <div class="field col-2 ta"><label class="lb">作品集 / 案例附件</label>
      <div class="up-box"><div class="ub-t">案例材料-智远AI.pdf</div>
      <div class="ub-d">支持 PDF / PPT / ZIP，单份 ≤ 20 MB</div></div></div>
  </div>`;

  const s3 = `<div class="grid">
    ${bigField({k:'sPrice', label:'报价区间', req:1, value:g('sPrice',CERT_SP.price), ph:'如：项目 20~80 万；人天 3.5~6 千'})}
    ${bigField({k:'sRegion', label:'可承接地域', value:g('sRegion',CERT_SP.region), half:1})}
    ${bigField({k:'sSettle', label:'结算方式', type:'sel', half:1,
      opts:['对公账户 · 月结 15 日','对公账户 · 验收后 15 个工作日','个人收款 · 验收后 7 个工作日'], value:g('sSettle',CERT_SP.settle)})}
    ${bigField({k:'sInvoice', label:'开票能力', type:'sel', value:g('sInvoice',CERT_SP.invoice),
      opts:['可开 6% 增值税专用发票','可开 3% 增值税普通发票','暂不支持开票']})}
    ${bigField({k:'sAgree', label:'协议确认', type:'txa', h:56, value:'', ph:'勾选下方协议后提交'})}
    <div class="field col-2"><div class="tipbar blue" style="margin:0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 8.2v.01M12 11v5"/></svg>
      <span>提交即表示同意《服务商入驻协议》与《平台服务费规则》（项目类抽佣 8%~10%）。审核通过后可随时更新资质，更新同样需要审核。</span>
    </div></div>
  </div>`;

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">服务商认证</div>
      <div class="page-desc">第 ${cur} / 3 步 · ${steps[cur-1]}</div>
    </div><div class="spacer"></div><div class="head-ops"><button class="btn" id="csCancel">取消</button></div></div>
    ${stepBar(steps, cur)}
    ${blkBox(steps[cur-1], '', '', [s1,s2,s3][cur-1])}
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      ${cur>1?'<button class="btn" id="csPrev">上一步</button>':'<span></span>'}
      ${cur<3
        ? '<button class="btn btn-primary" id="csNext" style="height:36px">下一步</button>'
        : '<button class="btn btn-primary" id="csSubmit" style="height:36px">提交审核</button>'}
    </div>`;

  bindPickers(box);
  box.querySelectorAll('[data-type]').forEach(c=>{
    c.addEventListener('click', ()=>{
      Object.assign(CERT_SP.draft, readFormIn(box));
      CERT_SP.draft.spType = c.dataset.type;
      CERT_SP.type = c.dataset.type;
      renderCertSp(box);
    });
  });
  box.querySelectorAll('.up-box').forEach(b=>b.addEventListener('click', ()=>toast('演示环境：已上传案例附件','ok')));

  const save = ()=>Object.assign(CERT_SP.draft, readFormIn(box));
  $('csCancel').onclick = ()=>{ save(); CERT_SP.editing = false; renderCertSp(box); };
  if($('csPrev')) $('csPrev').onclick = ()=>{ save(); state.spStep--; renderCertSp(box); };
  if($('csNext')) $('csNext').onclick = ()=>{
    const v = readFormIn(box);
    if(cur===1 && (!v.sName || !v.sMobile)){ toast('请填写主体名称与手机号','err'); return; }
    if(cur===2 && (!(v.sDomain||[]).length)){ toast('请至少选择 1 个擅长领域','err'); return; }
    save(); state.spStep++; renderCertSp(box);
  };
  if($('csSubmit')) $('csSubmit').onclick = ()=>{
    save();
    CERT_SP.state = 1; CERT_SP.submitAt = nowStamp({full:true});
    CERT_SP.logs = [{t:'提交入驻申请', d:CERT_SP.submitAt+' · 主体资质、案例材料已提交', s:'ok'},
                    {t:'平台审核中', d:'当前节点：资质核验（预计 1 个工作日内完成）', s:'on'}];
    CERT_SP.editing = false; CERT_SP.draft = {}; state.spStep = 1;
    renderCertSp(box);
    toast('入驻申请已提交，平台将在 1 个工作日内完成审核','ok');
  };
}

/* ================================================================
   16.11 投递（替代原来的一键 toast）
   ================================================================ */
function resumePickField(){
  return {k:'rType', label:'投递方式', type:'sel', req:1,
    value:'在线简历', opts:['在线简历', '附件简历 · 王旭-产品经理-2026.pdf']};
}
function openApplyForm(m, r){
  const bk = m.baseKey || m.key;
  /* 已报名的课程不重复报名 */
  if(bk==='train' && MY_COURSES.some(x=>x.id===r.id)){ toast('你已报名该课程，可在「我的课程」中继续学习','ok'); return; }
  const common = {t:(bk==='train'?'报名材料':'投递材料'), note:'企业看到的将是你选择的简历 + 本次填写的补充信息', fields:[
    resumePickField(),
    {k:'letter', label:'自荐语', type:'txa', h:80, ph:'用 2~3 句话说明你为什么适合，会显著提升通过率'}
  ]};

  const byMod = {
    job:{t:'补充信息', fields:[
      {k:'salary', label:'期望薪资', value:'20-25K', half:1},
      {k:'onboard', label:'到岗时间', type:'sel', half:1, opts:['随时','1 周内','2 周内','1 个月内','待定'], value:'2 周内'},
      {k:'state', label:'当前状态', type:'sel', half:1, opts:['在职-月内到岗','在职-考虑机会','离职-随时到岗'], value:'在职-月内到岗'},
      {k:'cityOk', label:'可接受城市', value:'深圳 / 杭州', half:1}
    ]},
    outs:{t:'用工信息', note:'外包岗按用工形式匹配，请如实填写', fields:[
      {k:'form', label:'期望用工形式', type:'chips', req:1,
        value:[m.types[r.type]], opts:['全职外包','实习外包','兼职工时','按天结算','驻场派遣']},
      {k:'avail', label:'可到岗日期', value:'2026-11-01', half:1},
      {k:'settle', label:'期望结算方式', type:'sel', half:1, opts:['月结','按天结算','按周结算','项目结束一次性'], value:'月结'},
      {k:'cityOk', label:'可接受城市', value:'深圳', half:1},
      {k:'stay', label:'可服务周期', value:'6 个月以上', half:1}
    ]},
    intern:{t:'实习信息', note:'实习岗按可实习周期与到岗天数筛选', fields:[
      {k:'period', label:'可实习起止', req:1, value:'2026-11 ~ 2027-05', half:1, ph:'如 2026-11 ~ 2027-05'},
      {k:'days', label:'每周到岗天数', type:'sel', req:1, half:1, opts:['2 天','3 天','4 天','5 天'], value:'4 天'},
      {k:'grade', label:'在校年级', type:'sel', half:1, opts:['大三','大四','研一','研二','研三','已毕业'], value:'研二'},
      {k:'school', label:'学校 / 专业', value:'华中科技大学 · 电子信息工程', half:1},
      {k:'needCert', label:'是否需要实习证明', type:'sel', half:1, opts:['需要','不需要'], value:'需要'}
    ]},
    train:{t:'报名信息', note:'报名后可在「我的课程」查看班期与学习进度', fields:[
      {k:'batch', label:'选择班期', type:'sel', req:1,
        opts:['第 6 期 · 2026-11-10 开班（周二 / 四 20:00）','第 7 期 · 2027-01-05 开班（周二 / 四 20:00）'],
        value:'第 6 期 · 2026-11-10 开班（周二 / 四 20:00）'},
      {k:'stuName', label:'学员姓名', req:1, value:'王旭', half:1},
      {k:'stuMobile', label:'手机号', req:1, value:'150****6688', half:1},
      {k:'invoice', label:'开票需求', type:'sel', half:1, opts:['个人 · 不开发票','企业 · 增值税普通发票','企业 · 增值税专用发票'], value:'个人 · 不开发票'},
      {k:'coupon', label:'优惠码', value:'', half:1, ph:'选填'}
    ]},
    coach:{t:'预约信息', note:'提交后讲师将在 24 小时内确认', fields:[
      {k:'pkg', label:'选择套餐', type:'chips', req:1, value:['4 次套餐 ¥1680'],
        opts:['单次咨询 ¥499','4 次套餐 ¥1680','12 周陪跑 ¥5980']},
      {k:'slot', label:'期望时段', type:'slots', req:1, busy:['10-25 周六 14:00'],
        opts:['10-24 周五 10:00','10-24 周五 15:00','10-25 周六 10:00','10-25 周六 14:00','10-26 周日 10:00','10-27 周一 20:00'],
        value:['10-24 周五 10:00']},
      {k:'goal', label:'本次想解决的问题', type:'txa', h:80, req:1,
        ph:'例如：想从 B 端产品转到 AI 产品，不知道简历该怎么改'}
    ]}
  }[bk] || {t:'补充信息', fields:[{k:'memo', label:'备注', type:'txa', h:70, ph:'补充说明'}]};

  openBigForm((bk==='train'?'报名 · ':'投递 · ') + esc(r.title), m.title + ' · ' + esc(r.co||''),
    [common, byMod],
    (v)=>{
      if(!v.rType){ toast('请选择投递方式','err'); return false; }
      const now = nowStamp();
      const id = 'AP' + Date.now().toString().slice(-9);
      APPLIES_P.unshift({
        id:id, obj:r.title, type:(bk==='job'?'岗位':bk==='outs'?'外包':bk==='intern'?'实习':bk==='train'?'培训':'私教'),
        co:r.co||'深圳市云启科技有限公司', salary:r.salary||r.budget||'面议', time:now, st:1, auth:0,
        resumeAuth:{seeker:1, company:0}, fb:'简历已投递，等待企业查看。'
      });
      APPLIES_E.unshift({
        id:'AE'+Date.now().toString().slice(-5), who:'王旭', dir:'AI 产品 · 4 年',
        obj:r.title, type:(bk==='train'?'课程报名':bk==='coach'?'私教预约':bk==='intern'?'实习投递':'岗位投递'),
        time:now, st:1,
        msg:(v.letter || '（未填写自荐语）') + (v.slot?'｜期望时段：'+v.slot:'') + (v.period?'｜可实习：'+v.period+' · 每周 '+v.days:'')
      });
      if(bk==='train'){
        MY_COURSES.unshift({
          id:r.id, title:r.title, teacher:(r.teacher||r.co||'讲师').replace('讲师 · ',''), cover:2,
          cls:'2026-11-10 ~ 12-22 · 每周二 / 四 20:00', mode:'线上直播 + 2 天线下（深圳）',
          done:0, total:32, score:null, cert:'结课后发放', next:'开班后解锁',
          lessons:[{n:'第 1 讲 · 大模型能力边界与选型', d:'2 课时', ok:0},
                   {n:'第 2 讲 · 结构化提示词与多轮设计', d:'2 课时', ok:0}]
        });
        ORDERS.unshift({
          id:'OD'+Date.now().toString().slice(-10), cat:'train', title:r.title,
          co:(r.co||'DAKA 平台课程'), amount:3600, st:1, at:now, pay:'待支付',
          detail:[['班期', v.batch||'第 6 期'],['学员', v.stuName+'（'+v.stuMobile+'）'],
                  ['课时','32 课时 · 6 周'],['开票', v.invoice||'个人 · 不开发票']]
        });
      }
      if(bk==='coach'){
        const pay = (v.pkg||['单次咨询 ¥499'])[0];
        const amt = parseInt(String(pay).replace(/[^\d]/g,''))||499;
        ORDERS.unshift({
          id:'OD'+Date.now().toString().slice(-10), cat:'coach', title:r.title, co:(r.co||'讲师'),
          amount:amt, st:1, at:now, pay:'待支付',
          detail:[['套餐', pay],['期望时段', v.slot||'待定'],['诉求', (v.goal||'').slice(0,24)],
                  ['交付物','按套餐约定']]
        });
      }
      appliedSet(m).add(r.id);
      /* 从 AI 职业规划等非列表页投递时，页面内没有列表容器，跳过重渲染 */
      if($('mCards')) renderList(m);
      toast(m.personToast || '投递成功', 'ok');
      closeFormModal();
      return true;
    }, bk==='train'?'提交报名':'提交投递', 'md');
}

/* ---------- 能力资料 / 承接申请（N10 / N25 共用） ---------- */
function openBidForm(m, r, mode){
  const isApply = mode === 'apply';
  const asCompany = state.acting === 'company';
  openBigForm(
    isApply ? '承接申请 · ' + esc(r.title) : '申请接单 · ' + esc(r.title),
    isApply ? '发布方将看到你的方案、报价与可投入档期' : '项目制合作需要提交能力资料，而不是简历',
    [
      {t:'承接主体', fields:[
        {k:'who', label:'承接主体', req:1, value: asCompany ? '深圳市云启科技有限公司' : '深圳智远 AI 咨询有限公司'},
        {k:'kind', label:'主体类型', type:'sel', half:1, opts:['个人','团队','机构'], value:'机构'},
        {k:'contact', label:'联系人 / 电话', value: asCompany ? '李明 · 138****6621' : '周昱 · 139****8830', half:1},
        {k:'team', label:'投入团队', value:'4 人（1 架构 + 2 开发 + 1 产品）'}
      ]},
      {t:'能力资料', note:'平台审核时会核对案例真实性', fields:[
        {k:'domain', label:'擅长领域', type:'chips', req:1,
          value:['Agent 编排','RAG'], opts:['Agent 编排','RAG','模型微调','数据分析','AI 视觉','流程自动化']},
        {k:'cases', label:'过往案例', type:'txa', h:96, req:1,
          value:'1. 某券商 AI 投研助手：RAG 覆盖 1200 份研报，摘要效率提升 4 倍（2025）\n2. 消费品牌 AI 视觉素材中台：月产 3000+，成本下降 62%（2025）'},
        {k:'cycle', label:'可投入周期', req:1, value:'10 周', half:1},
        {k:'hours', label:'每周投入', type:'sel', half:1, opts:['20 小时以内','20-40 小时','全职投入'], value:'全职投入'}
      ]},
      {t:'报价与方案', fields:[
        {k:'priceMode', label:'报价方式', type:'sel', half:1, opts:['总价','人天单价'], value:'总价'},
        {k:'price', label:'报价', req:1, value:'58 万', half:1},
        {k:'start', label:'可开始日期', value:'2026-11-01', half:1},
        {k:'plan', label:'承接方案', type:'txa', h:100, req:1,
          value:'分三阶段推进：① 需求对齐与知识库梳理（2 周）② 检索链路与评测体系（5 周）③ 上线灰度与运营交接（3 周）'},
        {k:'attach', label:'方案附件', value:'承接方案-智远AI-v1.0.pdf', ph:'演示环境已附示例文件'}
      ]}
    ],
    (v)=>{
      if(!(v.domain||[]).length){ toast('请选择擅长领域','err'); return false; }
      if(!v.price){ toast('请填写报价','err'); return false; }
      const now = nowStamp();
      BIDS.unshift({
        id:'BD'+Date.now().toString().slice(-9), proj:(r.id||''), who:v.who||'深圳智远 AI 咨询有限公司',
        kind:v.kind, price:v.price, cycle:v.cycle, team:v.team, plan:v.plan,
        cases:2, at:now, st:1
      });
      if(!isApply){
        APPLIES_P.unshift({
          id:'AP'+Date.now().toString().slice(-9), obj:r.title, type:'项目',
          co:r.co||'发布方', salary:r.budget||v.price, time:now, st:1, auth:0,
          resumeAuth:{seeker:1, company:0}, fb:'能力资料与方案已送达，等待企业比选。'
        });
      }
      toast(isApply?'承接申请已提交，等待企业确认':'能力资料已提交，可在「我的申请」查看进度','ok');
      closeFormModal();
      if(state.page==='hall') renderHall($('pageBox'));
      else if(state.page==='projectManage'||state.page==='project') renderList(m);
      else if(state.page==='applyP') renderApplyP($('pageBox'));
      return true;
    }, isApply?'提交承接申请':'提交能力资料');
}

/* ---------------- 面试 ---------------- */
function openInviteForm(name, job){
  const who = name || state.candId || '林沐';
  openBigForm('发起面试邀约','提交后候选人会收到站内消息，可在「面试管理」中确认或改期',
    [
      {t:'面试安排', fields:[
        {k:'who', label:'候选人', req:1, value:who, half:1},
        {k:'job', label:'应聘岗位', req:1, value:job||'AI 产品经理', half:1},
        {k:'round', label:'面试轮次', type:'sel', half:1, opts:['第 1 轮 · 业务面','第 2 轮 · 交叉面','第 3 轮 · HR 面'], value:'第 1 轮 · 业务面'},
        {k:'time', label:'面试时间', req:1, value:'2026-10-28 14:00', half:1},
        {k:'mode', label:'面试方式', type:'sel', half:1, opts:['线上 · 腾讯会议','到场面试'], value:'线上 · 腾讯会议'},
        {k:'addr', label:'会议链接 / 地址', value:'meeting.tencent.com/j/882-2f1', half:1},
        {k:'interviewer', label:'面试官', value:'李明（HRD）· 王旭（用人经理）'},
        {k:'note', label:'给候选人的说明', type:'txa', h:70,
          value:'重点交流 RAG 项目的需求设计与效果评测，请准备 1 个项目复盘。'}
      ]}
    ],
    (v)=>{
      if(!v.who || !v.time){ toast('请填写候选人与面试时间','err'); return false; }
      INTERVIEWS.unshift({
        id:'IV'+Date.now().toString().slice(-9), dir:'out', who:v.who, job:v.job, round:parseInt(v.round)||1,
        time:v.time, mode:v.mode, addr:v.addr, interviewer:v.interviewer, st:1, note:v.note, at:nowStamp()
      });
      toast('面试邀约已发出，候选人可在「面试管理」中确认','ok');
      closeFormModal();
      if(state.page==='interview') renderInterview($('pageBox'));
      else if(state.page==='applyE') renderApplyE($('pageBox'));
      else if(state.page==='candidate') renderCandidate($('pageBox'));
      return true;
    }, '发送邀约');
}
function openResultForm(iv){
  openBigForm('记录面试结果','结果仅内部可见，用于后续轮次与 offer 决策',
    [
      {t:'面试结果', fields:[
        {k:'result', label:'结论', type:'chips', req:1, value:['通过'],
          opts:['通过','待定','不通过']},
        {k:'score', label:'综合评分', type:'sel', half:1, opts:['5 分 · 强烈推荐','4 分 · 推荐','3 分 · 一般','2 分 · 不推荐'], value:'4 分 · 推荐'},
        {k:'next', label:'下一步', type:'sel', half:1, opts:['进入下一轮','发 offer','放入人才库','结束流程'], value:'进入下一轮'},
        {k:'comment', label:'评语', type:'txa', h:90, req:1,
          ph:'记录能力亮点与风险点，例如：RAG 项目主导经验充分，但缺少团队管理'}
      ]}
    ],
    (v)=>{
      const res = (v.result||['通过'])[0];
      iv.st = res==='不通过' ? 3 : 8;
      iv.result = res;
      iv.comment = v.comment || '';
      iv.score = v.score;
      toast('面试结果已记录','ok');
      closeFormModal();
      renderInterview($('pageBox'));
      return true;
    }, '保存结果');
}

/* ================================================================
   16.12 页面：面试管理（N11 收到邀约 / N18 发出邀约与结果）
   ================================================================ */
function renderInterview(box){
  const tab = state.ivTab;
  const outs = INTERVIEWS.filter(x=>x.dir==='out');
  const ins = INTERVIEWS.filter(x=>x.dir==='in');
  const cnt = st => outs.filter(x=>x.st===st).length;

  const outRows = outs.map(x=>{
    const wait = x.st===1;
    return `<tr>
      <td><div class="job-name">${esc(x.who)}<span class="sub">${esc(x.job)} · 第 ${x.round} 轮</span></div></td>
      <td class="t-time">${esc(x.time)}</td>
      <td class="t-small">${esc(x.mode)}<div class="t-muted" style="font-size: 12px">${esc(x.addr||'')}</div></td>
      <td class="t-small">${esc(x.interviewer||'—')}</td>
      <td>${stPill(IV_ST[x.st]||['—','draft'])}</td>
      <td><div class="ops-cell">
        ${wait?`<span class="row-act" data-remind="${x.id}">催确认</span><span class="row-act" data-resched="${x.id}">改期</span>`:''}
        ${x.st===2?`<span class="row-act" data-result="${x.id}">记录结果</span>`:''}
        ${x.st===8?`<span class="row-act" data-view="${x.id}">查看结论</span>`:''}
        ${x.st===3?`<span class="row-act" data-result="${x.id}">重新发起</span>`:''}
      </div></td>
    </tr>`;
  }).join('');

  const inCards = ins.map(x=>`
    <div class="blk" style="margin-bottom:12px">
      <div class="blk-head">
        <h2>${esc(x.job)}</h2><span class="sub">${esc(x.who)} · 第 ${x.round} 轮</span>
        <span class="spacer"></span>${stPill(IV_ST[x.st])}
      </div>
      <div class="blk-body">
        <div class="kv-grid">
          <div class="kv"><div class="k">面试时间</div><div class="v strong">${esc(x.time)}</div></div>
          <div class="kv"><div class="k">面试方式</div><div class="v">${esc(x.mode)}</div></div>
          <div class="kv"><div class="k">面试官</div><div class="v">${esc(x.interviewer)}</div></div>
          <div class="kv"><div class="k">会议 / 地址</div><div class="v">${esc(x.addr)}</div></div>
          <div class="kv full"><div class="k">企业说明</div><div class="v">${esc(x.note||'—')}</div></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
          ${x.st===5?`<button class="btn btn-primary" style="height:34px" data-accept="${x.id}">接受邀约</button>
            <button class="btn" data-reschedule="${x.id}">申请改期</button>
            <button class="btn btn-danger-o" data-decline="${x.id}">拒绝</button>`
            : x.st===7?`<span class="st pending">已申请改期，等待企业确认</span>`
            : x.st===8?`<span class="st on">面试已完成${x.result?' · '+esc(x.result):''}</span>`
            : `<span class="st on">已确认</span>`}
        </div>
      </div>
    </div>`).join('') || '<div class="empty-state"><b>暂无收到的邀约</b><span>企业发出邀约后会出现在这里</span></div>';

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">面试管理</div>
      <div class="page-desc">发出的邀约与收到的邀约统一在此处理 · 结果回写到「我的申请」与候选人档案</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="ivCal">面试日历</button>
      <button class="btn btn-primary" id="ivNew">＋ 发起面试邀约</button>
    </div></div>
    <div class="stat-row">
      ${statHtml(outs.length,'发出的邀约')}
      ${statHtml(cnt(1)+cnt(4),'待确认')}
      ${statHtml(cnt(2),'已确认')}
      ${statHtml(ins.filter(x=>x.st===5).length,'待我确认')}
    </div>
    ${subTabs('ivTabs',[['out','我发出的（'+outs.length+'）'],['in','我收到的（'+ins.length+'）']], tab)}
    ${tab==='out'
      ? `<div class="blk"><div class="blk-head"><h2>发出的面试邀约</h2><span class="sub">按面试时间倒序</span></div>
          ${simpleTable(
            [{t:'候选人 / 岗位',w:'240px'},{t:'面试时间',w:'150px'},{t:'方式',w:'210px'},
             {t:'面试官',w:'190px'},{t:'状态',w:'120px'},{t:'操作',w:'190px'}],
            outRows || emptyRow(6,'暂无发出的邀约','从「收到申请」中进入候选人详情即可发起'),1180)}
        </div>`
      : `<div>${inCards}</div>`}`;

  bindSubTabs(box,'ivTabs',k=>state.ivTab=k,()=>renderInterview(box));
  $('ivNew').onclick = openInviteForm;
  $('ivCal').onclick = ()=>askConfirm('面试日历（演示）',
    INTERVIEWS.filter(x=>x.st!==3).map(x=>`${x.time}　${x.who}　${x.job}`).join('\n') || '暂无安排',
    '知道了', null, 'info');
  box.querySelectorAll('[data-remind]').forEach(b=>b.onclick=()=>{
    const x = INTERVIEWS.find(i=>i.id===b.dataset.remind);
    toast('已再次提醒「'+x.who+'」确认面试时间','ok');
  });
  box.querySelectorAll('[data-resched]').forEach(b=>b.onclick=()=>{
    const x = INTERVIEWS.find(i=>i.id===b.dataset.resched);
    askConfirm('发起改期？','将向候选人发送新的时间选项，原邀约保持待确认状态。','发起改期',
      ()=>{ x.st = 4; renderInterview(box); toast('改期请求已发送'); },'info');
  });
  box.querySelectorAll('[data-result]').forEach(b=>b.onclick=()=>{
    const x = INTERVIEWS.find(i=>i.id===b.dataset.result);
    if(x.st===3){ openInviteForm(); return; }
    openResultForm(x);
  });
  box.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{
    const x = INTERVIEWS.find(i=>i.id===b.dataset.view);
    askConfirm('面试结论 · '+x.who,
      '结论：'+(x.result||'—')+'\n评分：'+(x.score||'—')+'\n评语：'+(x.comment||'—'),
      '知道了', null, 'info');
  });
  box.querySelectorAll('[data-accept]').forEach(b=>b.onclick=()=>{
    const x = INTERVIEWS.find(i=>i.id===b.dataset.accept);
    x.st = 6; renderInterview(box); toast('已接受邀约，面试前 24 小时会再次提醒','ok');
  });
  box.querySelectorAll('[data-reschedule]').forEach(b=>b.onclick=()=>{
    const x = INTERVIEWS.find(i=>i.id===b.dataset.reschedule);
    openBigForm('申请改期','企业会收到你的改期请求并重新安排',
      [{t:'可选时间', fields:[
        {k:'t1', label:'第一选择', value:'2026-10-29 10:00', half:1},
        {k:'t2', label:'第二选择', value:'2026-10-30 14:00', half:1},
        {k:'why', label:'改期原因', type:'txa', h:70, value:'当天有客户评审会，时间冲突'}
      ]}],
      (v)=>{ x.st = 7; closeFormModal(); renderInterview(box); toast('改期申请已提交，等待企业确认'); return true; },
      '提交申请','md');
  });
  box.querySelectorAll('[data-decline]').forEach(b=>b.onclick=()=>{
    const x = INTERVIEWS.find(i=>i.id===b.dataset.decline);
    askConfirm('拒绝该面试邀约？','拒绝后企业会收到通知，该岗位流程将结束。','确认拒绝',
      ()=>{ x.st = 3; renderInterview(box); toast('已拒绝邀约'); },'danger');
  });
}

/* ================================================================
   16.13 页面：收到申请（N22 平台推荐 / 实习生筛选并入）
   ================================================================ */
function renderApplyE(box){
  const tab = state.aeTab;
  const left = QUOTA.total - state.quotaUsed;
  const cnt = k => APPLIES_E.filter(a=>a.st===k).length;

  const inRows = APPLIES_E.map(a=>`<tr>
    <td><div class="job-name">${esc(a.who)}<span class="sub">${esc(a.dir)}</span></div></td>
    <td><span class="tag blue">${esc(a.type)}</span></td>
    <td>${esc(a.obj)}</td>
    <td class="t-time">${esc(a.time)}</td>
    <td><div class="t-req" title="${esc(a.msg)}">${esc(a.msg)}</div></td>
    <td>${stPill(AE_ST[a.st])}</td>
    <td><div class="ops-cell">
      <span class="row-act" data-cand="${esc(a.who)}">查看简历</span>
      ${a.st===1?`<span class="row-act" data-agree="${a.id}">同意</span>
        <span class="row-act" data-invite="${esc(a.who)}" data-obj="${esc(a.obj)}">邀约面试</span>
        <span class="row-act red" data-refuse="${a.id}">拒绝</span>`
        : `<span class="row-act" data-detail="${a.id}">详情</span>`}
    </div></td></tr>`).join('');

  const talentRows = TALENTS.map(t=>`<tr>
    <td><div class="job-name">${esc(t.name)}<span class="sub">${esc(t.dir)} · ${esc(t.city)}</span></div></td>
    <td>${esc(t.exp)} / ${esc(t.edu)}</td>
    <td><div class="skill-list" style="gap:5px">${t.skills.slice(0,3).map(s=>`<span class="tag" style="font-size: 12px">${esc(s)}</span>`).join('')}</div></td>
    <td><span class="tag blue">${esc(t.form)}</span></td>
    <td>${esc(t.avail)}</td>
    <td><div class="match">${pbarHtml(t.match)}<span class="mv">${t.match}%</span></div></td>
    <td><div class="t-req" title="${esc(t.reason)}">${esc(t.reason)}</div></td>
    <td><div class="ops-cell">
      <span class="row-act" data-talk="${t.id}">发起沟通</span>
      <span class="row-act" data-invite="${esc(t.name)}" data-obj="AI 产品经理">邀约</span>
    </div></td></tr>`).join('');

  const internRows = INTERN_POOL.map(p=>`<tr>
    <td><div class="job-name">${esc(p.name)}<span class="sub">${esc(p.school)} · ${esc(p.major)}</span></div></td>
    <td><span class="tag blue">${esc(p.grade)}</span></td>
    <td>${esc(p.days)}</td>
    <td class="t-small">${esc(p.period)}</td>
    <td>${esc(p.city)}</td>
    <td><div class="skill-list" style="gap:5px">${p.skills.map(s=>`<span class="tag" style="font-size: 12px">${esc(s)}</span>`).join('')}</div></td>
    <td><div class="match">${pbarHtml(p.match)}<span class="mv">${p.match}%</span></div></td>
    <td><div class="ops-cell">
      <span class="row-act" data-talk="${p.id}">发起沟通</span>
      <span class="row-act" data-invite="${esc(p.name)}" data-obj="AI 方向实习生">发邀约</span>
    </div></td></tr>`).join('');

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">收到申请</div>
      <div class="page-desc">主动投递、平台推荐、实习生筛选三个来源统一在此处理 · 同意后消耗 1 次联系次数</div>
    </div><div class="spacer"></div><div class="head-ops">
      <div class="quota"><span>剩余联系次数</span><b>${left}</b> / ${QUOTA.total}
        <span class="q-bar"><i style="width:${left/QUOTA.total*100}%"></i></span></div>
      <button class="btn btn-primary" id="aeRecharge">＋ 充值</button>
    </div></div>
    <div class="stat-row">
      ${statHtml(APPLIES_E.length,'全部申请')}
      ${statHtml(cnt(1),'待处理')}
      ${statHtml(cnt(2),'已同意')}
      ${statHtml(TALENTS.length+INTERN_POOL.length,'平台推荐')}
    </div>
    ${subTabs('aeTabs',[['in','主动投递（'+APPLIES_E.length+'）'],
      ['rec','平台推荐（'+TALENTS.length+'）'],['intern','实习生筛选（'+INTERN_POOL.length+'）']], tab)}
    ${tab==='in'?`<div class="blk">
      ${simpleTable(
        [{t:'申请人',w:'180px'},{t:'申请类型',w:'110px'},{t:'意向对象',w:'230px'},{t:'申请时间',w:'130px'},
         {t:'申请留言',w:'240px'},{t:'状态',w:'110px'},{t:'操作',w:'250px'}],
        inRows,1240)}
    </div>`:''}
    ${tab==='rec'?`<div class="blk">
      <div class="blk-head"><h2>平台推荐人才</h2><span class="sub">按技能标签、到岗时间、地点匹配</span>
        <span class="spacer"></span><span class="note">匹配度基于当前在招岗位计算</span></div>
      ${simpleTable(
        [{t:'人才',w:'200px'},{t:'经验 / 学历',w:'110px'},{t:'技能标签',w:'210px'},{t:'用工形式',w:'110px'},
         {t:'到岗',w:'100px'},{t:'匹配度',w:'140px'},{t:'推荐理由',w:'240px'},{t:'操作',w:'150px'}],
        talentRows,1280)}
    </div>`:''}
    ${tab==='intern'?`<div class="blk">
      <div class="blk-head"><h2>实习生筛选</h2><span class="sub">按年级、专业、可实习周期与每周到岗天数筛选</span></div>
      ${simpleTable(
        [{t:'实习生',w:'210px'},{t:'年级',w:'80px'},{t:'每周到岗',w:'100px'},{t:'可实习周期',w:'150px'},
         {t:'城市',w:'80px'},{t:'技能',w:'220px'},{t:'匹配度',w:'130px'},{t:'操作',w:'150px'}],
        internRows,1180)}
    </div>`:''}`;

  bindSubTabs(box,'aeTabs',k=>state.aeTab=k,()=>renderApplyE(box));

  box.querySelectorAll('[data-cand]').forEach(b=>b.onclick=()=>{
    state.candId = b.dataset.cand; go('candidate');
  });
  box.querySelectorAll('[data-agree]').forEach(b=>b.onclick=()=>{
    const a = APPLIES_E.find(x=>x.id===b.dataset.agree);
    askConfirm(`同意「${a.who}」的申请？`,
      `同意后将消耗 1 次联系次数并互相开放联系方式，剩余 ${QUOTA.total-state.quotaUsed-1} 次。`,
      '同意并建立联系',
      ()=>{ a.st=2; state.quotaUsed++; renderApplyE(box); toast('已同意，联系方式已互相开放','ok'); },'ok');
  });
  box.querySelectorAll('[data-refuse]').forEach(b=>b.onclick=()=>{
    const a = APPLIES_E.find(x=>x.id===b.dataset.refuse);
    askConfirm(`拒绝「${a.who}」的申请？`,'拒绝后将通知对方，不消耗联系次数。','确认拒绝',
      ()=>{ a.st=3; renderApplyE(box); toast('已拒绝'); },'danger');
  });
  box.querySelectorAll('[data-invite]').forEach(b=>b.onclick=()=>{
    state.candId = b.dataset.invite;
    openInviteForm(b.dataset.invite, b.dataset.obj);
  });
  box.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>toast('申请详情为演示占位，可点「查看简历」进入候选人详情'));
  box.querySelectorAll('[data-talk]').forEach(b=>{
    b.onclick=()=>{
      if(QUOTA.total - state.quotaUsed <= 0){ toast('联系次数已用完，请先充值','err'); return; }
      const t = TALENTS.find(x=>x.id===b.dataset.talk) || INTERN_POOL.find(x=>x.id===b.dataset.talk);
      askConfirm('向「'+t.name+'」发起沟通？','将消耗 1 次联系次数。','发起沟通',
        ()=>{ state.quotaUsed++; renderApplyE(box); toast('已发起沟通，对方回复后会以站内消息通知','ok'); },'ok');
    };
  });
  $('aeRecharge').onclick = ()=>openFormModal('充值联系次数','演示环境不接入真实支付',
    [{k:'num',label:'充值次数',type:'sel',opts:['10 次 · ¥300','20 次 · ¥560','50 次 · ¥1280']}],
    (v)=>{ state.quotaUsed = Math.max(0, state.quotaUsed - parseInt(v)); renderApplyE(box); toast('充值成功（演示）','ok'); closeFormModal(); return true; },'确认充值');
}

/* ================================================================
   16.14 页面：候选人详情（N17）
   ================================================================ */
const CAND_INFO = {
  '林沐':{ name:'林沐', intent:'AI 产品经理', salary:'30-38K', years:'9 年', city:'深圳',
    edu:'硕士 · 计算机技术', school:'哈尔滨工业大学', grad:'2016-06',
    skills:['Agent 编排','RAG','需求分析','团队管理','SQL','AI 效果评测'],
    intro:'9 年 B 端产品，近 4 年专注智能体与客服系统落地，主导过 3 个从 0 到 1 的 Agent 项目，其中 2 个已稳定运行超过 12 个月。擅长把模糊的业务诉求拆成可评测的能力边界。',
    works:[
      {org:'深圳市智联云科技', title:'AI 产品负责人', time:'2022.03 - 至今',
       desc:'搭建智能体客服产品线，覆盖 6 个行业客户；\n定义工具调用与多轮对话的评测口径，一次解决率由 58% 提升至 79%；\n带 6 人产品与运营团队。'},
      {org:'广州云图信息', title:'高级产品经理', time:'2016.07 - 2022.02',
       desc:'负责知识库与工单系统，主导检索链路重构，人工转接率下降 34%。'}
    ]},
  '纪野':{ name:'纪野', intent:'AI 视觉设计师', salary:'22-28K', years:'8 年', city:'上海',
    edu:'本科 · 视觉传达', school:'中国美术学院', grad:'2017-06',
    skills:['Midjourney','Stable Diffusion','LoRA 训练','品牌视觉','工作流搭建'],
    intro:'8 年品牌视觉经验，近 2 年专注 AI 素材生产工作流，为 5 个消费品牌搭过内部出图中台，月产素材 3000+，外包成本平均下降 60%。',
    works:[
      {org:'上海橙序设计', title:'AI 视觉负责人', time:'2023.05 - 至今',
       desc:'搭建品牌 AI 出图工作流，沉淀 12 套 LoRA 与 40+ 提示词模板；\n带 3 人小组，交付周期由 5 天压缩到 1 天。'},
      {org:'杭州视觉工厂', title:'资深设计师', time:'2017.07 - 2023.04',
       desc:'负责快消品牌年度视觉与电商素材，累计交付 2000+ 张主图。'}
    ]},
  '陈昊':{ name:'陈昊', intent:'AI 数据分析师', salary:'25-32K', years:'7 年', city:'北京',
    edu:'本科 · 统计学', school:'首都经济贸易大学', grad:'2018-06',
    skills:['SQL','Python','指标体系','BI 看板','AI 效果归因'],
    intro:'7 年数据分析，做过电商与制造两条业务线。擅长从 0 搭指标体系，并把 AI 效果量化成可追踪的经营指标。',
    works:[
      {org:'北京数知科技', title:'数据分析师', time:'2021.04 - 至今',
       desc:'搭建生产、质量、成本三类 AI 效果指标共 12 项；\n主导 BI 看板重构，报表产出周期由 7 天降至 1 天。'}
    ]},
  '王旭':RESUME,
  '苏晴':{ name:'苏晴', intent:'大模型算法实习生', salary:'300 元/天', years:'在校', city:'深圳',
    edu:'硕士在读 · 计算机', school:'华中科技大学', grad:'2027-06',
    skills:['PyTorch','评测集设计','Python','多模态'],
    intro:'研二在读，方向为大模型评测。参与过 2 个校企项目，独立设计过 3000 条评测集，熟悉人工评估与 badcase 归因流程。',
    works:[{org:'华中科技大学 · 智能计算实验室', title:'研究助理', time:'2025.09 - 至今',
      desc:'参与多模态模型评测项目，负责评测集构建与结果分析。'}]},
  '黄子航':{ name:'黄子航', intent:'多模态算法实习生', salary:'320 元/天', years:'在校', city:'深圳',
    edu:'硕士在读 · 人工智能', school:'中山大学', grad:'2028-06',
    skills:['PyTorch','数据标注','图文理解'],
    intro:'研一在读，做过图文匹配与图像描述两个课题，熟悉数据清洗到训练评估的完整链路。',
    works:[{org:'中山大学 · 视觉计算组', title:'研究助理', time:'2026.03 - 至今',
      desc:'负责图文数据清洗与标注规范制定。'}]}
};

function renderCandidate(box){
  const name = state.candId || '林沐';
  const c = CAND_INFO[name] || CAND_INFO['林沐'];
  const ap = APPLIES_E.find(a=>a.who===name);
  const lv = ap ? 3 : 2;
  const ivs = INTERVIEWS.filter(x=>x.dir==='out' && x.who===name);

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">候选人详情</div>
      <div class="page-desc">${ap?('通过「'+esc(ap.obj)+'」'+esc(ap.type)+' · '+esc(ap.time)):'来自平台推荐'}</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="cdBack">返回</button>
      <button class="btn" id="cdPdf">下载简历</button>
      <button class="btn btn-primary" id="cdInvite">邀约面试</button>
    </div></div>

    ${tipbar('简历授权状态：<b>'+AUTH_TEXT[lv].t+'</b> · 已获得候选人授权，可查看完整简历与联系方式。','green')}

    <div class="resume-layout">
      <div class="rs-card">
        <div class="rs-avatar">${avHTML(7,'m','lg')}</div>
        <div class="rs-name">${esc(c.name)}</div>
        <div class="rs-intent">${esc(c.intent)} · ${esc(c.salary)}</div>
        <div class="rs-state"><span class="st on">${esc(c.state||'在职-考虑机会')}</span></div>
        <div class="pct-bar" style="margin-top:16px"><i style="width:92%"></i></div>
        <div style="display:flex;justify-content:space-between;font-size: 12px;color:var(--muted);margin-top:6px"><span>简历完整度</span><b style="color:var(--blue-600)">92%</b></div>
        <div class="rs-div"></div>
        <div class="rs-line"><span class="k">手机号</span><span class="v">138****6625</span></div>
        <div class="rs-line"><span class="k">邮箱</span><span class="v">${esc(c.name)}@foxmail.com</span></div>
        <div class="rs-line"><span class="k">所在城市</span><span class="v">${esc(c.city)}</span></div>
        <div class="rs-line"><span class="k">工作年限</span><span class="v">${esc(c.years)}</span></div>
        <div class="rs-line"><span class="k">最高学历</span><span class="v">${esc(c.edu)}</span></div>
        <div class="rs-line"><span class="k">毕业院校</span><span class="v">${esc(c.school)}</span></div>
        <div class="rs-file">
          <div class="fi">${ICONS.resume}</div>
          <div class="rs-file-main"><div class="fn">${esc(c.name)}-简历-2026.pdf</div>
          <div class="fs">1.1 MB · 更新于 2026-10-18</div></div>
        </div>
      </div>
      <div>
        ${ap?blkBox('申请留言','', '', `<div class="rich-text" style="font-size: 12px;line-height:1.85;color:var(--text-2)">${esc(ap.msg)}</div>`):''}
        <div style="height:16px"></div>
        ${blkBox('工作经历','共 '+c.works.length+' 段','',
          c.works.map(w=>`<div class="exp-item"><div class="exp-top">
            <span class="exp-title">${esc(w.title)}</span><span class="exp-org">${esc(w.org)}</span>
            <span class="exp-time">${esc(w.time)}</span></div>
            <div class="exp-desc">${esc(w.desc)}</div></div>`).join(''))}
        <div style="height:16px"></div>
        ${blkBox('技能标签','', '', `<div class="skill-list">${c.skills.map(s=>`<span class="skill-tag">${esc(s)}</span>`).join('')}</div>`)}
        <div style="height:16px"></div>
        ${blkBox('个人优势','', '', `<div class="ai-note" style="line-height:1.9;font-size: 12px">${esc(c.intro)}</div>`)}
        <div style="height:16px"></div>
        ${blkBox('面试记录','共 '+ivs.length+' 轮','',
          ivs.length ? `<div class="tl">${ivs.map(x=>`<div class="tl-i ${x.st===8?'ok':'on'}">
            <div class="tl-t">第 ${x.round} 轮 · ${esc(x.time)} ${IV_ST[x.st]?'<span class="st '+IV_ST[x.st][1]+'">'+IV_ST[x.st][0]+'</span>':''}</div>
            <div class="tl-d">${esc(x.mode)}　${x.result?'结论：'+esc(x.result)+'　':''}${esc(x.comment||x.note||'')}</div>
          </div>`).join('')}</div>`
          : '<div class="empty-state" style="padding:24px 12px"><b>暂无面试记录</b><span>点击右上角「邀约面试」发起第一轮</span></div>')}
      </div>
    </div>`;

  $('cdBack').onclick = ()=>go('applyE');
  $('cdPdf').onclick = ()=>toast('简历 PDF 已开始下载（演示）','ok');
  $('cdInvite').onclick = ()=>openInviteForm(name, c.intent);
}

/* ================================================================
   16.15 页面：承接大厅（N24 / N25）
   ================================================================ */
function hallProjects(){
  const pm = CORE.find(x=>x.key==='project');
  return pm ? pm.records.filter(r=>r.status===1) : [];
}
function renderHall(box){
  const tab = state.hallTab || 'open';
  const open = hallProjects();
  const cons = consultDemands();
  const mine = BIDS.filter(b=>b.proj===state.hallProj);
  const taken = ORDERS.filter(o=>o.cat==='project');
  const done = TICKETS.filter(t=>t.kind==='project' && t.stage===5);

  const cardOf = (r)=>{
    const myBid = BIDS.find(b=>b.proj===r.id && b.who.indexOf('智远')>-1);
    return `<div class="card" style="padding:16px 18px">
      <div class="jc-top">
        <div class="jc-logo">${ICONS.project}</div>
        <div class="jc-head">
          <div class="jc-title">${esc(r.title)}</div>
          <div class="jc-co">${esc(r.co)} · ${esc(r.ptype)}发布</div>
        </div>
        <div class="jc-right">
          <div class="jc-salary"><span class="sal">${esc(r.budget)}</span></div>
          <div class="jc-sub"><span class="jc-time">截止 ${esc(r.deadline)}</span>
            <span class="jt jt-1">${esc(r.catg)}</span></div>
        </div>
      </div>
      <div class="jc-meta"><span>${esc(r.coop)}</span><span class="dot"></span>
        <span>${esc((r.tags||[]).join(' / '))}</span><span class="dot"></span>
        <span>${r.intents||0} 人已申请</span></div>
      <div class="jc-desc">验收：${esc((r.accept||'').slice(0,90))}…</div>
      <div class="jc-tags">${(r.tags||[]).map(t=>`<span class="jc-tag">${esc(t)}</span>`).join('')}</div>
      <div class="jc-foot">
        <div class="jc-contact"><span class="jc-avatar">${esc((r.co||'云').slice(0,1))}</span>
          <span class="jc-contact-txt">项目预算 <b>${esc(r.budget)}</b></span>
          <span class="st on">招募中</span></div>
        <span class="spacer"></span>
        ${myBid?'<button class="btn btn-sm" disabled>已提交申请</button>'
          :`<button class="btn btn-sm" data-viewp="${r.id}">查看需求</button>
            <button class="btn btn-sm btn-primary" style="height:30px" data-bid="${r.id}">承接申请</button>`}
      </div>
    </div>`;
  };

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">承接大厅</div>
      <div class="page-desc">服务商可承接的项目与咨询需求 · 提交方案与报价后由发布方确认</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="hallRule">承接规则</button>
      <button class="btn btn-primary" id="hallMine">我的承接</button>
    </div></div>

    ${CERT_SP.state!==2?tipbar('服务商认证<b>'+(CERT_SP.state===1?'审核中':'未通过')+'</b>，可先浏览与提交申请，认证通过后才能被确认为承接方。','blue','去认证','hallGoCert'):''}

    <div class="kpi-mini">
      <div class="km blue"><div class="k-l">在招项目</div><div class="k-v">${open.length}</div><div class="k-s">符合承接条件</div></div>
      <div class="km"><div class="k-l">我的申请</div><div class="k-v">${BIDS.length}</div><div class="k-s">待确认 ${BIDS.filter(b=>b.st===1).length}</div></div>
      <div class="km green"><div class="k-l">进行中</div><div class="k-v">${taken.filter(o=>o.st===3).length}</div><div class="k-s">按里程碑交付</div></div>
      <div class="km amber"><div class="k-l">已结项</div><div class="k-v">${done.length}</div><div class="k-s">可查看结算</div></div>
    </div>

    ${subTabs('hallTabs',[['open','项目需求（'+open.length+'）'],['consult','咨询需求（'+cons.length+'）'],
      ['applied','我的申请（'+BIDS.length+'）'],
      ['taken','进行中（'+taken.length+'）'],['done','已结项（'+done.length+'）']], tab)}

    ${tab==='open'?`<div class="cards">${open.map(cardOf).join('') || '<div class="cards-empty"><div class="t">暂无可承接项目</div><div class="s">新项目发布后会出现在这里</div></div>'}</div>`:''}

    ${tab==='consult'?`<div class="cards">${cons.map(r=>{
      const mineBid = BIDS.find(b=>b.proj===r.id && b.who.indexOf('智远')>-1);
      return `<div class="card" style="padding:16px 18px">
        <div class="jc-top">
          <div class="jc-logo">${ICONS.consult}</div>
          <div class="jc-head">
            <div class="jc-title">${esc(r.title)}</div>
            <div class="jc-co">${esc(r.co)} · ${esc(r.leaf||'咨询需求')}</div>
          </div>
          <div class="jc-right">
            <div class="jc-salary"><span class="sal">${esc((r.tfacts&&r.tfacts[0]&&r.tfacts[0][1])||'面议')}</span></div>
            <div class="jc-sub"><span class="jc-time">${esc(r.up)}</span><span class="jt jt-3">咨询</span></div>
          </div>
        </div>
        <div class="jc-meta"><span>${esc(r.city||'线上')}</span><span class="dot"></span>
          <span>${esc((r.tags||[]).join(' / ')||'数智化咨询')}</span><span class="dot"></span>
          <span>${r.applies||0} 家已投方案</span></div>
        <div class="jc-desc">需求：${esc((r.work||'').slice(0,96))}…</div>
        <div class="jc-foot">
          <div class="jc-contact"><span class="jc-avatar">${esc((r.co||'需').slice(0,1))}</span>
            <span class="jc-contact-txt">需求方 <b>${esc(r.co)}</b></span>
            <span class="st on">招募中</span></div>
          <span class="spacer"></span>
          ${mineBid?'<button class="btn btn-sm" disabled>已提交方案</button>'
            :`<button class="btn btn-sm" data-cview="${r.id}">查看需求</button>
              <button class="btn btn-sm btn-primary" style="height:30px" data-cbid="${r.id}">承接方案</button>`}
        </div>
      </div>`;
    }).join('') || '<div class="cards-empty"><div class="t">暂无可承接的咨询需求</div><div class="s">企业提交咨询需求后会出现在这里</div></div>'}</div>`:''}

    ${tab==='applied'?`<div class="blk">${simpleTable(
      [{t:'项目',w:'280px'},{t:'报价',w:'110px'},{t:'周期',w:'100px'},{t:'团队',w:'200px'},
       {t:'提交时间',w:'130px'},{t:'状态',w:'110px'},{t:'操作',w:'140px'}],
      BIDS.map(b=>{
        const p = (CORE.find(x=>x.key==='project').records||[]).find(x=>x.id===b.proj);
        return `<tr>
          <td><div class="job-name">${esc(p?p.title:'—')}<span class="sub">${esc(b.id)} · ${esc(b.who)}</span></div></td>
          <td><span class="salary">${esc(b.price)}</span></td>
          <td>${esc(b.cycle)}</td><td class="t-small">${esc(b.team)}</td>
          <td class="t-time">${esc(b.at)}</td>
          <td>${stPill(BID_ST[b.st])}</td>
          <td><div class="ops-cell">
            <span class="row-act" data-bd="${b.id}">查看方案</span>
            ${b.st===1?'<span class="row-act red" data-bdwd="${b.id}">撤回</span>':''}
          </div></td></tr>`;
      }).join(''),1160)}</div>`:''}

    ${tab==='taken'?`<div class="blk">${simpleTable(
      [{t:'项目',w:'300px'},{t:'合同金额',w:'130px'},{t:'里程碑',w:'140px'},
       {t:'当前阶段',w:'130px'},{t:'订单号',w:'160px'},{t:'操作',w:'120px'}],
      taken.map(o=>{
        const tk = TICKETS.find(t=>t.kind==='project');
        return `<tr><td><div class="job-name">${esc(o.title)}<span class="sub">${esc(o.co)}</span></div></td>
          <td><span class="salary">¥${o.amount.toLocaleString()}</span></td>
          <td>${esc(o.detail[2][1]||'5 个')}</td>
          <td>${tk?tkPill(tk):'—'}</td>
          <td class="t-mono">${esc(o.id)}</td>
          <td><span class="row-act" data-tk="${tk?tk.id:''}">去工单</span></td></tr>`;
      }).join(''),1060)}</div>`:''}

    ${tab==='done'?`<div class="blk">${simpleTable(
      [{t:'项目',w:'320px'},{t:'结算金额',w:'130px'},{t:'结项时间',w:'140px'},{t:'平台服务费',w:'130px'},{t:'操作',w:'120px'}],
      done.map(t=>`<tr><td><div class="job-name">${esc(t.title)}<span class="sub">${esc(t.id)}</span></div></td>
        <td><span class="salary">${esc(t.price)}</span></td><td class="t-time">2026-10-19</td>
        <td>¥14,400</td><td><span class="row-act" data-rev="1">查看结算</span></td></tr>`).join('')
        || emptyRow(5,'暂无已结项项目','完成验收后会出现在这里'),960)}</div>`:''}`;

  bindSubTabs(box,'hallTabs',k=>state.hallTab=k,()=>renderHall(box));
  if($('hallGoCert')) $('hallGoCert').onclick = ()=>go('certSp');
  $('hallRule').onclick = ()=>askConfirm('承接规则',
    '1. 只有完成服务商认证的主体可以提交承接申请；\n2. 发布方确认承接方后自动生成订单与工单，双方需在 3 天内确认合同要素；\n3. 交付过程按里程碑验收，验收通过后进入结算；\n4. 平台按成交额收取 8%~10% 服务费。',
    '知道了', null, 'info');
  $('hallMine').onclick = ()=>{ state.hallTab='applied'; renderHall(box); };
  box.querySelectorAll('[data-bid]').forEach(b=>{
    b.onclick = ()=>{
      const p = hallProjects().find(x=>x.id===b.dataset.bid);
      openBidForm({key:'project'}, p, 'apply');
    };
  });
  box.querySelectorAll('[data-viewp]').forEach(b=>b.onclick=()=>{
    const p = hallProjects().find(x=>x.id===b.dataset.viewp);
    askConfirm(p.title, '预算：'+p.budget+'\n截止：'+p.deadline+'\n合作方式：'+p.coop+'\n\n验收标准：\n'+p.accept, '知道了', null, 'info');
  });
  box.querySelectorAll('[data-bd]').forEach(b=>b.onclick=()=>{ state.bidId=b.dataset.bd; go('bidDetail'); });
  box.querySelectorAll('[data-cbid]').forEach(b=>b.onclick=()=>{
    const r = consultDemands().find(x=>x.id===b.dataset.cbid);
    if(r) openConsultBid(r);
  });
  box.querySelectorAll('[data-cview]').forEach(b=>b.onclick=()=>{
    const r = consultDemands().find(x=>x.id===b.dataset.cview);
    if(!r) return;
    askConfirm(r.title,
      '需求方：'+r.co+'\n预算：'+((r.tfacts&&r.tfacts[0]&&r.tfacts[0][1])||'面议')
      +'\n周期：'+((r.tfacts&&r.tfacts[1]&&r.tfacts[1][1])||'—')
      +'\n\n'+(r.work||''),
      '知道了', null, 'info');
  });
  box.querySelectorAll('[data-bdwd]').forEach(b=>b.onclick=()=>{
    const bd = BIDS.find(x=>x.id===b.dataset.bdwd);
    askConfirm('撤回承接申请？','撤回后报价与方案将从发布方的比选列表中移除。','确认撤回',
      ()=>{ BIDS.splice(BIDS.indexOf(bd),1); renderHall(box); toast('已撤回申请'); },'danger');
  });
  box.querySelectorAll('[data-tk]').forEach(b=>b.onclick=()=>{
    state.tkId = b.dataset.tk; state.tkTab = 'project'; go('ticket');
  });
  box.querySelectorAll('[data-rev]').forEach(b=>b.onclick=()=>go('revenue'));
}

/* ================================================================
   16.16 页面：项目申请人详情（N19）+ 确认承接生成订单（N20）
   ================================================================ */
function renderBidDetail(box){
  const b = BIDS.find(x=>x.id===state.bidId) || BIDS[0];
  const p = (CORE.find(x=>x.key==='project').records||[]).find(x=>x.id===b.proj);
  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">项目申请人详情</div>
      <div class="page-desc">${p?esc(p.title):'—'} · 申请编号 <span class="t-mono">${esc(b.id)}</span></div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="bdBack">返回比选</button>
      <button class="btn" id="bdNo">标记不合适</button>
      <button class="btn btn-primary" id="bdTake">确认承接并生成订单</button>
    </div></div>

    <div class="cert-hero" style="background:linear-gradient(135deg,#0A5FD9,#3E91FF 70%,#6FAEFF)">
      <div class="ch-ico">${ICONS.project}</div>
      <div class="ch-main">
        <div class="ch-t">${esc(b.who)}<span class="lv">${esc(b.kind)}</span></div>
        <div class="ch-s">报价 <b>${esc(b.price)}</b> · 周期 ${esc(b.cycle)} · 提交于 ${esc(b.at)}</div>
      </div>
      <div class="ch-side">${stPill(BID_ST[b.st])}</div>
    </div>

    <div class="ov-cols">
      <div>
        ${blkBox('能力资料','申请方提交', '', kvGrid([
          ['承接主体', esc(b.who), false, true],
          ['主体类型', esc(b.kind)],
          ['投入团队', esc(b.team)],
          ['过往案例', (b.cases||0)+' 个', false, true]
        ]))
        + `<div style="height:16px"></div>`
        + blkBox('承接方案','', '',
          `<div class="rich-text" style="font-size: 12px;line-height:1.9;color:var(--text-2)">${esc(b.plan)}</div>`
          + `<div class="up-file" style="margin-top:14px"><div class="uf-ico">${ICONS.resume}</div>
             <div class="uf-n">承接方案-${esc(b.who.slice(0,4))}-v1.0.pdf</div><span class="st on">可预览</span></div>`)}
      </div>
      <div>
        ${blkBox('报价与周期','', '', kvGrid([
          ['报价', '<span class="salary">'+esc(b.price)+'</span>', false, true],
          ['交付周期', esc(b.cycle)],
          ['可开始日期', '2026-11-01'],
          ['付款方式', '按里程碑分期']
        ]))}
        <div style="height:16px"></div>
        ${blkBox('比选参考','同项目其他申请人', '',
          BIDS.filter(x=>x.proj===b.proj).map(x=>`
            <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px dashed var(--line)">
              <div style="flex:1;min-width:0"><div style="font-size: 12px;font-weight:600">${esc(x.who)}</div>
                <div style="font-size: 12px;color:var(--muted);margin-top:2px">${esc(x.cycle)} · ${esc(x.team)}</div></div>
              <span class="salary">${esc(x.price)}</span>
              ${x.id===b.id?'<span class="st info">当前查看</span>':`<span class="row-act" data-sw="${x.id}">查看</span>`}
            </div>`).join(''))}
      </div>
    </div>`;

  $('bdBack').onclick = ()=>{ state.hallTab='applied'; go('hall'); };
  $('bdNo').onclick = ()=>askConfirm('标记为不合适？','申请方会收到通知，该报价将从比选列表移除。','确认',
    ()=>{ b.st=3; go('hall'); toast('已标记不合适'); },'danger');
  $('bdTake').onclick = ()=>openTakeForm(b,p);
  box.querySelectorAll('[data-sw]').forEach(x=>x.onclick=()=>{ state.bidId=x.dataset.sw; renderBidDetail(box); });
}
function openTakeForm(b, p){
  openBigForm('确认承接 · 生成订单','确认后双方进入合同要素确认，系统生成订单与工单',
    [
      {t:'承接方', fields:[
        {k:'who', label:'承接方', value:b.who, req:1},
        {k:'price', label:'合同金额', value:b.price, half:1},
        {k:'cycle', label:'交付周期', value:b.cycle, half:1}
      ]},
      {t:'合同要素', note:'生成订单后双方各有 3 天确认期', fields:[
        {k:'miles', label:'里程碑划分', type:'txa', h:80,
          value:'① 需求确认 20%　② 方案通过 20%　③ 中期交付 30%　④ 终验 20%　⑤ 结项 10%'},
        {k:'accept', label:'验收标准', type:'txa', h:70,
          value:p?p.accept:'按需求文档逐项验收，核心指标达到约定阈值即视为通过'},
        {k:'breach', label:'违约条款', type:'txa', h:60,
          value:'延期交付按日 0.3% 计违约金，上限为合同额 10%；单方终止需支付已完成部分费用'},
        {k:'settle', label:'结算方式', type:'sel', half:1,
          opts:['平台托管 · 按里程碑放款','平台托管 · 验收后一次性'], value:'平台托管 · 按里程碑放款'},
        {k:'days', label:'确认期（天）', type:'sel', half:1, opts:['3 天','5 天','7 天'], value:'3 天'}
      ]}
    ],
    (v)=>{
      const now = nowStamp();
      const oid = 'OD' + Date.now().toString().slice(-10);
      const amt = parseInt(String(v.price).replace(/[^\d]/g,'')) || 580000;
      ORDERS.unshift({
        id:oid, cat:'project', title:p?p.title:'项目', co:'深圳市云启科技有限公司',
        amount:amt, st:3, at:now, pay:'平台托管',
        detail:[['我的角色','承接方'],['周期',v.cycle],['里程碑','5 个 · 待双方确认'],['结算',v.settle]]
      });
      TICKETS.unshift({
        id:'TK'+Date.now().toString().slice(-9), kind:'project',
        title:p?p.title:'项目', owner:'深圳市云启科技有限公司', sp:b.who, price:v.price,
        stage:1, stages:['需求确认','方案通过','中期交付','终验','结算'],
        at:now, budget:v.price, cycle:v.cycle, scene:'项目承接',
        desc:'合同要素已生成，等待双方确认。\n里程碑：'+v.miles,
        docs:[]
      });
      b.st = 2;
      BIDS.forEach(x=>{ if(x.proj===b.proj && x.id!==b.id) x.st = 3; });
      if(p){ p.intents = (p.intents||0)+1; }
      toast('已确认承接，订单 '+oid+' 已生成','ok');
      closeFormModal();
      if(canSee('ticket')){ state.tkTab='project'; go('ticket'); }
      return true;
    }, '确认承接');
}

/* ================================================================
   16.17 页面：工单中心（N21 咨询工单 / N26 我的工单）
   ================================================================ */
function renderTicket(box){
  const tab = state.tkTab;
  const isSp = state.acting === 'sp';
  const cons = TICKETS.filter(t=>t.kind==='consult' && (isSp ? t.side==='taker' : t.side!=='taker'));
  const proj = TICKETS.filter(t=>t.kind==='project');

  const stageBar = (t)=>`<div class="mile">${t.stages.map((s,i)=>{
    const cls = i+1<t.stage ? 'done' : (i+1===t.stage ? 'on' : '');
    return `<div class="mile-i ${cls}"><div class="mi-bar"></div><div class="mi-t">${esc(s)}</div>
      <div class="mi-d">${i+1<t.stage?'已完成':(i+1===t.stage?'进行中':'待开始')}</div></div>`;
  }).join('')}</div>`;

  const card = (t)=>`
    <div class="blk" style="margin-bottom:14px">
      <div class="blk-head">
        <h2>${esc(t.title)}</h2>
        <span class="sub">${esc(t.id)} · ${t.kind==='consult'?'咨询工单':'承接工单'}</span>
        <span class="spacer"></span>${tkPill(t)}
      </div>
      <div class="blk-body">
        ${stageBar(t)}
        <div class="kv-grid" style="margin-top:16px">
          <div class="kv"><div class="k">${t.kind==='consult'?'发起方':'需求方'}</div><div class="v strong">${esc(t.owner)}</div></div>
          <div class="kv"><div class="k">${t.kind==='consult'?'匹配顾问':'承接方'}</div><div class="v strong">${esc(t.sp)}</div></div>
          <div class="kv"><div class="k">预算 / 金额</div><div class="v">${esc(t.budget||t.price)}</div></div>
          <div class="kv"><div class="k">周期</div><div class="v">${esc(t.cycle||'—')}</div></div>
          <div class="kv full"><div class="k">需求描述</div><div class="v">${esc(t.desc)}</div></div>
        </div>
        <div style="margin-top:16px">
          <div style="font-size: 12px;font-weight:700;margin-bottom:8px">交付物（${t.docs.length}）</div>
          ${t.docs.length? t.docs.map(d=>`<div class="up-file"><div class="uf-ico">${ICONS.resume}</div>
            <div class="uf-n">${esc(d.n)}</div>
            <span class="t-muted" style="font-size: 12px">${esc(d.at)}</span>
            <span class="row-act" data-dl="1">下载</span></div>`).join('')
            : '<div style="font-size: 12px;color:var(--muted)">暂无交付物</div>'}
        </div>
        <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
          ${t.kind==='project'
            ? (t.stage<5
                ? `<button class="btn btn-primary" style="height:34px" data-next="${t.id}">推进到「${esc(t.stages[t.stage])}」</button>
                   <button class="btn" data-upload="${t.id}">上传交付物</button>`
                : `<span class="st on">已结项</span><span class="row-act" data-rev="1">查看结算</span>`)
            : (t.stage===5
                ? `<button class="btn btn-primary" style="height:34px" data-accept="${t.id}">确认验收</button>
                   <button class="btn" data-chat="${t.id}">联系顾问</button>`
                : t.stage===6
                  ? `<span class="st on">已结项</span><button class="btn" data-dl="1">下载结项报告</button>`
                  : `<button class="btn" data-chat="${t.id}">联系顾问</button>
                     <button class="btn" data-upload="${t.id}">补充材料</button>`)}
        </div>
      </div>
    </div>`;

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">工单中心</div>
      <div class="page-desc">咨询工单看匹配与交付，承接工单看里程碑与验收 · 验收通过后自动进入结算</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="tkRule">工单规则</button>
    </div></div>
    <div class="kpi-mini">
      <div class="km blue"><div class="k-l">进行中工单</div><div class="k-v">${TICKETS.filter(t=>t.stage>1&&t.stage<6).length}</div><div class="k-s">含咨询与承接</div></div>
      <div class="km"><div class="k-l">待我验收</div><div class="k-v">${cons.filter(t=>t.stage===5).length}</div><div class="k-s">验收后结算</div></div>
      <div class="km green"><div class="k-l">已结项</div><div class="k-v">${TICKETS.filter(t=>t.stage===6).length}</div><div class="k-s">可下载结项材料</div></div>
      <div class="km amber"><div class="k-l">待匹配</div><div class="k-v">${cons.filter(t=>t.stage===1).length}</div><div class="k-s">平台派单中</div></div>
    </div>
    ${subTabs('tkTabs',[['consult',(isSp?'承接的咨询（':'咨询工单（')+cons.length+'）'],['project','承接工单（'+proj.length+'）']], tab)}
    ${tab==='consult'
      ? (cons.map(card).join('') || `<div class="empty-state"><b>暂无咨询工单</b><span>${isSp?'在「承接大厅 → 咨询需求」提交方案并被确认后会生成工单':'从「数智化咨询」提交咨询需求后会自动生成工单'}</span></div>`)
      : (proj.map(card).join('') || '<div class="empty-state"><b>暂无承接工单</b><span>在承接大厅被确认为承接方后会自动生成工单</span></div>')}`;

  bindSubTabs(box,'tkTabs',k=>state.tkTab=k,()=>renderTicket(box));
  $('tkRule').onclick = ()=>askConfirm('工单规则',
    '1. 咨询工单：提交需求 → 平台匹配顾问 → 方案评审 → 交付 → 验收结项；\n2. 承接工单：确认承接后生成，按里程碑推进，每个里程碑需上传交付物；\n3. 验收通过后 15 个工作日内结算，平台扣除服务费后打款。',
    '知道了', null, 'info');
  box.querySelectorAll('[data-next]').forEach(b=>b.onclick=()=>{
    const t = TICKETS.find(x=>x.id===b.dataset.next);
    askConfirm('推进工单阶段？','将从「'+t.stages[t.stage-1]+'」推进到「'+t.stages[t.stage]+'」，双方都会收到通知。','确认推进',
      ()=>{ t.stage++; renderTicket(box); toast('工单已推进到「'+t.stages[t.stage-1]+'」','ok'); },'ok');
  });
  box.querySelectorAll('[data-upload]').forEach(b=>b.onclick=()=>{
    const t = TICKETS.find(x=>x.id===b.dataset.upload);
    t.docs.unshift({n:'交付物-'+nowStamp().replace(/[: ]/g,'')+'.pdf', at:nowStamp()});
    renderTicket(box); toast('交付物已上传','ok');
  });
  box.querySelectorAll('[data-accept]').forEach(b=>b.onclick=()=>{
    const t = TICKETS.find(x=>x.id===b.dataset.accept);
    askConfirm('确认验收？','验收通过后工单结项，进入结算流程。','确认验收',
      ()=>{ t.stage=6; renderTicket(box); toast('已验收，工单结项','ok'); },'ok');
  });
  box.querySelectorAll('[data-chat]').forEach(b=>b.onclick=()=>toast('已打开与顾问的会话（演示占位）'));
  box.querySelectorAll('[data-dl]').forEach(b=>b.onclick=()=>toast('文件开始下载（演示）','ok'));
  box.querySelectorAll('[data-rev]').forEach(b=>b.onclick=()=>go('revenue'));
}

/* ================================================================
   16.18 页面：订单中心（N13 / N14 / N15 / N23 / N28）
   ================================================================ */
function renderOrder(box){
  const tab = state.ordTab;
  const list = ORDERS.filter(o=>tab==='all' || o.cat===tab);
  const sum = ORDERS.filter(o=>o.st!==6).reduce((a,o)=>a+o.amount,0);

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">订单中心</div>
      <div class="page-desc">培训、私教、项目、咨询、用工五类订单统一管理 · 用工订单额外展示在岗与结算状态</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="odExport">导出订单</button>
    </div></div>
    <div class="kpi-mini">
      <div class="km blue"><div class="k-l">累计订单</div><div class="k-v">${ORDERS.length}</div><div class="k-s">五类业务合计</div></div>
      <div class="km"><div class="k-l">交易总额</div><div class="k-v">¥${(sum/10000).toFixed(1)}万</div><div class="k-s">不含已退款</div></div>
      <div class="km amber"><div class="k-l">待付款</div><div class="k-v">${ORDERS.filter(o=>o.st===1).length}</div><div class="k-s">需在 24 小时内完成</div></div>
      <div class="km green"><div class="k-l">已完成</div><div class="k-v">${ORDERS.filter(o=>o.st===5).length}</div><div class="k-s">可评价与开票</div></div>
    </div>
    ${subTabs('odTabs',[['all','全部'],['train','培训'],['coach','私教'],['project','项目'],['consult','咨询'],['labor','用工']], tab)}
    <div class="blk">
      ${simpleTable(
        [{t:'订单号',w:'170px'},{t:'业务类型',w:'96px'},{t:'订单内容',w:'320px'},{t:'金额',w:'120px'},
         {t:'状态',w:'110px'},{t:'下单时间',w:'130px'},{t:'操作',w:'210px'}],
        list.map(o=>`<tr>
          <td class="t-mono">${esc(o.id)}</td>
          <td><span class="tag blue">${esc(OD_CAT[o.cat])}</span></td>
          <td><div class="job-name">${esc(o.title)}<span class="sub">${esc(o.co)}</span></div></td>
          <td><span class="salary">¥${o.amount.toLocaleString()}</span></td>
          <td>${stPill(OD_ST[o.st])}</td>
          <td class="t-time">${esc(o.at)}</td>
          <td><div class="ops-cell">
            <span class="row-act" data-odview="${o.id}">详情</span>
            ${o.st===1?`<span class="row-act" data-odpay="${o.id}">去支付</span>`:''}
            ${o.st===3&&o.cat==='coach'?`<span class="row-act" data-odresch="${o.id}">改期</span>`:''}
            ${o.st===4?`<span class="row-act" data-odaccept="${o.id}">确认验收</span>`:''}
            ${o.st===5?`<span class="row-act" data-odrate="${o.id}">评价</span>
                        <span class="row-act" data-odinv="${o.id}">开票</span>`:''}
          </div></td></tr>`).join('') || emptyRow(7,'该分类下暂无订单','切换上方分类看看'),
        1220)}
    </div>
    ${tab==='labor'||tab==='all'?`
      <div style="height:16px"></div>
      ${blkBox('录用与在岗状态','岗位外包订单专属 · 对应甲方需求「查看录用与服务状态」','',
        (()=>{
          const o = ORDERS.find(x=>x.cat==='labor');
          if(!o) return '<div class="empty-state"><b>暂无用工订单</b></div>';
          return `<div class="kv-grid">
            <div class="kv"><div class="k">用工形式</div><div class="v strong">驻场派遣</div></div>
            <div class="kv"><div class="k">到岗日期</div><div class="v strong">2026-10-27</div></div>
            <div class="kv"><div class="k">在岗状态</div><div class="v"><span class="st on">在岗中 · 第 1 个月</span></div></div>
            <div class="kv"><div class="k">合同周期</div><div class="v">2026-10-27 ~ 2027-04-26（6 个月）</div></div>
            <div class="kv"><div class="k">本期工时</div><div class="v">8 人 × 22 天 × 8 小时</div></div>
            <div class="kv"><div class="k">本期结算</div><div class="v strong">¥56,000 · 2026-11-15 到账</div></div>
            <div class="kv full"><div class="k">服务进度</div><div class="v">${pbarHtml(17)} <span style="font-size: 12px;color:var(--muted)">已服务 1 / 6 个月</span></div></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:14px">
            <button class="btn" id="lbReport">下载考勤与工时明细</button>
            <button class="btn" id="lbRenew">申请续签</button>
            <button class="btn btn-danger-o" id="lbEnd">申请结束用工</button>
          </div>`;
        })())}`:''}`;

  bindSubTabs(box,'odTabs',k=>state.ordTab=k,()=>renderOrder(box));
  $('odExport').onclick = ()=>toast('订单已导出为 Excel（演示）','ok');
  box.querySelectorAll('[data-odview]').forEach(b=>b.onclick=()=>{
    const o = ORDERS.find(x=>x.id===b.dataset.odview);
    askConfirm('订单详情 · '+o.id,
      o.detail.map(d=>d[0]+'：'+d[1]).join('\n')+'\n支付方式：'+o.pay+'　下单时间：'+o.at,
      '知道了', null, 'info');
  });
  box.querySelectorAll('[data-odpay]').forEach(b=>b.onclick=()=>{
    const o = ORDERS.find(x=>x.id===b.dataset.odpay);
    askConfirm('确认支付？','应付 ¥'+o.amount.toLocaleString()+'，演示环境不接入真实支付。','确认支付',
      ()=>{ o.st=2; o.pay='微信支付'; renderOrder(box); toast('支付成功','ok'); },'ok');
  });
  box.querySelectorAll('[data-odresch]').forEach(b=>b.onclick=()=>{
    const o = ORDERS.find(x=>x.id===b.dataset.odresch);
    openBigForm('私教改期','改期需提前 24 小时，每月最多 2 次',
      [{t:'改期信息', fields:[
        {k:'slot', label:'新的时段', type:'slots', value:['10-25 周六 10:00'],
          opts:TEACHERS.L001.slots, busy:TEACHERS.L001.busy},
        {k:'why', label:'改期原因', type:'txa', h:70, value:'临时出差'}
      ]}],
      (v)=>{ const i = o.detail.findIndex(d=>String(d[0]).indexOf('时段')>-1);
        if(i>-1) o.detail[i][1] = v.slot;
        closeFormModal(); renderOrder(box); toast('改期成功，新时段：'+v.slot,'ok'); return true; },
      '确认改期','md');
  });
  box.querySelectorAll('[data-odaccept]').forEach(b=>b.onclick=()=>{
    const o = ORDERS.find(x=>x.id===b.dataset.odaccept);
    askConfirm('确认验收？','验收后款项将结算给服务方。','确认验收',
      ()=>{ o.st=5; renderOrder(box); toast('已验收，订单完成','ok'); },'ok');
  });
  box.querySelectorAll('[data-odrate]').forEach(b=>b.onclick=()=>{
    const o = ORDERS.find(x=>x.id===b.dataset.odrate);
    openBigForm('服务评价','你的评价会影响服务商的排序与等级',
      [{t:'评价', fields:[
        {k:'stars', label:'评分', type:'chips', value:['5 分 非常满意'],
          opts:['5 分 非常满意','4 分 满意','3 分 一般','2 分 不满意']},
        {k:'txt', label:'评价内容', type:'txa', h:80, ph:'说说哪里对你帮助最大'}
      ]}],
      ()=>{ closeFormModal(); toast('评价已提交，感谢反馈','ok'); renderOrder(box); return true; },
      '提交评价','md');
  });
  box.querySelectorAll('[data-odinv]').forEach(b=>b.onclick=()=>toast('发票申请已提交，3 个工作日内开具（演示）','ok'));
  if($('lbReport')) $('lbReport').onclick=()=>toast('考勤与工时明细已下载（演示）','ok');
  if($('lbRenew')) $('lbRenew').onclick=()=>askConfirm('申请续签','将向用工企业发送续签意向，对方确认后生成新订单。','提交申请',
    ()=>toast('续签申请已提交','ok'),'ok');
  if($('lbEnd')) $('lbEnd').onclick=()=>askConfirm('申请结束用工？','需提前 30 天申请，离场前需完成交接。','确认申请',
    ()=>toast('已提交结束用工申请'),'danger');
}

/* ================================================================
   16.19 页面：收益与分成（N29）
   ================================================================ */
function renderRevenue(box){
  const R = REVENUE;
  const total = R.rows.reduce((a,r)=>a+r.amount,0);
  const settled = R.rows.filter(r=>r.st==='已结算').reduce((a,r)=>a+r.net,0);
  const pending = R.rows.filter(r=>r.st==='待结算').reduce((a,r)=>a+r.net,0);
  const withdrawn = R.payouts.reduce((a,p)=>a+p.amount,0);
  const canDraw = Math.max(0, settled - withdrawn);
  const wan = n => (n/10000).toFixed(1);

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">收益与分成</div>
      <div class="page-desc">成交额 → 平台服务费 → 实收 · 项目类抽佣 8%~10%，验收后 15 个工作日结算</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="rvRule">分成规则</button>
      <button class="btn btn-primary" id="rvDraw">申请提现</button>
    </div></div>
    <div class="kpi-mini">
      <div class="km blue"><div class="k-l">累计成交额</div><div class="k-v">¥${wan(total)}万</div><div class="k-s">${R.rows.length} 笔订单</div></div>
      <div class="km green"><div class="k-l">已结算</div><div class="k-v">¥${wan(settled)}万</div><div class="k-s">已扣除平台服务费</div></div>
      <div class="km amber"><div class="k-l">待结算</div><div class="k-v">¥${wan(pending)}万</div><div class="k-s">验收后结算</div></div>
      <div class="km"><div class="k-l">本月收入</div><div class="k-v">¥${wan(R.month)}万</div><div class="k-s">较上月 +18%</div></div>
    </div>
    <div class="ov-cols">
      <div>
        ${blkBox('收益台账','每笔订单的成交额、服务费与实收','',
          simpleTable(
            [{t:'订单',w:'240px'},{t:'成交额',w:'110px'},{t:'抽佣',w:'80px'},{t:'实收',w:'110px'},{t:'状态',w:'100px'}],
            R.rows.map(r=>`<tr>
              <td><div class="job-name">${esc(r.title)}<span class="sub t-mono">${esc(r.id)}</span></div></td>
              <td>¥${r.amount.toLocaleString()}</td>
              <td class="t-muted">${(r.rate*100).toFixed(0)}%</td>
              <td><span class="salary">¥${r.net.toLocaleString()}</span></td>
              <td>${r.st==='已结算'?'<span class="st on">已结算</span>':'<span class="st pending">待结算</span>'}</td>
            </tr>`).join(''),700))}
      </div>
      <div>
        ${blkBox('可提现余额','已结算金额扣除历史提现','', `
          <div style="font-size: 28px;font-weight:800;color:var(--blue-600);letter-spacing:-1px">¥${canDraw.toLocaleString()}</div>
          <div style="font-size: 12px;color:var(--muted);margin-top:6px">已结算 ¥${settled.toLocaleString()} − 已提现 ¥${withdrawn.toLocaleString()}</div>
          <div style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;font-size: 12px;color:var(--muted);margin-bottom:6px">
              <span>本月提现进度</span><span>¥50,000 / ¥100,000</span></div>
            ${pbarHtml(50)}
          </div>`)}
        <div style="height:16px"></div>
        ${blkBox('提现记录','', '', R.payouts.map(p=>`
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px dashed var(--line)">
            <div style="flex:1;min-width:0"><div style="font-size: 12px;font-weight:600">${esc(p.n)}</div>
              <div style="font-size: 12px;color:var(--muted);margin-top:2px">${esc(p.at)}</div></div>
            <span class="salary">¥${p.amount.toLocaleString()}</span>
            <span class="st on">${esc(p.st)}</span>
          </div>`).join(''))}
      </div>
    </div>`;

  $('rvRule').onclick = ()=>askConfirm('分成规则',
    '1. 项目外包 / 数智化咨询：平台服务费 8%~10%，按合同额计算；\n2. 培训课程 / 私教服务：平台服务费 10%，按实收学费计算；\n3. 结算节点：验收通过后 15 个工作日内；\n4. 提现：单笔最低 1000 元，T+1 到账，免手续费。',
    '知道了', null, 'info');
  $('rvDraw').onclick = ()=>openBigForm('申请提现','提现至认证时登记的对公账户',
    [{t:'提现信息', fields:[
      {k:'amt', label:'提现金额', value:'200000', req:1, half:1, ph:'最低 1000 元'},
      {k:'acct', label:'到账账户', type:'sel', half:1,
        opts:['招商银行 ****1234（对公）','工商银行 ****8890（对公）'], value:'招商银行 ****1234（对公）'},
      {k:'note', label:'备注', type:'txa', h:60, ph:'选填'}
    ]}],
    (v)=>{ REVENUE.payouts.unshift({n:'提现至'+v.acct, amount:parseInt(v.amt)||0, at:nowStamp(), st:'处理中'});
      closeFormModal(); renderRevenue(box); toast('提现申请已提交，T+1 到账','ok'); return true; },
    '确认提现','md');
}

/* ================================================================
   16.20 页面：我的课程（N12）
   ================================================================ */
function renderMyCourse(box){
  const list = MY_COURSES;
  const cur = list.find(c=>c.id===state.mcId) || list[0];
  const totalDone = list.reduce((a,c)=>a+c.done,0);
  const totalAll = list.reduce((a,c)=>a+c.total,0);
  const doneCnt = list.filter(c=>c.done>=c.total).length;

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">我的课程</div>
      <div class="page-desc">已报名课程的班期、学习进度、课件与结业材料 · 视频回放保留 12 个月</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="mcAll">去逛课程</button>
    </div></div>
    <div class="kpi-mini">
      <div class="km blue"><div class="k-l">在读课程</div><div class="k-v">${list.filter(c=>c.done<c.total).length}</div><div class="k-s">共 ${list.length} 门</div></div>
      <div class="km"><div class="k-l">已完成课时</div><div class="k-v">${totalDone}</div><div class="k-s">总 ${totalAll} 课时</div></div>
      <div class="km green"><div class="k-l">已结业</div><div class="k-v">${doneCnt}</div><div class="k-s">可下载证书</div></div>
      <div class="km amber"><div class="k-l">待交作业</div><div class="k-v">2</div><div class="k-s">本周截止</div></div>
    </div>
    <div class="mc-grid">
      ${list.map(c=>{
        const done = c.done >= c.total;
        return `<div class="mc-card${done?' is-done':''}">
          <div class="mc-band ${done?'done':'learn'}">
            <span class="mc-badge">${done?'已结业':'学习中'}</span>
            <div class="mc-t">${esc(c.title)}</div>
          </div>
          <div class="mc-body">
            <div class="mc-meta"><span>讲师 ${esc(c.teacher)}</span><span class="dot"></span><span>${esc(c.mode)}</span></div>
            <div class="mc-cls">${esc(c.cls)}</div>
            <div>
              <div class="mc-prog"><span>学习进度</span><b>${c.done} / ${c.total} 课时</b></div>
              ${pbarHtml(c.done/c.total*100, done)}
            </div>
            <div class="mc-next">${done?'✓ ':'▶ '}${esc(c.next)}</div>
            <div class="mc-acts">
              <button class="btn btn-sm" data-mc="${c.id}">课程详情</button>
              <button class="btn btn-sm" data-mcplay="${c.id}">${done?'看回放':'继续学习'}</button>
              <button class="btn btn-sm btn-primary" style="height:30px" data-mccert="${c.id}">${done?'下载证书':'学习报告'}</button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
    ${blkBox(cur?'课时安排 · '+esc(cur.title):'课时安排','', '',
      (cur?cur.lessons:[]).map((l,i)=>`<div class="lesson ${l.ok?'done':''}">
        <span class="ls-n">${l.ok?'✓':i+1}</span>
        <span class="ls-t">${esc(l.n)}</span>
        <span class="ls-d">${esc(l.d)}</span>
        <span class="row-act" data-lesson="1">${l.ok?'看回放':'去上课'}</span>
      </div>`).join('') || '<div class="empty-state"><b>暂无课时</b></div>')}`;

  $('mcAll').onclick = ()=>go('train');
  /* 课程详情：连接到「AI培训」的课程详情，同时把下方课时安排切到该课程 */
  box.querySelectorAll('[data-mc]').forEach(b=>b.onclick=()=>{
    state.mcId = b.dataset.mc;
    renderMyCourse(box);
    const tm = CORE.find(x=>x.key==='train');
    const rec = tm && tm.records.find(x=>x.id===b.dataset.mc);
    if(rec) openDrawer(tm, rec, {noCta:true});
  });
  box.querySelectorAll('[data-mcplay]').forEach(b=>b.onclick=()=>{
    state.mcId = b.dataset.mcplay;
    toast('正在打开直播 / 回放（演示占位）');
  });
  box.querySelectorAll('[data-mccert]').forEach(b=>b.onclick=()=>{
    const c = MY_COURSES.find(x=>x.id===b.dataset.mccert);
    if(c.done>=c.total) toast('结业证书已下载（演示）','ok');
    else toast('学习报告已生成：已完成 '+c.done+' / '+c.total+' 课时（演示）','ok');
  });
  box.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>toast('课时内容为演示占位'));
}

/* ================================================================
   16.21 页面：讲师主页 + 套餐 + 预约（N16）
   ================================================================ */
function renderTeacher(box){
  const t = TEACHERS[state.teacherId] || TEACHERS.L001;
  const stars = n => '★'.repeat(n) + '☆'.repeat(5-n);

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">讲师主页</div>
      <div class="page-desc">先看资历与套餐，再选时段预约 · 支持单次咨询与多次套餐</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="tcBack">返回列表</button>
      <button class="btn btn-primary" id="tcBook">预约沟通</button>
    </div></div>

    <div class="cert-hero">
      <div class="ch-ico">${ICONS.coach}</div>
      <div class="ch-main">
        <div class="ch-t">${esc(t.name)}<span class="lv">${esc(t.level)}</span></div>
        <div class="ch-s">${esc(t.title)} · 已通过平台实名与资质认证</div>
      </div>
      <div class="ch-side">
        <div style="font-size: 12px;color:rgba(255,255,255,.86)">评分 <b style="font-size: 18px">4.8</b> / 5</div>
      </div>
    </div>

    <div class="ov-cols">
      <div>
        ${blkBox('讲师简介','', '', `<div style="font-size: 12px;line-height:1.9;color:var(--text-2)">${esc(t.intro)}</div>
          <div class="skill-list" style="margin-top:14px">${t.tags.map(x=>`<span class="skill-tag">${esc(x)}</span>`).join('')}</div>`)}
        <div style="height:16px"></div>
        ${blkBox('套餐选择','价格与交付范围', '', `<div class="pkg-row">
          ${t.packages.map((p,i)=>`<div class="pkg${p.hot?' on':''}" data-pkg="${i}">
            <div class="pk-n">${esc(p.n)}${p.hot?' · 推荐':''}</div>
            <div class="pk-p">¥${p.price}<small>${esc(p.unit)}</small></div>
            <div class="pk-d">${esc(p.d)}</div>
          </div>`).join('')}
        </div>`)}
        <div style="height:16px"></div>
        ${blkBox('学员评价','共 '+t.reviews.length+' 条','',
          t.reviews.map(r=>`<div style="padding:10px 0;border-bottom:1px dashed var(--line)">
            <div style="display:flex;align-items:center;gap:8px">
              <b style="font-size: 12px">${esc(r.n)}</b>
              <span style="color:#F0A93B;font-size: 12px">${stars(r.s)}</span>
              <span class="spacer" style="flex:1"></span>
              <span style="font-size: 12px;color:var(--muted)">${esc(r.d)}</span></div>
            <div style="font-size: 12px;color:var(--text-2);line-height:1.7;margin-top:5px">${esc(r.t)}</div>
          </div>`).join(''))}
      </div>
      <div>
        ${blkBox('讲师数据','', '', `<div class="kv-grid">
          ${t.stats.map(s=>`<div class="kv"><div class="k">${esc(s[0])}</div><div class="v strong">${esc(s[1])}</div></div>`).join('')}
        </div>`)}
        <div style="height:16px"></div>
        ${blkBox('本周可约时段','灰色为已被预约', '',
          `<div class="slot-row" id="tcSlots">${t.slots.map(s=>
            `<button class="slot${t.busy.indexOf(s)>-1?' dis':''}" data-slot="${esc(s)}" ${t.busy.indexOf(s)>-1?'disabled':''}>${esc(s)}</button>`).join('')}</div>
           <div style="font-size: 12px;color:var(--muted);margin-top:10px;line-height:1.7">
             预约后讲师会在 24 小时内确认；如需改期请提前 24 小时操作，每月最多 2 次。</div>`)}
      </div>
    </div>`;

  $('tcBack').onclick = ()=>go('coach');
  $('tcBook').onclick = ()=>openCoachBook(t);
  let picked = '';
  box.querySelectorAll('#tcSlots .slot').forEach(b=>{
    b.onclick = ()=>{
      box.querySelectorAll('#tcSlots .slot').forEach(x=>x.classList.remove('on'));
      b.classList.add('on'); picked = b.dataset.slot;
    };
  });
  box.querySelectorAll('[data-pkg]').forEach(p=>{
    p.onclick = ()=>{
      box.querySelectorAll('[data-pkg]').forEach(x=>x.classList.remove('on'));
      p.classList.add('on');
      toast('已选择「'+t.packages[+p.dataset.pkg].n+'」');
    };
  });
}
function openCoachBook(t){
  openBigForm('预约 · '+t.name,'提交后讲师将在 24 小时内确认时间',
    [
      {t:'套餐与时段', fields:[
        {k:'pkg', label:'套餐', type:'chips', req:1,
          value:[(function(){ const p=t.packages[1]||t.packages[0]; return p.n+' ¥'+p.price; })()],
          opts:t.packages.map(p=>p.n+' ¥'+p.price)},
        {k:'slot', label:'期望时段', type:'slots', req:1, value:[t.slots.find(s=>t.busy.indexOf(s)<0)||t.slots[0]],
          opts:t.slots, busy:t.busy},
        {k:'goal', label:'本次诉求', type:'txa', h:90, req:1,
          ph:'例如：想从 B 端产品转 AI 产品，不知道简历和项目该怎么准备'}
      ]},
      {t:'联系方式', fields:[
        {k:'name', label:'称呼', value:'王旭', half:1},
        {k:'mobile', label:'手机号', value:'150****6688', half:1}
      ]}
    ],
    (v)=>{
      const now = nowStamp();
      const pay = (v.pkg||[''])[0] || '';
      const amt = parseInt(String(pay).replace(/[^\d]/g,'')) || 499;
      ORDERS.unshift({
        id:'OD'+Date.now().toString().slice(-10), cat:'coach', title:'私教 · '+t.name+' · '+(pay.split(' ¥')[0]||'单次咨询'),
        co:'讲师 · '+t.name, amount:amt, st:1, at:now, pay:'待支付',
        detail:[['套餐',pay],['时段',v.slot||'待定'],['诉求',(v.goal||'').slice(0,26)],['交付物','按套餐约定']]
      });
      if(canSee('order')){
        toast('预约已提交，请在「订单中心」完成支付','ok');
        closeFormModal();
        state.ordTab='coach'; go('order');
      }else{
        /* 个人端已隐藏订单中心：预约直接提交给讲师 */
        toast('预约已提交，讲师将在 24 小时内确认时间','ok');
        closeFormModal();
      }
      return true;
    }, '提交预约','md');
}

/* ================================================================
   16.22b 简历编辑（求职者 · 完善简历）
   ================================================================ */
function openResumeEdit(){
  openBigForm('编辑简历','保存后立即生效，企业看到的就是这一份',
    [
      {t:'求职意向', fields:[
        {k:'intent', label:'期望职位', req:1, value:RESUME.intent},
        {k:'salary', label:'期望薪资', value:RESUME.salary, half:1},
        {k:'expectCity', label:'期望城市', value:RESUME.expectCity, half:1},
        {k:'state', label:'求职状态', type:'sel', half:1,
          opts:['在职-月内到岗','在职-考虑机会','离职-随时到岗','在校/应届'], value:RESUME.state},
        {k:'years', label:'工作年限', type:'sel', half:1,
          opts:['1 年以下','1–3 年','3–5 年','5–10 年','10 年以上'], value:RESUME.years}
      ]},
      {t:'技能与优势', fields:[
        {k:'skills', label:'技能标签', type:'chips', value:RESUME.skills.slice(),
          opts:['需求分析','Axure','Figma','SQL','Prompt Engineering','数据分析',
                'B 端产品','项目管理','RAG','AI 产品','效果评测']},
        {k:'intro', label:'个人优势', type:'txa', h:100, req:1, value:RESUME.intro,
          tip:'建议用「年限 + 领域 + 可量化结果」写，投递前可随时修改'}
      ]}
    ],
    (v)=>{
      if(!v.intent){ toast('请填写期望职位','err'); return false; }
      if(!v.intro || v.intro.length < 20){ toast('个人优势至少 20 个字','err'); return false; }
      RESUME.intent = v.intent;
      RESUME.salary = v.salary || RESUME.salary;
      RESUME.expectCity = v.expectCity || RESUME.expectCity;
      RESUME.state = v.state;
      RESUME.years = v.years;
      if((v.skills||[]).length) RESUME.skills = v.skills;
      RESUME.intro = v.intro;
      RESUME.aiIntro = v.intro.replace(/\s+/g,' ').slice(0, 96) + '…';
      closeFormModal();
      renderExtraPage('resume');
      toast('简历已更新，投递时会使用最新版本','ok');
      return true;
    }, '保存简历');
}

/* ================================================================
   16.23 企业内训采购（N23）
   ================================================================ */
function openTrainPurchase(){
  openBigForm('企业内训采购','提交后平台会在 1 个工作日内给出讲师与方案建议',
    [
      {t:'培训需求', fields:[
        {k:'topic', label:'培训主题', req:1, ph:'如：面向职能部门的 AI 办公提效'},
        {k:'people', label:'参训人数', req:1, value:'86', half:1},
        {k:'days', label:'培训天数', type:'sel', half:1, opts:['0.5 天','1 天','2 天','3 天','5 天以上'], value:'3 天'},
        {k:'when', label:'期望时间', req:1, value:'2026-11 下旬', half:1},
        {k:'venue', label:'场地', type:'sel', half:1, opts:['客户现场','线上直播','平台场地','待定'], value:'客户现场'},
        {k:'budget', label:'预算区间', type:'sel', half:1, opts:['5 万以内','5-10 万','10-30 万','30 万以上'], value:'5-10 万'},
        {k:'role', label:'学员岗位构成', value:'职能 + 运营 + 产品，约 60 人零基础', }
      ]},
      {t:'交付要求', fields:[
        {k:'content', label:'内容要求', type:'txa', h:90,
          value:'希望结合公司真实业务场景做工作坊，产出可直接复用的提示词模板与作业清单。'},
        {k:'need', label:'是否需要结业评估', type:'sel', half:1, opts:['需要','不需要'], value:'需要'},
        {k:'invoice', label:'开票要求', type:'sel', half:1,
          opts:['增值税专用发票 6%','增值税普通发票','暂不开票'], value:'增值税专用发票 6%'}
      ]}
    ],
    (v)=>{
      if(!v.topic){ toast('请填写培训主题','err'); return false; }
      const now = nowStamp();
      const amount = {'5 万以内':48000,'5-10 万':86000,'10-30 万':186000,'30 万以上':360000}[v.budget] || 86000;
      ORDERS.unshift({
        id:'OD'+Date.now().toString().slice(-10), cat:'train', title:'企业内训 · '+v.topic,
        co:'深圳市云启科技有限公司', amount:amount, st:1, at:now, pay:'待支付',
        detail:[['参训', v.people+' 人 · '+v.days], ['期望时间', v.when],
                ['场地', v.venue], ['开票', v.invoice]]
      });
      TICKETS.unshift({
        id:'TK'+Date.now().toString().slice(-9), kind:'consult', title:'企业内训需求 · '+v.topic,
        owner:'深圳市云启科技有限公司', sp:'待平台派单', price:'¥'+amount.toLocaleString(),
        stage:1, stages:['需求提交','匹配讲师','方案评审','交付中','已结项'],
        at:now, budget:v.budget, cycle:v.days, scene:'企业内训',
        desc:v.content||'', docs:[]
      });
      closeFormModal();
      toast('内训需求已提交，订单已生成','ok');
      state.ordTab='train'; go('order');
      return true;
    }, '提交需求');
}

/* ================================================================
   16.24 我的申请（增加分类与面试进度）
   ================================================================ */
function renderApplyP(box){
  const tab = state.apTab || 'all';
  const map = {job:'岗位', project:'项目', outs:'外包', intern:'实习', train:'培训', coach:'私教'};
  const list = APPLIES_P.filter(a=>tab==='all' || a.type===map[tab]);
  const cnt = k => APPLIES_P.filter(a=>a.st===k).length;

  box.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">我的申请</div>
      <div class="page-desc">全平台投递与报名记录 · 岗位 / 项目 / 外包 / 实习 / 培训 / 私教统一查看</div>
    </div><div class="spacer"></div><div class="head-ops">
      <button class="btn" id="apExport">导出记录</button>
      <button class="btn btn-primary" id="apGo">去投递</button>
    </div></div>
    <div class="stat-row">
      ${statHtml(APPLIES_P.length,'全部申请')}${statHtml(cnt(2),'沟通中')}
      ${statHtml(cnt(5),'企业已通过')}${statHtml(cnt(3),'不合适')}
    </div>
    ${subTabs('apTabs',[['all','全部'],['job','岗位'],['project','项目'],['outs','外包'],
      ['intern','实习'],['train','培训'],['coach','私教']], tab)}
    <div class="blk">
      ${simpleTable(
        [{t:'申请对象',w:'260px'},{t:'类型',w:'86px'},{t:'薪资 / 预算',w:'130px'},{t:'投递时间',w:'120px'},
         {t:'进度状态',w:'110px'},{t:'企业反馈',w:'260px'},{t:'操作',w:'160px'}],
        list.map(a=>`<tr>
            <td><div class="job-name">${esc(a.obj)}<span class="sub">${esc(a.id)} · ${esc(a.co)}</span></div></td>
            <td><span class="tag blue">${esc(a.type)}</span></td>
            <td><span class="salary">${esc(a.salary)}</span></td>
            <td class="t-time">${esc(a.time)}</td>
            <td>${stPill(AP_ST[a.st])}</td>
            <td><div class="t-req" title="${esc(a.fb)}">${esc(a.fb)}</div></td>
            <td><div class="ops-cell">
              <span class="row-act" data-ap="d" data-id="${a.id}">详情</span>
              ${(a.type==='外包'&&a.st===5&&canSee('order'))?`<span class="row-act" data-labor="1">查看录用</span>`:''}
              <span class="row-act" data-ap="w" data-id="${a.id}">撤回</span>
            </div></td></tr>`).join('') || emptyRow(7,'该分类下暂无申请','切换上方分类看看'),1300)}
    </div>`;

  bindSubTabs(box,'apTabs',k=>state.apTab=k,()=>renderApplyP(box));
  $('apExport').onclick = ()=>toast('申请记录已导出（演示）','ok');
  $('apGo').onclick = ()=>go('job');
  box.querySelectorAll('[data-labor]').forEach(b=>b.onclick=()=>{
    state.ordTab = 'labor'; go('order');
    toast('已跳到「用工订单」，可查看录用、在岗与结算状态');
  });
  box.querySelectorAll('[data-ap]').forEach(b=>{
    b.onclick = ()=>{
      const a = APPLIES_P.find(x=>x.id===b.dataset.id);
      if(b.dataset.ap==='d'){
        const iv = INTERVIEWS.find(x=>x.dir==='in' && a.obj.indexOf(x.job)>-1);
        askConfirm('申请详情 · '+a.obj,
          '企业：'+a.co+'\n投递时间：'+a.time+'\n状态：'+AP_ST[a.st][0]
          +'\n\n企业反馈：'+a.fb
          +(iv?'\n\n面试：'+iv.time+' · '+iv.mode+'\n'+IV_ST[iv.st][0]:''),
          '知道了', null, 'info');
        return;
      }
      askConfirm('撤回该申请？','撤回后企业将无法查看该申请，操作不可恢复。','确认撤回',
        ()=>{ const i=APPLIES_P.indexOf(a); if(i>-1) APPLIES_P.splice(i,1); renderApplyP(box); toast('已撤回'); },'danger');
    };
  });
}

/* ================================================================
   16.25 页面注册表
   ================================================================ */
const EXTRA_PAGES = {
  certEnt:renderCertEnt,
  certSp:renderCertSp,
  applyE:renderApplyE,
  interview:renderInterview,
  hall:renderHall,
  bidDetail:renderBidDetail,
  ticket:renderTicket,
  order:renderOrder,
  revenue:renderRevenue,
  myCourse:renderMyCourse,
  teacher:renderTeacher,
  applyP:renderApplyP,
  candidate:renderCandidate
};

/* 投递动作重定向：项目 → 能力资料；私教 → 讲师主页；其余 → 投递弹层
   企业端在项目外包 / 岗位外包上走「承接申请」，其余企业端不出现申请入口 */
const _origActApply = actApply;
actApply = function(m, r){
  const bk = m.baseKey || m.key;
  if(isCompanyApply(m)){ openBidForm(m, r, 'apply'); return; }
  if(bk==='project'){ openBidForm(m, r, 'bid'); return; }
  if(bk==='coach'){
    state.teacherId = (String(r.co||'').indexOf('周昱')>-1) ? 'L002' : 'L001';
    go('teacher'); return;
  }
  /* 企业端申请数智化咨询：确认后提交，顾问 1 个工作日内对接 */
  if(bk==='consult' && state.acting==='company'){
    if(isApplied(m,r)){ toast('你已提交该咨询申请'); return; }
    askConfirm('申请「'+r.title+'」的咨询服务？',
      '提交后平台将在 1 个工作日内匹配顾问并与你联系，确认服务范围、周期与报价。',
      '提交申请', ()=>{
        appliedSet(m).add(r.id);
        if($('mCards')) renderList(m);
        toast('咨询申请已提交，顾问将在 1 个工作日内与你联系','ok');
      }, 'info');
    return;
  }
  /* 企业端报名 AI 培训：确认后直接报名（企业端没有「我的课程」，改走顾问回访口径） */
  if(bk==='train' && state.acting==='company'){
    if(isApplied(m,r)){ toast('你已报名该课程'); return; }
    const price = (cardAmount(m,r)||{}).main || '面议';
    askConfirm('确认报名「'+r.title+'」？',
      '课程费用 '+price+'，报名后课程顾问将在 1 个工作日内与你确认班期与开票信息。',
      '确认报名', ()=>{
        appliedSet(m).add(r.id);
        if($('mCards')) renderList(m);
        toast('报名成功，课程顾问将在 1 个工作日内与你联系','ok');
      }, 'info');
    return;
  }
  openApplyForm(m, r);
};

/* 咨询需求：补「周期」字段（覆盖原 openConsultForm） */
openConsultForm = function(){
  openBigForm('提交咨询需求','平台将在 1 个工作日内匹配顾问并生成工单',
    [
      {t:'需求信息', fields:[
        {k:'topic', label:'咨询主题', req:1, ph:'如：中小企业 AI 招聘落地路径'},
        {k:'scene', label:'业务场景', type:'sel', half:1,
          opts:['企业内部系统','招聘与人力','销售与营销','数据与经营','其他'], value:'招聘与人力'},
        {k:'size', label:'组织规模', type:'sel', half:1,
          opts:['50 人以下','50-200 人','200-1000 人','1000 人以上'], value:'200-1000 人'},
        {k:'budget', label:'预算区间', type:'sel', half:1,
          opts:['10 万以内','10-50 万','50-100 万','100 万以上','待评估'], value:'10-50 万'},
        {k:'cycle', label:'项目周期', type:'sel', half:1,
          opts:['1 个月内','1-3 个月','3-6 个月','6 个月以上'], value:'3-6 个月'},
        {k:'desc', label:'需求描述', type:'txa', h:90, req:1,
          ph:'简述当前痛点、已有系统与期望达成的目标（至少 10 个字）'}
      ]}
    ],
    (v)=>{
      if(!v.topic){ toast('请填写咨询主题','err'); return false; }
      if(!v.desc || v.desc.length<10){ toast('需求描述至少 10 个字','err'); return false; }
      const m = CORE.find(x=>x.key==='consult');
      const now = nowStamp();
      m.records.unshift({
        id:'C-9'+(300+m.records.length), title:v.topic, type:1, leaf:'咨询需求', catL1:'数字化战略',
        count:1, city:'', dist:'', online:true, pay:'neg', exp:'不限', edu:'不限',
        tags:['咨询需求', v.scene], status:1, up:now, expire:'',
        work:'咨询主题：'+v.topic+'；业务场景：'+v.scene+'；组织规模：'+v.size+'；周期：'+v.cycle+'。\n需求描述：'+v.desc,
        req:'平台将在 1 个工作日内分配顾问对接。',
        co:'顾问待分配', tfacts:[['预算',v.budget],['周期',v.cycle],['受理','待分配顾问']],
        views:0, applies:0, own:1
      });
      TICKETS.unshift({
        id:'TK'+Date.now().toString().slice(-9), kind:'consult', title:v.topic,
        owner:'深圳市云启科技有限公司', sp:'待平台匹配', price:'待报价',
        stage:1, stages:['需求提交','匹配顾问','方案评审','交付中','已结项'],
        at:now, budget:v.budget, cycle:v.cycle, scene:v.scene, desc:v.desc, docs:[]
      });
      closeFormModal();
      toast('咨询需求已提交，工单已生成','ok');
      if(canSee('ticket')){ state.tkTab='consult'; go('ticket'); }
      return true;
    }, '提交需求');
};

