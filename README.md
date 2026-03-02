# Meeting Planner

> A sleek, full-stack application for managing meeting rooms and reservations — built with a modern React frontend and a secure Spring Boot API.

---

## Overview

Meeting Planner streamlines how teams book and manage shared meeting spaces. From a single dashboard, users can browse available rooms, create reservations with real-time conflict detection, and view all upcoming meetings on an interactive calendar. Administrators get full control over rooms and user accounts — all wrapped in a polished, responsive interface with dark and light modes.

---

## Screenshots

> Dark mode · Light mode · Calendar view · Mobile menu

---

## Features

### For All Users
- **JWT Authentication** — Secure login with role-based access (Admin / User)
- **Room Browser** — Browse all rooms in a responsive card grid with type and capacity info
- **Reservation Booking** — Book any room with title, date, start/end time, and notes
- **Conflict Detection** — Live check prevents double-bookings before you submit
- **Calendar View** — Interactive month / week / day / agenda views via react-big-calendar
- **Dark / Light Mode** — Persistent preference saved in localStorage

### For Admins
- **Room Management** — Create, edit, and delete rooms; duplicate detection built-in
- **User Management** — Create users, assign roles (Admin / User), update or remove accounts
- **Full Reservation Control** — Edit or delete any reservation in the system

### UI / UX Highlights
- Glassmorphism cards with hover glow effects
- Animated page transitions (Framer Motion)
- Aurora orb backgrounds and shimmer buttons on auth pages
- Fully responsive — hamburger menu on mobile (HeroUI Navbar)
- Inter font for clean, professional typography
- Toast notifications for every action result

---

## Tech Stack

### Frontend

| Library | Version | Role |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 4.3 | Build tool & dev server |
| HeroUI (`@heroui/react`) | 2.6 | Component library |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 11 | Animations & page transitions |
| Lucide React | latest | Icons |
| React Router | 6.11 | Client-side routing |
| Axios | 1.4 | HTTP client with JWT interceptor |
| react-big-calendar | 1.11 | Calendar component |
| date-fns | 3.6 | Date formatting & utilities |

### Backend

| Technology | Role |
|---|---|
| Spring Boot 3.1 | REST API |
| Spring Security | Authentication & authorization |
| JWT (jjwt) | Stateless token auth |
| Spring Data JPA | ORM layer |
| MySQL | Relational database |
| Maven | Build & dependency management |

---

## Project Structure

```
Meeting-Planner-main/
├── README.md
├── Backend/
│   └── test/
│       ├── pom.xml
│       └── src/main/
│           ├── java/com/test/
│           │   ├── controller/       REST controllers
│           │   ├── service/          Business logic
│           │   ├── repository/       Spring Data repositories
│           │   ├── entity/           JPA entities
│           │   ├── dto/              Data transfer objects
│           │   └── security/         JWT + Spring Security config
│           └── resources/
│               └── application.properties
└── Frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx              HeroUIProvider entry point
        ├── App.jsx               ThemeContext + AnimatedRoutes
        ├── index.css             Tailwind + custom animations
        ├── services/
        │   ├── AuthService.js    Login, logout, role helpers
        │   ├── RoomService.js    Room CRUD
        │   ├── Reservation.js    Reservation CRUD
        │   └── UserService.js    User CRUD + Axios JWT interceptor
        └── components/
            ├── Page/
            │   ├── HeaderComponent.jsx   Navbar + theme toggle
            │   ├── FooterComponent.jsx   Footer
            │   ├── HomePage.jsx          Landing page
            │   └── Scheduler .jsx        react-big-calendar
            ├── Login.jsx
            ├── Register.jsx
            ├── room/
            │   ├── ListRoom.jsx          Room cards + CRUD modals
            │   └── AddRoom.jsx           Room form
            ├── reservation/
            │   ├── ListReservation.jsx   Reservation cards + modals
            │   └── AddReservation.jsx    Booking form + conflict check
            └── User/
                ├── ListUser.jsx          User cards + modals
                └── AddUser.jsx           User form
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Java JDK 17+
- MySQL 8.0+
- Maven 3.8+

### 1 — Database

```sql
CREATE DATABASE db_reservation;
```

Ensure MySQL is running on `localhost:3306` with credentials `root / root`
(or update `Backend/test/src/main/resources/application.properties`).

### 2 — Backend

```bash
cd Backend/test
./mvnw spring-boot:run
```

API available at **http://localhost:8080**

### 3 — Frontend

```bash
cd Frontend
npm install
npm run dev
```

App available at **http://localhost:3000**

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new account |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| GET | `/api/rooms` | User | List all rooms |
| POST | `/api/rooms` | Admin | Create room |
| PUT | `/api/rooms/{id}` | Admin | Update room |
| DELETE | `/api/rooms/{id}` | Admin | Delete room |
| GET | `/api/reservations` | User | List all reservations |
| POST | `/api/reservations` | User | Create reservation |
| PUT | `/api/reservations/{id}` | User | Update reservation |
| DELETE | `/api/reservations/{id}` | User | Delete reservation |
| GET | `/api/users` | User | List all users |
| POST | `/api/users` | Admin | Create user |
| PUT | `/api/users/{id}` | Admin | Update user |
| DELETE | `/api/users/{id}` | Admin | Delete user |

---

## Configuration

### Backend — `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/db_reservation
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your-secret-key
```

### Frontend — `vite.config.js`

Dev server runs on **port 3000** and proxies `/api/**` requests to the Spring Boot backend on port **8080**.

---

## Design Tokens

| Token | Value |
|---|---|
| Primary | Blue `#3b82f6` |
| Accent | Cyan `#06b6d4` |
| Font | Inter (Google Fonts) |
| Dark background | `slate-900 → blue-950 → slate-900` |
| Light background | `slate-100 → blue-50 → cyan-50` |
| Card style | Glassmorphism — `bg-white/5 backdrop-blur-xl` |
| Border | `border border-white/10` (dark) / `border-slate-200` (light) |

---

## Security

- Passwords hashed with **BCrypt**
- Stateless JWT — no server-side sessions
- CORS restricted to `http://localhost:3000`
- Role-based endpoint protection via Spring Security
- Frontend protected routes redirect unauthenticated users to `/login`

---

## License

MIT — see [LICENSE](LICENSE) for details.
