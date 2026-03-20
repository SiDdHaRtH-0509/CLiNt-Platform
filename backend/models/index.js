// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  college: { type: String },
  phone: { type: String },
  avatar: { type: String },
  enrolledWorkshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);

// ============================================================
// models/Workshop.js
const WorkshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['AI', 'Web Dev', 'Cybersecurity', 'Tools'], required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  seats: { type: Number, required: true },
  enrolledCount: { type: Number, default: 0 },
  tags: [String],
  thumbnail: { type: String },
  rating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

mongoose.model('Workshop', WorkshopSchema);

// ============================================================
// models/WorkshopRequest.js
const WorkshopRequestSchema = new mongoose.Schema({
  college: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  topic: { type: String, required: true },
  expectedStudents: { type: Number },
  location: { type: String },
  message: { type: String },
  preferredDate: { type: Date },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote: { type: String },
  approvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

mongoose.model('WorkshopRequest', WorkshopRequestSchema);

// ============================================================
// models/Participant.js
const ParticipantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
  status: { type: String, enum: ['registered', 'attended', 'completed', 'cancelled'], default: 'registered' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  registeredAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

ParticipantSchema.index({ user: 1, workshop: 1 }, { unique: true });
mongoose.model('Participant', ParticipantSchema);

// ============================================================
// models/Certificate.js
const CertificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
  certificateId: { type: String, unique: true, required: true },
  issuedAt: { type: Date, default: Date.now },
  pdfUrl: { type: String },
  verificationUrl: { type: String },
});

mongoose.model('Certificate', CertificateSchema);

// ============================================================
// models/Resource.js
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
  type: { type: String, enum: ['PDF', 'ZIP', 'Video', 'Link'], required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: String },
  isPublic: { type: Boolean, default: false },
  downloadCount: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

mongoose.model('Resource', ResourceSchema);


module.exports = {
  User: mongoose.model('User'),
  Workshop: mongoose.model('Workshop'),
  WorkshopRequest: mongoose.model('WorkshopRequest'),
  Participant: mongoose.model('Participant'),
  Certificate: mongoose.model('Certificate'),
  Resource: mongoose.model('Resource'),
};
