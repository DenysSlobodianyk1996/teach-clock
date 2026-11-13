# Closed test tracker

A new personal Play account can't publish to production until a closed test has had **at least 12 testers opted in, continuously, for at least 14 days**. Then you press **Apply for production**, and Google usually answers within 7 days. Source: https://support.google.com/googleplay/android-developer/answer/14151465 (checked 2026-11-13). The full steps are in [`../android-release.md`](../android-release.md) §9–§13; `bash scripts/release-wizard.sh` fills in the Key dates below as you go.

> **This repo is public.** Don't write testers' names or emails here. Use labels (T1, T2…). The real list lives in the Google Group, and in a private note if you want one.

## Where Google shows the progress

Play Console › your app › **Dashboard**. The "Apply for production" section shows how many testers are opted in and how many days the requirement has been met. Google's count decides it; this file is only your own log, and a place to collect answers for the application.

## Rules to keep in mind

- Testers count only when they **opt in** through the link with the Google account on their Android phone. Joining the Google Group alone doesn't count.
- The test only counts while it is running on a **closed testing** track. Internal testing doesn't count.
- If fewer than 12 testers are opted in, the 14 days count from when there are 12 again. So recruit about **15**, and check the Dashboard every few days.
- Uninstalling the app doesn't opt someone out. Leaving the test does. Ask testers to keep the app installed and to open it now and then: Google asks what testers did.
- New builds during the test are fine and expected; CI uploads every merge (ticket 12). Testers get them as updates.

## Key dates

| What                                     | Date |
| ---------------------------------------- | ---- |
| Developer account verified               |      |
| First build live on closed testing       |      |
| Tester invite sent                       |      |
| 12th tester opted in (day 1)             |      |
| Day 14 (earliest "Apply for production") |      |
| Applied for production                   |      |
| Production access granted                |      |
| First production release                 |      |
| Teacher Approved opt-in                  |      |

## Testers

Labels only. Tick when they have opted in, according to the Dashboard or what they tell you.

| Label | Invited | Opted in | Phone / Android version | Still in on day 14 |
| ----- | ------- | -------- | ----------------------- | ------------------ |
| T1    |         |          |                         |                    |
| T2    |         |          |                         |                    |
| T3    |         |          |                         |                    |
| T4    |         |          |                         |                    |
| T5    |         |          |                         |                    |
| T6    |         |          |                         |                    |
| T7    |         |          |                         |                    |
| T8    |         |          |                         |                    |
| T9    |         |          |                         |                    |
| T10   |         |          |                         |                    |
| T11   |         |          |                         |                    |
| T12   |         |          |                         |                    |
| T13   |         |          |                         |                    |
| T14   |         |          |                         |                    |
| T15   |         |          |                         |                    |

## Daily log

One line whenever you check the Dashboard.

| Date | Opted in (Dashboard) | Days met (Dashboard) | Build (versionName / versionCode) | Notes |
| ---- | -------------------- | -------------------- | --------------------------------- | ----- |
|      |                      |                      |                                   |       |

## Feedback and what changed

You'll need this for the "Apply for production" questions: how you recruited testers, what they reported, and what you changed because of it.

| Date | From (label) | What they said | What changed (PR) |
| ---- | ------------ | -------------- | ----------------- |
|      |              |                |                   |

## Draft answers for "Apply for production"

Fill these in as the test runs.

- **How did you recruit testers?**
- **How did testers use the app?** (Games played, devices, Teach and Test)
- **What feedback did you get, and what did you change?**
- **Who is the app for, and what does it offer them?** Children aged 6–12 learning to read and set an analogue clock; four Games; works offline; no ads; nothing collected.
- **Why is it ready for production?**
