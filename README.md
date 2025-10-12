# 💼 Invoicing Full-Stack Project

A lightweight full-stack invoicing app built with **Spring Boot** and **React**.  
Designed as a clean example of full-stack architecture for portfolio and learning purposes.

---

![Java](https://img.shields.io/badge/Java-17-blue?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 🧭 Overview

| Layer | Stack | Description |
|-------|--------|-------------|
| **Backend** | Java 17 · Spring Boot · JPA | REST API for managing people and invoices. |
| **Frontend** | React 18 · Axios | Simple UI for listing and editing invoices. |
| **Database** | H2 (dev) · PostgreSQL (prod) | Schema and demo data defined in SQL scripts. |

---

## 🗂️ Project structure

```
invoicing-fullstack/
├── invoice-server-starter/   # Spring Boot backend
└── invoice-client-starter/   # React frontend
```

### Backend
- Spring Boot 3.x + Spring Data JPA  
- MapStruct for DTO ↔ entity mapping  
- Validation with JSR-380 annotations  
- Soft delete using a `hidden` flag  
- Demo data loaded from `data.sql`

Run the backend:
```bash
cd invoice-server-starter
./mvnw spring-boot:run
```
API: **http://localhost:8080**

### Frontend
- React 18 with functional components and hooks  
- Axios-based API helpers in `src/api/`  
- React Router for navigation  
- Simple local state management (no Redux)

Run the client:
```bash
cd invoice-client-starter
npm install
npm start
```
UI: **http://localhost:3000**

---

## 🧪 Testing

Backend integration tests use an in-memory H2 profile:

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
- Keep DTOs in sync between backend & frontend  
- Lint & format before committing  
- Semantic commit messages are encouraged (`feat:`, `fix:`, `chore:`)

---

## 🗓️ Changelog

| Version | Changes |
|----------|----------|
| **0.1.0** | Initial setup with working backend & frontend |
| **0.2.0** | Cleanup of unused code, improved README and docs |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

_© 2025 — Created by [Michal 'Z3TT3R' Musil]. Feel free to fork, learn, and build upon it._
