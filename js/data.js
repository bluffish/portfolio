export const VERSION = 2;

export const PROJECTS = {
  'carla-collector': {
    title: 'Carla Collector — Autonomous Driving Dataset Generator',
    desc: 'Built a dataset generator in CARLA to simulate diverse weather, lighting, and road scenarios. Implemented anomalous object generation for out-of-distribution robustness testing. Generated 400+ GB of data used in multiple high-level publications.',
    tech: ['Python', 'CARLA', 'Unreal Engine', 'C++'],
    links: { github: 'https://github.com/bluffish/carla_collector' }
  },
  'oracle': {
    title: 'Oracle — Harvard Trading Platform (Contributor)',
    desc: 'Harvard\'s flagship trading platform and primary infrastructure for the Harvard University Trading Competition (HUTC), supporting 100+ concurrent traders. Features high-performance, lock-free Limit Order Books in Rust and a responsive trading UI.',
    tech: ['Rust', 'React', 'TypeScript'],
    links: {}
  },
  'exomoon-sim': {
    title: 'Exomoon Transit Probability Simulator',
    desc: 'Monte Carlo simulation framework to model Earth-Sun-Moon orbital dynamics, executing 10k+ iterations across varying initial conditions to quantify exomoon transit probabilities.',
    tech: ['Python', 'NumPy', 'MatLab'],
    links: { github: 'https://github.com/bluffish/moon_sim' }
  }
};

export const PROJECT_LIST = Object.keys(PROJECTS);

export const EXPERIENCE = {
  'hpe': {
    title: 'Embedded Software Engineering Intern',
    org: 'Hewlett Packard Enterprise',
    location: 'Spring, TX',
    date: 'Jun. 2025 \u2013 Aug. 2025',
    desc: 'Designed a high-throughput virtualized Hardware Security Module (HSM) in C++, achieving 10-20x latency reduction over industry competitors. Optimized communication between the BMC-resident HSM and host CPU for cloud-scale deployments.',
    tech: ['C++', 'Python']
  },
  'huqt': {
    title: 'Software Engineer, Trading Systems',
    org: 'Harvard University Quantitative Traders',
    location: 'Cambridge, MA',
    date: 'Sep. 2025 \u2013 Present',
    desc: 'Developing Oracle, Harvard\'s flagship trading platform for HUTC, supporting 100+ concurrent traders. Building high-performance, lock-free Limit Order Books in Rust.',
    tech: ['Rust', 'React', 'Python']
  },
  'rsi': {
    title: 'Research Science Institute (RSI) Scholar',
    org: 'Massachusetts Institute of Technology',
    location: 'Cambridge, MA',
    date: 'Jun. 2024 \u2013 Aug. 2024',
    desc: 'Conducted research on vision transformers for fluid dynamics closure modeling under Prof. Pierre Lermusiaux. Enhanced model robustness through a novel data-processing scheme and designed deep ensembling for closure models.',
    tech: ['Python', 'PyTorch', 'MatLab']
  },
  'cfa': {
    title: 'Exoplanet Researcher',
    org: 'Center for Astrophysics',
    location: 'Cambridge, MA',
    date: 'Jan. 2026 \u2013 Present',
    desc: 'Developing a Monte Carlo simulation framework to model Earth-Sun-Moon orbital dynamics, executing 10k+ iterations across varying initial conditions to quantify exomoon transit probabilities.',
    tech: ['Python', 'NumPy', 'MatLab', 'CUDA', 'C++']
  },
  'utd': {
    title: 'AI Safety Researcher',
    org: 'UT Dallas AI Safety Lab',
    location: 'Richardson, TX',
    date: 'Jun. 2022 \u2013 May 2025',
    desc: 'Led research on autonomous driving perception, resulting in multiple first-author publications at ICLR, ACM KDD, and Frontiers in Big Data. Engineered a distributed training pipeline across 30+ GPU nodes managing multi-terabyte datasets.',
    tech: ['Python', 'PyTorch', 'CUDA']
  }
};

export const EXPERIENCE_LIST = Object.keys(EXPERIENCE);

export const PAPERS = {
  'uq-bev-iclr': {
    title: 'Predictive Uncertainty Quantification for BEV Segmentation',
    authors: 'L. Yu*, B. Yang* et al. (* = co-first author)',
    venue: 'ICLR 2025',
    status: 'published',
    desc: 'Calibrated uncertainty estimation for bird\'s-eye-view semantic segmentation in autonomous driving pipelines using conformal prediction with distribution-free coverage guarantees.',
    links: {}
  },
  'camera-view-frontiers': {
    title: 'Camera-view Supervision for BEV Semantic Segmentation',
    authors: 'B. Yang et al.',
    venue: 'Frontiers in Big Data 2024',
    status: 'published',
    desc: 'Novel camera-view supervision approach for bird\'s-eye-view semantic segmentation, improving training efficiency and prediction quality.',
    links: {}
  },
  'uq-bev-kdd': {
    title: 'Evaluating Uncertainty Quantification for BEV Semantic Segmentation',
    authors: 'B. Yang et al.',
    venue: 'ACM KDD 2024',
    status: 'published',
    desc: 'Comprehensive evaluation of uncertainty quantification methods for bird\'s-eye-view semantic segmentation in autonomous driving.',
    links: {}
  }
};

export const PAPER_LIST = Object.keys(PAPERS);

// Precomputed venue list for intro
export const VENUES = [...new Set(Object.values(PAPERS).map(p => p.venue.replace(/\s*\d{4}$/, '')))];

export const SKILLS = {
  'Languages': { tags: ['Java', 'Python', 'C', 'C++', 'MatLab', 'Go', 'Rust'], cls: 'tag-lang' },
  'Frameworks': { tags: ['PyTorch', 'Matplotlib', 'Pandas', 'NumPy', 'React', 'Docker'], cls: 'tag-ml' },
  'Systems': { tags: ['Unix/Linux', 'Unreal Engine', 'CARLA'], cls: 'tag-hpc' }
};

export const COMMANDS = [
  'help', 'intro', 'about', 'projects', 'papers', 'experience',
  'ls', 'cat', 'cd', 'tree', 'skills',
  'contact', 'clear',
  'sudo', 'vim', 'cowsay', 'rm'
];

export const DIRS = ['projects', 'papers', 'experience'];
