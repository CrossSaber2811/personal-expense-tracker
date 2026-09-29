# REQUIREMENTS SPECIFICATION
## Project: Personal Expense Tracker (Hệ thống quản lý thu chi cá nhân)
**Version:** 1.1.0 (Refined Specification)  
**Target:** 2–3 Week Individual Project  
**Tech Stack:** React (TypeScript) + Spring Boot (Java 17/21) + PostgreSQL  

---

## 1. System Goals & Scope

### 1.1 Goal
Cung cấp một ứng dụng web quản lý tài chính cá nhân gọn gàng, tin cậy, cho phép người dùng ghi nhận các khoản thu nhập và chi tiêu, phân loại theo danh mục, thiết lập ngân sách chi tiêu hàng tháng, và trực quan hoá dòng tiền qua Dashboard và Báo cáo.

### 1.2 Target Audience & Roles
* **`ROLE_USER`**: Người dùng cá nhân; quản lý giao dịch, ngân sách, danh mục tùy chỉnh của chính mình.
* **`ROLE_ADMIN`**: Quản trị viên hệ thống; quản lý các danh mục mặc định của toàn hệ thống (System Categories).

### 1.3 Scope Matrix

| Code | Feature Description | Priority | In Scope (v1) |
|---|---|---|---|
| **F01** | User Registration (email unique, validation, password hashing) | MUST | Yes |
| **F02** | User Login / Logout (JWT generation + client-side token removal + token expiration) | MUST | Yes |
| **F03** | User Profile & Change Password (`PUT /api/users/me/password`) | MUST | Yes |
| **F04** | Transaction Management (CRUD, filter by date/month/category/type, pagination) | MUST | Yes |
| **F05** | Category Management (System default `user_id = NULL` & User custom `user_id != NULL`) | MUST | Yes |
| **F06** | Monthly Budgeting (Upsert budget per month/year, usage tracking & alert) | MUST | Yes |
| **F07** | Dashboard (Current total balance, monthly income/expense/net balance, budget card) | MUST | Yes |
| **F08** | Financial Reports (Spending breakdown by category, 6-month income vs expense trend) | MUST | Yes |
| **F09** | Input Validation (Jakarta Bean Validation on all DTOs with `@Valid`) | MUST | Yes |
| **F10** | Centralized Exception Handling (`GlobalExceptionHandler`, standardized REST error) | MUST | Yes |
| **F11** | Audit & Application Logging (SLF4J/Logback for security and business events) | MUST | Yes |
| **F12** | Unit Testing (Service layer with JUnit 5 & Mockito) | MUST | Yes |
| **F13** | Integration Testing (Controller to DB with `@SpringBootTest`, `MockMvc`) | MUST | Yes |
| **F14** | API Testing (Complete Postman collection with test assertions) | MUST | Yes |
| **B01** | Export Transactions to CSV | BONUS | No (Future) |
| **B02** | Dark Mode Theme Toggle | BONUS | No (Future) |
| **B03** | Recurring Transactions (Auto-recurring monthly bills) | BONUS | No (Future) |

---

## 2. Business Rules (BR)

| Rule ID | Rule Name | Description & Enforcement |
|---|---|---|
| **BR01** | **Positive Monetary Amount** | Số tiền giao dịch và ngân sách phải luôn > 0 (`BigDecimal.compareTo(BigDecimal.ZERO) > 0`). Validate tại DTO (`@Positive`, `@NotNull`) và double-check tại Service. Tuyệt đối không chấp nhận giá trị 0 hoặc âm. |
| **BR02** | **Strict Data Ownership (IDOR Prevention)** | Người dùng chỉ có quyền xem, sửa, xóa dữ liệu (Giao dịch, Ngân sách, Danh mục cá nhân) do chính mình tạo ra. Service layer luôn đối soát `resource.getUserId().equals(currentUser.getId())` hoặc sử dụng query bảo mật `findByTransactionIdAndUserId`. |
| **BR03** | **Category & Transaction Type Consistency** | Giao dịch `INCOME` chỉ được gán vào danh mục loại `INCOME`. Giao dịch `EXPENSE` chỉ được gán vào danh mục loại `EXPENSE`. Ném `BusinessException` nếu có sự bất đồng bộ loại. |
| **BR04** | **Monthly Budget Upsert** | Mỗi người dùng chỉ có duy nhất 1 ngân sách cho một cặp (tháng, năm). API `POST /api/budgets` áp dụng cơ chế **Upsert**: Nếu chưa tồn tại bản ghi `(user_id, month, year)` thì tạo mới (CREATE); nếu đã tồn tại thì tự động cập nhật số tiền (UPDATE). Database có ràng buộc `UNIQUE(user_id, month, year)`. |
| **BR05** | **Configurable Budget Alert Status** | Tỷ lệ chi tiêu tháng = `(Total Expense in Month / Monthly Budget) * 100`.<br>- `< 80%`: `NORMAL`<br>- `80% - 100%`: `WARNING`<br>- `> 100%`: `OVER_BUDGET`<br>Ngưỡng cảnh báo 80% được cấu hình qua `application.yml` (`app.budget.warning-threshold=0.8`), inject vào Service qua `BudgetProperties`, không hardcode. |
| **BR06** | **Balance Calculation (Dual Scope)** | Phân định rõ 2 khái niệm số dư:<br>1. **Current Total Balance (Số dư tích lũy)** = `Tổng thu nhập mọi thời đại - Tổng chi tiêu mọi thời đại` của người dùng.<br>2. **Monthly Net Balance (Chênh lệch tháng)** = `Thu nhập tháng hiện tại - Chi tiêu tháng hiện tại`.<br>Được tính toán động qua truy vấn tổng hợp (Aggregation Query), không lưu cột `balance` tĩnh trong bảng `users`. |
| **BR07** | **No Future Transaction Date** | Ngày giao dịch không được vượt quá ngày hiện tại của hệ thống: `transactionDate <= LocalDate.now()`. Bắt lỗi tại DTO bằng `@PastOrPresent` kết hợp kiểm tra tại Service layer. |

---

## 3. Detailed Functional Requirements

### 3.1 Authentication & User Profile (F01 - F03)
* **FR-AUTH-01**: Đăng ký tài khoản (`POST /api/auth/register`) với `username` (3–50 ký tự), `email` (định dạng email chuẩn, duy nhất), `password` (tối thiểu 6 ký tự, có chữ và số).
* **FR-AUTH-02**: Mật khẩu mã hóa BCrypt (`BCryptPasswordEncoder`, độ mạnh salt = 10) trước khi ghi vào Database.
* **FR-AUTH-03**: Đăng nhập (`POST /api/auth/login`) trả về JWT Access Token (hạn dùng 24h).
* **FR-AUTH-04**: Đăng xuất (`POST /api/auth/logout`): Xóa token khỏi client-side storage (localStorage) và xóa AuthContext. Phía backend trả về `200 OK` (Stateless logout).
* **FR-AUTH-05**: Xem thông tin tài khoản (`GET /api/users/me`).
* **FR-AUTH-06**: Đổi mật khẩu (`PUT /api/users/me/password`):
  * **Payload:** `{ "currentPassword": "...", "newPassword": "..." }`
  * **Business Rules:**
    1. `currentPassword` phải khớp với mật khẩu đang lưu trong DB (kiểm tra qua `passwordEncoder.matches`).
    2. `newPassword` phải khác hoàn toàn `currentPassword`.
    3. `newPassword` phải thỏa mãn validation mật khẩu (tối thiểu 6 ký tự, có chữ và số).

### 3.2 Transaction Management (F04)
* **FR-TXN-01**: Tạo giao dịch (`POST /api/transactions`): `type` (INCOME/EXPENSE), `amount` (> 0), `categoryId`, `transactionDate` (`<= LocalDate.now()`), `description` (tùy chọn, tối đa 255 ký tự).
* **FR-TXN-02**: Xem danh sách giao dịch (`GET /api/transactions`): Hỗ trợ phân trang (`page`, `size`, `sort`) và bộ lọc (`type`, `month`, `year`, `categoryId`).
* **FR-TXN-03**: Xem chi tiết giao dịch (`GET /api/transactions/{id}`).
* **FR-TXN-04**: Cập nhật giao dịch (`PUT /api/transactions/{id}`) - Chỉ chủ sở hữu.
* **FR-TXN-05**: Xóa giao dịch (`DELETE /api/transactions/{id}`) - Chỉ chủ sở hữu.

### 3.3 Category Management (F05)
* **FR-CAT-01**: Phân biệt nguồn gốc danh mục bằng `user_id`:
  * `user_id IS NULL`: Danh mục mặc định của hệ thống (System Default).
  * `user_id = currentUserId`: Danh mục cá nhân do người dùng tự tạo.
* **FR-CAT-02**: Xem danh sách danh mục (`GET /api/categories`): Trả về danh sách gồm toàn bộ danh mục hệ thống + danh mục cá nhân của user đang đăng nhập.
* **FR-CAT-03**: Tạo danh mục tùy chỉnh (`POST /api/categories`): Tự động gán `user_id = currentUserId`.
* **FR-CAT-04**: Cập nhật (`PUT /api/categories/{id}`) và Xóa (`DELETE /api/categories/{id}`): Chỉ áp dụng cho danh mục của chính user (`user_id != NULL`). Không cho phép sửa/xóa danh mục hệ thống (`user_id IS NULL`).
* **FR-CAT-05**: Ràng buộc toàn vẹn: Không cho phép xóa danh mục nếu đang có giao dịch tham chiếu tới nó (ném `BusinessException`).

### 3.4 Budgeting (F06)
* **FR-BDG-01**: Thiết lập/Cập nhật ngân sách tháng (`POST /api/budgets`): Cơ chế Upsert theo `(user_id, month, year)`.
* **FR-BDG-02**: Lấy ngân sách tháng hiện tại (`GET /api/budgets/current`): Trả về số tiền ngân sách, số tiền đã chi, số tiền còn lại, % đã chi tiêu, và trạng thái cảnh báo (`NORMAL`, `WARNING`, `OVER_BUDGET`).
* **FR-BDG-03**: Lấy ngân sách theo tháng/năm tùy chọn (`GET /api/budgets?month=X&year=Y`).

### 3.5 Dashboard & Financial Reports (F07 - F08)
* **FR-DSH-01**: Thống kê tổng hợp Dashboard (`GET /api/dashboard`):
  * `currentBalance`: Số dư tích lũy mọi thời đại.
  * `monthlyIncome`: Tổng thu nhập trong tháng hiện tại.
  * `monthlyExpense`: Tổng chi tiêu trong tháng hiện tại.
  * `monthlyNet`: Chênh lệch thu - chi tháng hiện tại (`monthlyIncome - monthlyExpense`).
  * `budgetSummary`: Thông tin tiến độ ngân sách tháng hiện tại.
* **FR-DSH-02**: Top 5 giao dịch phát sinh gần nhất (`recentTransactions`).
* **FR-RPT-01**: Báo cáo chi tiêu theo danh mục (`GET /api/reports/category?month=X&year=Y`): Gom nhóm chi tiêu theo danh mục kèm số tiền và tỷ lệ phần trăm (phục vụ vẽ Pie/Donut Chart).
* **FR-RPT-02**: Báo cáo dòng tiền 6 tháng gần nhất (`GET /api/reports/monthly-trend`): Danh sách 6 tháng gần nhất, mỗi tháng gồm `month`, `year`, `totalIncome`, `totalExpense` (phục vụ vẽ Bar Chart so sánh Thu vs Chi).

---

## 4. Non-Functional Requirements

* **NFR-SEC-01 (Token & Client-side Storage Strategy)**:
  * Ứng dụng sử dụng JWT Stateless Authentication. Token được lưu trữ trong `localStorage` phía Frontend kết hợp với React Context state để quản lý phiên làm việc.
  * **Trade-off Analysis:** Lựa chọn `localStorage` để giữ cấu trúc dự án tinh gọn trong 2–3 tuần (thay vì xử lý cookie HttpOnly phức tạp với CORS/CSRF). Đổi lại, bảo vệ chống XSS bằng cách: Không dùng `dangerouslySetInnerHTML`, sanitize dữ liệu đầu vào/ra, không bao giờ lưu mật khẩu phía client, và không bao giờ ghi token vào console/file log.
* **NFR-SEC-02 (IDOR Protection)**: Mọi endpoint nhận `{id}` đều phải qua bước kiểm tra quyền sở hữu tại Service layer trước khi thực hiện thao tác.
* **NFR-PERF-01 (Monetary Precision)**: Số tiền lưu trữ chính xác bằng `NUMERIC(15, 2)` trong PostgreSQL và xử lý bằng `java.math.BigDecimal` trong Backend (tránh lỗi sai số dấu phẩy động nhị phân của `float`/`double`).
* **NFR-QUAL-01 (Consistent Error Response)**: Toàn bộ lỗi được xử lý tập trung qua `GlobalExceptionHandler`, trả về cấu trúc JSON chuẩn:
  `{ "timestamp", "status", "error", "message", "path" }`.
* **NFR-ARCH-01 (Maintainability)**: Tổ chức code theo mô hình **Package-by-Feature** giúp dễ dàng định vị file code khi thầy cô vấn đáp.

---

## 5. Testing Requirements

Hệ thống bắt buộc triển khai 3 tầng kiểm thử để phục vụ tiêu chí **Y3 (Advanced Testing)**:

### 5.1 Unit Tests (JUnit 5 + Mockito)
Tập trung vào Service layer, giả lập (mock) Repository để kiểm tra 100% logic nghiệp vụ:
1. `AuthServiceTest`:
   * Đăng ký thành công / Báo lỗi khi email đã tồn tại.
   * Đăng nhập đúng / Báo lỗi khi sai mật khẩu.
   * Đổi mật khẩu: thành công / sai mật khẩu cũ / mật khẩu mới trùng mật khẩu cũ.
2. `TransactionServiceTest`:
   * Tạo giao dịch thành công.
   * Chặn giao dịch có số tiền $\le 0$.
   * Chặn giao dịch có ngày trong tương lai (`> LocalDate.now()`).
   * Chặn giao dịch có `type` không khớp với `category.type`.
   * Chặn User A cập nhật/xóa giao dịch của User B (chống IDOR).
3. `BudgetServiceTest`:
   * Upsert ngân sách: Tạo mới khi chưa có, Cập nhật khi đã có.
   * Tính toán trạng thái ngân sách: `< 80%` $\rightarrow$ `NORMAL`; `80% - 100%` $\rightarrow$ `WARNING`; `> 100%` $\rightarrow$ `OVER_BUDGET`.
4. `DashboardServiceTest`:
   * Tính đúng số dư tích lũy (`Total Income - Total Expense`).
   * Tính đúng chênh lệch tháng (`Monthly Net`).

### 5.2 Integration Tests (`@SpringBootTest` + `MockMvc`)
Kiểm thử tích hợp luồng từ Controller $\rightarrow$ Service $\rightarrow$ JPA Repository $\rightarrow$ Database:
1. `AuthControllerIntegrationTest`: Đăng ký tài khoản $\rightarrow$ Đăng nhập lấy JWT $\rightarrow$ Sử dụng JWT gọi `GET /api/users/me`.
2. `TransactionControllerIntegrationTest`: Tạo giao dịch hợp lệ qua API trả về `201 Created` $\rightarrow$ Thử gọi với amount âm trả về `400 Bad Request`.
3. `BudgetControllerIntegrationTest`: Gọi `POST /api/budgets` lần 1 (tạo) $\rightarrow$ Gọi lần 2 với số tiền khác (cập nhật).

### 5.3 API Testing (Postman Collection)
Bộ Postman collection có môi trường biến (`{{jwt_token}}`, `{{base_url}}`) với test script tự động kiểm tra status code và schema JSON cho 100% endpoints.
