const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getEntries = async (req, res) => {
  try {
    const entries = await prisma.entry.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
};


const submitEntry = async (req, res) => {
  const { startDate, endDate } = req.body;

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    return res.status(400).json({ error: 'Invalid startDate or endDate' });
  }

  const {
    userEmail,
    skills,
    hoursSpent,
    practiceType,
    verifierName,
    resultsAchieved,
    notes
  } = req.body;

  const hoursSpentInt = parseInt(hoursSpent, 10);
  if (isNaN(hoursSpentInt)) {
    return res.status(400).json({ error: 'Invalid hoursSpent value' });
  }

  try {
    let user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userEmail.split('@')[0],
          password: 'default'
        }
      });
    }

    const formattedResults =
      Array.isArray(resultsAchieved)
        ? resultsAchieved.join(', ')
        : typeof resultsAchieved === 'string'
          ? resultsAchieved
          : '';

    const newEntry = await prisma.entry.create({
      data: {
        userId: user.id,
        skills,
        hoursSpent: hoursSpentInt,
        startDate: startDateObj,
        endDate: endDateObj,
        practiceType,
        verifierName,
        resultsAchieved: formattedResults,
        notes,
      },
    });

    res.status(201).json({ entry: newEntry });
  } catch (error) {
    console.error('Error submitting entry:', error);
    res.status(500).json({ error: 'Failed to submit entry' });
  }
};




module.exports = {
  getEntries,
  submitEntry
};

