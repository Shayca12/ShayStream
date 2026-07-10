# 🔖 מדיניות ניהול גרסאות — ShayStream

הפרויקט משתמש ב-**Semantic Versioning (SemVer)** בפורמט `MAJOR.MINOR.PATCH`.

## הכללים

| חלק | מתי מעלים | דוגמה | הודעת commit |
|-----|-----------|-------|--------------|
| **PATCH** | תיקון באג, בלי שינוי התנהגות | `1.2.3 → 1.2.4` | `fix:` |
| **MINOR** | פיצ'ר חדש, **תואם לאחור** | `1.2.4 → 1.3.0` | `feat:` |
| **MAJOR** | שינוי **שובר** (breaking change) | `1.3.0 → 2.0.0` | `feat!:` או `BREAKING CHANGE:` |

## איפה הגרסאות חיות

- **כל שירות** — גרסה עצמאית ב-`services/<service>/package.json`.
- **האפליקציה** — גרסת המוצר הכוללת ב-`package.json` בשורש.
- **בזמן ריצה** — כל שירות חושף את גרסתו ב-`GET /health` (כך תמיד יודעים מה רץ).

## איך מעלים גרסה

מתוך תיקיית השירות (או השורש עבור האפליקציה):

```bash
npm version patch --no-git-tag-version   # תיקון באג
npm version minor --no-git-tag-version   # פיצ'ר חדש
npm version major --no-git-tag-version   # שינוי שובר
```

## שחרור ל-PROD ותיוג ב-Git

בכל מיזוג מ-`develop` ל-`main` (שחרור לפרודקשן) יוצרים **תגית Git** מוערת:

```bash
# תגית לשירות ספציפי
git tag -a auth-service-v1.0.0 -m "auth-service 1.0.0"
# תגית לאפליקציה כולה
git tag -a v1.0.0 -m "ShayStream 1.0.0"
git push --tags
```

## מצב נוכחי

- **האפליקציה:** `0.1.0` — בפיתוח (Walking Skeleton). תעלה ל-`1.0.0` כשה-MVP המלא
  (כולל frontend) ישוחרר ל-`main`/PROD.
- **auth-service / media-service / stream-service:** `0.1.0` כל אחד.

> `0.x.y` = "טרם שוחרר רשמית". `1.0.0` = השחרור היציב הראשון.
