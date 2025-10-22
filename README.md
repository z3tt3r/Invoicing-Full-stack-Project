# 💼 Invoicing Full-Stack Project

A lightweight full-stack invoicing app built with **Spring Boot** and **React**.  
Designed as a clean example of full-stack architecture for portfolio and learning purposes.

---

## 🧭 Overview

| Layer | Stack | Description |
|-------|-------|-------------|
| **Backend** | Java 17 · Spring Boot · JPA · MySQL | REST API for managing people, invoices and statistics |
| **Frontend** | React 18 · Bootstrap · Axios | Simple UI for listing and editing invoices |
| **Database** | MySQL (local) | Schema and demo data defined in SQL scripts |

---

## 🗂️ Project structure

```
invoicing-fullstack/
├── invoice-server-starter/     # Spring Boot backend
└── invoice-client-starter/     # React frontend sources (src-fe/)
```

---

## ⚙️ Backend

- **Spring Boot 3 + Spring Data JPA**
- Validation with JSR-380 annotations  
- Mapping via **MapStruct**  
- **Soft delete** using a hidden flag  
- Demo data loaded from `data.sql`  
- OpenAPI docs via `springdoc-openapi` (Swagger UI → `/swagger-ui`)

**Run the backend**

```bash
cd invoice-server-starter
./mvnw spring-boot:run
# or: mvn spring-boot:run
```

API available at [`http://localhost:8080`](http://localhost:8080)

---

## 💻 Frontend

- **React 18** with functional components and hooks  
- **Bootstrap 5** for UI styling  
- Axios-based API helpers in `src-fe/utils/api.js`  
- Simple routing and local state management  

**Run the client (manual setup):**
If not yet configured as an NPM project, run directly in your IDE or add a basic `package.json` with React scripts.

Example:
```bash
cd invoice-client-starter
npm install
npm start
```

UI available at [`http://localhost:3000`](http://localhost:3000)

---

## 🧪 Testing

**Backend integration tests**

```bash
cd invoice-server-starter
./mvnw test
```

Frontend tests (if available):
```bash
cd invoice-client-starter
npm test
```

---

## 🧰 Development notes

- Java 17+, Node.js 18+ required  
- Keep DTOs and API contracts in sync between backend & frontend  
- Format and lint before committing  
- Semantic commit messages are encouraged (`feat:`, `fix:`, `chore:`)

---

## 🗓️ Changelog

| Version | Changes |
|----------|----------|
| **0.1.0** | Initial setup with working backend & frontend |
| **0.2.0** | Cleanup of unused code, updated README and docs |

---

## 📄 License

This project is licensed under the **MIT License**.

© 2025 — Created by [Michal "Z3TT3R" Musil].  
Feel free to fork, learn and build upon it.
