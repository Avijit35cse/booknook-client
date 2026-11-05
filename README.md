# BookNook – A Small Online Library

A calm, modern online library for discovering books, managing a personal collection, and keeping track of every borrow. BookNook pairs a polished, responsive reading experience with a secure full-stack borrowing workflow.

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&amp;logo=nextdotjs&amp;logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&amp;logo=react&amp;logoColor=black" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&amp;logo=typescript&amp;logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&amp;logo=tailwindcss&amp;logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.better-auth.com/"><img src="https://img.shields.io/badge/Better_Auth-1.7-635BFF?style=flat-square" alt="Better Auth" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&amp;logo=express&amp;logoColor=white" alt="Express" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&amp;logo=mongodb&amp;logoColor=white" alt="MongoDB" /></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&amp;logo=vercel&amp;logoColor=white" alt="Deployed on Vercel" /></a>
</p>

**Live website:** [booknook-client-new.vercel.app](https://booknook-client-new.vercel.app/)

---

## Overview

BookNook is a full-stack library application built around a simple idea: borrowing a book should feel as considered as reading one. Visitors can browse the catalogue and inspect each title, while signed-in readers can add books, manage their own listings, borrow available copies, and return them when they are finished.

The project is split into two repositories:

| Part | Repository |
| --- | --- |
| Client (this repository) | [Avijit35cse/booknook-client](https://github.com/Avijit35cse/booknook-client) |
| Server and API | [Avijit35cse/booknook-server](https://github.com/Avijit35cse/booknook-server) |

## Tech Stack

**Client**

- Next.js 16 with the App Router and React 19
- TypeScript 5
- Tailwind CSS 4 with shadcn-style/Base UI primitives
- Better Auth React client
- Lucide React icons
- Swiper for the home page slider

**Server**

- Node.js and Express 5
- MongoDB 7 with the Better Auth MongoDB adapter
- Better Auth for accounts and sessions
- JWT verification with `jose`
- ImgBB for book cover uploads

**Deployment**

- Vercel for the live client and API

## Features

- **Browse and search the catalogue** — explore every book in the library with cover art, title, author, category, and current availability.
- **Detailed book pages** — open any title to see its description, remaining copies, who added it, and a clear availability status.
- **Personal book management** — add books with a cover image, then edit or delete your own listings from the My Books page.
- **Cover image uploads** — upload a JPG, PNG, or WebP cover directly from the Add Book and Edit Book forms.
- **Borrow with due dates** — each borrow is recorded with a borrow date and a return date seven days later.
- **Borrow tracking and returns** — My Borrows lists every active loan with its due date and a one-click return action.
- **Live copy availability** — available copies decrease when a book is borrowed and increase again when it is returned.
- **Duplicate borrowing prevention** — the server rejects a second active borrow of the same title by the same reader.
- **Secure authentication** — email/password accounts and Google sign-in are handled by Better Auth.
- **Protected routes** — account pages require a session and redirect to sign-in when one is missing.
- **Responsive, accessible interface** — layouts are built for mobile, tablet, and desktop, with keyboard-visible focus states and ARIA labels.
- **Toast notifications and custom dialogs** — feedback uses the in-app toast system, and destructive actions use custom modals rather than browser alerts.

## How Borrowing Works

1. A reader opens a book from the catalogue.
2. If at least one copy is available, they confirm the borrow in the app.
3. The API verifies the reader's session and decrements `availableCopies`.
4. The borrow is stored with a return date seven days from the borrow date.
5. The loan appears on the My Borrows page until the reader returns it.
6. Returning the book restores a copy to the catalogue.

Availability is enforced on the server. A book cannot be borrowed when `availableCopies` reaches zero, and the API returns a clear message if the reader already has an active borrow for that title.

## Authentication and Security

- **Better Auth** manages sign-up, sign-in, Google OAuth, sessions, and JWT issuing.
- Protected API requests attach a **Bearer JWT** obtained from the Better Auth client.
- Server endpoints verify the token before reading or mutating data.
- Account pages are wrapped in a client-side guard that redirects unauthenticated visitors to sign in.
- Borrow records are scoped to the signed-in reader, and return operations only affect that reader's own records.
- Book edit and delete operations are restricted to the reader who added the listing.
- All credentials and API keys are supplied through environment variables. No real secrets are committed to this repository.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A running BookNook server connected to MongoDB — see the [server repository](https://github.com/Avijit35cse/booknook-server)
- A free [ImgBB](https://imgbb.com/) account and API key for cover uploads

### 1. Clone the repository

```bash
git clone https://github.com/Avijit35cse/booknook-client.git
cd booknook-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
```

| Variable | Purpose | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the BookNook API | `http://localhost:5000` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | API key used to upload book covers | `your_imgbb_api_key_here` |

The values above are placeholders. Replace them with your own local or deployed values and never commit `.env.local`.

> `NEXT_PUBLIC_*` variables are included in the browser bundle. Keep that in mind when choosing which key to use, and follow ImgBB's guidance for restricting or rotating keys.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page updates automatically as you edit the source.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check the project without emitting files |

## Project Structure

```text
src/
├── app/                  # App Router pages (home, books, auth pages, profile)
├── components/
│   ├── auth/             # Route protection
│   ├── books/            # Borrow, edit, and delete flows
│   ├── home/             # Home page sections
│   ├── layout/           # Navbar, footer, account dropdown
│   └── ui/               # Shared UI primitives
└── lib/                  # API client, auth client, utilities
```

## Related Repositories

- **Client:** [github.com/Avijit35cse/booknook-client](https://github.com/Avijit35cse/booknook-client)
- **Server:** [github.com/Avijit35cse/booknook-server](https://github.com/Avijit35cse/booknook-server)
- **Live site:** [booknook-client-new.vercel.app](https://booknook-client-new.vercel.app/)

---

Built with care for readers who like their shelves — and their due dates — in order.
