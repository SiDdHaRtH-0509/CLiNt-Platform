// scripts/seed.js - Seed initial data for CLiNt
require('dotenv').config();
const mongoose = require('mongoose');
require('../models');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clint_db');
  console.log('Connected to MongoDB');

  const User = mongoose.model('User');
  const Workshop = mongoose.model('Workshop');

  // Create admin
  const adminExists = await User.findOne({ email: 'admin@clint.dev' });
  if (!adminExists) {
    await User.create({ name: 'Admin User', email: 'admin@clint.dev', password: 'Admin@CLiNt2025', role: 'admin' });
    console.log('✅ Admin created: admin@clint.dev / Admin@CLiNt2025');
  }

  // Seed workshops
  const workshopCount = await Workshop.countDocuments();
  if (workshopCount === 0) {
    await Workshop.insertMany([
      { title: 'Machine Learning Fundamentals', category: 'AI', description: 'Learn ML from scratch with Python and TensorFlow.', instructor: 'Dr. Aisha Patel', duration: '2 Days', level: 'Beginner', price: 1499, date: new Date('2025-04-12'), seats: 30, tags: ['Python', 'TensorFlow', 'Neural Nets'] },
      { title: 'Full-Stack with Next.js 14', category: 'Web Dev', description: 'Build production-ready apps with Next.js, Node.js, and MongoDB.', instructor: 'Rahul Sharma', duration: '3 Days', level: 'Intermediate', price: 1999, date: new Date('2025-04-20'), seats: 25, tags: ['React', 'Node.js', 'MongoDB'] },
      { title: 'Ethical Hacking & Pentesting', category: 'Cybersecurity', description: 'Master ethical hacking with Kali Linux and real-world scenarios.', instructor: 'Marcus Chen', duration: '2 Days', level: 'Advanced', price: 2499, date: new Date('2025-05-03'), seats: 20, tags: ['Kali Linux', 'Metasploit', 'OWASP'] },
      { title: 'Generative AI & LLMs', category: 'AI', description: 'Explore GPT-4, LangChain, and prompt engineering.', instructor: 'Priya Nair', duration: '1 Day', level: 'Intermediate', price: 999, date: new Date('2025-04-26'), seats: 40, tags: ['GPT-4', 'LangChain', 'Prompting'] },
      { title: 'DevOps & Cloud Native', category: 'Tools', description: 'Docker, Kubernetes, and AWS for modern deployments.', instructor: 'Arjun Mehta', duration: '2 Days', level: 'Intermediate', price: 1799, date: new Date('2025-05-10'), seats: 30, tags: ['Docker', 'K8s', 'AWS'] },
    ]);
    console.log('✅ 5 workshops seeded');
  }

  console.log('🌱 Seed completed!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
