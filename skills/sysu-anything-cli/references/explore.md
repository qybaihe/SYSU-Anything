# Explore

`explore` 对应交叉探索平台，主要覆盖：

- 组会查询、详情、预约
- 课题查询、筛选、详情、报名

## 会话恢复

```bash
node dist/cli.js explore refresh
node dist/cli.js explore whoami
```

如果状态不对，先 `refresh` 再继续。

## 组会

```bash
node dist/cli.js explore seminar list
node dist/cli.js explore seminar calendar --month 2026-04
node dist/cli.js explore seminar detail --id "<seminarId>"
node dist/cli.js explore seminar reserve --id "<seminarId>"
node dist/cli.js explore seminar reserve --id "<seminarId>" --confirm
```

## 课题

```bash
node dist/cli.js explore research list
node dist/cli.js explore research filters
node dist/cli.js explore research detail --id "<researchId>"
node dist/cli.js explore research apply --id "<researchId>" --message "您好，我对这个课题很感兴趣。"
node dist/cli.js explore research apply --id "<researchId>" --message "您好，我对这个课题很感兴趣。" --confirm
```

## 重要行为

- `explore refresh`
  - 用于补 explore 自己的站点会话
- `seminar reserve`
  - 默认只预览
  - `--confirm` 才真实提交
- `research apply`
  - 默认只预览
  - `--confirm` 才真实提交

## 建议顺序

1. `explore whoami`
2. 先查列表或筛选条件
3. 进入详情拿准 ID
4. 先不带 `--confirm` 预览
5. 只有用户明确要提交时再加 `--confirm`
