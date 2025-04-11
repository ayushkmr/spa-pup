# Seed Data for Puppy Spa

This document describes the seed data that has been added to the Puppy Spa application.

## Waiting Lists

We've created waiting lists for the past 6 days (including today) with a total of 62 puppies:

- 2025-04-05: 9 puppies
- 2025-04-06: 10 puppies
- 2025-04-07: 12 puppies
- 2025-04-08: 11 puppies
- 2025-04-09: 10 puppies
- 2025-04-10 (today): 10 puppies

## Data Variety

The seed data includes:

- 50 different puppy names
- 50 different owner names
- 10 different services
- 20 different notes (including some empty notes)
- Random arrival times between 8am and 4pm
- For past days, approximately 80% of puppies are marked as serviced

## How to Regenerate Seed Data

If you need to regenerate the seed data, you can run the `seed-waiting-lists.js` script:

```bash
# Copy the script to the container
docker cp backend/seed-waiting-lists.js <container_name>:/app/seed-waiting-lists.js

# Run the script
docker-compose exec backend node seed-waiting-lists.js
```

## Customizing Seed Data

You can modify the `seed-waiting-lists.js` script to customize the seed data:

- Change the number of days by modifying the loop in the `main()` function
- Add or remove puppy names, owner names, services, or notes
- Adjust the number of entries per day by changing the `numEntries` calculation
- Modify the probability of a puppy being serviced by changing the `Math.random() < 0.8` condition

## Viewing Seed Data

You can view the seed data in several ways:

1. **Prisma Studio**: Run `docker-compose exec backend npx prisma studio` and open http://localhost:5555 in your browser
2. **Frontend Application**: Open http://localhost in your browser
3. **API Endpoints**:
   - Get today's waiting list: `curl http://localhost/api/waiting-list/today`
   - Get a specific date's waiting list: `curl http://localhost/api/waiting-list/history/2025-04-05`
   - Get all puppies: `curl http://localhost/api/puppy/all`
