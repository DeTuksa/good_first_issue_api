# Contributing to Good First Issue API

Thanks for considering contributing to the **Good First Issue API** project! We welcome all kinds of contributions including bug fixes, feature development, documentation, tests, and improvements.

## 📋 Table of Contents

* [Code of Conduct](#code-of-conduct)
* [How to Contribute](#how-to-contribute)
* [Running the Project Locally](#running-the-project-locally)
* [Commit Message Guidelines](#commit-message-guidelines)
* [Pull Request Process](#pull-request-process)
* [Reporting Issues](#reporting-issues)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

---

## How to Contribute

1. **Fork** the repository
2. **Clone** your fork

   ```bash
   git clone https://github.com/DeTuksa/good_first_issue_api.git
   cd good_first_issue_api
   ```
3. **Install** dependencies

   ```bash
   npm install
   ```
4. Create a new **feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Make your changes with **clear commits**
6. Write **unit or integration tests** if applicable
7. Make sure tests pass:

   ```bash
   npm run test
   ```
8. **Push** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```
9. Submit a **Pull Request**

---

## Running the Project Locally

```bash
# Start in dev mode
npm run start:dev

# Run tests
npm run test
```

Make sure to set up a `.env` file with your GitHub token:

```env
GITHUB_TOKEN=your_personal_token
```

---

## Commit Message Guidelines

We follow **Conventional Commits**:

```
type(scope): description
```

**Examples:**

* `feat(github): add language and topic filters`
* `fix(api): correct query parameter parsing`
* `docs(readme): update usage instructions`

---

## Pull Request Process

* Keep PRs focused and small.
* Reference related issue numbers in your PR (e.g., `Closes #42`).
* Include relevant tests and pass linting.
* Fill out the PR description template.

---

## Reporting Issues

1. Search existing issues before submitting.
2. Create a new issue with a descriptive title and detailed information.
3. Include logs, screenshots, or steps to reproduce if applicable.

---

Thank you for helping us improve this project!
