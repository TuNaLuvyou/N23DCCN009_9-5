# NextAuth Token Refresh Exercise

## Giới thiệu

Đây là dự án thực hành NextAuth với 3 nội dung chính:

- Đăng nhập bằng `CredentialsProvider`
- Phân quyền truy cập theo role người dùng
- Tự động refresh access token khi token hết hạn

## Chức năng chính

- Tài khoản demo:
  - `student / 123456` (`ROLE_STUDENT`)
  - `advisor / 123456` (`ROLE_ADVISOR`)
- Chỉ `ROLE_ADVISOR` được truy cập dashboard.
- Dashboard hiển thị countdown token và có nút `Lấy danh sách lớp` để demo luồng refresh token.
- Nếu refresh token lỗi, người dùng sẽ bị yêu cầu đăng nhập lại.

## Cấu trúc dự án

```text
nextauth-exercise/
├── pages/
│   ├── _app.js
│   ├── login.js
│   ├── index.js
│   └── api/
│       └── auth/
│           └── [...nextauth].js
├── package.json
├── package-lock.json
└── next.config.js
```

## Yêu cầu môi trường

- Node.js 16+
- npm 8+

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Truy cập: `http://localhost:3000`

## Script

- `npm run dev`: chạy môi trường development
- `npm run build`: build production
- `npm run start`: chạy bản production sau khi build

## Luồng demo đề xuất

1. Đăng nhập bằng `advisor / 123456`.
2. Nhấn `Lấy danh sách lớp` để lấy dữ liệu lần 1.
3. Chờ access token gần hoặc hết hạn.
4. Nhấn lại `Lấy danh sách lớp` để kích hoạt luồng refresh token tự động.
5. Mở Console để theo dõi log refresh token.

## Ghi chú kỹ thuật

- Token và API đang ở dạng mô phỏng để phục vụ bài tập.
- Callback `jwt` lưu và cập nhật:
  - `accessToken`
  - `refreshToken`
  - `accessTokenExpires`
  - `role`
- Callback `session` trả các thông tin trên về client để UI sử dụng.
