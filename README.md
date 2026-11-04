# DocU

Paste your essay, fill in a few details, and get back a correctly formatted APA or MLA PDF: header, title, body and works-cited page included.

DocU is a full-stack app with a Spring Boot API and a React frontend. Documents are saved to your account, so you can come back and download any of them again later.

## Features

- **APA and MLA formatting**: headers, spacing and a works-cited page, generated with Apache PDFBox
- **Saved documents**: every document is stored with its details and citations, and the PDF is rebuilt from them whenever you download it
- **Accounts**: sign up and log in with JWT authentication in an HTTP-only cookie, with BCrypt-hashed passwords
- **One formatter per style**: each citation style implements a shared `StyleFormatter` interface, so adding a style doesn't touch the PDF generator

## Tech stack

| Layer | Stack |
|---|---|
| Backend | Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA, MapStruct, Lombok, JJWT |
| PDF | Apache PDFBox 3 |
| Database | PostgreSQL |
| Frontend | React 19, React Router, Zustand, Tailwind CSS, Axios, Vite |

## Getting started

### Prerequisites

- Java 21
- Maven
- Node.js (LTS)
- PostgreSQL

### 1. Database

Create a database for the app:

```bash
createdb docu
```

### 2. Backend

create `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/docu
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

Then run the API (it serves on `http://localhost:8080`):

```bash
mvn spring-boot:run
```

### 3. Frontend

```bash
cd frontend-docu/docu-frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API

Every route except sign-up, login and logout needs the `accessToken` cookie that login sets.

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/account` | Create an account |
| `POST` | `/api/account/login` | Log in and set the auth cookie |
| `POST` | `/api/account/logout` | Clear the auth cookie |
| `GET` | `/api/account/user` | The logged-in user |
| `POST` | `/api/document/generate/{userId}` | Save a document and return its PDF |
| `GET` | `/api/document/generate/{userId}/{docId}` | Rebuild and download a saved document |
| `GET` | `/api/document/user/{userId}` | List a user's documents |
| `DELETE` | `/api/document/{docId}` | Delete a document |

## Project structure

```
DocU/
├── src/main/java/com/ryan/docu/
│   ├── controller/          # Document and user endpoints
│   ├── service/
│   │   └── generators/      # PdfGeneratorService + ApaFormatter, MlaFormatter
│   ├── security/            # Spring Security config, JWT filter, accounts
│   ├── model/               # JPA entities, DTOs, enums
│   ├── mapper/              # MapStruct mappers
│   └── repo/                # Spring Data repositories
└── frontend-docu/docu-frontend/
    └── src/
        ├── components/      # Auth screens, dashboard, document modal
        ├── stores/          # Zustand auth store
        └── api/             # Axios service calls
```

## Notes

- The JWT signing key is generated each time the server starts, so a restart logs everyone out. Sessions last 30 minutes.
- The auth cookie is not marked `Secure`, so the app is set up for local development over HTTP.

## Roadmap

- [ ] Chicago and Harvard styles
- [ ] Export to `.docx`
