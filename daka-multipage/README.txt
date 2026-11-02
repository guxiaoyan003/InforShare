DAKA · 统一工作台 —— 多页版（按菜单拆分）
============================================================

一、这是什么
------------------------------------------------------------
把原来的单文件 Demo（DAKA-企业端.html / DAKA-个人端.html）按左侧菜单
拆成了独立页面：一个菜单 = 一个 html 文件，两端都有的菜单放在 shared/
共用同一份页面，不再各存一份。

业务逻辑、字段、演示数据、菜单顺序都没有改动，改的只是文件组织方式。


二、怎么打开
------------------------------------------------------------
直接双击对应的 index 页即可，不需要服务器、不需要安装、不依赖网络：

  企业端：enterprise/index.html
  个人端：personal/index.html

必须先登录才能进工作台：

  企业端   账号：深圳市云启科技有限公司   密码：123456
  个人端   账号：王旭                     密码：123456

登录后会跳到该端的第一个页面（企业端 → 项目外包，个人端 → 岗位招聘），
之后点左侧菜单在页面之间跳转，登录状态在同一个浏览器标签页内保持。


三、目录结构
------------------------------------------------------------
daka-multipage/
├─ assets/                 公共资源（两端共用）
│  ├─ css/app.css          全站样式
│  └─ js/
│     ├─ core.js           工具函数 / 导航配置 / 登录会话 / 权限 / 侧边栏 / 路由
│     ├─ components.js     通用 UI 构件（抽屉 / 弹窗 / 确认框 / tabs）
│     ├─ business.js       核心业务页与发布端管理页的列表、筛选、发布表单
│     ├─ data.js           功能页的演示数据
│     ├─ features.js       功能页渲染（认证 / 面试 / 申请 / 交易 / 账号）
│     └─ career-plan.js     AI 职业规划（对话式评估）
├─ enterprise/             企业端页面（含登录入口）
├─ personal/               个人端页面（含登录入口）
└─ shared/                 两端共用页面


四、企业端菜单 → 页面文件（13 项，顺序与原菜单一致）
------------------------------------------------------------
核心业务
  项目外包            shared/project-outsourcing.html
  岗位外包            shared/position-outsourcing.html
  数智化咨询          shared/digital-consulting.html
  AI培训              shared/ai-training.html
认证与入驻
  企业认证            enterprise/enterprise-certification.html
发布端管理
  岗位发布管理        enterprise/position-publishing.html
  项目外包管理        shared/project-outsourcing-management.html
  数智化咨询管理      shared/digital-consulting-management.html
  AI培训管理          enterprise/ai-training-management.html
  AI私教管理          enterprise/ai-coach-management.html
业务协作
  收到申请            enterprise/received-applications.html
我的
  投诉反馈            shared/complaint-feedback.html
设置
  设置                shared/account-settings.html


五、个人端菜单 → 页面文件（16 项，顺序与原菜单一致）
------------------------------------------------------------
核心业务
  岗位招聘            personal/job-recruitment.html
  项目外包            shared/project-outsourcing.html
  岗位外包            shared/position-outsourcing.html
  数智化咨询          shared/digital-consulting.html
  AI培训              shared/ai-training.html
  AI私教              personal/ai-coach.html
  AI职业规划          personal/ai-career-plan.html
  AI实习              personal/ai-internship.html
发布端管理
  项目外包管理        shared/project-outsourcing-management.html
  数智化咨询管理      shared/digital-consulting-management.html
业务协作
  面试管理            personal/interview-management.html
我的
  我的简历            personal/resume.html
  我的申请            personal/my-applications.html
  我的课程            personal/my-courses.html
  投诉反馈            shared/complaint-feedback.html
设置
  设置                shared/account-settings.html


六、几个说明
------------------------------------------------------------
1. 同名菜单共用页面
   「项目外包」「岗位外包」「数智化咨询」「AI培训」「项目外包管理」
   「数智化咨询管理」「投诉反馈」「设置」这 8 项两端都有，页面只写一份
   放在 shared/，靠登录身份自动切换可见菜单与操作权限。

2. 登录与会话
   打开任意业务页，如果没有登录会直接跳到本端 index 登录页。
   登录状态存在浏览器的 sessionStorage 里（标签页级）：
   · 新开标签页 / 新窗口打开 → 需要重新登录
   · 同一标签页内点菜单 → 不用重复登录
   · 关闭标签页 → 登录状态清除
   会话里带角色，个人端页面不接受企业端身份，反之亦然：
   企业身份误开个人端页面时，会自动回到企业端首页，不会被打断登录。

3. 详情页不单独占文件
   候选人详情、项目申请人详情、讲师主页是由列表点进去的二级视图，
   仍然在所属列表页内切换，不另外占一个 html。

4. 与原单文件版的关系
   原 DAKA-企业端.html / DAKA-个人端.html 未做改动，仍可独立使用。
   本目录是内容等价的多页版本。
