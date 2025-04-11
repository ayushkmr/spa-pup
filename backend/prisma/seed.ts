import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { addDays, subDays, setHours, setMinutes } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('Admin user created:', admin);
  } else {
    console.log('Admin user already exists');
  }

  // Create sample puppies if they don't exist
  const puppyNames = [
    { name: 'Max', ownerName: 'John Smith' },
    { name: 'Bella', ownerName: 'Emily Johnson' },
    { name: 'Charlie', ownerName: 'Michael Brown' },
    { name: 'Luna', ownerName: 'Jessica Davis' },
    { name: 'Cooper', ownerName: 'David Wilson' },
    { name: 'Lucy', ownerName: 'Sarah Martinez' },
    { name: 'Buddy', ownerName: 'Robert Taylor' },
    { name: 'Daisy', ownerName: 'Jennifer Anderson' },
    { name: 'Rocky', ownerName: 'Thomas Jackson' },
    { name: 'Sadie', ownerName: 'Lisa White' },
    { name: 'Milo', ownerName: 'Daniel Harris' },
    { name: 'Molly', ownerName: 'Nancy Martin' },
    { name: 'Bailey', ownerName: 'Christopher Thompson' },
    { name: 'Lola', ownerName: 'Karen Garcia' },
    { name: 'Duke', ownerName: 'Edward Rodriguez' }
  ];

  const puppies: Array<{ id: number; name: string; ownerName: string; createdAt: Date }> = [];
  for (const puppyData of puppyNames) {
    const existingPuppy = await prisma.puppy.findFirst({
      where: {
        name: puppyData.name,
        ownerName: puppyData.ownerName
      }
    });

    if (!existingPuppy) {
      const puppy = await prisma.puppy.create({
        data: puppyData
      });
      puppies.push(puppy);
      console.log(`Created puppy: ${puppy.name} (Owner: ${puppy.ownerName})`);
    } else {
      puppies.push(existingPuppy);
      console.log(`Puppy already exists: ${existingPuppy.name} (Owner: ${existingPuppy.ownerName})`);
    }
  }

  // Services available
  const services = [
    "Bath & Dry",
    "Full Grooming",
    "Nail Trimming",
    "Teeth Brushing",
    "Flea Treatment",
    "Haircut",
    "Ear Cleaning",
    "Paw Massage",
    "Fur Coloring",
    "Aromatherapy",
    "Mud Bath",
    "Puppy Facial",
    "De-shedding Treatment"
  ];

  // Create waiting lists for past, present, and future dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create past waiting lists (7 days ago, 3 days ago, 1 day ago)
  const pastDates = [subDays(today, 7), subDays(today, 3), subDays(today, 1)];

  // Create future waiting lists (1 day ahead, 3 days ahead, 7 days ahead)
  const futureDates = [addDays(today, 1), addDays(today, 3), addDays(today, 7)];

  // All dates including today
  const allDates = [...pastDates, today, ...futureDates];

  for (const date of allDates) {
    // Check if waiting list already exists for this date
    const existingList = await prisma.waitingList.findUnique({
      where: { date }
    });

    let waitingList;
    if (!existingList) {
      waitingList = await prisma.waitingList.create({
        data: { date }
      });
      console.log(`Created waiting list for ${date.toDateString()}`);
    } else {
      waitingList = existingList;
      console.log(`Waiting list already exists for ${date.toDateString()}`);
    }

    // Skip adding entries if the list already exists
    if (existingList) continue;

    // Add entries to the waiting list
    const isPastDate = date < today;
    const isFutureDate = date > today;
    const isToday = date.getTime() === today.getTime();

    // Determine how many entries to create based on the date
    const numEntries = Math.floor(Math.random() * 5) + 3; // 3-7 entries

    for (let i = 0; i < numEntries; i++) {
      // Randomly select a puppy and service
      const puppy = puppies[Math.floor(Math.random() * puppies.length)];
      const service = services[Math.floor(Math.random() * services.length)];

      // Generate a random time for the appointment
      const hour = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
      const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45 minutes

      // For past dates, all entries are serviced
      const isServiced = isPastDate || (isToday && Math.random() > 0.5);

      // For future dates, some entries are future bookings
      const isFutureBooking = isFutureDate && Math.random() > 0.3;

      // Create arrival time
      let arrivalTime: Date;
      let serviceTime: Date | null = null;
      let scheduledTime: Date | null = null;

      if (isPastDate || isToday) {
        // For past or today's entries, set arrival time
        arrivalTime = setMinutes(setHours(new Date(date), hour), minute);

        // For serviced entries, set service time
        if (isServiced) {
          // Service time is 30-90 minutes after arrival
          const serviceMinutes = minute + 30 + Math.floor(Math.random() * 60);
          const serviceHour = hour + Math.floor(serviceMinutes / 60);
          serviceTime = setMinutes(setHours(new Date(date), serviceHour), serviceMinutes % 60);
        }
      } else {
        // For future entries, set current time as arrival time
        arrivalTime = new Date();

        // For future bookings, set scheduled time
        if (isFutureBooking) {
          scheduledTime = setMinutes(setHours(new Date(date), hour), minute);
        }
      }

      // Create the entry
      const entry = await prisma.waitingListEntry.create({
        data: {
          waitingListId: waitingList.id,
          puppyId: puppy.id,
          serviceRequired: service,
          notes: Math.random() > 0.7 ? `Special instructions for ${puppy.name}` : null,
          arrivalTime,
          serviceTime,
          scheduledTime,
          position: i + 1,
          serviced: isServiced,
          isFutureBooking,
        }
      });

      console.log(`Created entry for ${puppy.name}: ${service} on ${date.toDateString()} ${isFutureBooking ? '(Future Booking)' : isServiced ? '(Serviced)' : '(Waiting)'}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
