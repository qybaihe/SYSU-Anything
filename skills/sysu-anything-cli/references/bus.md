# 离线班车

`bus` 是离线快照能力，数据来自仓库内：

```text
data/bus-schedule.json
```

不依赖 `mportal` 或任何登录态。

## 基本命令

```bash
node dist/cli.js bus --help
node dist/cli.js bus --bus 1
node dist/cli.js bus --bus 0
```

## 规则

- `--bus 1`
  - 工作日
- `--bus 0`
  - 节假日
- 不传 `--bus`
  - CLI 只按当前是不是周末自动推断
  - 不识别法定节假日调休

## 常用筛选

```bash
node dist/cli.js bus --from 东校园 --to 南校园
node dist/cli.js bus --query 教职工
node dist/cli.js bus --query 黄埔大道
node dist/cli.js bus --upcoming
node dist/cli.js bus --notes
node dist/cli.js bus --json
```

参数含义：

- `--from`
  - 按起点方向或起点站点过滤
- `--to`
  - 按终点方向或终点站点过滤
- `--query`
  - 按方向、站点、路线、乘客类型、车辆类型、备注模糊过滤
- `--upcoming`
  - 只保留当前时间之后仍未发车的班次
- `--notes`
  - 打印该方向附带的长备注
- `--json`
  - 输出结构化结果

## 典型例子

```bash
node dist/cli.js bus --bus 1 --from 东校园 --to 南校园
node dist/cli.js bus --bus 0 --upcoming
node dist/cli.js bus --bus 1 --query 学生 --json
```

## 维护方式

如果班车时刻有更新，直接替换：

```text
data/bus-schedule.json
```

然后重新构建：

```bash
npm run build
```
