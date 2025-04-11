const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate a random time on a specific date
function getRandomTime(date, startHour = 8, endHour = 17) {
  const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  const minute = Math.floor(Math.random() * 60);
  
  const time = new Date(date);
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

// Helper function to get a date X days from today
function getDateDaysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date;
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

async function getOrCreateWaitingList(date) {
  // Check if waiting list exists for the date
  let waitingList = await prisma.waitingList.findFirst({
    where: {
      date
    }
  });
  
  // Create waiting list if it doesn't exist
  if (!waitingList) {
    waitingList = await prisma.waitingList.create({
      data: {
        date
      }
    });
    console.log(`Created waiting list for ${date.toISOString().split('T')[0]}`);
  } else {
    console.log(`Using existing waiting list for ${date.toISOString().split('T')[0]}`);
  }
  
  return waitingList;
}

async function createWaitingListEntry(waitingList, puppy, serviceRequired, status, isFuture, scheduledTime, notes) {
  const now = new Date();
  
  // Set appropriate times based on status
  let arrivalTime, serviceTime;
  
  if (status === 'completed') {
    // Completed appointments have arrival and service times
    arrivalTime = getRandomTime(waitingList.date, 8, 15); // Between 8 AM and 3 PM
    serviceTime = new Date(arrivalTime.getTime() + (30 * 60 * 1000)); // 30 minutes after arrival
  } else if (status === 'cancelled') {
    // Cancelled appointments have arrival time but no service time
    arrivalTime = getRandomTime(waitingList.date, 8, 15);
    serviceTime = null;
  } else if (isFuture) {
    // Future appointments have scheduled time but no arrival or service time
    arrivalTime = null;
    serviceTime = null;
  } else {
    // Regular waiting appointments have arrival time but no service time
    arrivalTime = getRandomTime(waitingList.date, 8, now.getHours());
    serviceTime = null;
  }
  
  // Create the waiting list entry
  const entry = await prisma.waitingListEntry.create({
    data: {
      serviceRequired,
      notes: notes || (Math.random() > 0.7 ? 'Owner will return in 2 hours' : ''),
      arrivalTime,
      serviceTime,
      scheduledTime,
      position: Math.floor(Math.random() * 10) + 1,
      serviced: status === 'completed',
      isFutureBooking: isFuture,
      status,
      waitingList: {
        connect: { id: waitingList.id }
      },
      puppy: {
        connect: { id: puppy.id }
      }
    }
  });
  
  const dateStr = waitingList.date.toISOString().split('T')[0];
  const statusText = isFuture ? `${status} (Scheduled for ${scheduledTime ? scheduledTime.toLocaleTimeString() : 'later'})` : status;
  console.log(`Added ${puppy.name} (${puppy.breed || 'Unknown breed'}) to ${dateStr} - Service: ${serviceRequired} - Status: ${statusText}`);
  
  return entry;
}

async function seedComprehensiveData() {
  try {
    // Define dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = getDateDaysFromToday(-1);
    const twoDaysAgo = getDateDaysFromToday(-2);
    const threeDaysAgo = getDateDaysFromToday(-3);
    const tomorrow = getDateDaysFromToday(1);
    const dayAfterTomorrow = getDateDaysFromToday(2);
    
    // Get or create waiting lists for each date
    const todayList = await getOrCreateWaitingList(today);
    const yesterdayList = await getOrCreateWaitingList(yesterday);
    const twoDaysAgoList = await getOrCreateWaitingList(twoDaysAgo);
    const threeDaysAgoList = await getOrCreateWaitingList(threeDaysAgo);
    const tomorrowList = await getOrCreateWaitingList(tomorrow);
    const dayAfterTomorrowList = await getOrCreateWaitingList(dayAfterTomorrow);
    
    // Define puppies with different breeds
    const puppyData = [
      // Regular puppies
      { name: 'Max', owner: 'John Smith', breed: 'Labrador Retriever' },
      { name: 'Bella', owner: 'Sarah Johnson', breed: 'Poodle' },
      { name: 'Charlie', owner: 'Michael Williams', breed: 'Golden Retriever' },
      { name: 'Luna', owner: 'Emily Davis', breed: 'Bulldog' },
      { name: 'Cooper', owner: 'David Brown', breed: 'Beagle' },
      { name: 'Lucy', owner: 'Jessica Wilson', breed: 'Yorkshire Terrier' },
      { name: 'Bailey', owner: 'Daniel Miller', breed: 'Boxer' },
      { name: 'Daisy', owner: 'Olivia Moore', breed: 'Dachshund' },
      { name: 'Rocky', owner: 'James Taylor', breed: 'Shih Tzu' },
      { name: 'Sadie', owner: 'Sophia Anderson', breed: 'Mixed Breed' },
      { name: 'Milo', owner: 'Ethan Thomas', breed: 'German Shepherd' },
      
      // More puppies with different breeds
      { name: 'Buddy', owner: 'William Jones', breed: 'Siberian Husky' },
      { name: 'Molly', owner: 'Ava Martinez', breed: 'Chihuahua' },
      { name: 'Jack', owner: 'Benjamin Garcia', breed: 'Rottweiler' },
      { name: 'Stella', owner: 'Mia Robinson', breed: 'Great Dane' },
      { name: 'Oliver', owner: 'Charlotte Lee', breed: 'Pomeranian' },
      { name: 'Ruby', owner: 'Jacob Walker', breed: 'Border Collie' },
      { name: 'Tucker', owner: 'Emma Hall', breed: 'Australian Shepherd' },
      { name: 'Coco', owner: 'Alexander Young', breed: 'Cocker Spaniel' },
      { name: 'Bear', owner: 'Sofia King', breed: 'Bernese Mountain Dog' }
    ];
    
    // Create all puppies
    const puppies = [];
    for (const data of puppyData) {
      const puppy = await createPuppy(data.name, data.owner, data.breed);
      puppies.push(puppy);
    }
    
    // Services offered
    const services = [
      'Bath & Dry',
      'Full Grooming',
      'Nail Trimming',
      'Teeth Brushing',
      'Flea Treatment',
      'Haircut',
      'Ear Cleaning',
      'Paw Massage',
      'De-shedding Treatment',
      'Aromatherapy'
    ];
    
    // 1. PAST APPOINTMENTS (3 days ago)
    console.log('\n--- SEEDING APPOINTMENTS FROM THREE DAYS AGO ---');
    // All completed or cancelled
    for (let i = 0; i < 5; i++) {
      const puppy = puppies[i];
      const service = services[Math.floor(Math.random() * services.length)];
      const status = Math.random() > 0.3 ? 'completed' : 'cancelled'; // 70% completed, 30% cancelled
      
      await createWaitingListEntry(
        threeDaysAgoList,
        puppy,
        service,
        status,
        false,
        null,
        null
      );
    }
    
    // 2. PAST APPOINTMENTS (2 days ago)
    console.log('\n--- SEEDING APPOINTMENTS FROM TWO DAYS AGO ---');
    // All completed or cancelled
    for (let i = 3; i < 8; i++) {
      const puppy = puppies[i];
      const service = services[Math.floor(Math.random() * services.length)];
      const status = Math.random() > 0.3 ? 'completed' : 'cancelled'; // 70% completed, 30% cancelled
      
      await createWaitingListEntry(
        twoDaysAgoList,
        puppy,
        service,
        status,
        false,
        null,
        null
      );
    }
    
    // 3. PAST APPOINTMENTS (yesterday)
    console.log('\n--- SEEDING APPOINTMENTS FROM YESTERDAY ---');
    // All completed or cancelled
    for (let i = 6; i < 11; i++) {
      const puppy = puppies[i];
      const service = services[Math.floor(Math.random() * services.length)];
      const status = Math.random() > 0.3 ? 'completed' : 'cancelled'; // 70% completed, 30% cancelled
      
      await createWaitingListEntry(
        yesterdayList,
        puppy,
        service,
        status,
        false,
        null,
        null
      );
    }
    
    // 4. TODAY'S APPOINTMENTS
    console.log('\n--- SEEDING TODAY\'S APPOINTMENTS ---');
    
    // 4.1 Completed appointments (earlier today)
    for (let i = 0; i < 3; i++) {
      const puppy = puppies[i];
      const service = services[Math.floor(Math.random() * services.length)];
      
      await createWaitingListEntry(
        todayList,
        puppy,
        service,
        'completed',
        false,
        null,
        null
      );
    }
    
    // 4.2 Cancelled appointments (earlier today)
    for (let i = 3; i < 5; i++) {
      const puppy = puppies[i];
      const service = services[Math.floor(Math.random() * services.length)];
      
      await createWaitingListEntry(
        todayList,
        puppy,
        service,
        'cancelled',
        false,
        null,
        null
      );
    }
    
    // 4.3 Current waiting appointments
    for (let i = 5; i < 8; i++) {
      const puppy = puppies[i];
      const service = services[Math.floor(Math.random() * services.length)];
      
      await createWaitingListEntry(
        todayList,
        puppy,
        service,
        'waiting',
        false,
        null,
        null
      );
    }
    
    // 4.4 Future appointments for later today
    const now = new Date();
    for (let i = 8; i < 11; i++) {
      const puppy = puppies[i];
      const service = services[Math.floor(Math.random() * services.length)];
      const hoursFromNow = 1 + Math.floor(Math.random() * 4); // 1-4 hours from now
      const scheduledTime = new Date(now.getTime() + (hoursFromNow * 60 * 60 * 1000));
      
      await createWaitingListEntry(
        todayList,
        puppy,
        service,
        'waiting',
        true,
        scheduledTime,
        `Scheduled for ${scheduledTime.getHours()}:${scheduledTime.getMinutes().toString().padStart(2, '0')}`
      );
    }
    
    // 5. TOMORROW'S APPOINTMENTS
    console.log('\n--- SEEDING TOMORROW\'S APPOINTMENTS ---');
    // All future bookings
    for (let i = 11; i < 16; i++) {
      const puppy = puppies[i];
      const service = services[Math.floor(Math.random() * services.length)];
      const hour = 9 + Math.floor(Math.random() * 7); // Between 9 AM and 4 PM
      const minute = Math.floor(Math.random() * 60);
      
      const scheduledTime = new Date(tomorrow);
      scheduledTime.setHours(hour, minute, 0, 0);
      
      await createWaitingListEntry(
        tomorrowList,
        puppy,
        service,
        'waiting',
        true,
        scheduledTime,
        `Scheduled for ${hour}:${minute.toString().padStart(2, '0')}`
      );
    }
    
    // 6. DAY AFTER TOMORROW'S APPOINTMENTS
    console.log('\n--- SEEDING DAY AFTER TOMORROW\'S APPOINTMENTS ---');
    // All future bookings
    for (let i = 15; i < 20; i++) {
      const puppy = puppies[i];
      const service = services[Math.floor(Math.random() * services.length)];
      const hour = 9 + Math.floor(Math.random() * 7); // Between 9 AM and 4 PM
      const minute = Math.floor(Math.random() * 60);
      
      const scheduledTime = new Date(dayAfterTomorrow);
      scheduledTime.setHours(hour, minute, 0, 0);
      
      await createWaitingListEntry(
        dayAfterTomorrowList,
        puppy,
        service,
        'waiting',
        true,
        scheduledTime,
        `Scheduled for ${hour}:${minute.toString().padStart(2, '0')}`
      );
    }
    
    console.log('\nSuccessfully seeded comprehensive appointment data!');
    console.log('- Past appointments (completed/cancelled)');
    console.log('- Today\'s appointments (completed, cancelled, waiting, and scheduled)');
    console.log('- Future appointments (tomorrow and day after)');
    
  } catch (error) {
    console.error('Error seeding comprehensive data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedComprehensiveData();
