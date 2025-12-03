#!/usr/bin/env node

/**
 * Database Seed Script for CAMP
 * 
 * Populates MongoDB with sample data for development and testing.
 * 
 * Usage:
 *   node scripts/seed.js
 *   node scripts/seed.js --drop  (drops existing data first)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Item = require('../models/Item');
const Facility = require('../models/Facility');
const Borrowal = require('../models/Borrowal');
const Reservation = require('../models/Reservation');
const Fine = require('../models/Fine');
const Notification = require('../models/Notification');
const Waitlist = require('../models/Waitlist');

const dropData = process.argv.includes('--drop');

async function seed() {
  try {
    // Connect to database
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/camp-dev';
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to MongoDB');

    // Drop existing data if requested
    if (dropData) {
      await Promise.all([
        User.deleteMany({}),
        Item.deleteMany({}),
        Facility.deleteMany({}),
        Borrowal.deleteMany({}),
        Reservation.deleteMany({}),
        Fine.deleteMany({}),
        Notification.deleteMany({}),
        Waitlist.deleteMany({})
      ]);
      console.log('✓ Dropped existing data');
    }

    // Create Facilities
    console.log('\n→ Creating facilities...');
    const facilities = await Facility.insertMany([
      {
        name: 'IM Lab',
        description: 'Innovation & Maker Lab with 3D printers, electronics, and more',
        location: {
          building: 'Hunt Library',
          room: '204',
          floor: '2nd Floor'
        },
        contactEmail: 'imlab@univ.edu',
        contactPhone: '412-555-1001',
        operatingHours: {
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '17:00' },
          sunday: { open: '12:00', close: '18:00' }
        }
      },
      {
        name: 'Media Center',
        description: 'Audio/video equipment lending center',
        location: {
          building: 'Student Union',
          room: '204',
          floor: '2nd Floor'
        },
        contactEmail: 'mediacenter@univ.edu',
        contactPhone: '412-555-1002',
        operatingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '20:00' }
        }
      },
      {
        name: 'Arts Centre',
        description: 'Professional photography and video equipment',
        location: {
          building: 'College of Fine Arts',
          room: '101',
          floor: '1st Floor'
        },
        contactEmail: 'artscentre@univ.edu',
        contactPhone: '412-555-1003',
        operatingHours: {
          monday: { open: '10:00', close: '20:00' },
          tuesday: { open: '10:00', close: '20:00' },
          wednesday: { open: '10:00', close: '20:00' },
          thursday: { open: '10:00', close: '20:00' },
          friday: { open: '10:00', close: '17:00' }
        }
      },
      {
        name: 'Library',
        description: 'General equipment lending and study spaces',
        location: {
          building: 'Main Library',
          room: 'Circulation Desk',
          floor: 'Ground Floor'
        },
        contactEmail: 'library@univ.edu',
        contactPhone: '412-555-1004',
        operatingHours: {
          monday: { open: '07:00', close: '23:00' },
          tuesday: { open: '07:00', close: '23:00' },
          wednesday: { open: '07:00', close: '23:00' },
          thursday: { open: '07:00', close: '23:00' },
          friday: { open: '07:00', close: '21:00' },
          saturday: { open: '09:00', close: '19:00' },
          sunday: { open: '10:00', close: '23:00' }
        }
      }
    ]);
    console.log(`✓ Created ${facilities.length} facilities`);

    // Create Users
    console.log('\n→ Creating users...');
    
    // Hash password for all users
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const hashedStaffPassword = await bcrypt.hash('StaffPass123!', 10);
    const hashedAdminPassword = await bcrypt.hash('AdminPass123!', 10);
    
    const students = await User.insertMany([
      {
        netId: 'si2356',
        email: 'si2356@univ.edu',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'student',
        phone: '412-555-0101'
      },
      {
        netId: 'ls1842',
        email: 'ls1842@univ.edu',
        password: hashedPassword,
        firstName: 'Leah',
        lastName: 'Sullivan',
        role: 'student',
        phone: '412-555-0102'
      },
      {
        netId: 'mt2201',
        email: 'mt2201@univ.edu',
        password: hashedPassword,
        firstName: 'Michael',
        lastName: 'Thompson',
        role: 'student',
        phone: '412-555-0103'
      },
      {
        netId: 'ak1016',
        email: 'ak1016@univ.edu',
        password: hashedPassword,
        firstName: 'Akshith',
        lastName: 'Kumar',
        role: 'student',
        phone: '412-555-0104'
      },
      {
        netId: 'ew3847',
        email: 'ew3847@univ.edu',
        password: hashedPassword,
        firstName: 'Emma',
        lastName: 'Wilson',
        role: 'student',
        phone: '412-555-0105'
      }
    ]);

    const staff = await User.insertMany([
      {
        netId: 'staff01',
        email: 'staff@univ.edu',
        password: hashedStaffPassword,
        firstName: 'John',
        lastName: 'Manager',
        role: 'staff',
        phone: '412-555-0200'
      },
      {
        netId: 'admin01',
        email: 'admin@univ.edu',
        password: hashedAdminPassword,
        firstName: 'Jane',
        lastName: 'Administrator',
        role: 'admin',
        phone: '412-555-0201'
      }
    ]);
    console.log(`✓ Created ${students.length} students and ${staff.length} staff`);

    // Create Items
    console.log('\n→ Creating items...');
    const items = await Item.insertMany([
      // Camera Equipment
      {
        name: 'Canon EOS R5',
        category: 'Camera',
        facility: facilities.find(f => f.name === 'Arts Centre')._id,
        status: 'available',
        quantity: 3,
        description: 'Professional mirrorless camera with 45MP sensor',
        assetId: 'CAM-R5-001',
        condition: 'excellent',
        imageUrl: '/images/canon-r5.jpg'
      },
      {
        name: 'Canon EOS Rebel T7i',
        category: 'Camera',
        facility: facilities.find(f => f.name === 'Media Center')._id,
        status: 'available',
        quantity: 5,
        description: 'DSLR camera kit with 18-55mm lens',
        assetId: 'CAM-T7I-001',
        condition: 'good'
      },
      {
        name: 'Sony DSLR Camera',
        category: 'Camera',
        facility: facilities.find(f => f.name === 'IM Lab')._id,
        status: 'available',
        quantity: 2,
        description: 'Sony Alpha series DSLR',
        assetId: 'CAM-SONY-001',
        condition: 'good'
      },
      {
        name: 'Video Camera',
        category: 'Camera',
        facility: facilities.find(f => f.name === 'Arts Centre')._id,
        status: 'maintenance',
        quantity: 2,
        description: 'Sony FDR-AX700 4K camcorder',
        assetId: 'VID-112',
        condition: 'fair'
      },
      // Audio Equipment
      {
        name: 'Audio Recorder',
        category: 'Other',
        facility: facilities.find(f => f.name === 'Media Center')._id,
        status: 'available',
        quantity: 4,
        description: 'Zoom H4n Pro with accessories',
        assetId: 'AUD-105',
        condition: 'good'
      },
      {
        name: 'Microphone',
        category: 'Other',
        facility: facilities.find(f => f.name === 'Library')._id,
        status: 'available',
        quantity: 10,
        description: 'Rode NTG3 shotgun microphone',
        assetId: 'MIC-003',
        condition: 'good'
      },
      {
        name: 'Microphone Stand',
        category: 'Other',
        facility: facilities.find(f => f.name === 'Media Center')._id,
        status: 'available',
        quantity: 8,
        description: 'Adjustable boom stand',
        assetId: 'MIC-089',
        condition: 'good'
      },
      // Accessories
      {
        name: 'Tripod',
        category: 'Other',
        facility: facilities.find(f => f.name === 'Library')._id,
        status: 'available',
        quantity: 6,
        description: 'Manfrotto 190 aluminum tripod',
        assetId: 'TRI-042',
        condition: 'good'
      },
      {
        name: 'Lighting Kit',
        category: 'Other',
        facility: facilities.find(f => f.name === 'IM Lab')._id,
        status: 'available',
        quantity: 3,
        description: '3-point LED lighting kit with stands',
        assetId: 'LIT-034',
        condition: 'excellent'
      },
      // Computers
      {
        name: 'MacBook Pro 16"',
        category: 'Laptop',
        facility: facilities.find(f => f.name === 'IM Lab')._id,
        status: 'available',
        quantity: 10,
        description: '16" M2 Pro, 16GB RAM, 512GB SSD',
        assetId: 'LAP-203',
        condition: 'excellent'
      },
      {
        name: 'MacBook Pro 14-inch',
        category: 'Laptop',
        facility: facilities.find(f => f.name === 'Library')._id,
        status: 'available',
        quantity: 8,
        description: 'M2 chip, 16GB RAM',
        assetId: 'LAP-014',
        condition: 'good'
      },
      // Electronics
      {
        name: 'VR Headset - Meta Quest 3',
        category: 'Lab Equipment',
        facility: facilities.find(f => f.name === 'IM Lab')._id,
        status: 'available',
        quantity: 5,
        description: 'Meta Quest 3 VR headset with controllers',
        assetId: 'VR-301',
        condition: 'excellent'
      },
      // Other
      {
        name: 'Projector',
        category: 'Other',
        facility: facilities.find(f => f.name === 'Library')._id,
        status: 'available',
        quantity: 4,
        description: 'Epson PowerLite 1080p projector',
        assetId: 'PRJ-056',
        condition: 'good'
      }
    ]);
    console.log(`✓ Created ${items.length} items`);

    // Create Borrowals
    console.log('\n→ Creating borrowals...');
    const now = new Date();
    const borrowals = await Borrowal.insertMany([
      // Active borrowals
      {
        user: students[0]._id, // Sarah
        item: items.find(i => i.name === 'Canon EOS R5')._id,
        checkoutDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        status: 'active',
        checkedOutBy: staff[0]._id
      },
      {
        user: students[1]._id, // Leah
        item: items.find(i => i.name === 'Audio Recorder')._id,
        checkoutDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        status: 'overdue',
        checkedOutBy: staff[0]._id
      },
      {
        user: students[2]._id, // Michael
        item: items.find(i => i.name === 'Tripod')._id,
        checkoutDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        status: 'overdue',
        checkedOutBy: staff[0]._id
      },
      {
        user: students[3]._id, // Akshith
        item: items.find(i => i.name === 'MacBook Pro 16"')._id,
        checkoutDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
        status: 'active',
        checkedOutBy: staff[0]._id
      },
      // Returned borrowals (history)
      {
        user: students[0]._id,
        item: items.find(i => i.name === 'Sony DSLR Camera')._id,
        checkoutDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000),
        status: 'returned',
        conditionOnReturn: 'good',
        checkedOutBy: staff[0]._id
      },
      {
        user: students[1]._id,
        item: items.find(i => i.name === 'Microphone')._id,
        checkoutDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000),
        status: 'returned',
        conditionOnReturn: 'good',
        checkedOutBy: staff[0]._id
      }
    ]);
    console.log(`✓ Created ${borrowals.length} borrowals`);

    // Create Reservations
    console.log('\n→ Creating reservations...');
    const reservations = await Reservation.insertMany([
      {
        user: students[3]._id,
        item: items.find(i => i.name === 'Lighting Kit')._id,
        reservationDate: new Date(),
        pickupDate: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        expiryDate: new Date(now.getTime() + 26 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        user: students[4]._id,
        item: items.find(i => i.name === 'Microphone Stand')._id,
        reservationDate: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        pickupDate: new Date(now.getTime() + 4 * 60 * 60 * 1000),
        expiryDate: new Date(now.getTime() + 28 * 60 * 60 * 1000),
        status: 'confirmed'
      }
    ]);
    console.log(`✓ Created ${reservations.length} reservations`);

    // Create Fines
    console.log('\n→ Creating fines...');
    const fines = await Fine.insertMany([
      {
        user: students[0]._id,
        borrowal: borrowals.find(b => b.user.equals(students[1]._id) && b.status === 'overdue')._id,
        amount: 5,
        reason: 'late-return',
        description: 'Overdue – Audio Recorder',
        status: 'pending'
      },
      {
        user: students[2]._id,
        borrowal: borrowals.find(b => b.user.equals(students[2]._id) && b.status === 'overdue')._id,
        amount: 12,
        reason: 'damage',
        description: 'Damage – Tripod',
        status: 'pending'
      },
      {
        user: students[1]._id,
        amount: 3,
        reason: 'late-return',
        description: 'Late – Microphone',
        status: 'paid',
        paidDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log(`✓ Created ${fines.length} fines`);

    // Create Notifications
    console.log('\n→ Creating notifications...');
    const notifications = await Notification.insertMany([
      {
        user: students[0]._id,
        type: 'reminder',
        title: 'Item Due Soon',
        message: 'Your Canon EOS R5 is due in 2 days',
        relatedItem: items.find(i => i.name === 'Canon EOS R5')._id,
        isRead: false
      },
      {
        user: students[1]._id,
        type: 'overdue',
        title: 'Overdue Item',
        message: 'Your Audio Recorder is overdue. Please return it as soon as possible.',
        relatedItem: items.find(i => i.name === 'Audio Recorder')._id,
        isRead: false
      },
      {
        user: students[3]._id,
        type: 'reservation',
        title: 'Reservation Ready',
        message: 'Your reserved Lighting Kit is ready for pickup at IM Lab',
        relatedReservation: reservations[0]._id,
        isRead: false
      }
    ]);
    console.log(`✓ Created ${notifications.length} notifications`);

    // Create Waitlist entries
    console.log('\n→ Creating waitlist entries...');
    const waitlistEntries = await Waitlist.insertMany([
      {
        user: students[4]._id,
        item: items.find(i => i.name === 'Canon EOS R5')._id,
        facility: facilities.find(f => f.name === 'Arts Centre')._id,
        position: 1,
        status: 'waiting'
      }
    ]);
    console.log(`✓ Created ${waitlistEntries.length} waitlist entries`);

    console.log('\n✓ Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`  - ${facilities.length} facilities`);
    console.log(`  - ${students.length} students`);
    console.log(`  - ${staff.length} staff members`);
    console.log(`  - ${items.length} items`);
    console.log(`  - ${borrowals.length} borrowals`);
    console.log(`  - ${reservations.length} reservations`);
    console.log(`  - ${fines.length} fines`);
    console.log(`  - ${notifications.length} notifications`);
    console.log(`  - ${waitlistEntries.length} waitlist entries`);
    
    console.log('\nTest Credentials:');
    console.log('  Student: si2356@univ.edu / Password123!');
    console.log('  Staff:   staff@univ.edu / StaffPass123!');
    console.log('  Admin:   admin@univ.edu / AdminPass123!');

  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

seed();
