# Peer-to-Peer (P2P) Learning Platform

A full-stack web application for collaborative student-led learning, built with a modern glassmorphism UI and secure authentication system.

---

## 🚀 Features

- **Secure Authentication** - JWT-based login and registration with Bcrypt password hashing  
- **GitHub OAuth Login** - Social authentication using OAuth 2.0  
- **OTP Password Reset** - Email-based reset system using Nodemailer  
- **Peer Matching** - Skill and interest-based mentorship recommendations  
- **Community Forum** - Threaded peer-to-peer discussions  
- **Resource Library** - Categorized sharing of notes, videos, and articles  
- **Modern UI** - Responsive glassmorphism design using custom CSS and "Outfit" font  

---

## 🛠 Tech Stack

**Frontend:** React.js, React Router, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas (Mongoose)  
**Authentication:** JWT, Bcrypt.js, GitHub OAuth  
**Email Service:** Nodemailer  

---

## 🏗 Architecture

Frontend (React)  
-> Express Backend API  
-> MongoDB Atlas  

### Authentication Flow

- Local JWT authentication  
- GitHub OAuth integration  
- Protected routes with token validation  

---

