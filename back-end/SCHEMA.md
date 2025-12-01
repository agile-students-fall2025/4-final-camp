# Database Schema Documentation

Complete reference for CAMP's MongoDB database schema with Mongoose models.

## Table of Contents
- [User](#user)
- [Item](#item)
- [Facility](#facility)
- [Borrowal](#borrowal)
- [Reservation](#reservation)
- [Fine](#fine)
- [Notification](#notification)
- [Waitlist](#waitlist)
- [Relationships](#relationships)
- [Indexes](#indexes)

---

## User

Stores student, staff, and admin account information.

### Schema

```javascript
{
  netId: String,              // University network ID (unique, required)
  email: String,              // University email (unique, required)
  password: String,           // Bcrypt hashed password (required)
  firstName: String,          // User's first name (required)
  lastName: String,           // User's last name (required)
  role: String,               // 'student' | 'staff' | 'admin' (required, default: 'student')
  phone: String,              // Contact phone number (optional)
  isActive: Boolean,          // Account active status (default: true)
  notificationPreferences: {
    email: Boolean,           // Email notifications enabled
    sms: Boolean,             // SMS notifications enabled
    inApp: Boolean,           // In-app notifications enabled
    reminder: {
      startDaysBefore: Number,
      frequency: String       // 'daily' | 'twice-daily' | 'once'
    }
  },
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Virtuals

- `fullName` - Returns `${firstName} ${lastName}`

### Indexes

- `netId` - Unique index
- `email` - Unique index
- `role` - Standard index for filtering

### Hooks

- `pre('save')` - Hashes password with bcrypt (10 rounds) before saving

### Methods

- `comparePassword(candidatePassword)` - Returns Promise<boolean> comparing bcrypt hashes

---

## Item

Represents borrowable equipment/resources.

### Schema

```javascript
{
  name: String,               // Item name (required)
  category: String,           // 'Camera' | 'Computer' | 'Audio' | 'Lighting' | 'Accessory' | 'Electronics' | 'Other'
  facility: ObjectId,         // Reference to Facility (required)
  status: String,             // 'available' | 'checked-out' | 'reserved' | 'maintenance' (default: 'available')
  description: String,        // Detailed description (optional)
  assetId: String,            // Physical asset tag ID (optional, unique if provided)
  condition: String,          // 'excellent' | 'good' | 'fair' | 'needs-repair' (default: 'good')
  imageUrl: String,           // URL to item image (optional)
  isActive: Boolean,          // Item active in system (default: true)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Indexes

- `facility` - Standard index for facility-based queries
- `status` - Standard index for availability filtering
- `category` - Standard index for category filtering
- `{ name: 'text', description: 'text' }` - Text search index

### Relationships

- `facility` → Facility (many-to-one)
- Referenced by: Borrowal, Reservation, Fine, Waitlist

---

## Facility

Physical locations where items can be borrowed/returned.

### Schema

```javascript
{
  name: String,               // Facility name (required, unique)
  location: String,           // Physical address/building (required)
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  manager: [ObjectId],        // References to User (staff/admin)
  description: String,        // Facility description (optional)
  isActive: Boolean,          // Facility operational (default: true)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Indexes

- `name` - Unique index

### Relationships

- `manager` → User (many-to-many)
- Referenced by: Item, Borrowal, Reservation, Waitlist

---

## Borrowal

Tracks checked-out items and their return status.

### Schema

```javascript
{
  user: ObjectId,             // Reference to User (required)
  item: ObjectId,             // Reference to Item (required)
  facility: ObjectId,         // Reference to Facility (required)
  checkedOutAt: Date,         // Checkout timestamp (required, default: now)
  dueDate: Date,              // Return due date (required)
  returnedAt: Date,           // Actual return timestamp (optional)
  status: String,             // 'active' | 'overdue' | 'returned' (default: 'active')
  renewalsRemaining: Number,  // Renewal attempts left (default: 2)
  renewalCount: Number,       // Times renewed (default: 0)
  returnCondition: String,    // 'excellent' | 'good' | 'fair' | 'damaged' (optional)
  notes: String,              // Staff notes (optional)
  checkedOutBy: ObjectId,     // Reference to User (staff who checked out)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Virtuals

- `daysBorrowed` - Returns number of days between checkedOutAt and (returnedAt or now)
- `daysOverdue` - Returns days past dueDate if overdue, else 0

### Indexes

- `user` - Standard index for user queries
- `item` - Standard index for item queries
- `status` - Standard index for status filtering
- `dueDate` - Standard index for overdue tracking
- `{ user: 1, status: 1 }` - Compound index for user dashboard

### Relationships

- `user` → User (many-to-one)
- `item` → Item (many-to-one)
- `facility` → Facility (many-to-one)
- `checkedOutBy` → User (many-to-one)
- Referenced by: Fine

---

## Reservation

Holds items for future pickup.

### Schema

```javascript
{
  user: ObjectId,             // Reference to User (required)
  item: ObjectId,             // Reference to Item (required)
  facility: ObjectId,         // Reference to Facility (required)
  pickupTime: Date,           // Scheduled pickup timestamp (required)
  expiryTime: Date,           // Reservation expiration (required, default: pickupTime + 24h)
  status: String,             // 'pending' | 'ready' | 'completed' | 'cancelled' | 'expired' (default: 'pending')
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Indexes

- `user` - Standard index for user queries
- `item` - Standard index for item queries
- `status` - Standard index for status filtering
- `pickupTime` - Standard index for scheduling
- `{ user: 1, status: 1 }` - Compound index for user reservations

### Relationships

- `user` → User (many-to-one)
- `item` → Item (many-to-one)
- `facility` → Facility (many-to-one)
- Referenced by: Notification

---

## Fine

Financial penalties for late returns, damage, or loss.

### Schema

```javascript
{
  user: ObjectId,             // Reference to User (required)
  item: ObjectId,             // Reference to Item (optional)
  borrowal: ObjectId,         // Reference to Borrowal (optional)
  amount: Number,             // Fine amount in dollars (required, min: 0)
  reason: String,             // 'overdue' | 'damage' | 'lost' (required)
  description: String,        // Detailed reason (optional)
  status: String,             // 'pending' | 'paid' | 'waived' (default: 'pending')
  paidAt: Date,               // Payment timestamp (optional)
  paymentMethod: String,      // 'campus-cash' | 'credit-card' | 'waived' (optional)
  receiptNumber: String,      // Payment receipt ID (optional)
  issuedBy: ObjectId,         // Reference to User (staff who issued)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Indexes

- `user` - Standard index for user queries
- `status` - Standard index for status filtering
- `{ user: 1, status: 1 }` - Compound index for unpaid fines

### Relationships

- `user` → User (many-to-one)
- `item` → Item (many-to-one, optional)
- `borrowal` → Borrowal (many-to-one, optional)
- `issuedBy` → User (many-to-one)

---

## Notification

In-app and email notifications for users.

### Schema

```javascript
{
  user: ObjectId,             // Reference to User (required)
  type: String,               // 'due-reminder' | 'overdue' | 'reservation-ready' | 'reservation-expired' | 'fine-issued' | 'fine-paid' (required)
  title: String,              // Notification title (required)
  message: String,            // Notification body (required)
  read: Boolean,              // Read status (default: false)
  relatedBorrowal: ObjectId,  // Reference to Borrowal (optional)
  relatedReservation: ObjectId, // Reference to Reservation (optional)
  relatedItem: ObjectId,      // Reference to Item (optional)
  relatedFine: ObjectId,      // Reference to Fine (optional)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Indexes

- `user` - Standard index for user queries
- `read` - Standard index for unread filtering
- `createdAt` - Standard index for chronological sorting
- `{ user: 1, read: 1 }` - Compound index for unread notifications

### Relationships

- `user` → User (many-to-one)
- `relatedBorrowal` → Borrowal (many-to-one, optional)
- `relatedReservation` → Reservation (many-to-one, optional)
- `relatedItem` → Item (many-to-one, optional)
- `relatedFine` → Fine (many-to-one, optional)

---

## Waitlist

Queue for unavailable items.

### Schema

```javascript
{
  user: ObjectId,             // Reference to User (required)
  item: ObjectId,             // Reference to Item (required)
  facility: ObjectId,         // Reference to Facility (required)
  position: Number,           // Queue position (required, min: 1)
  status: String,             // 'waiting' | 'notified' | 'cancelled' | 'fulfilled' (default: 'waiting')
  notifiedAt: Date,           // Notification timestamp (optional)
  estimatedAvailability: Date, // Estimated available date (optional)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### Indexes

- `item` - Standard index for item queries
- `status` - Standard index for status filtering
- `{ item: 1, position: 1 }` - Compound index for queue ordering

### Relationships

- `user` → User (many-to-one)
- `item` → Item (many-to-one)
- `facility` → Facility (many-to-one)

---

## Entity Relationship Diagram

```
User (1) ----< (N) Borrowal (N) >---- (1) Item (N) >---- (1) Facility
  |                                      |
  |                                      |
  | (1)                                  | (N)
  |                                      |
  v                                      v
  (N) Reservation (N) >---------------< (1)
  |
  | (1)
  |
  v
  (N) Fine
  |
  | (1)
  |
  v
  (N) Notification
  |
  | (1)
  |
  v
  (N) Waitlist (N) >----< (1) Item
```

### Key Relationships

1. **User → Borrowal**: One user can have many borrowals
2. **Item → Borrowal**: One item can be borrowed multiple times (sequentially)
3. **User → Reservation**: One user can reserve multiple items
4. **Item → Reservation**: One item can have multiple reservations (time-separated)
5. **User → Fine**: One user can have multiple fines
6. **Borrowal → Fine**: One borrowal can generate multiple fines (damage + overdue)
7. **User → Notification**: One user receives many notifications
8. **User → Waitlist**: One user can be on waitlist for multiple items
9. **Facility → Item**: One facility houses many items
10. **Facility → Borrowal/Reservation**: Tracks where items are borrowed/reserved from

---

## Indexes Summary

### Performance-Critical Indexes

1. **User Collection**
   - `netId` (unique) - Login authentication
   - `email` (unique) - Login authentication
   - `role` - Staff/student filtering

2. **Item Collection**
   - `facility` - Facility-based browsing
   - `status` - Availability filtering
   - `category` - Category filtering
   - Text search on `name` and `description` - Search functionality

3. **Borrowal Collection**
   - `{ user: 1, status: 1 }` - User's active/overdue items
   - `dueDate` - Overdue item detection
   - `status` - Staff overdue tracking

4. **Reservation Collection**
   - `{ user: 1, status: 1 }` - User's pending reservations
   - `pickupTime` - Upcoming pickups

5. **Fine Collection**
   - `{ user: 1, status: 1 }` - Unpaid fines

6. **Notification Collection**
   - `{ user: 1, read: 1 }` - Unread notifications count

### Index Maintenance

Run `db.collection.getIndexes()` to verify all indexes are created.

For production:
```javascript
// Rebuild all indexes
db.users.reIndex();
db.items.reIndex();
db.borrowals.reIndex();
// ... etc
```

---

## Data Validation

### At Application Level (Mongoose)

- Required fields enforced in schemas
- Enum validation for status fields
- Min/max validation for numeric fields
- Custom validators for:
  - Email format (User)
  - NetID format (User)
  - Date ranges (Reservation pickup/expiry)
  - Fine amounts (non-negative)

### At Database Level (MongoDB)

Consider adding validation rules for production:

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      required: ["netId", "email", "password", "firstName", "lastName"],
      properties: {
        email: { pattern: "^[a-zA-Z0-9._%+-]+@univ\\.edu$" },
        role: { enum: ["student", "staff", "admin"] }
      }
    }
  }
});
```

---

## Seeding Data

Use the seed script to populate the database:

```bash
# Seed with sample data
node scripts/seed.js

# Drop existing data and reseed
node scripts/seed.js --drop
```

### Sample Data Included

- 5 students
- 2 staff members (1 staff, 1 admin)
- 4 facilities
- 13 items across all categories
- 6 borrowals (4 active/overdue, 2 returned)
- 2 reservations
- 3 fines (2 pending, 1 paid)
- 3 notifications
- 1 waitlist entry

---

## Migration Guide

### From Mock Data to MongoDB

1. **Authentication**: Switch from array lookup to `User.findOne({ email })`
2. **Items**: Replace arrays with `Item.find({ status: 'available' })`
3. **Borrowals**: Use `.populate('user', 'item', 'facility')` for full data
4. **Reservations**: Add `.populate()` for related entities
5. **Fines**: Aggregate unpaid fines with `$match` and `$group`

### Breaking Changes from Mock APIs

- IDs changed from numeric/string to MongoDB ObjectIds
- Date formats changed to ISO 8601 timestamps
- Pagination required for large collections
- Authentication required on most endpoints
- Role-based authorization on staff endpoints

---

## Best Practices

### Query Optimization

```javascript
// ✅ Good: Use projection to limit fields
User.find({}, 'firstName lastName email')

// ❌ Bad: Fetch entire documents
User.find({})

// ✅ Good: Use populate sparingly
Borrowal.find().populate('item', 'name category')

// ❌ Bad: Over-populate
Borrowal.find().populate('user item facility checkedOutBy')

// ✅ Good: Use lean() for read-only data
Item.find({ status: 'available' }).lean()

// ❌ Bad: Full Mongoose documents when not needed
Item.find({ status: 'available' })
```

### Error Handling

Always handle Mongoose errors:

```javascript
try {
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  // ...
} catch (error) {
  console.error('Database error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
```

### Transaction Usage

For operations affecting multiple collections:

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Check out item
  await Borrowal.create([borrowalData], { session });
  await Item.findByIdAndUpdate(itemId, { status: 'checked-out' }, { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## Environment Variables

Required for database connection:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/camp?retryWrites=true&w=majority
MONGODB_URI_TEST=mongodb://localhost:27017/camp-test
NODE_ENV=development
```

Test environment automatically uses test database to avoid polluting production data.

---

## Backup & Restore

### Backup

```bash
# Backup entire database
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/camp" --out=./backup

# Backup specific collection
mongodump --uri="mongodb+srv://..." --collection=users --out=./backup
```

### Restore

```bash
# Restore entire database
mongorestore --uri="mongodb+srv://..." ./backup

# Restore specific collection
mongorestore --uri="mongodb+srv://..." --collection=users ./backup/camp/users.bson
```

---

## Monitoring

### Useful Queries

```javascript
// Count documents per collection
db.users.countDocuments()
db.items.countDocuments()
db.borrowals.countDocuments()

// Check overdue borrowals
db.borrowals.find({ status: 'overdue' }).count()

// Unpaid fines total
db.fines.aggregate([
  { $match: { status: 'pending' } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
])

// Most borrowed items
db.borrowals.aggregate([
  { $group: { _id: '$item', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])
```

### Performance Monitoring

```javascript
// Explain query execution
db.items.find({ status: 'available' }).explain('executionStats')

// Check index usage
db.items.aggregate([{ $indexStats: {} }])

// Current operations
db.currentOp()
```
