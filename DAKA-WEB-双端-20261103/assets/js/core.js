/* DAKA 原型 · 公共引擎：数据层 / 登录守卫 / 外壳渲染 / 审批引擎
   由 _build.py 从 _assets.JS_CORE 生成，请勿手工修改 */

/* ===================== DAKA 后台原型 · 公共引擎 ===================== */
const DB_KEY = 'daka_admin_db_v2';
const SESSION_KEY = 'daka_admin_session_v2';
const SEED = {"sys_user":[{"user_id":1,"user_type":"enterprise","mobile":"13800000001","password_hash":"User@2026","password_salt":"salt_u_ent_01","nickname":"示例科技有限公司","status":1,"register_source":"demo","created_at":"2026-11-02 10:00:00"},{"user_id":2,"user_type":"personal","mobile":"13800000002","password_hash":"User@2026","password_salt":"salt_u_per_01","nickname":"示例个人开发者","status":1,"register_source":"demo","created_at":"2026-11-02 10:00:00"},{"user_id":3,"user_type":"enterprise","mobile":"13800000004","password_hash":"User@2026","nickname":"云启科技有限公司","status":1,"register_source":"app","created_at":"2026-11-02 10:00:00"},{"user_id":4,"user_type":"personal","mobile":"13800000005","password_hash":"User@2026","nickname":"李明（前端开发）","status":0,"register_source":"wechat","created_at":"2026-11-02 10:00:00"}],"user_personal_profile":[{"profile_id":1,"user_id":2,"real_name":"示例个人开发者","id_card_no_mask":"110101********1234","auth_status":2,"education":"本科","graduate_school":"示例大学","job_title":"前端开发工程师","work_city":"深圳","work_years":5,"self_intro":"Demo 个人用户"},{"profile_id":2,"user_id":4,"real_name":"李明","id_card_no_mask":"440301********5678","auth_status":1,"education":"本科","job_title":"前端开发工程师","work_city":"广州","work_years":3}],"user_enterprise_profile":[{"profile_id":1,"user_id":1,"enterprise_name":"示例科技有限公司","credit_code":"91440300MA5EXAMPLE1","legal_person_name":"张三","license_no":"91440300MA5EXAMPLE1","register_address":"广东省深圳市南山区科技园","business_scope":"软件开发、技术服务、技术咨询","industry":"软件和信息技术服务业","employee_scale":"20-99人","contact_name":"李四","contact_mobile":"13800000003","auth_status":2},{"profile_id":2,"user_id":3,"enterprise_name":"云启科技有限公司","credit_code":"91440300MA5CLOUD02","legal_person_name":"王云","register_address":"深圳市福田区","industry":"企业服务","employee_scale":"100-499人","contact_name":"陈经理","contact_mobile":"13800000006","auth_status":1}],"biz_identity_auth_apply":[{"apply_id":1,"user_id":2,"auth_type":"personal_realname","real_name":"示例个人开发者","id_card_no_mask":"110101********1234","status":2,"submit_time":"2026-11-02 10:00:00"},{"apply_id":2,"user_id":1,"auth_type":"enterprise_license","real_name":"张三","enterprise_name":"示例科技有限公司","credit_code":"91440300MA5EXAMPLE1","status":2,"submit_time":"2026-11-02 10:00:00"},{"apply_id":3,"user_id":3,"auth_type":"enterprise_license","real_name":"王云","enterprise_name":"云启科技有限公司","credit_code":"91440300MA5CLOUD02","status":1,"submit_time":"2026-11-02 09:20:00"},{"apply_id":4,"user_id":4,"auth_type":"personal_realname","real_name":"李明","id_card_no_mask":"440301********5678","status":1,"submit_time":"2026-11-02 09:45:00"}],"sys_admin_user":[{"admin_id":1,"admin_account":"admin","password_hash":"admin123","password_salt":"salt_admin_01","real_name":"系统管理员","mobile":"13900000001","status":1,"created_at":"2026-11-02 10:00:00"},{"admin_id":2,"admin_account":"auditor","password_hash":"audit123","real_name":"张审核","mobile":"13900000002","status":1,"created_at":"2026-11-02 10:00:00"},{"admin_id":3,"admin_account":"operator","password_hash":"oper123","real_name":"李运营","mobile":"13900000003","status":1,"created_at":"2026-11-02 10:00:00"}],"sys_admin_user_role":[{"id":1,"admin_id":1,"role_id":1},{"id":2,"admin_id":2,"role_id":2},{"id":3,"admin_id":3,"role_id":3}],"biz_audit_record":[{"audit_id":1,"module":"content","biz_type":"project","biz_id":1,"action":"submit","from_status":"draft","to_status":"pending","applicant_user_id":1,"audit_time":"2026-11-02 10:00:00","audit_remark":"用户提交发布申请"},{"audit_id":2,"module":"content","biz_type":"project","biz_id":1,"action":"approve","from_status":"pending","to_status":"published","applicant_user_id":1,"auditor_admin_id":1,"audit_time":"2026-11-01 15:20:00","audit_remark":"内容合规，审核通过"},{"audit_id":3,"module":"content","biz_type":"job","biz_id":1,"action":"approve","from_status":"pending","to_status":"published","applicant_user_id":1,"auditor_admin_id":2,"audit_time":"2026-11-01 15:35:00","audit_remark":"岗位信息完整，审核通过"},{"audit_id":4,"module":"content","biz_type":"course","biz_id":1,"action":"approve","from_status":"pending","to_status":"published","applicant_user_id":1,"auditor_admin_id":2,"audit_time":"2026-11-01 16:02:00","audit_remark":"课程大纲完整，审核通过"},{"audit_id":5,"module":"identity_auth","biz_type":"identity","biz_id":1,"action":"approve","from_status":"pending","to_status":"published","applicant_user_id":2,"auditor_admin_id":1,"audit_time":"2026-10-31 11:10:00","audit_remark":"认证材料核验通过"},{"audit_id":6,"module":"content","biz_type":"project","biz_id":4,"action":"reject","from_status":"pending","to_status":"rejected","applicant_user_id":2,"auditor_admin_id":2,"audit_time":"2026-11-02 09:05:00","audit_remark":"项目描述不完整，请补充交付标准后重新提交"}],"biz_project":[{"project_id":1,"project_type":"outsourcing","publisher_user_id":1,"publisher_type":"enterprise","title":"【Demo】企业官网重构外包项目","summary":"需要前端+后端一起重构企业官网","work_city":"深圳","remote_allowed":1,"headcount":5,"skill_tags":"Vue,Java,SpringBoot","contact_name":"李四","contact_mobile":"13800000003","fee_mode":"free","fee_amount":0,"publish_status":"published","audit_pass_time":"2026-11-01 15:20:00","view_count":128,"apply_count":3},{"project_id":2,"project_type":"consultation","publisher_user_id":1,"publisher_type":"enterprise","title":"【Demo】制造业数智化诊断咨询","summary":"为期3周的数字化转型诊断","work_city":"广州","contact_name":"李四","fee_mode":"free","publish_status":"published","audit_pass_time":"2026-11-01 15:26:00","view_count":76,"apply_count":1},{"project_id":3,"project_type":"ai_coaching","publisher_user_id":2,"publisher_type":"personal","title":"【Demo】AI编程私教（10课时）","summary":"手把手带你用大模型提效","work_city":"深圳","headcount":10,"skill_tags":"AI,Python,大模型","fee_mode":"free","publish_status":"published","audit_pass_time":"2026-11-01 15:40:00","view_count":210,"apply_count":8},{"project_id":4,"project_type":"outsourcing","publisher_user_id":2,"publisher_type":"personal","title":"【Demo】小程序外包（草稿）","summary":"个人开发者草稿示例","skill_tags":"小程序","fee_mode":"free","publish_status":"draft","view_count":0,"apply_count":0},{"project_id":5,"project_type":"outsourcing","publisher_user_id":3,"publisher_type":"enterprise","title":"供应链管理系统二期开发","summary":"需要 Java 团队驻场开发 3 个月","work_city":"深圳","headcount":8,"skill_tags":"Java,SpringBoot,MySQL","contact_name":"陈经理","fee_mode":"times","fee_amount":4800,"fee_times":10,"fee_unit_desc":"人天","publish_status":"pending","view_count":0,"apply_count":0,"created_at":"2026-11-02 09:40:00"}],"biz_job":[{"job_id":1,"job_type":"recruitment","publisher_user_id":1,"publisher_type":"enterprise","title":"【Demo】高级前端开发工程师","company_name":"示例科技有限公司","job_category":"前端开发","salary_min":20000,"salary_max":35000,"salary_months":13,"headcount":2,"work_city":"深圳","work_address":"南山区科技园","work_mode":"onsite","education_require":"本科","experience_require":"3-5年","skill_tags":"Vue3,TypeScript,Vite","contact_name":"李四","fee_mode":"free","publish_status":"published","audit_pass_time":"2026-11-01 15:35:00","view_count":340,"apply_count":12},{"job_id":2,"job_type":"outsourcing","publisher_user_id":1,"publisher_type":"enterprise","title":"【Demo】Java后端外包（3个月）","company_name":"示例科技有限公司","job_category":"后端开发","salary_min":22000,"salary_max":30000,"salary_months":12,"headcount":2,"work_city":"深圳","work_mode":"hybrid","skill_tags":"Java,SpringBoot,MySQL","fee_mode":"free","publish_status":"published","audit_pass_time":"2026-11-01 15:38:00","view_count":156,"apply_count":5},{"job_id":3,"job_type":"internship","publisher_user_id":1,"publisher_type":"enterprise","title":"【Demo】2027届前端实习生","company_name":"示例科技有限公司","salary_min":8000,"salary_max":12000,"salary_months":12,"headcount":5,"work_city":"深圳","work_mode":"onsite","education_require":"大专","skill_tags":"HTML,CSS,JavaScript","fee_mode":"free","publish_status":"published","audit_pass_time":"2026-11-01 15:42:00","view_count":421,"apply_count":27},{"job_id":4,"job_type":"recruitment","publisher_user_id":3,"publisher_type":"enterprise","title":"AI 产品经理","company_name":"云启科技有限公司","job_category":"产品","salary_min":25000,"salary_max":40000,"salary_months":14,"headcount":1,"work_city":"深圳","work_mode":"hybrid","skill_tags":"AI,产品设计","fee_mode":"free","publish_status":"pending","view_count":0,"apply_count":0,"created_at":"2026-11-02 10:05:00"}],"biz_ai_course":[{"course_id":1,"publisher_user_id":1,"title":"【Demo】AI大模型应用实战训练营","summary":"2天线下实战课，从0到1做出可用的大模型应用","outline":"第1天：LLM基础与Prompt工程\n第2天：RAG与Agent实战","teacher_name":"王老师","teacher_title":"资深AI架构师","course_category":"AI应用开发","level":"进阶","duration_hours":16,"start_date":"2026-12-01","end_date":"2026-12-02","city":"深圳","is_offline":1,"class_limit":30,"enrolled_count":12,"fee_mode":"free","publish_status":"published","audit_pass_time":"2026-11-01 16:02:00","view_count":268,"apply_count":15},{"course_id":2,"publisher_user_id":3,"title":"企业数智化转型领导力研修班","summary":"面向管理层的数字化转型方法论","teacher_name":"赵教授","course_category":"数智化转型","level":"高阶","duration_hours":24,"start_date":"2026-12-15","end_date":"2026-12-17","city":"上海","is_offline":1,"class_limit":40,"enrolled_count":0,"fee_mode":"year","fee_amount":12800,"fee_unit_desc":"期","publish_status":"pending","view_count":0,"apply_count":0,"created_at":"2026-11-02 10:20:00"}],"biz_content_status_log":[{"log_id":1,"module":"project","biz_id":1,"from_status":"draft","to_status":"pending","operator_user_id":1,"remark":"提交发布申请"},{"log_id":2,"module":"project","biz_id":1,"from_status":"pending","to_status":"published","operator_admin_id":1,"remark":"后台审核通过"},{"log_id":3,"module":"job","biz_id":1,"from_status":"pending","to_status":"published","operator_admin_id":2,"remark":"后台审核通过"},{"log_id":4,"module":"course","biz_id":1,"from_status":"pending","to_status":"published","operator_admin_id":2,"remark":"后台审核通过"}],"biz_application":[{"application_id":1,"application_no":"AP20261102000001","apply_type":"project","applicant_user_id":2,"biz_type":"project","biz_id":1,"biz_title_snapshot":"【Demo】企业官网重构外包项目","publisher_user_id":1,"applicant_type":"personal","status":"accepted","apply_note":"希望承接前端部分，可远程","expect_fee_mode":"free","expect_fee_amount":0,"is_paid":1},{"application_id":2,"application_no":"AP20261102000002","apply_type":"job","applicant_user_id":2,"biz_type":"job","biz_id":1,"biz_title_snapshot":"【Demo】高级前端开发工程师","publisher_user_id":1,"applicant_type":"personal","status":"submitted","apply_note":"简历已投递，期待沟通","expect_fee_mode":"free","expect_fee_amount":0,"is_paid":1},{"application_id":3,"application_no":"AP20261102000003","apply_type":"course","applicant_user_id":2,"biz_type":"course","biz_id":1,"biz_title_snapshot":"【Demo】AI大模型应用实战训练营","publisher_user_id":1,"applicant_type":"personal","status":"withdrawn","apply_note":"临时有事，先撤回","withdraw_reason":"时间冲突","expect_fee_mode":"free","expect_fee_amount":0,"is_paid":1}],"biz_message":[{"message_id":1,"application_id":1,"sender_user_id":2,"receiver_user_id":1,"content":"您好，我对贵司的项目很感兴趣，方便聊聊具体需求吗？","msg_type":"text","is_read":1,"read_time":"2026-11-02 09:12:00"},{"message_id":2,"application_id":1,"sender_user_id":1,"receiver_user_id":2,"content":"可以的，我们约个时间详细沟通一下需求。","msg_type":"text","is_read":0}],"biz_order":[{"order_id":1,"order_no":"OD20261101000001","application_id":1,"payer_user_id":2,"payee_user_id":1,"biz_type":"project","biz_id":1,"fee_mode":"free","fee_amount":0,"is_free":1,"free_reason":"默认不收费","pay_status":"paid","pay_channel":"manual","pay_time":"2026-11-01 16:10:00"},{"order_id":2,"order_no":"OD20261102000001","payer_user_id":4,"payee_user_id":3,"biz_type":"project","biz_id":5,"fee_mode":"times","fee_amount":4800,"times_count":10,"is_free":0,"pay_status":"unpaid"},{"order_id":3,"order_no":"OD20261102000002","payer_user_id":2,"payee_user_id":3,"biz_type":"course","biz_id":2,"fee_mode":"year","fee_amount":12800,"is_free":0,"pay_status":"paid","pay_channel":"wechat","pay_time":"2026-11-02 09:30:00"}],"biz_fee_rule":[{"rule_id":1,"rule_name":"项目默认免费（企业）","subject_scope":"enterprise","biz_type":"project","fee_mode":"free","fee_amount":0,"is_enabled":1,"priority":100,"remark":"业务规则11：默认情况下不收费","created_by_admin_id":1},{"rule_id":2,"rule_name":"项目默认免费（个人）","subject_scope":"personal","biz_type":"project","fee_mode":"free","fee_amount":0,"is_enabled":1,"priority":100,"remark":"业务规则11：默认情况下不收费","created_by_admin_id":1},{"rule_id":3,"rule_name":"AI培训默认免费（企业）","subject_scope":"enterprise","biz_type":"course","fee_mode":"free","fee_amount":0,"is_enabled":1,"priority":100,"remark":"业务规则11：默认情况下不收费","created_by_admin_id":1},{"rule_id":4,"rule_name":"AI培训按年收费（企业）","subject_scope":"enterprise","biz_type":"course","fee_mode":"year","fee_amount":12800,"fee_unit_desc":"期","is_enabled":0,"priority":10,"remark":"备用规则：需要时启用","created_by_admin_id":3}],"biz_fee_free_target":[{"id":1,"user_id":2,"subject_type":"personal","biz_type":"project","is_free":1,"discount_rate":100,"effective_from":"2026-01-01","effective_to":"2026-12-31","reason":"平台优质个人开发者，全年免收费","created_by_admin_id":1},{"id":2,"user_id":3,"subject_type":"enterprise","biz_type":"course","is_free":0,"discount_rate":80,"effective_from":"2026-11-01","effective_to":"2027-11-01","reason":"战略合作企业，课程八折","created_by_admin_id":3}],"biz_project_fee":[{"fee_id":1,"project_id":1,"fee_mode":"free","fee_amount":0,"is_default":1},{"fee_id":2,"project_id":2,"fee_mode":"free","fee_amount":0,"is_default":1},{"fee_id":3,"project_id":3,"fee_mode":"free","fee_amount":0,"is_default":1},{"fee_id":4,"project_id":5,"fee_mode":"times","fee_amount":4800,"times_count":10,"fee_unit_desc":"人天","is_default":1},{"fee_id":5,"project_id":5,"fee_mode":"month","fee_amount":68000,"fee_unit_desc":"月","is_default":0}],"biz_course_fee":[{"fee_id":1,"course_id":1,"fee_mode":"free","fee_amount":0,"is_default":1},{"fee_id":2,"course_id":2,"fee_mode":"year","fee_amount":12800,"fee_unit_desc":"期","is_default":1},{"fee_id":3,"course_id":2,"fee_mode":"times","fee_amount":1680,"times_count":8,"fee_unit_desc":"课时","is_default":0}],"sys_menu":[{"menu_id":1,"end_type":"enterprise","menu_code":"ent_home","menu_name":"首页","route_path":"/ent/home","sort_no":1,"is_visible":1,"need_audit":0},{"menu_id":2,"end_type":"enterprise","menu_code":"ent_project","menu_name":"项目大厅","route_path":"/ent/project","sort_no":2,"is_visible":1,"need_audit":1},{"menu_id":3,"end_type":"enterprise","menu_code":"ent_job","menu_name":"岗位大厅","route_path":"/ent/job","sort_no":3,"is_visible":1,"need_audit":1},{"menu_id":4,"end_type":"enterprise","menu_code":"ent_course","menu_name":"AI培训","route_path":"/ent/course","sort_no":4,"is_visible":1,"allow_publish":1,"need_audit":1},{"menu_id":5,"end_type":"enterprise","menu_code":"ent_publish","menu_name":"发布中心","route_path":"/ent/publish","sort_no":5,"is_visible":1,"need_realname":1,"need_enterprise_auth":1,"allow_publish":1,"need_audit":1},{"menu_id":6,"end_type":"personal","menu_code":"per_home","menu_name":"首页","route_path":"/per/home","sort_no":1,"is_visible":1,"need_audit":0},{"menu_id":7,"end_type":"personal","menu_code":"per_project","menu_name":"项目大厅","route_path":"/per/project","sort_no":2,"is_visible":1,"need_audit":1},{"menu_id":8,"end_type":"personal","menu_code":"per_publish","menu_name":"发布中心","route_path":"/per/publish","sort_no":4,"is_visible":1,"need_realname":1,"allow_publish":1,"need_audit":1},{"menu_id":9,"end_type":"personal","menu_code":"per_ai_coach","menu_name":"AI私教","route_path":"/per/coach","sort_no":8,"is_visible":1,"allow_publish":1,"need_audit":1}],"sys_menu_action":[{"action_id":1,"menu_id":5,"action_code":"publish_project","action_name":"发布外包项目","need_realname":1,"need_enterprise_auth":1,"sort_no":1},{"action_id":2,"menu_id":5,"action_code":"publish_consultation","action_name":"发布数智化咨询","need_realname":1,"need_enterprise_auth":1,"sort_no":2},{"action_id":3,"menu_id":5,"action_code":"publish_job","action_name":"发布岗位","need_realname":1,"need_enterprise_auth":1,"sort_no":3},{"action_id":4,"menu_id":4,"action_code":"publish_course","action_name":"发布AI培训","need_realname":1,"need_enterprise_auth":1,"sort_no":1},{"action_id":5,"menu_id":2,"action_code":"apply_project","action_name":"申请项目","sort_no":1},{"action_id":6,"menu_id":3,"action_code":"apply_job","action_name":"申请岗位","sort_no":1},{"action_id":7,"menu_id":8,"action_code":"publish_ai_coaching","action_name":"发布AI私教","need_realname":1,"sort_no":2}],"sys_status_config":[{"status_id":1,"biz_type":"project","status_code":"draft","status_name":"草稿","status_desc":"仅发布者自己可见","is_default":1,"is_visible":0,"can_publish":1,"sort_no":1},{"status_id":2,"biz_type":"project","status_code":"pending","status_name":"待审核","status_desc":"已提交，等待后台审批","sort_no":2},{"status_id":3,"biz_type":"project","status_code":"published","status_name":"已发布","status_desc":"审批通过，企业与个人均可见","is_visible":1,"can_publish":1,"can_apply":1,"sort_no":3},{"status_id":4,"biz_type":"project","status_code":"rejected","status_name":"已驳回","status_desc":"审批未通过，可修改重新提交","sort_no":4},{"status_id":5,"biz_type":"job","status_code":"draft","status_name":"草稿","status_desc":"仅发布者自己可见","is_default":1,"can_publish":1,"sort_no":1},{"status_id":6,"biz_type":"job","status_code":"published","status_name":"已发布","status_desc":"审批通过，双方均可见","is_visible":1,"can_publish":1,"can_apply":1,"sort_no":3},{"status_id":7,"biz_type":"course","status_code":"draft","status_name":"草稿","status_desc":"仅发布企业可见","is_default":1,"can_publish":1,"sort_no":1},{"status_id":8,"biz_type":"course","status_code":"published","status_name":"已发布","status_desc":"审批通过，双方均可见","is_visible":1,"can_publish":1,"can_apply":1,"sort_no":3}],"sys_role":[{"role_id":1,"role_code":"super_admin","role_name":"超级管理员","end_type":"all","remark":"拥有全部后台菜单与操作权限","status":1},{"role_id":2,"role_code":"auditor","role_name":"内容审核员","end_type":"all","remark":"负责项目/岗位/课程/认证审批","status":1},{"role_id":3,"role_code":"operator","role_name":"运营管理员","end_type":"all","remark":"负责菜单可见性、收费标准、状态配置","status":1}],"sys_role_menu":[{"id":1,"role_id":1,"menu_id":1},{"id":2,"role_id":1,"menu_id":2},{"id":3,"role_id":1,"menu_id":3},{"id":4,"role_id":2,"menu_id":2},{"id":5,"role_id":2,"menu_id":3},{"id":6,"role_id":3,"menu_id":5}],"sys_config":[{"config_id":1,"config_key":"default_fee_charged","config_value":"0","config_name":"默认是否收费","config_group":"fee","value_type":"bool","remark":"0=不收费 1=收费（业务规则11：默认不收费）"},{"config_id":2,"config_key":"default_need_audit","config_value":"1","config_name":"发布是否需后台审批","config_group":"audit","value_type":"bool","remark":"1=需要审批 0=免审批（业务规则4/5）"},{"config_id":3,"config_key":"allow_apply_to_others","config_value":"1","config_name":"是否允许申请他人内容","config_group":"apply","value_type":"bool","remark":"1=允许 0=禁止（业务规则6）"},{"config_id":4,"config_key":"allow_withdraw_apply","config_value":"1","config_name":"申请是否允许撤回","config_group":"apply","value_type":"bool","remark":"1=允许撤回 0=不允许"},{"config_id":5,"config_key":"personal_apply_fee_mode","config_value":"times","config_name":"个人申请项目计费方式","config_group":"fee","value_type":"string","remark":"times=按次数 year=按年 month=按月"},{"config_id":6,"config_key":"enterprise_publish_fee_mode","config_value":"times","config_name":"企业发布项目计费方式","config_group":"fee","value_type":"string","remark":"times=按次数 year=按年 month=按月"},{"config_id":7,"config_key":"default_password","config_value":"User@2026","config_name":"新用户初始密码","config_group":"common","value_type":"string","remark":"用户首次登录后强制修改"}],"sys_login_log":[{"log_id":1,"user_id":1,"login_type":"scan","login_result":1,"client_ip":"127.0.0.1","user_agent":"Demo/1.0 (企业端)"},{"log_id":2,"user_id":2,"login_type":"sms_code","login_result":1,"client_ip":"127.0.0.1","user_agent":"Demo/1.0 (个人端)"},{"log_id":3,"login_type":"password","login_result":0,"fail_reason":"密码错误","client_ip":"10.0.0.8","user_agent":"Chrome/120"}],"sys_dict_type":[{"dict_type_id":1,"dict_type_code":"project_type","dict_type_name":"项目类型","remark":"业务规则1：外包项目/数智化咨询/AI私教 三选一"},{"dict_type_id":2,"dict_type_code":"job_type","dict_type_name":"岗位类型","remark":"业务规则2：岗位招聘/岗位外包/实习 三选一"},{"dict_type_id":3,"dict_type_code":"publish_status","dict_type_name":"内容发布状态","remark":"草稿/待审核/已发布/已驳回/已下架/已结束"},{"dict_type_id":4,"dict_type_code":"application_status","dict_type_name":"申请状态","remark":"已提交/已通过/已拒绝/已撤回/已取消"},{"dict_type_id":5,"dict_type_code":"fee_mode","dict_type_name":"计费方式","remark":"免费/按次数/按年/按月"},{"dict_type_id":6,"dict_type_code":"auth_type","dict_type_name":"认证类型","remark":"个人实名/营业执照"},{"dict_type_id":7,"dict_type_code":"pay_status","dict_type_name":"订单支付状态","remark":"未支付/已支付/已退款/已关闭"}],"sys_dict_item":[{"dict_item_id":1,"dict_type_id":1,"item_code":"outsourcing","item_name":"外包项目","sort_no":1,"remark":"企业与个人均可发布"},{"dict_item_id":2,"dict_type_id":1,"item_code":"consultation","item_name":"数智化咨询","sort_no":2,"remark":"企业端发布"},{"dict_item_id":3,"dict_type_id":1,"item_code":"ai_coaching","item_name":"AI私教","sort_no":3,"remark":"个人端发布"},{"dict_item_id":4,"dict_type_id":2,"item_code":"recruitment","item_name":"岗位招聘","sort_no":1},{"dict_item_id":5,"dict_type_id":2,"item_code":"outsourcing","item_name":"岗位外包","sort_no":2},{"dict_item_id":6,"dict_type_id":2,"item_code":"internship","item_name":"实习","sort_no":3},{"dict_item_id":7,"dict_type_id":3,"item_code":"draft","item_name":"草稿","sort_no":1,"is_default":1,"remark":"仅自己可见"},{"dict_item_id":8,"dict_type_id":3,"item_code":"pending","item_name":"待审核","sort_no":2},{"dict_item_id":9,"dict_type_id":3,"item_code":"published","item_name":"已发布","sort_no":3,"remark":"审批通过，他人可见可申请"},{"dict_item_id":10,"dict_type_id":5,"item_code":"free","item_name":"免费","sort_no":1,"is_default":1,"remark":"默认不收费"},{"dict_item_id":11,"dict_type_id":5,"item_code":"times","item_name":"按次数","sort_no":2},{"dict_item_id":12,"dict_type_id":5,"item_code":"year","item_name":"按年","sort_no":3},{"dict_item_id":13,"dict_type_id":5,"item_code":"month","item_name":"按月","sort_no":4}]};
const NAV = [["总览",[["home.html","后台首页","数据概览与快捷入口"],["audit.html","内容发布审批","审批工作台 · 通过 / 驳回 / 下架"]]],["用户与认证域",[["sys_user.html","用户账号","sys_user"],["user_personal_profile.html","个人档案","user_personal_profile"],["user_enterprise_profile.html","企业档案","user_enterprise_profile"],["biz_identity_auth_apply.html","实名认证申请","biz_identity_auth_apply"],["sys_admin_user.html","后台账户","sys_admin_user"],["sys_admin_user_role.html","后台人员角色","sys_admin_user_role"],["biz_audit_record.html","审批流水","biz_audit_record"]]],["内容域",[["biz_project.html","项目管理","biz_project"],["biz_job.html","岗位管理","biz_job"],["biz_ai_course.html","AI培训课程","biz_ai_course"],["biz_content_status_log.html","内容状态日志","biz_content_status_log"]]],["申请与沟通域",[["biz_application.html","申请单管理","biz_application"],["biz_message.html","沟通消息","biz_message"]]],["收费域",[["biz_order.html","收费订单","biz_order"],["biz_fee_rule.html","收费标准规则","biz_fee_rule"],["biz_fee_free_target.html","免收费对象","biz_fee_free_target"],["biz_project_fee.html","项目收费明细","biz_project_fee"],["biz_course_fee.html","课程收费明细","biz_course_fee"]]],["后台配置域",[["sys_menu.html","菜单配置","sys_menu"],["sys_menu_action.html","菜单动作配置","sys_menu_action"],["sys_status_config.html","状态配置","sys_status_config"],["sys_role.html","角色管理","sys_role"],["sys_role_menu.html","角色菜单关联","sys_role_menu"],["sys_config.html","全局参数配置","sys_config"],["sys_login_log.html","登录日志","sys_login_log"]]],["字典域",[["sys_dict_type.html","字典类型","sys_dict_type"],["sys_dict_item.html","字典项","sys_dict_item"]]]];
/* 页面按 personal / enterprise / admin / shared 分目录存放，
   链接需按当前页面所在目录换算相对路径（SELF_DIR 由当前 URL 自动推断） */
const PAGE_DIR = {"home.html":"admin","login.html":"admin","index.html":"admin","sys_user.html":"admin","sys_admin_user.html":"admin","sys_admin_user_role.html":"admin","sys_menu.html":"admin","sys_menu_action.html":"admin","sys_status_config.html":"admin","sys_role.html":"admin","sys_role_menu.html":"admin","sys_config.html":"admin","sys_login_log.html":"admin","sys_dict_type.html":"admin","sys_dict_item.html":"admin","user_personal_profile.html":"admin","biz_application.html":"admin","biz_message.html":"admin","user_enterprise_profile.html":"admin","biz_project.html":"admin","biz_job.html":"admin","biz_ai_course.html":"admin","biz_content_status_log.html":"admin","audit.html":"admin","biz_identity_auth_apply.html":"admin","biz_audit_record.html":"admin","biz_order.html":"admin","biz_fee_rule.html":"admin","biz_fee_free_target.html":"admin","biz_project_fee.html":"admin","biz_course_fee.html":"admin"};
const SELF_DIR = (function(){
  try{
    const seg = String(location.pathname || '').replace(/\\/g, '/').split('/').filter(Boolean);
    if(seg.length >= 2) return decodeURIComponent(seg[seg.length - 2]);
  }catch(e){}
  return '';
})();
function pageHref(f){
  const d = PAGE_DIR[f] || SELF_DIR;
  return (d === SELF_DIR || !d) ? f : ('../' + d + '/' + f);
}
/* 静态资源路径：页面均在 demo/<分类目录>/ 下，资源统一在 ../assets/ */
function assetPath(p){ return '../assets/' + p; }
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const pad = (n) => String(n).padStart(2,'0');
function nowStr(){
  const d = new Date();
  return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+
    pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
}
let _toastTimer = null;
function toast(msg, type){
  const t = $('toast'); if(!t) return;
  t.textContent = msg; t.className = 'toast show' + (type ? ' '+type : '');
  clearTimeout(_toastTimer); _toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}

/* ---------- 数据层（localStorage 模拟数据库，所有页面共享） ---------- */
function loadDB(){
  let raw = null;
  try{ raw = localStorage.getItem(DB_KEY); }catch(e){}
  if(raw){ try{ const db = JSON.parse(raw); if(db && db.tables) return db; }catch(e){} }
  const db = { tables: JSON.parse(JSON.stringify(SEED)), created_at: nowStr() };
  saveDB(db); return db;
}
function saveDB(db){ try{ localStorage.setItem(DB_KEY, JSON.stringify(db)); }catch(e){ toast('本地存储写入失败','err'); } }
function rows(name){ const db = loadDB(); return db.tables[name] || []; }
function resetDB(){
  const db = { tables: JSON.parse(JSON.stringify(SEED)), created_at: nowStr() };
  saveDB(db); return db;
}
function nextIdIn(db, table, pk){
  const a = db.tables[table] || [];
  let m = 0; a.forEach(r=>{ const v = Number(r[pk]); if(!isNaN(v) && v > m) m = v; });
  return m + 1;
}
function writeRow(name, pk, row, isNew){
  const db = loadDB();
  if(!db.tables[name]) db.tables[name] = [];
  if(isNew){ db.tables[name].push(row); }
  else{
    const i = db.tables[name].findIndex(r => String(r[pk]) === String(row[pk]));
    if(i < 0) return false;
    db.tables[name][i] = row;
  }
  saveDB(db); return true;
}
function physicalDelete(name, pk, pkVal){
  const db = loadDB();
  const arr = db.tables[name] || [];
  const i = arr.findIndex(r => String(r[pk]) === String(pkVal));
  if(i < 0) return false;
  arr.splice(i, 1);           /* 物理删除：直接从数组移除，非逻辑删除标记 */
  saveDB(db); return true;
}

/* ---------- 会话 / 登录守卫 ---------- */
function getSession(){
  try{ return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }catch(e){ return null; }
}
function setSession(s){ localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function guard(activeFile){
  const s = getSession();
  if(!s || !s.admin_account){ location.href = pageHref('login.html'); return null; }
  renderShell(activeFile, s);
  return s;
}
function logout(){ localStorage.removeItem(SESSION_KEY); location.href = pageHref('login.html'); }
function currentAdmin(){
  const s = getSession() || {};
  const u = rows('sys_admin_user').find(x => String(x.admin_id) === String(s.admin_id));
  return { id: Number(s.admin_id || 1), account: s.admin_account || 'admin',
           name: (u && u.real_name) || s.real_name || '系统管理员' };
}

/* ---------- 外壳：侧边栏 + 顶栏 ---------- */
function renderShell(activeFile, s){
  const nav = $('sidebar');
  if(nav){
    let h = '<div class="logo"><div class="logo-mark">大咖</div>'+
      '<div class="logo-text">DAKA · 管理后台<span>ADMIN CONSOLE</span></div></div><nav class="nav">';
    NAV.forEach(g=>{
      h += '<div class="nav-group">'+esc(g[0])+'</div>';
      g[1].forEach(it=>{
        h += '<a class="nav-item'+(it[0]===activeFile?' active':'')+'" href="'+pageHref(it[0])+'">'+
             '<span class="ni-ico">▦</span><span>'+esc(it[1])+'</span></a>';
      });
    });
    h += '</nav><div class="nav-foot"><div class="nav-item" onclick="logout()">'+
         '<span class="ni-ico">↪</span><span>退出登录</span></div></div>';
    nav.innerHTML = h;
  }
  const tb = $('topbar');
  if(tb){
    const g = NAV.find(g=>g[1].some(it=>it[0]===activeFile));
    const item = g ? g[1].find(it=>it[0]===activeFile) : null;
    tb.innerHTML = '<div class="crumb"><span>DAKA 后台</span><span class="sep">/</span>'+
      '<b>'+esc(g?g[0]:'总览')+'</b><span class="sep">/</span><b>'+esc(item?item[1]:'控制台')+'</b></div>'+
      '<div class="spacer"></div>'+
      '<span class="top-chip"><span class="dot"></span>已登录 · 管理后台</span>'+
      '<button class="btn btn-sm btn-ghost" onclick="resetAll()">重置演示数据</button>'+
      '<div class="profile" onclick="logout()" title="点击退出登录">'+
      '<span class="avatar">'+esc((s.real_name||'管').slice(0,1))+'</span>'+
      '<span class="p-info"><span class="p-name">'+esc(s.real_name||'系统管理员')+'</span>'+
      '<span class="p-role">'+esc(s.admin_account||'admin')+' · 超级管理员</span></span></div>';
  }
}
function resetAll(){
  openConfirm({ title:'重置演示数据', danger:false,
    body:'<div class="info-box">将清空当前所有增删改与审批操作，恢复为 27 张表的初始演示数据。此操作不影响登录状态。</div>',
    okText:'确认重置', onOk:()=>{ resetDB(); toast('演示数据已重置','ok'); setTimeout(()=>location.reload(), 500); } });
}

/* ---------- 通用弹窗 ---------- */
function openModal(opts){
  const mask = $('mask');
  mask.innerHTML = '<div class="modal '+(opts.size||'')+'" onclick="event.stopPropagation()">'+
    '<div class="m-head"><h3>'+esc(opts.title)+(opts.sub?'<span class="m-sub">'+esc(opts.sub)+'</span>':'')+'</h3>'+
    '<button class="m-close" onclick="closeModal()">×</button></div>'+
    '<div class="m-body">'+opts.body+'</div>'+
    '<div class="m-foot">'+(opts.footer||'<button class="btn" onclick="closeModal()">关闭</button>')+'</div></div>';
  mask.classList.remove('hidden');
  mask.onclick = ()=>closeModal();
}
function closeModal(){ $('mask').classList.add('hidden'); $('mask').innerHTML=''; }
let _confirmCb = null;
function openConfirm(opts){
  _confirmCb = opts.onOk || null;
  openModal({ size:'sm', title: opts.title || '操作确认',
    body: opts.body || '',
    footer:'<button class="btn" onclick="closeModal()">取消</button>'+
      '<button class="btn '+(opts.danger===false?'btn-primary':'btn-danger')+'" onclick="confirmOk()">'+esc(opts.okText||'确认')+'</button>' });
}
function confirmOk(){ const cb=_confirmCb; _confirmCb=null; closeModal(); if(cb) cb(); }

/* ---------- 枚举 / 徽章 ---------- */
function optLabel(field, val){
  if(!field.options) return val;
  const hit = field.options.find(o => String(o[0]) === String(val));
  return hit ? hit[1] : (val == null || val === '' ? '—' : val);
}
function badgeFor(field, val){
  const label = optLabel(field, val);
  if(!field.options) return esc(label);
  const colors = { green:'b-green', blue:'b-blue', amber:'b-amber', red:'b-red', gray:'b-gray' };
  let c = 'b-gray';
  const map = field.badge || {};
  if(map[String(val)]) c = colors[map[String(val)]] || 'b-gray';
  else if(['1','2','published','approve','paid','accepted'].includes(String(val))) c = 'b-green';
  else if(['0','pending','submit'].includes(String(val))) c = 'b-amber';
  else if(['rejected','reject','3'].includes(String(val))) c = 'b-red';
  return '<span class="badge '+c+'">'+esc(label)+'</span>';
}

/* ---------- 审批引擎：更新业务状态 + 审批留痕 + 状态日志 ---------- */
const AUDIT_TABLES = { project:{t:'biz_project',pk:'project_id'}, job:{t:'biz_job',pk:'job_id'}, course:{t:'biz_ai_course',pk:'course_id'} };
function doAudit(module, bizType, bizId, action, remark){
  const db = loadDB();
  const admin = currentAdmin();
  const t = nowStr();
  let from='', to='', applicant=null, title='';
  if(module === 'content'){
    const cfg = AUDIT_TABLES[bizType];
    if(!cfg) return {ok:false, msg:'未知内容类型'};
    const arr = db.tables[cfg.t] || [];
    const row = arr.find(r => String(r[cfg.pk]) === String(bizId));
    if(!row) return {ok:false, msg:'业务对象不存在（可能已被物理删除）'};
    from = row.publish_status; applicant = row.publisher_user_id;
    title = row.title;
    if(action === 'approve'){ to='published'; row.publish_status='published'; row.audit_pass_time=t; }
    else if(action === 'reject'){ to='rejected'; row.publish_status='rejected'; }
    else if(action === 'offline'){ to='offline'; row.publish_status='offline'; }
    else if(action === 'reopen'){ to='published'; row.publish_status='published'; row.audit_pass_time=t; }
    else if(action === 'submit'){ to='pending'; row.publish_status='pending'; }
    row.updated_at = t;
    db.tables.biz_content_status_log.push({
      log_id: nextIdIn(db,'biz_content_status_log','log_id'), module: bizType, biz_id: Number(bizId),
      from_status: from, to_status: to, operator_admin_id: admin.id,
      remark: remark || ('后台' + ({submit:'提交审核',approve:'审核通过',reject:'审核驳回',offline:'下架',reopen:'重新开放'}[action]||action)),
      created_at: t });
  } else if(module === 'identity_auth'){
    const arr = db.tables.biz_identity_auth_apply || [];
    const row = arr.find(r => String(r.apply_id) === String(bizId));
    if(!row) return {ok:false, msg:'认证申请不存在'};
    from = String(row.status); applicant = row.user_id;
    title = row.enterprise_name || row.real_name || ('认证申请#'+bizId);
    to = action === 'approve' ? '2' : '3';
    row.status = Number(to); row.updated_at = t;
    if(action === 'approve'){
      const pfTable = row.auth_type === 'enterprise_license' ? 'user_enterprise_profile' : 'user_personal_profile';
      const p = (db.tables[pfTable]||[]).find(x => String(x.user_id) === String(row.user_id));
      if(p){ p.auth_status = 2; p.updated_at = t; }
    }
  } else {
    return {ok:false, msg:'暂不支持该审批模块'};
  }
  /* 审批流水：审批人 + 审批时间必填 */
  db.tables.biz_audit_record.push({
    audit_id: nextIdIn(db,'biz_audit_record','audit_id'),
    module: module, biz_type: module === 'identity_auth' ? 'identity' : bizType,
    biz_id: Number(bizId), action: action, from_status: from, to_status: to,
    applicant_user_id: applicant == null ? null : Number(applicant),
    auditor_admin_id: admin.id, audit_time: t, audit_remark: remark || '', created_at: t });
  saveDB(db);
  return {ok:true, to:to, title:title, auditor:admin.name, time:t};
}
function openAuditDialog(o){
  const admin = currentAdmin();
  const actionName = {submit:'提交审核', approve:'审核通过', reject:'审核驳回', offline:'下架', reopen:'重新开放'}[o.action] || o.action;
  const needReason = o.action === 'reject';
  const body =
    '<div class="info-box"><b>审批对象：</b>'+esc(o.title||(o.bizType+' #'+o.bizId))+'<br>'+
    '<b>业务类型：</b>'+esc(o.bizName||o.bizType)+'　<b>当前状态：</b>'+esc(o.from||'—')+'<br>'+
    '<b>审批动作：</b><span class="badge '+(o.action==='approve'?'b-green':o.action==='reject'?'b-red':'b-amber')+'">'+esc(actionName)+'</span></div>'+
    '<div class="kv"><span class="k">审批人</span><span>'+esc(admin.name)+'（'+esc(admin.account)+' · ID '+admin.id+'）</span></div>'+
    '<div class="kv"><span class="k">审批时间</span><span>'+esc(nowStr())+'（提交时自动记录）</span></div>'+
    '<div class="fi" style="margin-top:12px"><label>审批意见 / 驳回原因'+(needReason?'<span class="req">*</span>':'')+'</label>'+
    '<textarea id="auditRemark" placeholder="'+(needReason?'请填写驳回原因（必填）':'可填写审批意见，选填')+'"></textarea>'+
    '<span class="hint">审批结果将写入 biz_audit_record，同时记录审批人与审批时间；内容状态流转写入 biz_content_status_log。</span></div>';
  openModal({ size:'sm', title:'内容 / 认证审批', sub:actionName, body:body,
    footer:'<button class="btn" onclick="closeModal()">取消</button>'+
      '<button class="btn '+(o.action==='approve'?'btn-primary':'btn-danger')+'" onclick="submitAudit()">确认'+esc(actionName)+'</button>' });
  window._auditPending = o;
}
function submitAudit(){
  const o = window._auditPending; if(!o) return;
  const remark = ($('auditRemark') ? $('auditRemark').value : '').trim();
  if(o.action === 'reject' && !remark){ toast('驳回必须填写驳回原因','err'); return; }
  const r = doAudit(o.module, o.bizType, o.bizId, o.action, remark);
  if(!r.ok){ toast(r.msg,'err'); return; }
  closeModal(); window._auditPending = null;
  toast('审批完成：'+r.auditor+' 于 '+r.time+' 执行'+
    ({submit:'提交审核',approve:'通过',reject:'驳回',offline:'下架',reopen:'重新开放'}[o.action]||'操作'),'ok');
  if(o.onDone) o.onDone(); else setTimeout(()=>location.reload(), 600);
}
