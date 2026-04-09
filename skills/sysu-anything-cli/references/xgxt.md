# XGXT / 勤工助学 / 长假离返校

`xgxt` 对应：

- `https://xgxt.sysu.edu.cn/qgzx-mobile/`
- `https://xgxt.sysu.edu.cn/jjrlfx/mobile/#/student?blxn=2025-2026`
- 当前已封装的是勤工助学岗位相关能力，以及长假离返校任务 / 登记能力

## 当前结论

- 现有 `session.json` 可以让 `qgzx-mobile` 静态页面直接打开
- 但这还不等于 API 已登录
- `node dist/cli.js xgxt current-user` 现在会优先复用已有 `xgxt-auth.json`
- 如果本地只有 CAS 会话，没有 xgxt token，CLI 会自动走“CAS 票据 -> /sso/login -> accessToken”补齐 `xgxt-auth.json`
- 如果本地 `xgxt-auth.json` 已过期，但 `session.json` 还有效，CLI 会自动回 CAS 刷新并重试
- `tryLoginUserInfo` 对当前站点不是稳定前置；实际可用的是根站 `POST /sso/login?realm=sysuRealm&ticket=...&service=https://xgxt.sysu.edu.cn/`

## 恢复路径

```bash
node dist/cli.js xgxt probe --wechat-ua
node dist/cli.js xgxt auth-url
node dist/cli.js xgxt replay-callback --url "<最终回跳URL>"
node dist/cli.js xgxt current-user
```

说明：

- `probe --wechat-ua`
  - 看当前是直接进页面、跳 appgw，还是跳企业微信 OAuth
- `auth-url`
  - 生成企业微信打开用的授权链接
  - 当前实现会在必要时自动退回到“干净探测”拿链接
- `replay-callback`
  - 支持两种 URL
  - `https://xgxt.sysu.edu.cn/qgzx-mobile/?ysdata=...&code=...&state=...#/`
  - `https://appgw.sysu.edu.cn/sso/oauth2?r=...&code=...`
- `current-user`
  - 成功后会把结果写到 `xgxt-auth.json`
  - 现在会优先尝试自动从现有 CAS 会话补票据并恢复 xgxt token

## 已封装命令

```bash
node dist/cli.js xgxt probe
node dist/cli.js xgxt auth-url
node dist/cli.js xgxt replay-callback --help
node dist/cli.js xgxt current-user
node dist/cli.js xgxt workstudy filters
node dist/cli.js xgxt workstudy list
node dist/cli.js xgxt workstudy detail --id "<qgzxgwId>"
node dist/cli.js xgxt workstudy resume
node dist/cli.js xgxt workstudy records
node dist/cli.js xgxt workstudy judge --id "<qgzxgwId>" --year "<qgzxnd>"
node dist/cli.js xgxt workstudy apply --help
node dist/cli.js xgxt holiday filters
node dist/cli.js xgxt holiday list
node dist/cli.js xgxt holiday detail --id "<cjlfxgzId>"
node dist/cli.js xgxt holiday apply --help
```

## 岗位列表

```bash
node dist/cli.js xgxt workstudy filters
node dist/cli.js xgxt workstudy list --year "<qgzxnd>"
node dist/cli.js xgxt workstudy detail --id "<qgzxgwId>"
```

可传的筛选：

- `--year`
  - 对应 `qgzxnd`
  - 省略时，`workstudy list` / `workstudy records` 会自动取最新可用学年
- `--campus-ids`
  - 原样透传到 `xqids`
- `--type-ids`
  - 原样透传到 `gwlxids`

## 报名链路

前端已确认的真实顺序：

1. `gwsq/judge`
2. `xsjl/get`
3. `gwsq/insert`
4. `gwsq/report`

CLI 对应：

```bash
node dist/cli.js xgxt workstudy judge --id "<qgzxgwId>" --year "<qgzxnd>"
node dist/cli.js xgxt workstudy apply --id "<qgzxgwId>" --year "<qgzxnd>" --slots-json '[{"gwgzsjId":"123","xsgzkssj":"08:00","xsgzjssj":"11:30","xsgzxq":1}]'
node dist/cli.js xgxt workstudy apply --id "<qgzxgwId>" --year "<qgzxnd>" --slots-json '[{"gwgzsjId":"123","xsgzkssj":"08:00","xsgzjssj":"11:30","xsgzxq":1}]' --confirm
```

注意：

- 默认只预览
- 只有 `--confirm` 才会真的提交
- `--slots-json` 直接对应前端的 `xsgrkqgzxsj`
- 如果没有 `qgzxxsjlId`，通常说明还没简历，真实提交会被阻塞

## 长假离返校

对应入口：

- `https://xgxt.sysu.edu.cn/jjrlfx/mobile/#/student?blxn=2025-2026`

当前已确认的接口：

- `GET /api/sm-jjrlfx/student/school-year`
- `GET /api/sm-jjrlfx/student/work-list?blxn=<schoolYear>`
- `GET /api/sm-jjrlfx/student/{cjlfxgzId}/info`
- `GET /api/sm-jjrlfx/student/destination-type`
- `GET /api/sm-jjrlfx/student/transport`
- `GET /api/sm-jjrlfx/student/country/drop`
- `GET /api/sm-jjrlfx/student/province/drop`
- `GET /api/sm-jjrlfx/student/city/drop?fdm=<省份>`
- `GET /api/sm-jjrlfx/student/district/drop?province=<省份>&city=<城市>`
- `POST /api/sm-jjrlfx/student/register`

已封装命令：

```bash
node dist/cli.js xgxt holiday filters
node dist/cli.js xgxt holiday list --school-year 2025-2026
node dist/cli.js xgxt holiday detail --id "<cjlfxgzId>"
node dist/cli.js xgxt holiday cities --province 广东省
node dist/cli.js xgxt holiday districts --province 广东省 --city 广州市
node dist/cli.js xgxt holiday apply --id "<cjlfxgzId>"
```

说明：

- `xgxt holiday list` 省略 `--school-year` 时，会自动取最新办理学年
- `xgxt holiday detail` 能拿到当前账号已登记的完整表单
- `xgxt holiday apply` 会先读详情，尽量沿用已有字段
- 模式映射固定为：

```text
1 -> 留校
0 -> 离校
```

常用示例：

```bash
node dist/cli.js xgxt holiday filters
node dist/cli.js xgxt holiday list
node dist/cli.js xgxt holiday detail --id "<cjlfxgzId>"
node dist/cli.js xgxt holiday apply --id "<cjlfxgzId>"
node dist/cli.js xgxt holiday apply --id "<cjlfxgzId>" --mode 留校 --current-campus 珠海校区 --stay-reason 科研 --holiday-campus 珠海校区 --holiday-address "珠海校区-荔园18号-6层-618-618-04"
node dist/cli.js xgxt holiday apply --id "<cjlfxgzId>" --mode 离校 --current-campus 珠海校区 --leave-date 2026-04-04 --return-date 2026-04-06 --destination-type 回家 --transport 火车 --country 中国 --province 广东省 --city 广州市 --district 天河区 --street 体育东路
node dist/cli.js xgxt holiday apply --id "<cjlfxgzId>" --mode 离校 --current-campus 珠海校区 --leave-date 2026-04-04 --return-date 2026-04-06 --destination-type 回家 --transport 火车 --country 中国 --province 广东省 --city 广州市 --district 天河区 --street 体育东路 --confirm
```

注意：

- 默认只预览
- 只有 `--confirm` 才会真的提交
- 如果 `--country` 是 `中国`，建议把 `--province`、`--city`、`--district` 一起补齐
- 留校模式常用校区值目前内置为：`广州校区南校园 / 广州校区北校园 / 广州校区东校园 / 深圳校区 / 珠海校区`
- 留校原因目前内置为：`社会实践 / 科研 / 实习 / 复习 / 其他`

## Agent 建议顺序

1. 先 `xgxt current-user`
2. 不通就走 `xgxt auth-url` + `xgxt replay-callback`
3. 如果是勤工助学，先 `workstudy filters`
4. 如果是长假离返校，先 `holiday filters`
5. 再 `list` / `detail`
6. 勤工助学报名前先 `judge`
7. 先不带 `--confirm` 做 `apply` 预览
8. 只有用户明确要求真实提交时再加 `--confirm`
