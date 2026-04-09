# Qiguan 岐关车

`qg` 用于广州与珠海校区之间的岐关车查询，以及生成微信下单入口链接。

它和仓库里的离线 `bus` 不一样：

- `bus`
  - 查广州各校区之间的校车离线快照
- `qg`
  - 查珠海与广州之间的岐关车实时班次
  - 生成微信下单入口链接

## 快速入口

```bash
node dist/cli.js qg --help
node dist/cli.js qg list --today --available
node dist/cli.js qg routes
```

## 常见查询

```bash
node dist/cli.js qg list --start zhuhai --to south --today --available
node dist/cli.js qg list --start zhuhai --to east --station boya --tomorrow --available
node dist/cli.js qg list --start south --to zhuhai --date 2026-04-10 --available
```

## 生成下单链接

优先先跑列表，再用列表里的 `Code`：

```bash
node dist/cli.js qg list --start zhuhai --to south --today --available
node dist/cli.js qg link 1
node dist/cli.js qg link 1 --copy
```

没有缓存列表时，也可以按路线和时间直接生成：

```bash
node dist/cli.js qg link --start zhuhai --to south --station zhuhai --time 16:00
```

## 路线键

校区键：

- `zhuhai`
- `south`
- `east`

珠海站点键：

- `zhuhai`
- `boya`
- `fifth`

## 重要边界

- 不需要 SYSU 登录态
- `sysu-anything qg ...` 只是透明转发本机 `qg` CLI
- 只做班次查询和微信下单入口生成
- 不自动提交乘车人信息、不自动创建订单、不自动支付

## 本机依赖

当前环境里需要能直接调用：

```bash
qg --help
```

如果缺失，可在本机恢复：

```bash
npm install -g qg-skill
```

或进入本地项目：

```bash
cd /Users/baihe/Documents/岐关车cli
npm install
npm run build
npm link
```
