const { PrismaClient } = require('@prisma/client');
const { addDays, subDays, format } = require('date-fns');

const prisma = new PrismaClient();

// Sample data
const dogNames = [
  'Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Lucy', 'Buddy', 'Daisy', 'Rocky', 'Lola',
  'Tucker', 'Sadie', 'Jack', 'Molly', 'Bear', 'Bailey', 'Duke', 'Maggie', 'Toby', 'Sophie',
  'Oliver', 'Ruby', 'Leo', 'Zoe', 'Milo', 'Chloe', 'Teddy', 'Lily', 'Bentley', 'Coco',
  'Winston', 'Rosie', 'Murphy', 'Gracie', 'Zeus', 'Penny', 'Oscar', 'Stella', 'Sam', 'Nala',
  'Rusty', 'Abby', 'Baxter', 'Piper', 'Gus', 'Willow', 'Louie', 'Dixie', 'Archie', 'Ellie'
];

const ownerNames = [
  'John Smith', 'Emily Johnson', 'Michael Williams', 'Sarah Brown', 'David Jones',
  'Jessica Garcia', 'James Miller', 'Jennifer Davis', 'Robert Martinez', 'Lisa Rodriguez',
  'William Wilson', 'Patricia Moore', 'Richard Taylor', 'Linda Anderson', 'Charles Thomas',
  'Barbara Jackson', 'Joseph White', 'Margaret Harris', 'Thomas Martin', 'Dorothy Thompson',
  'Christopher Garcia', 'Mary Martinez', 'Daniel Robinson', 'Susan Clark', 'Matthew Lewis',
  'Karen Lee', 'Anthony Walker', 'Nancy Hall', 'Donald Allen', 'Carol Young',
  'Mark Hernandez', 'Sandra King', 'Paul Wright', 'Ashley Scott', 'Steven Green',
  'Kimberly Adams', 'Andrew Baker', 'Donna Nelson', 'Kenneth Hill', 'Carol Ramirez',
  'George Campbell', 'Michelle Mitchell', 'Joshua Roberts', 'Elizabeth Carter', 'Kevin Phillips',
  'Amanda Evans', 'Brian Turner', 'Melissa Torres', 'Edward Parker', 'Deborah Collins'
];

const services = [
  'Bath & Dry', 'Full Grooming', 'Nail Trimming', 'Ear Cleaning', 'Teeth Brushing',
  'De-shedding Treatment', 'Flea Treatment', 'Haircut', 'Paw Trim', 'Sanitary Trim'
];

const notes = [
  'First time customer',
  'Nervous around other dogs',
  'Prefers female groomers',
  'Sensitive skin, use hypoallergenic shampoo',
  'Extra fluffy, may need more time',
  'Doesn\'t like nail trimming',
  'Very friendly',
  'Senior dog, handle with care',
  'Matted fur in some areas',
  'Puppy, still getting used to grooming',
  'Likes treats during grooming',
  'Owner will return in 2 hours',
  'Has skin condition, check with owner',
  'Needs express anal glands',
  'Use conditioner on coat',
  '',  // Some entries with no notes
  '',
  '',
  '',
  ''
];

// Function to create a waiting list for a specific date
async function createWaitingListForDate(date) {
  console.log(`Creating waiting list for ${format(date, 'yyyy-MM-dd')}`);

  // Create or find waiting list for the date
  const waitingList = await prisma.waitingList.upsert({
    where: { date: new Date(date.setHours(0, 0, 0, 0)) },
    update: {},
    create: {
      date: new Date(date.setHours(0, 0, 0, 0)),
    },
  });

  console.log(`Waiting list created with ID: ${waitingList.id}`);

  // Number of entries for this day (random between 10-14)
  const numEntries = Math.floor(Math.random() * 5) + 10;

  // Create entries for this waiting list
  for (let i = 0; i < numEntries; i++) {
    // Create a puppy
    const puppyName = dogNames[Math.floor(Math.random() * dogNames.length)];
    const ownerName = ownerNames[Math.floor(Math.random() * ownerNames.length)];

    const puppy = await prisma.puppy.create({
      data: {
        name: puppyName,
        ownerName: ownerName,
      },
    });

    console.log(`Created puppy: ${puppyName} (Owner: ${ownerName})`);

    // Create a waiting list entry
    const service = services[Math.floor(Math.random() * services.length)];
    const note = notes[Math.floor(Math.random() * notes.length)];

    // Random arrival time between 8am and 4pm
    const hours = Math.floor(Math.random() * 8) + 8;
    const minutes = Math.floor(Math.random() * 60);
    const arrivalTime = new Date(date);
    arrivalTime.setHours(hours, minutes, 0, 0);

    // Determine if the puppy has been serviced (80% chance if in the past)
    const isToday = date.toDateString() === new Date().toDateString();
    const shouldBeServiced = !isToday && Math.random() < 0.8;

    // If serviced, set a service time 30-90 minutes after arrival
    let serviceTime = null;
    if (shouldBeServiced) {
      const waitTimeMinutes = Math.floor(Math.random() * 60) + 30;
      serviceTime = new Date(arrivalTime);
      serviceTime.setMinutes(serviceTime.getMinutes() + waitTimeMinutes);
    }

    await prisma.waitingListEntry.create({
      data: {
        waitingListId: waitingList.id,
        puppyId: puppy.id,
        serviceRequired: service,
        notes: note,
        arrivalTime: arrivalTime,
        serviceTime: serviceTime,
        position: i + 1,
        serviced: shouldBeServiced,
      },
    });

    console.log(`Added ${puppyName} to waiting list for ${format(date, 'yyyy-MM-dd')} - Service: ${service}`);
  }

  console.log(`Completed waiting list for ${format(date, 'yyyy-MM-dd')} with ${numEntries} entries\n`);
}

async function main() {
  try {
    // Create waiting lists for the past 5 days
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = subDays(today, i);
      await createWaitingListForDate(date);
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
