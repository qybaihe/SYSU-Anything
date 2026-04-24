# USC / BPM 预约

Use `sysu-anything usc` for the BPM-based reservation apps:

- `app_id=197`: 课室临时使用申请
- `app_id=290`: 会议场所使用申请
- `app_id=178`: 学生活动中心场地使用申请

Before login-dependent USC actions, check:

```bash
sysu-anything usc whoami --json
```

## Query first

```bash
sysu-anything usc apps
sysu-anything usc schema classroom
sysu-anything usc schema meeting
sysu-anything usc schema activity
sysu-anything usc sessions --app-id 197 --json
sysu-anything usc tasks --app-id 197 --json
```

Classroom query helpers:

```bash
sysu-anything usc classroom campuses
sysu-anything usc classroom sections
sysu-anything usc classroom rooms --campus 广州校区南校园 --date 2026-04-28 --section-start 10 --section-end 11
```

Meeting-room query helpers:

```bash
sysu-anything usc meeting campuses
sysu-anything usc meeting venues --campus 珠海校区 --query C507
sysu-anything usc meeting availability --campus 珠海校区 --venue C507 --start "2026-04-27 08:00" --end "2026-04-27 09:00"
```

Student-activity query helpers:

```bash
sysu-anything usc activity rooms
sysu-anything usc activity clubs --query 音乐
```

## Classroom application defaults

For normal non-lecture classroom use:

- `--activity-category` is usually `院系非教学类活动(不含社团活动)`.
- Keep `--content` short. Do not paste the whole plan or long time explanation into activity content.
- Put contact person, phone, and special notes in `--requirements`.
- Keep `--lecture no` for normal activities; lecture mode may require attachments.
- Initial app_id=197 application does not choose a concrete classroom. `Select_151` being empty is expected. Concrete classroom selection happens later after 教务部登记 / fill-task.

Example:

```bash
sysu-anything usc classroom fill-initial \
  --date 2026-04-28 \
  --section-start 10 \
  --section-end 11 \
  --campus 广州校区南校园 \
  --content "第一期 Vibe Coding 氛围编程活动" \
  --activity-category "院系非教学类活动(不含社团活动)" \
  --lecture no \
  --internal-count 150 \
  --requirements "负责人：蓝澍德；联系电话：0756-3661006。"
```

## Save verification

After any save, prefer verifying with both:

```bash
sysu-anything usc examine-data --sess-id <id> --json
sysu-anything usc session-detail --sess-id <id> --json
```

For app_id=290, `start-data` can be stale for some time fields; trust `examine-data` and `session-detail` for saved state verification.

## Final submit boundary

Never fake final submission. Final BPM submission is `/site/app/start` and must remain preview-only unless the user clearly confirms the exact action.

Preview:

```bash
sysu-anything usc classroom submit --sess-id <id>
```

Real submit after user confirmation:

```bash
sysu-anything usc classroom submit --sess-id <id> --confirm
```

Apple sync path after confirmed classroom submit:

```bash
sysu-anything-apple usc classroom submit --sess-id <id> --confirm --calendar --reminders
```

If the classroom session has already been submitted and the user only wants to backfill Apple Calendar / Reminders, use the Apple-only local sync path instead:

```bash
sysu-anything-apple usc classroom sync --sess-id <id> --calendar --reminders
```
