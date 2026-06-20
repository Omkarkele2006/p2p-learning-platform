# P2PLearn

P2PLearn is a peer-to-peer collaborative learning platform built to help students discover peer mentors, exchange study resources, and participate in community discussions. The platform was created to address the isolation and linear structure of traditional e-learning systems by providing a decentralized, student-led space where every user can teach their expertise and learn from others in a matching-based ecosystem.

---

## Project Overview

Traditional online education separates study material from active community engagement. P2PLearn bridges this gap by introducing:
- **Skill-Based Peer Matching**: Connects students who want to learn a specific topic with peers who have listed that topic as a teaching skill.
- **Resource Exchange Library**: A shared repository where users can upload, categorize (Videos, Articles, Notes, Repositories), and filter learning assets.
- **Community Forum**: An open threaded forum where students ask questions, post answers, and track replies in real-time.
- **Reputation-Driven Mentorship**: Promotes positive contributions by scoring users based on study help and displaying reputation tier badges.

---

## Key Features

- **Authentication System**: Secures user accounts via JSON Web Token (JWT) sessions and bcrypt password hashing.
- **GitHub OAuth Login**: Integrated social sign-in via GitHub OAuth 2.0.
- **OTP Password Recovery**: Secure, temporary 6-digit OTP dispatch using Nodemailer to verify identity before password reset.
- **Peer Matching Algorithm**: Dynamically calculates skills overlap to generate match percentages and identify suitable mentors.
- **Resource Exchange Grid**: Renders shared learning assets with tag sorting, category indicators, and upload forms.
- **Threaded Forums**: Supports open topic discussions with relative timestamp trackers ("5 min ago") and user initial avatars.
- **Activity Insights Dashboard**: Dedicated profile widgets monitoring total posts, replies, and resources shared.
- **Profile Completion Engine**: Tracks completeness in 20% intervals, prompting action items like editing skills, interests, or bios to maximize matching accuracy.
- **Keyboard & Screen Reader Accessibility**: Map input labels using htmlFor/id parameters, high-visibility focus states, and aria attributes.
- **Robust Security Middleware**: Express validator inputs checks, SQL/NoSQL injection sanitizers, and centralized promise error handlers.

---

## Technology Stack

### Frontend
- **React (v19)**: Virtual DOM UI structure.
- **React Router (v7)**: Client-side routing, protected routes, and auth checks.
- **Axios**: Standardized API client configured with global interceptors to handle automatic token attachment and 401 redirects.
- **React Hot Toast**: Toast notifications replacing standard browser alerts.

### Backend
- **Node.js**: V8 Javascript runtime.
- **Express.js**: HTTP request routing and custom middleware chains.
- **Mongoose / MongoDB Atlas**: Schema-enforced document storage.

### Security & Utilities
- **express-validator**: Validation and sanitization middleware for request payloads.
- **jsonwebtoken (JWT)**: Token creation and payload signing.
- **bcryptjs**: Blowfish password hashing algorithm.
- **nodemailer**: SMTP email client configuration for OTP retrieval.

---

## System Architecture

```text
    +------------------------------------------+
    |               Client (React)             |
    |      (Vite + React Router + Axios)       |
    +------------------------------------------+
                         |  (HTTPS requests + JWT)
                         v
    +------------------------------------------+
    |             Express API Gateway          |
    |  (Routing, CORS, express-validator)      |
    +------------------------------------------+
                         |
      +------------------+------------------+
      | (protect auth)                      | (public routes)
      v                                     v
+------------------+                  +------------------+
| authMiddleware   |                  | controllers      |
| & validation     |                  | (user, resource) |
+------------------+                  +------------------+
      |                                     |
      v                                     v
+--------------------------------------------------------+
|                      Mongoose Models                   |
|                 (User, Resource, Discussion)           |
+--------------------------------------------------------+
                         |
                         v
+--------------------------------------------------------+
|                     MongoDB Atlas                      |
+--------------------------------------------------------+
```

### Authentication & Authorization Flow
1. **Login & Token Dispatch**: Validated request inputs verify password hash matching in the database. Upon success, a JWT is signed with the user ID and returned to the client.
2. **Storage**: The client caches the token inside `localStorage`.
3. **Route Guards**: Private pages are wrapped in a `<ProtectedRoute />` component. The wrapper checks for local token existence, preventing page flashing by loading spinners during transit, and immediately redirects unauthenticated users to `/login`.
4. **API Interceptor**: An Axios request interceptor attaches the JWT to the `Authorization` header of all subsequent API calls. If the backend returns `401 Unauthorized`, an Axios response interceptor intercepts the error, flushes `localStorage`, and redirects the browser.

---

## Application Screens

- **Landing Page (`/`)**: Main marketing page detailing platform value propositions, bento features grid, step timeline, public stats dashboard, about card, and contact form.
- **Login (`/login`)**: Center-aligned login form with social sign-in and recovery links.
- **Register (`/register`)**: Standard registration form containing password confirmation mismatch checks and mandatory terms agreement toggles.
- **Dashboard (`/dashboard`)**: Activity insights stats grid, profile completion meter, active reputation badges, recent activity timeline, and recommended mentor matches.
- **Library (`/resources`)**: Form to upload links/documents and categorized search grids sorted by tags.
- **Community Forum (`/forum`)**: Topic creation block, thread accordion expansion view, replies lists, and inline reply forms.
- **Legal Pages (`/privacy-policy` & `/terms-and-conditions`)**: Clean text screens detailing usage terms.

---

## Security Measures

- **JWT Auth**: Payload signing ensures session data cannot be manipulated.
- **Password Hashing**: Bcrypt applies 10 salt rounds to secure passwords before storage.
- **Validation Middleware**: Route queries pass validation criteria (email formatting, password lengths) before hitting controllers.
- **Data Sanitization**: Prevents cross-site scripting (XSS) and injection attacks by normalization and tag escapes.
- **Centralized Error Handling**: Wrapper functions catch rejected controller promises and forward exceptions to Express error handler middleware, masking raw server exceptions from clients.

---

## Local Development Setup

### Prerequisites
- Node.js installed on your machine.
- MongoDB Atlas cluster URL or local MongoDB instance running.
- Gmail SMTP configuration parameters (for Nodemailer recovery).

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/Omkarkele2006/p2p-learning-platform.git
cd p2p-learning-platform

# Install backend dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory using the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_signing_secret_string
EMAIL_USER=your_gmail_address_for_otp_service
EMAIL_PASS=your_gmail_app_password
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

### 3. Run the Servers
Open two terminal windows:

**Terminal 1 (Backend Server)**
```bash
cd server
npm start
```
*(Starts on port 5000)*

**Terminal 2 (Vite Frontend client)**
```bash
cd client
npm run dev
```
*(Runs locally on port 5173)*

To package frontend assets for production compilation:
```bash
cd client
npm run build
```

---

## Environment Variables Configuration

| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | Yes | Port where the Node Express server boots (default: `5000`). |
| `MONGO_URI` | Yes | MongoDB connection string containing credentials and target database cluster name. |
| `JWT_SECRET` | Yes | Key hash used by the server to sign and verify JSON Web Token sessions. |
| `EMAIL_USER` | Yes | Gmail address utilized by Nodemailer to dispatch password recovery OTP codes. |
| `EMAIL_PASS` | Yes | Gmail App password (not standard account password) to authenticate Nodemailer SMTP transactions. |
| `GITHUB_CLIENT_ID` | Yes | Client ID generated from your GitHub Developer Settings OAuth Application portal. |
| `GITHUB_CLIENT_SECRET` | Yes | Client Secret generated from your GitHub OAuth Application portal. |

---

## Future Improvements

- **Session Scheduling**: Allow matched peers to directly book Google Calendar invites.
- **Expanded Matching System**: Factor in profile completion metrics and timezone availability in matching.
- **Real-Time Notification System**: Integrate WebSockets to notify users when their posts receive replies or sessions are requested.
