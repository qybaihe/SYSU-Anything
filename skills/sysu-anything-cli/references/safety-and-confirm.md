# 安全边界与 `--confirm`

这个 CLI 里，很多写操作默认都是“只预览，不提交”。

## 明确属于写操作的命令

- `node dist/cli.js jwxt leave apply`
- `node dist/cli.js gym book`
- `node dist/cli.js explore seminar reserve`
- `node dist/cli.js explore research apply`

## 默认策略

- 没有 `--confirm`
  - 只预览 payload、参数或服务端返回的准备信息
- 有 `--confirm`
  - 真实提交

## Agent 建议流程

1. 先读对应 `--help`
2. 先跑查询命令，确认对象、日期、ID、时间段
3. 再跑一次不带 `--confirm` 的预览
4. 只有用户明确说“提交”“预约”“报名”“请假”“确认执行”时，才加 `--confirm`

## 额外建议

- 能用 `--json` 时优先用 `--json`
- 不要猜测 callback URL、ID、场地名、组会 ID、课题 ID
- 如果登录态异常，先走恢复命令，不要直接切浏览器自动化
