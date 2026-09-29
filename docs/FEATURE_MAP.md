# FEATURE TRACEABILITY MAP

## Project: Personal Expense Tracker

**Document Version:** 1.2.0  
**Purpose:** Bản đồ truy vết mã nguồn (Traceability Matrix) phục vụ trực tiếp cho việc phát triển, review code, kiểm thử và trả lời vấn đáp (Viva Exam). Tài liệu cho phép xác định nhanh vị trí Frontend, Backend, Database và Test/Verification của từng tính năng.

---

# 1. Master Feature Traceability Matrix

| Mã      | Tên tính năng                      | Frontend Location                                                                                                                                   | Backend Location                                                                                                                                                                                                 | Database / Data Source            | Test / Verification Location                                                  |
| ------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| **F01** | **User Registration**              | `frontend/src/features/auth/RegisterPage.tsx`<br>`authService.ts`                                                                                   | `auth/AuthController.java`<br>`auth/AuthService.java`<br>`auth/RegisterRequest.java`                                                                                                                             | `users`                           | `AuthServiceTest.java`<br>`AuthControllerIntegrationTest.java`                |
| **F02** | **Login & Stateless Logout**       | `frontend/src/features/auth/LoginPage.tsx`<br>`frontend/src/contexts/AuthContext.tsx`<br>`authService.ts`                                           | `auth/AuthController.java`<br>`auth/AuthService.java`<br>`config/SecurityConfig.java`<br>`config/JwtAuthenticationFilter.java`                                                                                   | `users`                           | `AuthServiceTest.java`<br>`AuthControllerIntegrationTest.java`                |
| **F03** | **Profile & Change Password**      | `frontend/src/features/auth/ProfilePage.tsx`                                                                                                        | `user/UserController.java`<br>`user/UserService.java`<br>`user/ChangePasswordRequest.java`                                                                                                                       | `users`                           | `UserServiceTest.java`<br>`UserControllerIntegrationTest.java`                |
| **F04** | **Transaction CRUD & Filter**      | `frontend/src/features/transactions/TransactionListPage.tsx`<br>`TransactionFormModal.tsx`<br>`TransactionFilterBar.tsx`<br>`transactionService.ts` | `transaction/TransactionController.java`<br>`transaction/TransactionService.java`<br>`transaction/TransactionRepository.java`<br>`transaction/TransactionRequest.java`<br>`transaction/TransactionResponse.java` | `transactions`<br>`categories`    | `TransactionServiceTest.java`<br>`TransactionControllerIntegrationTest.java`  |
| **F05** | **Category Management**            | `frontend/src/features/categories/CategoryListPage.tsx`<br>`categoryService.ts`                                                                     | `category/CategoryController.java`<br>`category/CategoryService.java`<br>`category/CategoryRepository.java`<br>`category/Category.java`<br>`category/CategoryType.java`                                          | `categories`                      | `CategoryServiceTest.java`<br>`CategoryControllerIntegrationTest.java`        |
| **F06** | **Monthly Budget (Upsert)**        | `frontend/src/features/budget/BudgetPage.tsx`<br>`BudgetProgressBar.tsx`<br>`budgetService.ts`                                                      | `budget/BudgetController.java`<br>`budget/BudgetService.java`<br>`budget/BudgetRepository.java`<br>`budget/BudgetProperties.java`<br>`budget/BudgetStatus.java`                                                  | `budgets`                         | `BudgetServiceTest.java`<br>`BudgetControllerIntegrationTest.java`            |
| **F07** | **Dashboard & Balance Summary**    | `frontend/src/features/dashboard/DashboardPage.tsx`<br>`RecentTransactionsCard.tsx`                                                                 | `dashboard/DashboardController.java`<br>`dashboard/DashboardService.java`<br>`dashboard/DashboardSummaryResponse.java`                                                                                           | `transactions`<br>`budgets`       | `DashboardServiceTest.java`<br>`DashboardControllerIntegrationTest.java`      |
| **F08** | **Financial Reports (6 Months)**   | `frontend/src/features/reports/ReportsPage.tsx`<br>`CategoryPieChart.tsx`<br>`MonthlyTrendChart.tsx`<br>`reportService.ts`                          | `report/ReportController.java`<br>`report/ReportService.java`                                                                                                                                                    | `transactions`<br>`categories`    | `ReportServiceTest.java`<br>`ReportControllerIntegrationTest.java`            |
| **F09** | **DTO Input Validation**           | Form validation and error display                                                                                                                   | `@Valid` trong Controller<br>`@NotNull`<br>`@Positive`<br>`@PastOrPresent`<br>`@Size`<br>`@Pattern` trong DTOs                                                                                                   | `NOT NULL`<br>`CHECK` constraints | `ValidationTest.java`<br>`ControllerValidationIntegrationTest.java`           |
| **F10** | **Global Exception Handling**      | Toast notifications / alert banners                                                                                                                 | `exception/GlobalExceptionHandler.java`<br>`exception/ErrorResponse.java`<br>`exception/BusinessException.java`<br>`exception/ResourceNotFoundException.java`                                                    | N/A                               | `GlobalExceptionHandlerTest.java`                                             |
| **F11** | **Logging & Auditing**             | Network error handling / developer console                                                                                                          | SLF4J + Logback trong Service layer                                                                                                                                                                              | N/A                               | `logs/app.log`<br>Log event verification                                      |
| **F12** | **Service Unit Testing**           | N/A                                                                                                                                                 | Tests tập trung tại Service layer                                                                                                                                                                                | N/A                               | `src/test/.../*ServiceTest.java`<br>JUnit 5 + Mockito                         |
| **F13** | **Controller Integration Testing** | N/A                                                                                                                                                 | Controller → Service → Repository                                                                                                                                                                                | PostgreSQL                        | `src/test/.../*ControllerIntegrationTest.java`<br>`@SpringBootTest` + MockMvc |
| **F14** | **Postman API Testing**            | N/A                                                                                                                                                 | Toàn bộ REST API                                                                                                                                                                                                 | PostgreSQL                        | `postman/expense-tracker.json`<br>Postman Collection / Test Results           |

---

# 2. Feature Dependency Map

Traceability không chỉ xác định file mà còn xác định dependency giữa các feature.

```text
F01 Registration
      ↓
F02 Login
      ↓
F03 Profile / Change Password
      ↓
Authentication Context
      ↓
────────────────────────────────────
↓              ↓          ↓        ↓
F04           F05        F06      F07
Transactions  Categories Budget   Dashboard
↓              ↓          ↓        ↓
└──────────────┴──────────┴────────┘
               ↓
              F08
            Reports
```

Validation, Exception Handling, Logging và Testing là các concern dùng chung:

```text
F09 Validation
F10 Exception Handling
F11 Logging
F12 Unit Testing
F13 Integration Testing
F14 Postman Testing
```

---

# 3. Viva Defense Cheat Sheet

## 3.1 Code Location & Architecture — Y2a

### Q: "Form thêm chi tiêu nằm ở đâu trên Frontend?"

Mở:

```text
frontend/src/features/transactions/TransactionFormModal.tsx
```

Component này chịu trách nhiệm giao diện và nhập dữ liệu.

Sau khi submit:

```text
TransactionFormModal.tsx
        ↓
transactionService.ts
        ↓
POST /api/transactions
```

---

### Q: "API tạo giao dịch nằm ở đâu?"

Mở:

```text
backend/src/main/java/com/example/expense/transaction/TransactionController.java
```

Tìm method có:

```java
@PostMapping
```

Controller nhận Request DTO và gọi:

```text
TransactionService.createTransaction(...)
```

Business logic không nằm trong Controller.

---

### Q: "Logic nghiệp vụ tạo transaction nằm ở đâu?"

Mở:

```text
backend/src/main/java/com/example/expense/transaction/TransactionService.java
```

Các rule quan trọng:

```text
amount > 0
category tồn tại
category thuộc user hiện tại hoặc là system category
transaction.type == category.type
transaction.date <= today
```

---

### Q: "Logic đổi mật khẩu nằm ở đâu?"

Mở:

```text
backend/.../user/UserController.java
```

Endpoint:

```text
PUT /api/users/me/password
```

Sau đó:

```text
UserController
      ↓
UserService.changePassword()
```

Service thực hiện:

```text
1. Kiểm tra currentPassword bằng BCrypt
2. Kiểm tra newPassword khác password cũ
3. Validate password mới
4. Hash password bằng BCrypt
5. Save user
```

Password hoặc password hash không được trả về Frontend.

---

# 4. Business Rule Traceability

## BR01 — Positive Monetary Amount

```text
Frontend
→ TransactionFormModal.tsx

Backend
→ TransactionRequest.java
→ TransactionService.java

Database
→ transactions.amount CHECK (amount > 0)

Tests
→ TransactionServiceTest.java
→ ValidationTest.java
```

Rule:

```text
amount > 0
```

---

## BR02 — Strict Data Ownership / IDOR Prevention

```text
Frontend
→ API request chứa resource ID

Backend
→ TransactionService.java
→ BudgetService.java
→ CategoryService.java

Database
→ user_id Foreign Key

Tests
→ TransactionServiceTest.java
→ Controller Integration Test
```

Ví dụ:

```java
transactionRepository.findByIdAndUserId(id, currentUserId)
```

hoặc:

```text
findById()
→ verifyOwnership()
```

User không được phép đọc, sửa hoặc xóa transaction của user khác.

Để tránh làm lộ sự tồn tại của resource, API có thể trả:

```text
404 Not Found
```

cho resource không tồn tại trong phạm vi user hiện tại.

---

## BR03 — Category / Transaction Type Consistency

Ví dụ:

```text
Transaction:
type = EXPENSE
```

thì:

```text
Category:
type = EXPENSE
```

Backend:

```text
TransactionService.java
```

kiểm tra trước khi lưu.

Database vẫn giữ:

```text
categories.type CHECK (type IN ('INCOME', 'EXPENSE'))
transactions.type CHECK (type IN ('INCOME', 'EXPENSE'))
```

Cross-entity rule được xử lý tại Service.

---

## BR04 — Single Budget per Month / Year

Business key:

```text
(user_id, month, year)
```

Backend:

```text
BudgetService.java
```

Flow:

```text
POST /api/budgets
      ↓
Search existing budget
      ↓
Not found → Create
Found     → Update
```

Database bảo vệ duplicate:

```sql
UNIQUE(user_id, month, year)
```

---

## BR05 — Configurable Budget Alert

Mở:

```text
backend/src/main/resources/application.yml
```

Ví dụ:

```yaml
app:
  budget:
    warning-threshold: 0.8
```

Backend:

```text
BudgetProperties.java
      ↓
BudgetService.java
```

Logic:

```text
usage < 80%
→ NORMAL

80% <= usage <= 100%
→ WARNING

usage > 100%
→ OVER_BUDGET
```

Threshold không được hard-code trong Service.

---

## BR06 — Dynamic Balance

Balance không được lưu dưới dạng một giá trị cumulative riêng trong `users`.

### Current Balance

```text
currentBalance
=
Total Income
-
Total Expense
```

Đây là balance toàn thời gian của user.

### Monthly Net

```text
monthlyNet
=
Current Month Income
-
Current Month Expense
```

Hai giá trị này được tính trong:

```text
dashboard/DashboardService.java
```

---

## BR07 — No Future Transaction Date

Frontend:

```text
TransactionFormModal.tsx
```

Backend:

```text
TransactionRequest.java
@PastOrPresent
```

và:

```text
TransactionService.java
```

Database:

```text
transaction_date NOT NULL
```

Không sử dụng:

```sql
CHECK (transaction_date <= CURRENT_DATE)
```

vì rule này được xử lý tại application layer.

---

# 5. Viva Questions About Requirement Changes

## Q: "Đổi password từ tối thiểu 6 ký tự thành 8 ký tự và bắt buộc ký tự đặc biệt thì sửa ở đâu?"

Mở:

```text
backend/.../auth/RegisterRequest.java
backend/.../user/ChangePasswordRequest.java
```

Ví dụ:

```java
@Size(min = 8)
@Pattern(...)
```

Sau đó cập nhật validation tương ứng ở Frontend.

Test cần cập nhật:

```text
UserServiceTest
ValidationTest
```

Điểm quan trọng:

```text
Requirement
    ↓
DTO Validation
    ↓
Frontend Validation
    ↓
Test
```

Không chỉ sửa giao diện.

---

## Q: "Đổi cảnh báo ngân sách từ 80% thành 70% thì sửa đâu?"

Mở:

```text
backend/src/main/resources/application.yml
```

Đổi:

```yaml
warning-threshold: 0.8
```

thành:

```yaml
warning-threshold: 0.7
```

Không cần sửa `BudgetService` nếu implementation sử dụng `BudgetProperties`.

---

## Q: "Nếu tạo ngân sách hai lần cùng tháng thì sao?"

Mở:

```text
BudgetService.java
```

Cơ chế:

```text
(userId, month, year)
        ↓
Find existing budget
        ↓
┌──────────────┬──────────────┐
│ Không có     │ Đã tồn tại   │
│              │              │
↓              ↓
Create         Update
```

Database có:

```sql
UNIQUE(user_id, month, year)
```

để bảo vệ toàn vẹn dữ liệu.

---

# 6. Viva Questions About Authentication & Security

## Q: "Logout của em có revoke JWT trên server không?"

Không.

Thiết kế sử dụng **stateless JWT**.

Logout thực hiện:

```text
Frontend
→ Remove JWT
→ Clear AuthContext
→ Redirect Login
```

Token đã phát hành vẫn hợp lệ cho đến khi:

```text
exp
```

hết hạn.

Project không sử dụng Redis blacklist/token store trong phiên bản MVP.

---

## Q: "Tại sao sử dụng localStorage?"

Lý do thiết kế:

```text
React SPA
+
Spring Boot REST API
+
JWT Stateless
```

`localStorage` giúp triển khai MVP đơn giản và dễ kiểm thử.

Tuy nhiên, token trong `localStorage` có rủi ro bị truy cập nếu ứng dụng có XSS.

Do đó project:

```text
Không sử dụng dangerouslySetInnerHTML
Không lưu password
Không log JWT
Không commit secret
```

HttpOnly Cookie là một phương án khác nhưng yêu cầu xử lý thêm:

```text
Cookie
SameSite
CSRF
CORS
```

---

# 7. Viva Questions About Database Design

## Q: "Làm sao phân biệt system category và custom category?"

Dựa trên:

```text
categories.user_id
```

### System Category

```text
user_id IS NULL
```

### Personal Category

```text
user_id = currentUserId
```

Do đó không cần:

```text
is_default
```

vì thông tin bị dư thừa.

---

## Q: "Tại sao transaction và category đều có type?"

Transaction:

```text
INCOME / EXPENSE
```

Category:

```text
INCOME / EXPENSE
```

Service phải đảm bảo:

```text
transaction.type == category.type
```

Điều này ngăn trường hợp:

```text
Transaction = EXPENSE
Category    = Tiền lương
```

Database kiểm tra domain value cơ bản, còn Service kiểm tra business relationship.

---

## Q: "Tại sao dùng BigDecimal thay vì double?"

Java:

```text
BigDecimal
```

PostgreSQL:

```text
NUMERIC(15,2)
```

Tiền tệ cần độ chính xác thập phân.

Không sử dụng:

```text
float
double
```

cho monetary calculation.

---

# 8. Viva Questions About Agent & Git — Y1 + Y2c

## Q: "Làm sao biết Agent không tự ý sửa file khác?"

Sau mỗi task:

```bash
git status
git diff
```

Kiểm tra:

```text
1. Những file nào thay đổi?
2. Có file ngoài scope không?
3. Agent có thêm dependency không?
4. Có sửa feature cũ không?
5. Có xóa code không?
6. Có thay đổi database ngoài yêu cầu không?
```

Nếu Agent thay đổi ngoài scope:

```text
Review
→ Reject / Revert
→ Re-run task với scope rõ hơn
```

---

## Q: "Tại sao chia Agent task thành nhiều task nhỏ?"

Thay vì:

```text
Build the entire application
```

sử dụng:

```text
Task 1
Implement registration

Task 2
Implement login

Task 3
Implement transaction creation

Task 4
Implement transaction update/delete

Task 5
Implement budget

...
```

Mỗi task có:

```text
Requirement
Expected files
Constraints
Tests
Acceptance criteria
```

Điều này giúp kiểm soát:

```text
Scope
Diff
Regression
Bug
```

---

# 9. Definition of Done

Một feature không được xem là hoàn thành chỉ vì Agent đã tạo code.

```text
Requirement
    ↓
Design
    ↓
Agent Implementation
    ↓
Git Diff Review
    ↓
Unit Test
    ↓
Integration Test
    ↓
Bug Fix
    ↓
Documentation
    ↓
Commit
```

Một feature đạt Definition of Done khi đáp ứng:

```text
[✓] Requirement implemented
[✓] Business rules correct
[✓] Authorization checked
[✓] Tests pass
[✓] No unrelated diff
[✓] No sensitive information leaked
[✓] Documentation updated
```

---

# 10. Skill / Agent Workflow Traceability

Để đáp ứng phần skill usage, Agent workflow được chia thành các nhóm:

## Architecture Skill

Mục tiêu:

```text
Requirement
→ Identify affected modules
→ Identify affected files
→ Check dependencies
→ Plan changes
```

## Implementation Skill

Mục tiêu:

```text
DTO
→ Controller
→ Service
→ Repository
→ Test
```

## Code Review Skill

Kiểm tra:

```text
Correctness
Security
Naming
Duplication
Unnecessary changes
Architecture violation
```

## Testing Skill

Kiểm tra:

```text
Happy Path
Boundary Cases
Invalid Input
Exception Cases
Authorization
Business Rules
Regression
```

---

# 11. Developer Effectiveness Traceability

Khi đánh giá Agent hoặc thành viên nhóm, không chỉ nhìn số dòng code.

Các tiêu chí:

| Tiêu chí           | Cách kiểm tra                     |
| ------------------ | --------------------------------- |
| Feature completion | Requirement / Acceptance Criteria |
| Correctness        | Expected behavior + Test          |
| Test coverage      | Unit + Integration Test           |
| Bug rate           | Issue / Bug history               |
| Diff quality       | `git diff`                        |
| Regression         | Existing test suite               |
| Code quality       | Code Review                       |
| Documentation      | README / Docs                     |
| Security           | Authorization + Validation Review |
| Commit quality     | Git history                       |

Mục tiêu là đánh giá **kết quả và chất lượng thay đổi**, không chỉ số lượng code.

---

# 12. Quick Navigation Map

Khi giảng viên hỏi một feature, có thể điều hướng theo bảng sau:

```text
LOGIN
→ frontend/src/features/auth/LoginPage.tsx
→ backend/.../auth/AuthController.java
→ backend/.../auth/AuthService.java
→ backend/.../config/JwtAuthenticationFilter.java

ADD EXPENSE
→ frontend/src/features/transactions/TransactionFormModal.tsx
→ backend/.../transaction/TransactionController.java
→ backend/.../transaction/TransactionService.java
→ transactions

CHANGE PASSWORD
→ frontend/src/features/auth/ProfilePage.tsx
→ backend/.../user/UserController.java
→ backend/.../user/UserService.java
→ users

CATEGORY
→ frontend/src/features/categories/
→ backend/.../category/
→ categories

BUDGET
→ frontend/src/features/budget/
→ backend/.../budget/
→ budgets

DASHBOARD
→ frontend/src/features/dashboard/
→ backend/.../dashboard/
→ transactions + budgets

REPORT
→ frontend/src/features/reports/
→ backend/.../report/
→ transactions + categories

VALIDATION
→ DTO + @Valid
→ F09 tests

EXCEPTION
→ exception/GlobalExceptionHandler.java

LOGGING
→ SLF4J / Logback
→ logs/app.log

UNIT TEST
→ src/test/.../*ServiceTest.java

INTEGRATION TEST
→ src/test/.../*ControllerIntegrationTest.java

POSTMAN
→ postman/expense-tracker.json
```

---

# 13. Feature Traceability Principle

Mỗi tính năng phải có khả năng truy vết theo chuỗi:

```text
Requirement
    ↓
Frontend
    ↓
API Endpoint
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
    ↓
Test
    ↓
Git Commit
```

Ví dụ:

```text
"User tạo một khoản chi tiêu"
          ↓
F04 Transaction
          ↓
TransactionFormModal.tsx
          ↓
POST /api/transactions
          ↓
TransactionController.java
          ↓
TransactionService.java
          ↓
TransactionRepository.java
          ↓
transactions
          ↓
TransactionServiceTest.java
          ↓
git commit
```

Đây là nguyên tắc chính để chứng minh developer có thể **truy vết, kiểm soát, sửa đổi và kiểm thử code do AI Agent tạo ra**.
