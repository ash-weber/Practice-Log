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

const getMyEntries = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10', 10)));
    const offset = (page - 1) * limit;

    // optional filters
    const skill = req.query.skill ? String(req.query.skill).trim() : null;
    const sortBy = ['createdAt', 'startDate', 'endDate', 'hoursSpent'].includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    let fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
    let toDate = req.query.toDate ? new Date(req.query.toDate) : null;
    if (fromDate) {
      fromDate.setHours(0, 0, 0, 0);
    }
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return res.json({ entries: [], total: 0, page, limit });

    const where = { userId: user.id };
    const dateConditions = [];
    if (fromDate && toDate) {
      dateConditions.push({ startDate: { lte: toDate } });
      dateConditions.push({ endDate: { gte: fromDate } });
    } else if (fromDate) {
      dateConditions.push({ endDate: { gte: fromDate } });
    } else if (toDate) {
      dateConditions.push({ startDate: { lte: toDate } });
    }
    if (dateConditions.length > 0) where.AND = dateConditions;

    if (skill) {
      const all = await prisma.entry.findMany({
        where,
        include: { user: { select: { email: true, name: true } } },
        orderBy: { [sortBy]: order },
      });

      const filtered = all.filter(e => Array.isArray(e.skills) && e.skills.some(s => String(s).toLowerCase() === skill.toLowerCase()));
      const total = filtered.length;
      const pageEntries = filtered.slice(offset, offset + limit);
      return res.json({ entries: pageEntries, total, page, limit });
    }

    const [total, entries] = await Promise.all([
      prisma.entry.count({ where }),
      prisma.entry.findMany({
        where,
        include: { user: { select: { email: true, name: true } } },
        orderBy: { [sortBy]: order },
        skip: offset,
        take: limit,
      })
    ]);

    res.json({ entries, total, page, limit });
  } catch (error) {
    console.error('Error fetching my entries:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
};

const getEntryAnalytics = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return res.json({ analytics: {} });

    let fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
    let toDate = req.query.toDate ? new Date(req.query.toDate) : null;
    if (fromDate) fromDate.setHours(0,0,0,0);
    if (toDate) toDate.setHours(23,59,59,999);

    const where = { userId: user.id };
    const dateConditions = [];
    if (fromDate && toDate) {
      dateConditions.push({ startDate: { lte: toDate } });
      dateConditions.push({ endDate: { gte: fromDate } });
    } else if (fromDate) {
      dateConditions.push({ endDate: { gte: fromDate } });
    } else if (toDate) {
      dateConditions.push({ startDate: { lte: toDate } });
    }
    if (dateConditions.length > 0) where.AND = dateConditions;

    const entries = await prisma.entry.findMany({ where });

    const analytics = {
      totalEntries: entries.length,
      totalHours: 0,
      avgHoursPerEntry: 0,
      skillHours: {},
    };

    entries.forEach(entry => {
      const hours = parseFloat(entry.hoursSpent) || 0;
      analytics.totalHours += hours;
      const skills = Array.isArray(entry.skills) ? entry.skills : [];
      const perSkill = skills.length > 0 ? hours / skills.length : 0;
      skills.forEach(skill => {
        analytics.skillHours[skill] = (analytics.skillHours[skill] || 0) + perSkill;
      });
    });

    analytics.avgHoursPerEntry = analytics.totalEntries > 0 ? analytics.totalHours / analytics.totalEntries : 0;

    res.json({ analytics });
  } catch (error) {
    console.error('Error computing analytics:', error);
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
};

const getOthersAnalytics = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return res.json({ analytics: {} });

    let fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
    let toDate = req.query.toDate ? new Date(req.query.toDate) : null;
    if (fromDate) fromDate.setHours(0,0,0,0);
    if (toDate) toDate.setHours(23,59,59,999);

    const where = { NOT: { userId: user.id } };
    const dateConditions = [];
    if (fromDate && toDate) {
      dateConditions.push({ startDate: { lte: toDate } });
      dateConditions.push({ endDate: { gte: fromDate } });
    } else if (fromDate) {
      dateConditions.push({ endDate: { gte: fromDate } });
    } else if (toDate) {
      dateConditions.push({ startDate: { lte: toDate } });
    }
    if (dateConditions.length > 0) where.AND = dateConditions;

    const entries = await prisma.entry.findMany({ where });

    const analytics = {
      totalEntries: entries.length,
      totalHours: 0,
      skillHours: {},
      skillEntryCounts: {},
    };

    entries.forEach(entry => {
      const hours = parseFloat(entry.hoursSpent) || 0;
      analytics.totalHours += hours;
      const skills = Array.isArray(entry.skills) ? entry.skills : [];
      const perSkill = skills.length > 0 ? hours / skills.length : 0;
      skills.forEach(skill => {
        analytics.skillHours[skill] = (analytics.skillHours[skill] || 0) + perSkill;
        analytics.skillEntryCounts[skill] = (analytics.skillEntryCounts[skill] || 0) + 1;
      });
    });

    res.json({ analytics });
  } catch (error) {
    console.error('Error computing others analytics:', error);
    res.status(500).json({ error: 'Failed to compute analytics' });
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

    const formattedSkills = Array.isArray(skills) ? skills : [skills];
    const formattedPracticeType = Array.isArray(practiceType) ? practiceType : [practiceType];

    const formattedResults =
      Array.isArray(resultsAchieved)
        ? resultsAchieved.join(', ')
        : typeof resultsAchieved === 'string'
          ? resultsAchieved
          : '';

    const newEntry = await prisma.entry.create({
      data: {
        userId: user.id,
        skills: formattedSkills,
        hoursSpent: hoursSpentInt,
        startDate: startDateObj,
        endDate: endDateObj,
        practiceType: formattedPracticeType,
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
  submitEntry,
  getMyEntries,
  getEntryAnalytics,
  getOthersAnalytics
};
