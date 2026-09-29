# Personal Expense Tracker (Hệ thống quản lý thu chi cá nhân)

Ứng dụng web quản lý thu chi cá nhân được thiết kế và xây dựng theo phương pháp Pair Programming với AI Agent, tối ưu cho việc kiểm soát mã nguồn, kiểm thử tự động và vấn đáp bảo vệ đồ án (Viva Defense).

---

## 📁 Cấu trúc thư mục dự án

```text
personal-expense-tracker/
│
├── docs/                           # Tài liệu đặc tả kỹ thuật (Phase 0)
│   ├── REQUIREMENTS.md             # Phạm vi, 7 Business Rules, Functional/Non-functional & Testing
│   ├── ARCHITECTURE.md             # Kiến trúc Monolithic Layered, Package-by-Feature, Sequence diagrams
│   ├── DATABASE.md                 # Thiết kế PostgreSQL (4 bảng), Data Integrity Matrix, ERD
│   └── FEATURE_MAP.md              # Traceability Matrix, Viva Defense Cheat Sheet
│
├── backend/                        # Backend REST API (Spring Boot 3, Java 17/21, PostgreSQL)
│   └── README.md
│
├── frontend/                       # Frontend Web App (React 18+, TypeScript, Vite)
│   └── README.md
│
├── .gitignore                      # Git ignore cho Java/Maven và React/Node
└── README.md                       # Tài liệu tổng quan dự án
```

---

## 📚 Project Specifications (Phase 0)

Toàn bộ tài liệu đặc tả kiến trúc và thiết kế hệ thống đã được hoàn thiện trong thư mục `docs/`:

1. [docs/REQUIREMENTS.md](file:///C:/Users/admin/.gemini/antigravity-ide/scratch/personal-expense-tracker/docs/REQUIREMENTS.md) — Đặc tả yêu cầu chức năng (FR), phi chức năng (NFR), phạm vi (Scope F01–F14), 7 quy tắc nghiệp vụ cốt lõi (Business Rules BR01–BR07), và yêu cầu kiểm thử (Testing Requirements).
2. [docs/ARCHITECTURE.md](file:///C:/Users/admin/.gemini/antigravity-ide/scratch/personal-expense-tracker/docs/ARCHITECTURE.md) — Kiến trúc tổng thể Monolithic Layered, cấu trúc thư mục Package-by-Feature, luồng bảo mật JWT Stateless, và cơ chế xử lý lỗi tập trung.
3. [docs/DATABASE.md](file:///C:/Users/admin/.gemini/antigravity-ide/scratch/personal-expense-tracker/docs/DATABASE.md) — Thiết kế Database PostgreSQL chi tiết (4 bảng: `users`, `categories`, `transactions`, `budgets`), sơ đồ ERD, Data Integrity Matrix, chỉ mục tối ưu và kiểu dữ liệu `NUMERIC(15, 2)`.
4. [docs/FEATURE_MAP.md](file:///C:/Users/admin/.gemini/antigravity-ide/scratch/personal-expense-tracker/docs/FEATURE_MAP.md) — Bản đồ truy vết tính năng (Traceability Matrix), Feature Dependency Map, và cẩm nang trả lời nhanh các câu hỏi xoáy khi vấn đáp (Tiêu chí Y1, Y2a, Y2b, Y2c, Y3).

---

## 🛠 Tech Stack

* **Frontend:** React 18+, TypeScript, Vite, React Router, Axios
* **Backend:** Java 17/21, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security, JWT, Bean Validation, Lombok
* **Database:** PostgreSQL 15+
* **Testing:** JUnit 5, Mockito, Spring Boot Test, MockMvc, Postman
