# User Management

This document provides information on how to manage users in the Puppy Spa application.

## Default Users

The application comes with the following default users:

1. **Admin User**
   - Username: `admin`
   - Password: `admin123`
   - Role: `admin`

## Updating User Passwords

To update a user's password, you can use the provided script or create a new one based on your needs.

### Using the Update Script

1. The `update-admin-password.js` script is provided to update the admin password:

```bash
# Copy the script to the container
docker cp backend/update-admin-password.js <container_name>:/app/update-admin-password.js

# Run the script
docker-compose exec backend node update-admin-password.js
```

### Creating Custom Password Update Scripts

You can create custom scripts to update passwords for specific users or to set different passwords:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function updateUserPassword(username, newPassword) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      console.log(`User ${username} does not exist.`);
      return;
    }

    // Update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { username },
      data: {
        password: hashedPassword,
      },
    });
    
    console.log(`Password updated for user ${username}`);
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Example: Update password for user 'admin' to 'new_password'
updateUserPassword('admin', 'new_password');
```

## Creating New Users

To create a new user, you can use the API endpoint or create a script similar to the one below:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createUser(username, password, role = 'user') {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      console.log(`User ${username} already exists.`);
      return;
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
    
    console.log(`User created: ${username} with role ${role}`);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Example: Create a new user
createUser('newuser', 'password123', 'user');
```

## Using the API

You can also use the API endpoints to manage users:

### Login

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin", "password":"admin123"}' \
  http://localhost/api/auth/login
```

### Register a New User (requires admin token)

```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"username":"newuser", "password":"password123", "role":"user"}' \
  http://localhost/api/auth/register
```

### Get User Profile (requires authentication)

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost/api/auth/profile
```
