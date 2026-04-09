# Gym

`gym` 用于体育场馆认证、查询、预约。

## 登录链路

```bash
node dist/cli.js gym probe
node dist/cli.js gym auth-url
node dist/cli.js gym replay-callback --url "<callback-url>"
node dist/cli.js gym token refresh
```

## 读操作

```bash
node dist/cli.js gym profile
node dist/cli.js gym campuses
node dist/cli.js gym venue-types --campus 南校园 --sport 羽毛球
node dist/cli.js gym available --venue-type "珠海校区健身房"
node dist/cli.js gym bookings --venue-type "珠海校区健身房" --mine
```

## 写操作

```bash
node dist/cli.js gym book --venue-type "珠海校区健身房" --date 2026-04-09 --start 09:00 --end 10:00
node dist/cli.js gym book --venue-type "珠海校区健身房" --date 2026-04-09 --start 09:00 --end 10:00 --confirm
```

## 重要行为

- `gym token refresh`
  - 强制刷新 API token
- `gym available`
  - 默认查可预约时段
- `gym bookings --mine`
  - 查自己的预约通常更稳
- `gym book`
  - 默认只预览
  - 只有加 `--confirm` 才会真正提交

## 建议顺序

1. 先确认认证链路没问题
2. 用 `venue-types` 找场地类型
3. 用 `available` 查空档
4. 用 `book` 先预览
5. 只有用户明确要下单时再加 `--confirm`
