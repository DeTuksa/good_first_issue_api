# 🧐 Good First Issue Dashboard – Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS logo" />
</p>

<p align="center">
  <b>A backend API that helps developers discover GitHub issues labeled <code>good first issue</code> by language or topic.</b>
</p>

---

## 📘 Table of Contents

* [✨ Features](#-features)
* [📦 Installation](#-installation)
* [⚙️ Configuration](#%ef%b8%8f-configuration)
* [🚀 Running the App](#-running-the-app)
* [🧪 Testing](#-testing)
* [📢 API Usage](#-api-usage)
* [📁 Project Structure](#-project-structure)
* [📚 Contributing](#-contributing)
* [🛡 License](#-license)

---

## ✨ Features

* ✅ Fetches GitHub issues tagged with `good first issue`.
* 🔍 Supports filtering by language and topic.
* ⚡ Built with [NestJS](https://nestjs.com) + [GitHub REST API v3](https://docs.github.com/en/rest).
* 🧪 Includes unit and integration tests (Jest + Supertest).
* 📦 Modular and scalable backend architecture.
* 📊 Simple and ready for frontend dashboard integration.

---

## 📦 Installation

```bash
git clone https://github.com/DeTuksa/good_first_issue_api.git
cd good_first_issue_api
npm install
```

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
GITHUB_TOKEN=your_personal_github_token
```

This token is used to authenticate requests to the GitHub API to avoid rate limits.

---

## 🚀 Running the App

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end (integration) tests
npm run test:e2e

# Code coverage
npm run test:cov
```

---

## 📢 API Usage

### `GET /github/issues`

Fetches GitHub issues labeled `good first issue`.

**Query Parameters:**

| Parameter | Type   | Description                               |
| --------- | ------ | ----------------------------------------- |
| language  | string | (Optional) Filter by programming language |
| topic     | string | (Optional) Filter by repository topic     |

**Example Request:**

```bash
GET /github/issues?language=typescript&topic=nestjs
```

**Example Response:**

```json
[
  {
    "title": "Fix input validation bug",
    "url": "https://github.com/org/repo/issues/123",
    "repository": "https://api.github.com/repos/org/repo",
    "created_at": "2025-05-14T10:00:00Z",
    "labels": ["good first issue", "bug"]
  }
]
```

---

## 📁 Project Structure

```
src/
├── github/
│   ├── github.controller.spec.ts      # Controller unit tests
│   ├── github.controller.ts         # Handles API routes 
│   ├── github.module.ts
│   ├── github.service.spec.ts    # Unit tests
│   └── github.service.ts # Business logic and GitHub API requests
├── app.module.ts

test/
├── github.e2e-spec.ts            # End-to-end tests (Supertest)

.env.example                      # Sample env config
```

---

## 📚 Contributing

We welcome contributions of all kinds!

### 🛠 How to Contribute

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit: `git commit -m 'feat: your message'`.
4. Push to your fork: `git push origin feature/your-feature-name`.
5. Submit a pull request.

### ✅ Guidelines

* Follow conventional commit messages (e.g. `feat:`, `fix:`, `docs:`).
* Write or update tests for any changes.
* Ensure all tests pass: `npm run test`.

Check out [`CONTRIBUTING.md`](CONTRIBUTING.md) for full details.

---

## 🛡 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

* [NestJS](https://nestjs.com)
* [GitHub REST API](https://docs.github.com/en/rest)
* [Supertest](https://github.com/visionmedia/supertest)
* [Jest](https://jestjs.io/)
