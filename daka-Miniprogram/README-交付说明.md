# 大咖 DAKA · 双端小程序交付包

本包由 `DAKA-小程序-双端-demo-v1.html` 1:1 还原为**可运行的微信小程序工程**，并配套 **Python（FastAPI）+ MySQL** 后端。

- 个人端：机会 / 职业规划 / 消息 / 我的
- 企业端：合作 / 企业认证 / 消息 / 我的
- 20+ 二级页：职位详情、投递弹层、搜索筛选、在线简历、我的发布、收到申请、申请详情、上传简历、投诉、发布需求（3 类 / 5 类）、企业认证 4 步流程、牛人库、牛人主页、消息详情、编辑资料等
- 动画：分类下划线滑动、二级页右滑进入、舵式 tabbar、FAB 旋转、气泡 typing、弹层/选择器/Toast 全部按 demo 曲线还原

---

## 一、包结构

```
DAKA-交付包/
├── README.md                 # 本文件
├── 01-小程序端/               # 用微信开发者工具导入这个目录
│   ├── app.js / app.json / app.wxss
│   ├── pages/index/          # 单页壳 + 页面模板（tpl/）
│   ├── utils/                # config / api / service / mock / vm
│   ├── styles/icons.wxss     # 从 demo 提取的 64 个 SVG 图标
│   ├── assets/               # 15 张商务头像、2 张规划页背景、企业 logo
│   ├── project.config.json
│   └── sitemap.json
└── 02-后端服务/
    ├── app/                  # FastAPI + SQLAlchemy
    ├── sql/schema.sql        # 15 张表建表语句
    ├── seed_data.json        # 演示数据
    ├── requirements.txt
    ├── .env.example
    └── README.md             # 后端部署详细说明
```

---

## 二、5 分钟预览（不需要后端）

1. 打开**微信开发者工具** → 导入项目 → 选择 `01-小程序端` 目录。
2. AppID 可先选「测试号」；正式联调时把 `project.config.json` 的 `appid` 换成公司小程序 AppID。
3. 直接编译即可。此时 `utils/config.js` 中：

```js
USE_MOCK: true
```

演示模式会把数据存在小程序本地 Storage（`daka_mock_db_v1`），所有点击、投递、发布、认证、投诉、上传等交互都能完整走通，**不需要数据库与服务器**。

> 想恢复初始演示数据：开发者工具 → 清缓存 → 清除数据缓存，重新编译。

---

## 三、切换到真实后端（3 步）

1. 后端按 `02-后端服务/README.md` 部署完成，拿到 HTTPS 域名，例如 `https://api.example.com`。
2. 修改 `01-小程序端/utils/config.js`：

```js
USE_MOCK: false,
API_BASE: 'https://api.example.com/api'
```

3. 微信公众平台 → 开发管理 → 开发设置 → 服务器域名：
   - request 合法域名：`https://api.example.com`
   - uploadFile 合法域名：`https://api.example.com`

重新编译，登录页输入演示账号 `13800136688 / 123456`（或后端 `app.seed` 打印的账号）。

---

## 四、数据库

- 建库：`CREATE DATABASE daka DEFAULT CHARACTER SET utf8mb4;`
- 建表：`mysql -u用户 -p daka < 02-后端服务/sql/schema.sql`
- 演示数据：`python -m app.seed`

15 张表：`users / companies / jobs / coops / posts / applications / post_applicants / coop_applications / company_applications / messages / resumes / complaints / career_plans / talents / company_certs`。

数据库地址、账号、密码全部通过 `.env` 注入，代码中没有任何硬编码地址，交由部署同学统一填写。

---

## 五、和 demo 的唯一差异（微信规范要求）

demo 是手机外框里的原型，画了「状态栏 9:41 / 灵动岛 / 微信胶囊 / Home 指示条」。真机与开发者工具中这些由系统提供，如果再画一遍会出现两个胶囊、两个状态栏，因此小程序端：

- 保留自定义导航（标题居中、白底、返回箭头），**不再绘制**状态栏、灵动岛、胶囊、Home 条；
- 顶部安全距离用 `wx.getWindowInfo().statusBarHeight` 动态计算，所有页面内容与 demo 的位置关系保持一致；
- 其余尺寸、字号、圆角、间距、颜色、图标、动效均按 demo 的 440 设计稿等比换算为 `rpx`（换算系数 750/440）。

---

## 六、AI 能力（本期不接模型）

按需求「AI 功能暂时不开发，先把 demo 功能放那里」：

- 职业规划页、对话流程、3 轮问答、能力画像卡片、历史记录均已完整实现；
- 结论文案与推荐问题目前是 demo 中的脚本数据，位置在 `01-小程序端/utils/seed.js` 的 `GW_Q / GW_PLAN`，以及 `pages/index/pages.js` 的 `chatStart / chatAsk / chatFinish`；
- 后续接入大模型时，只需把 `chatAnswer()` 里的固定 `ACK` 文案换成后端接口返回，推荐新增 `POST /api/ai/plan`，其余 UI 与数据结构不用动。

---

## 七、验收自测清单（已逐项跑通）

- 登录：个人 / 企业切换、密码 / 验证码切换、协议勾选、微信登录占位
- 个人：7 个分类横滑 + 下划线跟手、职位列表、职位详情 3 个 tab、投递弹层（在线简历 / PDF 简历 / 自荐语）、已投递态
- 搜索：关键词、城市 / 类型 / 经验三个筛选、结果计数、空状态
- 职业规划：玻璃卡、对话逐条打字、选项点击、方案卡、重新评估、历史记录 / 规划详情
- 消息：列表、未读样式、长按删除确认、消息详情、关联内容跳转
- 我的：资料卡、4 个常用功能、上传简历（真实文件选择）、投诉（类型选择 + 列表）
- 发布：3 类（咨询 / 项目 / 私教）分段、表单校验、发布后回到列表
- 企业：4 类合作需求、企业认证 4 步（含校验、验证码倒计时、审核中 / 已认证两态、模拟审核）、发布 5 类、牛人库筛选与主页、收到申请同意 / 拒绝
- 通用：弹层、选择器、对话框、Toast、返回栈、tabbar 隐藏 / 显示

---

## 八、上线前还需要业务方补充

1. 小程序 AppID、AppSecret、服务器 HTTPS 域名与备案
2. 微信「用户隐私保护指引」（手机号、相册、文件用途）
3. 短信验证码服务（当前演示码固定 `123456`）
4. 真实企业资质审核流程（当前后端提供 `模拟审核通过` 接口，仅用于验收）
5. 对象存储（简历 / 营业执照文件；当前存服务器本地 `uploads/`）
