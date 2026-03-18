
# 🎯 SkillsMatched

**SkillsMatched** is a full-stack MERN application designed to connect users based on their skills and interests.
It helps users find suitable matches, collaborators, or opportunities by intelligently comparing skill sets.

---

## 🚀 Features

- User Authentication (Signup / Login)
- Skill-based matching system
- User profiles with skills & interests
- Match recommendations
- Responsive UI
- REST API integration

---

## 🛠 Tech Stack

### Frontend
- React.js
- JavaScript, Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- PostgresSQL

### Authentication
- JSON Web Tokens (JWT)
- bcrypt for password hashing

---

## 📂 Project Structure

```
SkillsMatched/
│
├── frontend/
│   ├── components/
│   ├── app/
│       └── page.tsx
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```
git clone https://github.com/Crystlfly/SkillsMatched.git
cd SkillsMatched
```

### 2. Backend Setup
```
cd backend
npm install
npm start
```

Create a `.env` file:
```
DATABASE_URL=postgresSQL_password

JWT_SECRET=JWT_secret
SUPABASE_URL=supabase_connection_url
SUPABASE_SERVICE_ROLE=service_role
BACKEND_URL=backend_url
GOOGLE_CLIENT_ID=client_id
GOOGLE_CLIENT_SECRET=client_secret

EMAIL_USER=email_id
EMAIL_PASS=email_pass
FRONTEND_URL=frontend_url
NEXT_PUBLIC_BACKEND_URL=backend_url

REDIS_HOST=redis_host
REDIS_PORT=redis_port
REDIS_USERNAME=redis_username
REDIS_PASSWORD=redis_password
```

### 3. Frontend Setup
```
cd frontend
npm install
npm start
```

---

## 🧩 How It Works

1. User signs up and adds skills
2. Skills are stored in postgresSQL
3. Backend compares skills with other users
4. Best matches are returned
5. Frontend displays matched users

---

## 📌 Use Cases

- Finding collaborators for projects
- Skill-based networking
- Learning & mentorship matching

---

## 🔒 Security

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes

---

## 📈 Future Enhancements

- Real-time chat
- Advanced matching algorithm
- Skill endorsements
- Admin dashboard
- Cloud deployment


---

⭐ If you like this project, give it a star!
