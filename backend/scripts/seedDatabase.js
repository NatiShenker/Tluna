const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Location = require('../models/Location');
const Complaint = require('../models/Complaint');

const seedData = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Connect with additional options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
      socketTimeoutMS: 45000, // Increased socket timeout
      family: 4 // Force IPv4
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Location.deleteMany({});
    await Complaint.deleteMany({});

    // Create users
    const users = await User.create([
      {
        email: 'principal@school.com',
        password: 'password123',
        name: 'John Principal',
        role: 'PRINCIPAL'
      },
      {
        email: 'teacher1@school.com',
        password: 'password123',
        name: 'Sarah Teacher',
        role: 'TEACHER'
      },
      {
        email: 'teacher2@school.com',
        password: 'password123',
        name: 'Mike Teacher',
        role: 'TEACHER'
      }
    ]);

    console.log('Users created');

    // Create locations
    const locations = await Location.create([
      {
        name: 'Main Building - Floor 1',
        description: 'First floor of the main school building'
      },
      {
        name: 'Cafeteria',
        description: 'School cafeteria and lunch area'
      },
      {
        name: 'Playground',
        description: 'Main playground area'
      },
      {
        name: 'Gymnasium',
        description: 'School gym and sports facilities'
      },
      {
        name: 'Library',
        description: 'School library and study area'
      }
    ]);

    console.log('Locations created');

    // Create some students
    const students = await User.create([
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'STUDENT',
        grade: '10',
        class: 'A'
      },
      {
        firstName: 'Bob',
        lastName: 'Smith',
        role: 'STUDENT',
        grade: '10',
        class: 'B'
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        role: 'STUDENT',
        grade: '11',
        class: 'A'
      }
    ]);

    console.log('Students created');

    // Create complaints
    const complaints = await Complaint.create([
      {
        studentId: students[0]._id,
        teacherId: users[1]._id,
        status: 'SUBMITTED',
        incident: {
          date: new Date('2024-03-10'),
          locationId: locations[2]._id,
          description: 'Student was involved in a fight during recess'
        }
      },
      {
        studentId: students[1]._id,
        teacherId: users[2]._id,
        status: 'DRAFT',
        incident: {
          date: new Date('2024-03-11'),
          locationId: locations[1]._id,
          description: 'Student was caught throwing food in the cafeteria'
        }
      },
      {
        studentId: students[2]._id,
        teacherId: users[1]._id,
        status: 'CLOSED',
        incident: {
          date: new Date('2024-03-09'),
          locationId: locations[4]._id,
          description: 'Student was disrupting other students in the library'
        },
        decision: {
          decidedBy: users[0]._id,
          punishment: 'One week library ban',
          notes: 'Student has apologized and promised to maintain library etiquette'
        }
      }
    ]);

    console.log('Complaints created');
    console.log('Database seeded successfully');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('\nConnection string being used:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nConnection Error Details:');
      console.error('1. Check if your MongoDB Atlas cluster is running');
      console.error('2. Verify your database user credentials');
      console.error('3. Try accessing MongoDB Atlas in your browser to confirm network connectivity');
    }
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedData(); 