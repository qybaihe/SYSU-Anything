# 认证与状态目录

默认状态目录：

```bash
~/.sysu-anything/
```

关键文件：

- `session.json`
  - SYSU CAS 会话
- `ykt-session.json`
  - 雨课堂网页会话
- `jwxt-session.json`
  - JWXT 服务会话
- `chat-session.json`
  - chat 站点会话
- `chat-auth.json`
  - chat Bearer token
- `gym-session.json`
  - gym 站点会话
- `gym-auth.json`
  - gym Bearer token
- `libic-session.json`
  - libic 站点会话与 token
- `explore-session.json`
  - explore 站点会话
- `xgxt-session.json`
  - xgxt / 勤工助学站点会话
- `xgxt-auth.json`
  - xgxt 当前用户与 Authorization token 状态
- `career-session.json`
  - career 就业系统站点会话
- `qr/workwechat-login.png`
  - 最近一次企业微信二维码
- `qr/ykt-login.png`
  - 最近一次雨课堂登录二维码

## 启动默认流程

在 skill 里，默认顺序应该是：

1. 先判断用户要用哪个功能
2. 先检查该功能对应的登录状态
3. 如果登录不完整，先补登录或补 token
4. 再重新跑一次登录检查
5. 登录检查通过后，才执行真正的查询或写操作

不要对 `chat`、`gym`、`libic`、`explore`、`jwxt` 直接跳过登录检查。

## 功能与登录要求

- `bus`
  - 需要登录：否
  - 启动检查：无
  - 可以直接执行目标命令
- `qg`
  - 需要登录：否
  - 启动检查：无
  - 需要本机可调用 `qg`
- `today` / `jwxt`
  - 需要登录：CAS
  - 本地依赖：`session.json`
  - 启动检查：`sysu-anything jwxt status`
- `ykt`
  - 需要登录：雨课堂网页会话
  - 本地依赖：`ykt-session.json`
  - 启动检查：`sysu-anything ykt status`
- `chat`
  - 需要登录：CAS + chat callback token
  - 本地依赖：`session.json`、`chat-session.json`、`chat-auth.json`
  - 启动检查：`sysu-anything chat sources`
- `gym`
  - 需要登录：CAS + gym callback 会话 + gym token
  - 本地依赖：`session.json`、`gym-session.json`、`gym-auth.json`
  - 启动检查：`sysu-anything gym profile`
- `libic`
  - 需要登录：CAS + libic 站点会话 + libic token
  - 本地依赖：`session.json`、`libic-session.json`
  - 启动检查：`sysu-anything libic whoami`
- `explore`
  - 需要登录：CAS + explore 站点会话
  - 本地依赖：`session.json`、`explore-session.json`
  - 启动检查：`sysu-anything explore whoami`
- `career`
  - `teachin/jobfair/job` 的 `list/detail`：不需要登录
  - `teachin/jobfair signup`、`job apply`：需要 CAS 会话去播种 career 自己的登录状态
  - 本地依赖：`session.json`、`career-session.json`
  - 启动检查：无单独 `status`，先确保 `sysu-anything auth workwechat` 成功，再执行目标写命令
- `xgxt`
  - 需要登录：xgxt 站点会话 + xgxt current-user/token
  - 本地依赖：`session.json`、`xgxt-session.json`、`xgxt-auth.json`
  - 启动检查：`sysu-anything xgxt current-user`

## 哪些能力依赖登录

- `bus`
  - 不依赖登录
- `qg`
  - 不依赖登录，但依赖本机 `qg` CLI
- `today` / `jwxt`
  - 依赖 CAS，会自动走 JWXT 二段登录
- `ykt`
  - 不依赖 SYSU CAS
  - 依赖雨课堂自己的网页登录状态和 `ykt-session.json`
- `chat`
  - 依赖 CAS，且通常还需要 chat callback 回放得到 token
- `gym`
  - 依赖 CAS、gym callback 回放，以及 gym token
- `libic`
  - 依赖 CAS，并需要额外播种 libic 自己的 `/auth/address -> /authcenter -> /auth/token`
  - 成功后会把站点会话和 token 持久化到 `libic-session.json`
- `explore`
  - 依赖 CAS，并需要额外播种 explore 自己的 `JSESSIONID`
- `career`
  - `teachin/jobfair/job` 公开列表和详情不依赖登录
  - 写操作依赖 CAS，会在第一次请求时自动尝试播种 `career-session.json`
  - `job apply` 还可能被“先填写就业意向”或“简历完整度需达到 90% 以上”阻塞
- `xgxt`
  - 静态页面入口可复用 SYSU/appgw 会话
  - 但 API 还需要 xgxt 自己的 current-user/token 状态
  - 通常要走一次 `xgxt auth-url` + `xgxt replay-callback`

## 标准恢复路径

### 1. CAS 基础登录

```bash
sysu-anything auth workwechat
```

适用：

- `today`
- `jwxt`
- `chat`
- `gym`
- `explore`

### 2. Chat 登录恢复

```bash
sysu-anything chat sources
sysu-anything chat probe
sysu-anything chat auth-url
sysu-anything chat replay-callback --url "<callback-url>"
sysu-anything chat sources
```

### 3. YKT 登录恢复

```bash
sysu-anything ykt status
sysu-anything ykt login
sysu-anything ykt status
```

### 4. Gym 登录恢复

```bash
sysu-anything gym profile
sysu-anything gym probe
sysu-anything gym auth-url
sysu-anything gym replay-callback --url "<callback-url>"
sysu-anything gym token refresh
sysu-anything gym profile
```

### 5. Explore 会话恢复

```bash
sysu-anything explore whoami
sysu-anything explore refresh
sysu-anything explore whoami
```

### 6. Libic 会话恢复

```bash
sysu-anything libic whoami
sysu-anything libic refresh
sysu-anything libic whoami
```

### 7. JWXT 登录恢复

```bash
sysu-anything jwxt status
sysu-anything auth workwechat
sysu-anything jwxt status
```

### 8. XGXT 登录恢复

```bash
sysu-anything xgxt probe --wechat-ua
sysu-anything xgxt auth-url
sysu-anything xgxt replay-callback --url "<最终回跳URL>"
sysu-anything xgxt current-user
```

### 9. Career 写操作准备

```bash
sysu-anything auth workwechat
sysu-anything career teachin signup --id <id>
sysu-anything career jobfair signup --id <id>
sysu-anything career job apply --id <id>
```

说明：

- `career` 目前没有单独的 `status` 子命令
- 写命令会自动尝试复用 `session.json` 去播种 `career-session.json`
- 如果仍提示未登录，先重新跑 `auth workwechat`，再重试原命令

补充说明：

- `xgxt current-user` 现在会优先复用 `xgxt-auth.json`
- 如果本地 `xgxt-auth.json` 过期，但 `session.json` 还可用，CLI 会自动回 CAS 刷新并重试
- `xgxt holiday ...` 和 `xgxt workstudy ...` 共用同一套 `xgxt-session.json` / `xgxt-auth.json`

## 判断思路

- 只是 `bus` 失败：通常不是登录问题，先看参数或离线数据
- 只是 `qg` 失败：通常不是 SYSU 登录问题，先看本机 `qg` 是否安装、参数是否正确
- `jwxt` / `today` 失败：先跑 `jwxt status`，不通就先补 CAS
- `ykt` 相关动作前：先跑 `ykt status`
- `ykt status` 不通：先跑 `ykt login`
- `chat` 相关动作前：先跑 `chat sources`
- `chat sources` 不通：先补 callback 回放
- `gym` 相关动作前：先跑 `gym profile`
- `gym profile` 不通：先补 callback，再 `token refresh`
- `libic` 相关动作前：先跑 `libic whoami`
- `libic whoami` 不通：先 `libic refresh`，再必要时补 CAS
- `explore` 相关动作前：先跑 `explore whoami`
- `explore whoami` 不通：先 `explore refresh`，再必要时补 CAS
- `career` 的 `list/detail` 失败：先看页面结构、参数或站点响应
- `career` 的 `signup/apply` 提示未登录：先补 `auth workwechat`
- `career job apply` 失败但不是登录问题：优先看是否缺就业意向、默认简历、或简历完整度未到 90%
- `xgxt` 相关动作前：先跑 `xgxt current-user`
- `xgxt current-user` 不通：先 `xgxt auth-url`，再 `xgxt replay-callback`
- `xgxt holiday` 与 `xgxt workstudy` 的登录检查完全相同
