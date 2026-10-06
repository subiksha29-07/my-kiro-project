# Smart Expense Tracker

> A fully client-side personal finance web application built with Next.js 14, TypeScript, and Tailwind CSS.  
> No backend. No account required. All data stays in your browser.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-1-6e9f18?logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Overview

Smart Expense Tracker is a personal finance application that lets you record income and expense transactions, monitor your current balance, and track monthly spending against a self-defined budget — all without any server, database, or login.

Every piece of data is stored in the browser's `localStorage` and remains private to your device. The application is built on Next.js 14 with the App Router, written entirely in TypeScript, and styled with Tailwind CSS.

The project was developed as a **Kiro University** showcase, applying spec-driven development, property-based testing, AI steering documents, automation hooks, a custom Power, an MCP server, and a custom agent — all within a single cohesive codebase.

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Dashboard Features](#dashboard-features)
- [Transaction Management](#transaction-management)
- [Category Management](#category-management)
- [Testing Approach](#testing-approach)
- [Project Architecture](#project-architecture)
- [Kiro Workflow](#kiro-workflow)
- [Kiro Hooks](#kiro-hooks)
- [Kiro Powers](#kiro-powers)
- [MCP Configuration](#mcp-configuration)
- [Custom Agent](#custom-agent)
- [Setup Instructions](#setup-instructions)
- [Running Tests](#running-tests)
- [Folder Structure](#folder-structure)

---

## Screenshots

### Dashboard
![Dashboard — summary cards and budget widget](public/screenshots/dashboard.png)

*Real-time summary cards showing Total Income, Total Expenses, and Current Balance. Budget progress bar and Quick Actions panel.*

### Transaction List
![Transaction list with entries](public/screenshots/transaction-list.png)

*All transactions listed with type indicator, category badge, date, and amount. Filter dropdowns for Type and Category.*

### Add Transaction Form
![Add Transaction form](public/screenshots/add-transaction.png)

*Form for adding a new transaction with type, amount, date, title, category, and optional description fields.*

### Category Manager
![Category Manager modal](public/screenshots/category-manager.png)

*Modal for managing custom expense and income categories. Changes apply to the transaction form and filter dropdowns.*

---

## Features

The Smart Expense Tracker implements the following core features:

- **Dashboard** — real-time summary of total income, total expenses, and current balance
- **Monthly Budget** — set a spending limit and track progress with a visual bar
- **Transaction Management** — add, edit, delete, filter, and sort income and expense records
- **Category Management** — create and remove custom categories for both income and expenses
- **Data Persistence** — all data is saved to `localStorage` and survives page refreshes
- **Empty State Handling** — the dashboard shows a clear call-to-action when no transactions exist
- **Delete Confirmation** — a confirmation dialog prevents accidental transaction deletion
- **Stale-Update Protection** — optimistic concurrency prevents silent overwrites during edits
