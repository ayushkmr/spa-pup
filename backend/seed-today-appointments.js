const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate a random time today
function getRandomTimeToday(startHour = 8, endHour = 17) {
  const now = new Date();
  const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  const minute = Math.floor(Math.random() * 60);

  const time = new Date();
  time.setHours(hour, minute, 0, 0);

  return time;
}

// Helper function to get a future time today
function getFutureTimeToday(hoursFromNow = 2) {
  const now = new Date();
  const futureTime = new Date(now.getTime() + (hoursFromNow * 60 * 60 * 1000));

  // If it's after closing time (e.g., 5 PM), set it to tomorrow morning
  if (futureTime.getHours() >= 17) {
    futureTime.setDate(futureTime.getDate() + 1);
    futureTime.setHours(9, 0, 0, 0);
  }

  return futureTime;
}

async function createPuppy(name, ownerName, breed) {
  // Check if puppy already exists
  const existingPuppy = await prisma.puppy.findFirst({
    where: {
      name,
      ownerName
    }
  });

  if (existingPuppy) {
    console.log(`Using existing puppy: ${name} (Owner: ${ownerName}, Breed: ${existingPuppy.breed || 'Unknown'})`);
    return existingPuppy;
  }

  // Create new puppy
  const puppyBreed = breed || ['Labrador Retriever', 'Poodle', 'Golden Retriever', 'Bulldog', 'Beagle'][Math.floor(Math.random() * 5)];

  const puppy = await prisma.puppy.create({
    data: {
      name,
      ownerName,
      breed: puppyBreed,
      notes: Math.random() > 0.7 ? 'Special care needed' : ''
    }
  });

  console.log(`Created puppy: ${name} (Owner: ${ownerName}, Breed: ${puppyBreed})`);
  return puppy;
}

async function seedTodayAppointments() {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today's waiting list exists
    let waitingList = await prisma.waitingList.findFirst({
      where: {
        date: today
      }
    });

    // Create today's waiting list if it doesn't exist
    if (!waitingList) {
      waitingList = await prisma.waitingList.create({
        data: {
          date: today
        }
      });
      console.log(`Created waiting list for today (${today.toISOString().split('T')[0]})`);
    } else {
      console.log(`Using existing waiting list for today (${today.toISOString().split('T')[0]})`);
    }

    // Create puppies with different statuses
    const puppies = [
      // Completed appointments (serviced)
      { name: 'Max', owner: 'John Smith', breed: 'Labrador Retriever', service: 'Bath & Dry', status: 'completed' },
      { name: 'Bella', owner: 'Sarah Johnson', breed: 'Poodle', service: 'Nail Trimming', status: 'completed' },
      { name: 'Charlie', owner: 'Michael Williams', breed: 'Golden Retriever', service: 'Full Grooming', status: 'completed' },

      // Cancelled appointments
      { name: 'Luna', owner: 'Emily Davis', breed: 'Bulldog', service: 'Ear Cleaning', status: 'cancelled' },
      { name: 'Cooper', owner: 'David Brown', breed: 'Beagle', service: 'De-shedding Treatment', status: 'cancelled' },

      // Waiting appointments (currently in the waiting list)
      { name: 'Lucy', owner: 'Jessica Wilson', breed: 'Yorkshire Terrier', service: 'Paw Trim', status: 'waiting' },
      { name: 'Bailey', owner: 'Daniel Miller', breed: 'Boxer', service: 'Teeth Brushing', status: 'waiting' },
      { name: 'Daisy', owner: 'Olivia Moore', breed: 'Dachshund', service: 'Haircut', status: 'waiting' },

      // Future appointments (scheduled for later today)
      { name: 'Rocky', owner: 'James Taylor', breed: 'Shih Tzu', service: 'Bath & Dry', status: 'waiting', future: true },
      { name: 'Sadie', owner: 'Sophia Anderson', breed: 'Mixed Breed', service: 'Full Grooming', status: 'waiting', future: true },
      { name: 'Milo', owner: 'Ethan Thomas', breed: 'German Shepherd', service: 'Nail Trimming', status: 'waiting', future: true }
    ];

    // Add entries to the waiting list
    for (const puppyData of puppies) {
      const puppy = await createPuppy(puppyData.name, puppyData.owner, puppyData.breed);

      const now = new Date();
      const isFuture = puppyData.future === true;

      // Set appropriate times based on status
      let arrivalTime, serviceTime, scheduledTime;

      if (puppyData.status === 'completed') {
        // Completed appointments have arrival and service times in the past
        arrivalTime = getRandomTimeToday(8, now.getHours() - 1);
        serviceTime = new Date(arrivalTime.getTime() + (30 * 60 * 1000)); // 30 minutes after arrival
      } else if (puppyData.status === 'cancelled') {
        // Cancelled appointments have arrival time but no service time
        arrivalTime = getRandomTimeToday(8, now.getHours() - 1);
        serviceTime = null;
      } else if (isFuture) {
        // Future appointments have scheduled time in the future
        arrivalTime = null;
        serviceTime = null;
        scheduledTime = getFutureTimeToday(2 + Math.floor(Math.random() * 4)); // 2-5 hours from now
      } else {
        // Regular waiting appointments have arrival time but no service time
        arrivalTime = getRandomTimeToday(8, now.getHours());
        serviceTime = null;
      }

      // Create the waiting list entry
      const entry = await prisma.waitingListEntry.create({
        data: {
          serviceRequired: puppyData.service,
          notes: Math.random() > 0.7 ? 'Owner will return in 2 hours' : '',
          arrivalTime,
          serviceTime,
          scheduledTime,
          position: Math.floor(Math.random() * 10) + 1,
          serviced: puppyData.status === 'completed',
          isFutureBooking: isFuture,
          status: puppyData.status,
          waitingList: {
            connect: { id: waitingList.id }
          },
          puppy: {
            connect: { id: puppy.id }
          }
        }
      });

      console.log(`Added ${puppy.name} to today's waiting list - Service: ${puppyData.service} - Status: ${puppyData.status}${isFuture ? ' (Scheduled)' : ''}`);
    }

    console.log('Successfully seeded today\'s appointments with various statuses');

  } catch (error) {
    console.error('Error seeding today\'s appointments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTodayAppointments();
