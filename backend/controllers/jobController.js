import mongoose from 'mongoose';
import Job from '../models/Job.js';

// Pre-seeded jobs for immediate testing and fallback
const seedJobs = [
  {
    _id: '6651a0000000000000000001',
    id: '1',
    title: 'Professional Driver (Private Car & Cab)',
    category: 'DRIVER',
    location: 'Bengaluru',
    dailyWage: 1200,
    minWage: 1000,
    maxWage: 1400,
    salaryType: 'Daily',
    workTime: '8 AM – 6 PM',
    experience: '2+ Years',
    employerName: 'Nandi Motors & Cabs',
    companyName: 'Nandi Transport Logistics',
    description: 'Looking for a reliable private driver with a valid commercial/LMV driving license and familiarity with Bengaluru routes.',
    requirements: ['Valid LMV License', 'Clean driving record', 'Smartphone navigation'],
    status: 'ACTIVE',
    applicantsCount: 6,
  },
  {
    _id: '6651a0000000000000000002',
    id: '2',
    title: 'Commercial Truck & E-Commerce Delivery Driver',
    category: 'DRIVER',
    location: 'Mysuru',
    dailyWage: 1400,
    minWage: 1200,
    maxWage: 1600,
    salaryType: 'Daily',
    workTime: '9 AM – 7 PM',
    experience: '3+ Years',
    employerName: 'Express Logistics India',
    companyName: 'Express Fleet Solutions',
    description: 'Medium and heavy goods vehicle delivery across Mysuru-Bengaluru corridor. Safe drivers needed.',
    requirements: ['HGMV / HMV License', '3+ years highway experience', 'Night driving ability'],
    status: 'ACTIVE',
    applicantsCount: 4,
  },
  {
    _id: '6651a0000000000000000003',
    id: '3',
    title: 'Modular Furniture Carpenter & Assembler',
    category: 'CARPENTER',
    location: 'Bengaluru',
    dailyWage: 1100,
    minWage: 950,
    maxWage: 1300,
    salaryType: 'Daily',
    workTime: '9 AM – 6 PM',
    experience: '1+ Years',
    employerName: 'WoodCraft Interior Studios',
    companyName: 'WoodCraft Interiors Pvt Ltd',
    description: 'Assembly and installation of kitchen cabinets, wardrobes, and residential modular woodwork.',
    requirements: ['Tool handling experience', 'Drawing measurement reading', 'Punctuality'],
    status: 'ACTIVE',
    applicantsCount: 5,
  },
  {
    _id: '6651a0000000000000000004',
    id: '4',
    title: 'Construction & Warehouse General Helper',
    category: 'HELPER',
    location: 'Bengaluru',
    dailyWage: 850,
    minWage: 800,
    maxWage: 950,
    salaryType: 'Daily',
    workTime: '8 AM – 5 PM',
    experience: 'Fresher / Any',
    employerName: 'Skyline Infrastructure',
    companyName: 'Skyline Builders & Developers',
    description: 'Loading, unloading materials, assisting site foremen, and warehouse material arrangement.',
    requirements: ['Physical fitness', 'Immediate joining', 'Team worker'],
    status: 'ACTIVE',
    applicantsCount: 9,
  },
  {
    _id: '6651a0000000000000000005',
    id: '5',
    title: 'Residential Daily Cook & Kitchen Associate',
    category: 'COOK',
    location: 'Bengaluru',
    dailyWage: 950,
    minWage: 850,
    maxWage: 1100,
    salaryType: 'Daily',
    workTime: '7 AM – 3 PM',
    experience: '1+ Years',
    employerName: 'Urban Home Services',
    companyName: 'Urban Hospitality Management',
    description: 'South Indian & North Indian daily home-style cooking for apartments in Koramangala & HSR.',
    requirements: ['Hygiene awareness', 'Knowledge of regional dishes', 'References'],
    status: 'ACTIVE',
    applicantsCount: 3,
  },
  {
    _id: '6651a0000000000000000006',
    id: '6',
    title: 'Interior Wall Painter & Spray Polisher',
    category: 'PAINTER',
    location: 'Bengaluru',
    dailyWage: 1150,
    minWage: 1000,
    maxWage: 1350,
    salaryType: 'Daily',
    workTime: '9 AM – 6 PM',
    experience: '2+ Years',
    employerName: 'Rainbow Finishes',
    companyName: 'Rainbow Home Solutions',
    description: 'Primer application, putty finish, roller painting, and wood varnish polishing for apartment re-paints.',
    requirements: ['Brush and roller skills', 'Surface prep knowledge', 'Attention to detail'],
    status: 'ACTIVE',
    applicantsCount: 2,
  },
  {
    _id: '6651a0000000000000000007',
    id: '7',
    title: 'Licensed Building Electrician & Wireman',
    category: 'ELECTRICIAN',
    location: 'Bengaluru',
    dailyWage: 1300,
    minWage: 1100,
    maxWage: 1500,
    salaryType: 'Daily',
    workTime: '9 AM – 6 PM',
    experience: '3+ Years',
    employerName: 'PowerTech Electricals',
    companyName: 'PowerTech Systems & Maintenance',
    description: 'Residential MCB installation, conduit wiring, inverter setup, and commercial electrical maintenance.',
    requirements: ['ITI Electrical or Wireman certificate', 'Safety equipment usage', 'Circuit testing'],
    status: 'ACTIVE',
    applicantsCount: 7,
  },
  {
    _id: '6651a0000000000000000008',
    id: '8',
    title: 'Sanitary & Commercial Pipe Plumber',
    category: 'PLUMBER',
    location: 'Bengaluru',
    dailyWage: 1250,
    minWage: 1100,
    maxWage: 1400,
    salaryType: 'Daily',
    workTime: '9 AM – 5 PM',
    experience: '2+ Years',
    employerName: 'AquaFlow Services',
    companyName: 'AquaFlow Infrastructure',
    description: 'CPVC/UPVC pipe fittings, motor pump repairs, bathroom fixture installations, and leakage solving.',
    requirements: ['Pipe threading experience', 'Leak diagnostics', 'Own basic plumbing tools'],
    status: 'ACTIVE',
    applicantsCount: 4,
  },
];

let inMemoryJobs = [...seedJobs];

/**
 * @desc    Get all jobs (with search, category, location, employer filters)
 * @route   GET /api/jobs
 * @access  Public
 */
export const getJobs = async (req, res) => {
  try {
    const { category, location, search, employerId } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const query = { status: 'ACTIVE' };

      if (category && category !== 'ALL') {
        query.category = category.toUpperCase();
      }

      if (location && location !== 'ALL') {
        query.location = new RegExp(location, 'i');
      }

      if (employerId) {
        query.employerId = employerId;
        delete query.status; // allow employer to see all their jobs
      }

      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { category: new RegExp(search, 'i') },
          { location: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { companyName: new RegExp(search, 'i') },
        ];
      }

      let jobs = await Job.find(query).sort({ createdAt: -1 });

      // Auto seed if database is empty
      if (jobs.length === 0 && !employerId && (!category || category === 'ALL')) {
        for (const s of seedJobs) {
          const doc = new Job({
            ...s,
            employerId: s._id,
          });
          await doc.save();
        }
        jobs = await Job.find(query).sort({ createdAt: -1 });
      }

      return res.status(200).json(jobs.map((j) => j.toJSON()));
    }

    // Fallback in-memory
    let results = inMemoryJobs;

    if (employerId) {
      results = results.filter((j) => String(j.employerId) === String(employerId));
    }

    if (category && category !== 'ALL') {
      results = results.filter((j) => j.category.toUpperCase() === category.toUpperCase());
    }

    if (location && location !== 'ALL') {
      results = results.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (search) {
      const s = search.toLowerCase();
      results = results.filter(
        (j) =>
          j.title.toLowerCase().includes(s) ||
          j.category.toLowerCase().includes(s) ||
          j.location.toLowerCase().includes(s)
      );
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('[Get Jobs Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.isValidObjectId(id)) {
      const job = await Job.findById(id);
      if (job) return res.status(200).json(job.toJSON());
    }

    const matched = inMemoryJobs.find((j) => String(j.id) === String(id) || String(j._id) === String(id));
    if (matched) return res.status(200).json(matched);

    return res.status(404).json({ success: false, message: 'Job listing not found.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new job listing (Employer only)
 * @route   POST /api/jobs
 * @access  Private (Employer)
 */
export const createJob = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      workTime = '9:00 AM – 6:00 PM',
      experience = '1+ Years',
      dailyWage,
      minWage,
      maxWage,
      salaryType = 'Daily',
      description = '',
      requirements = [],
    } = req.body;

    if (!title || !category || !location || !dailyWage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Work Category, Location, and Daily Wage.',
      });
    }

    const employerId = req.user._id || req.user.id || new mongoose.Types.ObjectId();
    const employerName = req.user.fullName || 'Verified Employer';
    const companyName = req.user.companyName || employerName;

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const newJob = new Job({
        employerId,
        employerName,
        companyName,
        title: title.trim(),
        category: category.toUpperCase().trim(),
        location: location.trim(),
        workTime,
        experience,
        dailyWage: Number(dailyWage),
        minWage: Number(minWage || dailyWage * 0.9),
        maxWage: Number(maxWage || dailyWage * 1.2),
        salaryType,
        description,
        requirements: Array.isArray(requirements) ? requirements : requirements.split(',').map((r) => r.trim()),
        status: 'ACTIVE',
        applicantsCount: 0,
      });

      await newJob.save();
      return res.status(201).json({
        success: true,
        message: 'Job posted successfully and published to workers.',
        job: newJob.toJSON(),
      });
    }

    // In-memory fallback
    const fallback = {
      _id: 'job_' + Date.now(),
      id: 'job_' + Date.now(),
      employerId,
      employerName,
      companyName,
      title: title.trim(),
      category: category.toUpperCase().trim(),
      location: location.trim(),
      workTime,
      experience,
      dailyWage: Number(dailyWage),
      minWage: Number(minWage || dailyWage * 0.9),
      maxWage: Number(maxWage || dailyWage * 1.2),
      salaryType,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(',').map((r) => r.trim()),
      status: 'ACTIVE',
      applicantsCount: 0,
      createdAt: new Date().toISOString(),
    };

    inMemoryJobs.unshift(fallback);

    return res.status(201).json({
      success: true,
      message: 'Job posted successfully.',
      job: fallback,
    });
  } catch (error) {
    console.error('[Create Job Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update / Close job listing (Employer only)
 * @route   PUT /api/jobs/:id
 * @access  Private (Employer)
 */
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.isValidObjectId(id)) {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      Object.assign(job, req.body);
      await job.save();
      return res.status(200).json({ success: true, message: 'Job updated.', job: job.toJSON() });
    }

    const idx = inMemoryJobs.findIndex((j) => String(j.id) === String(id) || String(j._id) === String(id));
    if (idx !== -1) {
      Object.assign(inMemoryJobs[idx], req.body);
      return res.status(200).json({ success: true, message: 'Job updated.', job: inMemoryJobs[idx] });
    }

    return res.status(404).json({ success: false, message: 'Job not found.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete job listing
 * @route   DELETE /api/jobs/:id
 * @access  Private (Employer)
 */
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.isValidObjectId(id)) {
      await Job.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Job removed successfully.' });
    }

    inMemoryJobs = inMemoryJobs.filter((j) => String(j.id) !== String(id) && String(j._id) !== String(id));
    return res.status(200).json({ success: true, message: 'Job removed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { getJobs, getJobById, createJob, updateJob, deleteJob };
