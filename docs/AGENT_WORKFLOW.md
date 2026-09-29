# AI AGENT WORKFLOW & CONTROL PROTOCOL

## Project: Personal Expense Tracker
**Document Version:** 1.0.0  
**Target:** Kiểm soát tuyệt đối quá trình AI Agent sinh và sửa mã nguồn (Rubric Y1 + Y2c)  

---

## 1. Mục đích & Nguyên tắc cốt lõi

Quy trình này biến việc sử dụng AI ("vibe coding") từ một hành động phó mặc thành một **quy trình kỹ thuật có kiểm soát chặt chẽ**.

> **Nguyên tắc bất biến:**  
> Agent được phép viết code, nhưng Developer phải biết code đó nằm ở đâu, tại sao nó tồn tại, nó liên quan đến thành phần nào, và làm sao chứng minh nó chạy đúng trước khi đưa vào Git history.

---

## 2. Quy tắc biên giới của Agent (Agent Boundaries)

### 2.1 Agent MUST (Bắt buộc phải làm)
* **Tuân thủ tuyệt đối tài liệu đặc tả:** Mọi thay đổi phải bám sát `REQUIREMENTS.md`, `ARCHITECTURE.md`, `DATABASE.md`, và `FEATURE_MAP.md`.
* **Giới hạn phạm vi (Strict Scoping):** Chỉ sửa đổi đúng các file liên quan trực tiếp đến micro-task được giao.
* **Kèm theo kiểm thử tự động (Test-driven delivery):** Mọi logic mới tại Service/Controller đều phải đi kèm Unit Test hoặc Integration Test tương ứng.
* **Giải trình thay đổi:** Trước và sau khi sửa, Agent phải giải thích rõ file nào được tạo mới/sửa đổi và mục đích của từng thay đổi.
* **Bảo vệ tính tương thích:** Không được làm gãy các test case hoặc tính năng đã pass trước đó (Zero Regression).
* **Tuân thủ kiến trúc Package-by-Feature:** Đặt class đúng package nghiệp vụ, không tạo cấu trúc lộn xộn.

### 2.2 Agent MUST NOT (Tuyệt đối không được làm)
* ❌ **Không tự ý refactor các module không liên quan:** Nghiêm cấm sửa đổi lan man sang các file ngoài task.
* ❌ **Không tự ý thay đổi Database schema:** Không thêm/xóa cột hay thay đổi ràng buộc CSDL nếu không có yêu cầu rõ ràng.
* ❌ **Không tự ý thêm dependency mới:** Chỉ sử dụng các thư viện đã được phê duyệt trong danh mục Dependency Baseline (Spring Web, Data JPA, Security, Validation, PostgreSQL, Lombok, JJWT). Không tự cài thêm các thư viện lạ vào `pom.xml` hoặc `package.json`.
* ❌ **Không bypass hoặc disable test:** Tuyệt đối không dùng `@Disabled`, comment test case, hoặc thêm flag `-DskipTests` để né lỗi.
* ❌ **Không hạ thấp chuẩn validation:** Không bỏ các annotation validation (`@NotNull`, `@Positive`, `@PastOrPresent`) khi test không pass.
* ❌ **Không hard-code secrets:** Không ghi mật khẩu, JWT secret, hoặc chuỗi kết nối nhạy cảm vào file code Java hay TypeScript.

---

## 3. Quy trình 7 bước lặp của Agent (The 7-Step Iterative Cycle)

Mọi feature hay bug fix đều phải tuần tự trải qua chu trình sau:

```text
┌──────────────────────────────────────────────┐
│ 1. Xác định Task & Tiêu chí nghiệm thu      │
│    (Requirement & Acceptance Criteria)       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 2. Soạn Prompt có cấu trúc rõ ràng           │
│    (Scope, Files, Rules, Constraints)        │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 3. Agent thực thi & sinh mã nguồn             │
│    (Implementation in isolated branch)       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 4. Kiểm tra Git Diff (`git status / diff`)   │
│    (Bác bỏ mọi thay đổi nằm ngoài scope)     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 5. Kiểm thử tự động (`mvn test`)             │
│    (Happy path + Boundary + Exception)       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 6. Review & Sửa lỗi (nếu có)                 │
│    (Fix bug ngay tại chỗ, chạy lại test)     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 7. Commit theo chuẩn Conventional Commits    │
│    (feat:, test:, fix:, docs:)               │
└──────────────────────────────────────────────┘
```

---

## 4. Mẫu Prompt chuẩn giao task cho Agent

Khi yêu cầu Agent thực hiện một tính năng, luôn sử dụng cấu trúc prompt mẫu sau:

```text
TASK: Implement [Tên tính năng, ví dụ: POST /api/transactions]
FEATURE CODE: [Mã tính năng, ví dụ: F04]
BRANCH: [Tên branch, ví dụ: feature/transaction]

PHẠM VI THAY ĐỔI DỰ KIẾN:
- Controller: com.example.expense.transaction.TransactionController
- Service: com.example.expense.transaction.TransactionService
- DTO: TransactionRequest, TransactionResponse
- Test: TransactionServiceTest

QUY TẮC BẮT BUỘC (BUSINESS RULES):
- BR01: Số tiền > 0 (@Positive)
- BR02: Kiểm tra quyền sở hữu transaction thuộc user hiện tại
- BR03: Kiểm tra category.type khớp với transaction.type
- BR07: Ngày giao dịch <= LocalDate.now()

RÀNG BUỘC KỸ THUẬT:
- KHÔNG thay đổi file ngoài package transaction/
- KHÔNG thêm dependency mới vào pom.xml
- KHÔNG hardcode secret
- Viết Unit Test bao phủ: amount hợp lệ, amount <= 0, ngày tương lai, sai category type, và test case IDOR.
```

---

## 5. Checklist kiểm soát Git Diff trước khi Commit

Trước mỗi lần gõ `git commit`, Developer bắt buộc kiểm tra 6 câu hỏi:

1. **Scope Check:** Các file trong `git status` có đúng danh sách dự kiến không? Có file lạ nào bị sửa nhầm không?
2. **Logic Check:** `git diff` có đoạn code nào Agent tự ý sinh thêm mà không có trong spec không?
3. **Dependency Check:** `pom.xml` hoặc `package.json` có bị thêm thư viện mới không?
4. **Security Check:** Có mật khẩu, token, hoặc secret nào bị hardcode không?
5. **Test Check:** Lệnh `./mvnw test` hoặc `mvn test` có chạy pass 100% không? Có test case nào bị tắt (`@Disabled`) không?
6. **Error Handling Check:** Ngoại lệ có được ném đúng lớp `BusinessException` / `ResourceNotFoundException` để `GlobalExceptionHandler` bắt không?

---

## 6. Chiến lược phân nhánh & Đặt tên Commit

### 6.1 Cấu trúc nhánh (Git Branching Strategy)
```text
main                # Nhánh production ổn định
  └── develop       # Nhánh tích hợp chính
        ├── feature/auth
        ├── feature/transaction
        ├── feature/category
        ├── feature/budget
        ├── feature/dashboard
        └── feature/report
```

### 6.2 Chuẩn thông điệp Commit (Conventional Commits)
* `feat:` Tính năng mới (ví dụ: `feat: implement transaction creation with validation`)
* `test:` Bổ sung hoặc cập nhật test (ví dụ: `test: add unit tests for budget upsert logic`)
* `fix:` Sửa lỗi (ví dụ: `fix: prevent future date in transaction creation`)
* `docs:` Cập nhật tài liệu (ví dụ: `docs: add agent workflow and control protocol`)
* `refactor:` Tối ưu code không đổi logic (ví dụ: `refactor: extract budget threshold properties`)
