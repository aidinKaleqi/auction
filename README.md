# سرویس حراجی

سرویس مدیریت حراجی در زمان واقعی که با **NestJS** و **TypeORM** ساخته شده است. مدیریت حراجی‌ها، قرار دادن پیشنهادها و تعیین برندگان با پشتیبانی کش‌گذاری Redis و صف‌های کار.

## ویژگی‌ها

- ایجاد و مدیریت حراجی‌ها
- سیستم پیشنهاد در زمان واقعی
- تعیین خودکار برندگان
- کش‌گذاری Redis برای بهبود کارایی
- پردازش صف‌های کار با Bull
- اعتبارسنجی درخواست و مدیریت خطاها
- پشتیبانی استقرار خوشه‌ای

## پشته‌ی فناوری

- **زبان برنامه نویسی**: Node.js
- **فریمورک**: NestJS 10
- **پایگاه‌داده**: PostgreSQL با TypeORM
- **کش**: Redis
- **صف کار**: Bull
- **زبان**: TypeScript

## ساختار پروژه

```
src/
├── module/                          # ماژول‌های داخلی
│   ├── auction/                    # ماژول حراجی
│   │   ├── auction.module.ts       # تعریف ماژول
│   │   ├── controllers/            # کنترل‌کننده‌های API
│   │   │   └── auction.controller.ts
│   │   ├── services/               # سرویس‌های تجاری
│   │   │   └── auction.service.ts
│   │   ├── businesslogics/         # منطق تجاری
│   │   │   └── auction.businesslogic.ts
│   │   ├── repositories/           # لایه دسترسی به داده‌ها
│   │   │   └── auction.repository.ts
│   │   ├── processes/              # پردازش‌های صف کار
│   │   │   └── auction.process.ts
│   │   ├── dtos/                   # اشیاء انتقال داده
│   │   │   ├── create-auction.dto.ts
│   │   │   ├── get-active-auctions.dto.ts
│   │   │   └── place-bid.dto.ts
│   │   ├── enums/                  # شمارنده‌ها
│   │   │   ├── auction.enum.ts
│   │   │   └── bid.enum.ts
│   │   └── interfaces/             # تعاریف رابط
│   │       └── auction.interface.ts
│   │
│   └── user/                       # ماژول کاربر
│       ├── user.module.ts
│       ├── services/
│       │   └── user.service.ts
│       └── repositories/
│           └── user.repository.ts
│
├── repository/                      # لایه دسترسی مشترک
│   ├── repository.module.ts
│   ├── cache.repository.ts         # عملیات کش Redis
│   ├── database.repository.ts      # عملیات پایگاه‌داده
│   ├── config/
│   │   └── database.config.ts
│   └── entities/                   # موجودیت‌های پایگاه‌داده
│       ├── auction/
│       │   ├── auction.entity.ts
│       │   └── bid.entity.ts
│       └── user/
│           └── user.entity.ts
│
├── common/                         # ابزارهای مشترک
│   └── utility.ts
│
├── interceptors/                   # رهگیرهای پاسخ
│   └── transform.interceptor.ts
│
├── middlewares/                    # میانی‌افزار‌ها
│   ├── logger.middleware.ts        # ثبت درخواست‌ها
│   └── requestId.middleware.ts     # ردیابی شناسهٔ درخواست
│
├── filter/                         # فیلترهای شخصی‌سازی‌شده
│   ├── custom.error.ts
│   ├── custom.event.ts
│   ├── customError.filter.ts
│   └── customEvent.filter.ts
│
├── app.module.ts                   # ماژول اصلی برنامه
├── cluster.ts                      # مدیریت خوشه
├── router.ts                       # تعریف مسیرها
└── main.ts                         # نقطهٔ شروع برنامه
```

## نقاط پایانی API

### حراجی‌ها

| http متد | نقطهٔ پایانی | شرح |
|--------|----------|-------------|
| `POST` | `/api/auctions` | ایجاد حراجی جدید |
| `GET` | `/api/auctions/active` | دریافت حراجی‌های فعال  |
| `GET` | `/api/auctions/:id` | دریافت جزئیات حراجی |
| `POST` | `/api/auctions/:id/close` | بسته کردن حراجی |
| `GET` | `/api/auctions/:id/winner` | دریافت برندهٔ حراجی |

### پیشنهادکردن

| http متد | نقطهٔ پایانی | شرح |
|--------|----------|-------------|
| `POST` | `/api/auctions/:id/bids` | ایجاد پیشنهاد |
| `GET` | `/api/auctions/:id/bids` | دریافت تمام پیشنهادهای یک حراجی |

## شروع کار

### پیش‌ نیازها

- Node.js 18+
- PostgreSQL
- Redis

### نصب

```bash
npm install
```

### متغیرهای محیطی

فایل `.env` را با محتویات مورد نظر مشابه مثال زیر ایجاد کنید:

```env
# -------- DataBase
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_USER=auction
DATABASE_PASSWORD=auction
DATABASE_NAME=auction
DATABASE_SCHEMA=auction
DATABASE_EXTRA_MIN=5
DATABASE_EXTRA_MAX=10
DATABASE_EXTRA_MIN_IDLETiIME=30000

# -------- Cache (Redis)
CACHE_HOST=127.0.0.1
CACHE_PORT=6379
CACHE_PASS=123456
CACHE_DB_NUMBER=1

# -------- Service
SERVICE_NAME=auction
SERVICE_MODE=dev
SERVICE_PORT=8000
SERVICE_LOG_SHOW=false
SERVICE_IP=127.0.0.1
SERVICE_CLUSTER_SIZE=1

# -------- Auction Duration
AUCTION_DURATION_MINUTES=30
```

### اجرا

```bash
# development env
npm run start:dev

# production env
npm run build
npm run start:prod
```
