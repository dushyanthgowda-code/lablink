import { Equipment, SlotBooking, ConflictCase, DepartmentUtilization } from '../types';

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-sem-01',
    name: 'FEI Quanta 200 Scanning Electron Microscope (SEM)',
    category: 'specialised_equipment',
    department: 'Materials Science',
    labName: 'Center for Nanoscale Characterization',
    building: 'Raman Nanotech Wing, Room 104',
    description: 'High-resolution field emission SEM for ultra-fine imaging of conductive and non-conductive nanomaterials, biological specimens, and failure analysis down to 1.2nm resolution.',
    specifications: {
      'Resolution': '1.2 nm at 30 kV',
      'Magnification': '25x to 1,000,000x',
      'Detectors': 'ETD, Low Vacuum SED, BSED',
      'Chamber Pressure': 'High vacuum to 2600 Pa'
    },
    safetyLevel: 'Hazardous / Controlled',
    prerequisites: ['Radiation & Vacuum Safety Cert Level 2', 'Specimen Prep Clearance'],
    status: 'available',
    hourlyCostTokens: 30,
    tags: ['nanomaterials', 'electron microscope', 'imaging', 'surface analysis', 'crystallography'],
    utilizationScore: 88,
    totalBookings: 142
  },
  {
    id: 'eq-vna-02',
    name: 'Keysight E5071C 20GHz Vector Network Analyzer',
    category: 'specialised_equipment',
    department: 'ECE',
    labName: 'Microwave & RF Systems Laboratory',
    building: 'Maxwell Telecom Building, Room 302',
    description: 'Comprehensive 4-port VNA for high-frequency S-parameter characterization of RF circuits, patch antennas, filter prototypes, and high-speed PCB traces up to 20 GHz.',
    specifications: {
      'Frequency Range': '300 kHz to 20 GHz',
      'Dynamic Range': '130 dB',
      'Trace Noise': '0.001 dB rms',
      'Port Configuration': '4-Port Balanced'
    },
    safetyLevel: 'Moderate',
    prerequisites: ['High-Frequency Calibration Protocol Training'],
    status: 'available',
    hourlyCostTokens: 25,
    tags: ['rf', 'microwave', 'antenna', 's-parameters', 'telecom', 'pcb'],
    utilizationScore: 76,
    totalBookings: 98
  },
  {
    id: 'eq-jetson-03',
    name: 'NVIDIA Jetson AGX Orin 64GB Industrial Dev Kit',
    category: 'development_kit',
    department: 'CSE',
    labName: 'Autonomous Edge AI Research Cell',
    building: 'Turing Computer Science Tower, Room 512',
    description: 'Server-grade edge AI development system delivering up to 275 TOPS of tensor performance for robotics, autonomous navigation, vision AI, and multi-modal edge computing.',
    specifications: {
      'AI Compute': '275 TOPS (INT8)',
      'GPU': '2048-core NVIDIA Ampere with 64 Tensor Cores',
      'Memory': '64GB 256-bit LPDDR5',
      'Storage': '64GB eMMC 5.1 + 1TB NVMe expansion'
    },
    safetyLevel: 'Basic',
    prerequisites: ['Linux Embedded Systems Briefing'],
    status: 'available',
    hourlyCostTokens: 15,
    tags: ['edge ai', 'nvidia', 'jetson', 'deep learning', 'computer vision', 'robotics'],
    utilizationScore: 92,
    totalBookings: 185
  },
  {
    id: 'eq-gpu-04',
    name: 'NVIDIA DGX Station A100 (4x 80GB Tensor Core Workstation)',
    category: 'workstation',
    department: 'CSE',
    labName: 'High Performance Computing Cluster',
    building: 'Turing Computer Science Tower, Server Rm 101',
    description: 'Petaflop-class AI workstation designed for training large language models, 3D generative diffusion, and massive parallel simulation workloads without data center cooling requirements.',
    specifications: {
      'GPUs': '4x NVIDIA A100 80GB SXM4 (320GB HBM2e Total)',
      'CPU': 'AMD EPYC 7742 64-Core Processor',
      'System RAM': '512GB DDR4',
      'Storage': '7.68TB NVMe U.2 High-Speed SSD'
    },
    safetyLevel: 'Moderate',
    prerequisites: ['HPC Slurm Scheduling Certification', 'CUDA Optimization Workshop'],
    status: 'busy',
    hourlyCostTokens: 40,
    tags: ['hpc', 'gpu compute', 'llm training', 'deep learning', 'parallel processing', 'a100'],
    utilizationScore: 96,
    totalBookings: 230
  },
  {
    id: 'eq-kuka-05',
    name: 'KUKA KR 6 AGILUS Six-Axis Industrial Robotic Arm',
    category: 'specialised_equipment',
    department: 'Robotics',
    labName: 'Precision Mechatronics & Automation Studio',
    building: 'Da Vinci Robotics Pavilion, Bay 03',
    description: 'High-speed compact 6-axis manipulator designed for pick-and-place precision, path planning kinematics, robotic vision inspection, and tactile sensor integration.',
    specifications: {
      'Payload': '6 kg',
      'Max Reach': '901 mm',
      'Pose Repeatability': '±0.02 mm',
      'Controller': 'KR C4 compact with ROS2 Bridge'
    },
    safetyLevel: 'Hazardous / Controlled',
    prerequisites: ['Industrial Robot Emergency Stop Protocol', 'Safety Cage Interlock Training'],
    status: 'available',
    hourlyCostTokens: 35,
    tags: ['robotics', 'kuka', 'kinematics', 'manipulator', 'ros2', 'automation'],
    utilizationScore: 68,
    totalBookings: 74
  },
  {
    id: 'eq-utm-06',
    name: 'Instron 5982 100kN Universal Testing Machine (UTM)',
    category: 'specialised_equipment',
    department: 'Mechanical',
    labName: 'Materials & Structural Mechanics Lab',
    building: 'Watt Mechanical Engineering Hall, Room 120',
    description: 'Heavy-duty dual column electromechanical testing system for tensile, compression, flexure, and peel characterization of aerospace composites, polymers, and structural metals.',
    specifications: {
      'Load Capacity': '100 kN (22,500 lbf)',
      'Vertical Test Space': '1330 mm',
      'Crosshead Speed': '0.00005 to 1016 mm/min',
      'Data Acquisition': 'Bluehill Universal Suite at 2.5 kHz'
    },
    safetyLevel: 'Hazardous / Controlled',
    prerequisites: ['Tensile Machine Safety Guarding Certification'],
    status: 'available',
    hourlyCostTokens: 25,
    tags: ['materials', 'tensile test', 'stress strain', 'mechanical testing', 'composites'],
    utilizationScore: 71,
    totalBookings: 89
  },
  {
    id: 'eq-sla-07',
    name: 'Formlabs Form 3B+ Medical SLA 3D Printer',
    category: 'development_kit',
    department: 'Biotechnology',
    labName: 'Biomedical Microdevices & Biofabrication Lab',
    building: 'Franklin Bioengineering Center, Room 215',
    description: 'Precision stereolithography 3D printer compatible with biocompatible resins, microfluidic chips, dental prosthetics, and surgical guide prototypes.',
    specifications: {
      'XY Resolution': '25 microns',
      'Laser Spot Size': '85 microns',
      'Build Volume': '14.5 x 14.5 x 18.5 cm',
      'Supported Resins': 'BioMed Clear, Elastic 50A, Rigid 10k, Tough 2000'
    },
    safetyLevel: 'Moderate',
    prerequisites: ['Chemical Resin Handling & IPA Wash Safety'],
    status: 'available',
    hourlyCostTokens: 20,
    tags: ['3d printing', 'sla', 'biomedical', 'microfluidics', 'prototyping', 'resin'],
    utilizationScore: 82,
    totalBookings: 115
  },
  {
    id: 'eq-wind-08',
    name: 'Subsonic Open-Jet Aerodynamic Wind Tunnel Workstation',
    category: 'workstation',
    department: 'Mechanical',
    labName: 'Fluid Dynamics & Aerodynamics Facility',
    building: 'Watt Mechanical Engineering Hall, Bay 07',
    description: 'Calibrated aerodynamic wind tunnel with computerized 3-axis force balance and Particle Image Velocimetry (PIV) for UAV wing airfoil optimization and boundary layer analysis.',
    specifications: {
      'Test Section': '450 mm x 450 mm x 1200 mm',
      'Airspeed Range': '2 to 45 m/s (up to 160 km/h)',
      'Turbulence Intensity': '< 0.2%',
      'Sensors': '6-Component Strain Gauge Balance + PIV Camera'
    },
    safetyLevel: 'Hazardous / Controlled',
    prerequisites: ['Aerodynamics High-Speed Tunnel Safety Lockout'],
    status: 'available',
    hourlyCostTokens: 30,
    tags: ['aerodynamics', 'wind tunnel', 'uav', 'airfoil', 'fluid mechanics', 'piv'],
    utilizationScore: 62,
    totalBookings: 56
  },
  {
    id: 'eq-xrd-09',
    name: 'Rigaku SmartLab X-Ray Diffractometer (XRD)',
    category: 'specialised_equipment',
    department: 'Materials Science',
    labName: 'Crystallography & Powder Diffraction Suite',
    building: 'Raman Nanotech Wing, Room 112',
    description: 'State-of-the-art multi-purpose XRD system for powder diffraction, thin film rocking curve analysis, residual stress, in-situ high temperature phase transformation.',
    specifications: {
      'X-Ray Generator': '9 kW Rotating Anode Cu-Kα',
      'Goniometer Accuracy': '0.0001 degree',
      'Detector': 'HyPix-3000 Multi-Dimensional Semiconductor',
      'Atmosphere': 'Room temperature to 1100°C chamber'
    },
    safetyLevel: 'Hazardous / Controlled',
    prerequisites: ['State Radiation Safety Officer (RSO) Badge Clearance'],
    status: 'maintenance',
    hourlyCostTokens: 35,
    tags: ['xrd', 'crystallography', 'thin films', 'diffraction', 'phase analysis'],
    utilizationScore: 85,
    totalBookings: 130
  },
  {
    id: 'eq-fpga-10',
    name: 'AMD Xilinx ZCU102 Zynq UltraScale+ MPSoC Dev Board',
    category: 'development_kit',
    department: 'ECE',
    labName: 'Reconfigurable Embedded Systems Lab',
    building: 'Maxwell Telecom Building, Room 218',
    description: 'Heterogeneous computing development platform combining quad-core ARM Cortex-A53 with UltraScale+ FPGA fabric for hardware video codecs, DSP, 5G wireless baseband, and real-time motor control.',
    specifications: {
      'Logic Cells': '600k System Logic Cells',
      'Processors': 'Quad ARM Cortex-A53 + Dual Cortex-R5F',
      'Transceivers': '24x GTH 16.3Gbps',
      'Memory': '4GB 64-bit DDR4 Component + 512MB DDR4 SODIMM'
    },
    safetyLevel: 'Basic',
    prerequisites: ['Vivado Design Suite Fundamentals'],
    status: 'available',
    hourlyCostTokens: 15,
    tags: ['fpga', 'xilinx', 'embedded', 'verilog', 'mpsoc', 'hardware accelerator'],
    utilizationScore: 74,
    totalBookings: 104
  }
];

export const INITIAL_BOOKINGS: SlotBooking[] = [
  {
    id: 'bk-101',
    equipmentId: 'eq-sem-01',
    equipmentName: 'FEI Quanta 200 Scanning Electron Microscope (SEM)',
    department: 'Materials Science',
    studentId: 'STU-2024-8841',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@campus.edu',
    date: '2026-11-25',
    startTime: '10:00',
    endTime: '13:00',
    durationHours: 3,
    projectTitle: 'Zinc-Oxide Nanowire Synthesis for Next-Gen Solar Cells',
    projectDescription: 'Need SEM morphology verification for final IEEE conference paper revision. Sample ready and coated.',
    projectDeadline: '2026-11-28',
    urgencyLevel: 'Critical Capstone',
    facultyGuide: 'Dr. Ramesh Kulkarni (Materials Science)',
    status: 'approved',
    aiFairnessScore: 94,
    createdAt: '2026-11-22T09:30:00Z'
  },
  {
    id: 'bk-102',
    equipmentId: 'eq-sem-01',
    equipmentName: 'FEI Quanta 200 Scanning Electron Microscope (SEM)',
    department: 'Biotechnology',
    studentId: 'STU-2024-9120',
    studentName: 'Priya Iyer',
    studentEmail: 'priya.iyer@campus.edu',
    date: '2026-11-25',
    startTime: '11:00',
    endTime: '14:00',
    durationHours: 3,
    projectTitle: 'Chitosan Scaffolds for Tissue Engineering',
    projectDescription: 'Pore diameter analysis for semester laboratory mini-project. Samples freeze-dried.',
    projectDeadline: '2026-12-15',
    urgencyLevel: 'Normal',
    facultyGuide: 'Dr. Sunita Sen (Biotechnology)',
    status: 'conflict_flagged',
    aiFairnessScore: 68,
    aiConflictNotes: 'Direct 2-hour overlap with Critical Capstone project bk-101 on 2026-11-25.',
    createdAt: '2026-11-22T14:15:00Z'
  },
  {
    id: 'bk-103',
    equipmentId: 'eq-gpu-04',
    equipmentName: 'NVIDIA DGX Station A100 (4x 80GB Tensor Core Workstation)',
    department: 'CSE',
    studentId: 'STU-2024-3312',
    studentName: 'Rohan Deshmukh',
    studentEmail: 'rohan.d@campus.edu',
    date: '2026-11-24',
    startTime: '14:00',
    endTime: '18:00',
    durationHours: 4,
    projectTitle: 'Multi-Modal Medical Diagnosis LLM Fine-Tuning (M.Tech Thesis)',
    projectDescription: 'Training 8B parameter vision-language model on chest X-ray CT scan dataset. Model checkpointing requires A100 SXM4 interconnect.',
    projectDeadline: '2026-11-30',
    urgencyLevel: 'High',
    facultyGuide: 'Prof. Arvind Nambiar (CSE)',
    status: 'pending_faculty',
    aiFairnessScore: 91,
    createdAt: '2026-11-23T08:00:00Z'
  },
  {
    id: 'bk-104',
    equipmentId: 'eq-vna-02',
    equipmentName: 'Keysight E5071C 20GHz Vector Network Analyzer',
    department: 'ECE',
    studentId: 'STU-2024-6510',
    studentName: 'Ananya Roy',
    studentEmail: 'ananya.roy@campus.edu',
    date: '2026-11-26',
    startTime: '09:00',
    endTime: '12:00',
    durationHours: 3,
    projectTitle: 'Millimeter-Wave Microstrip Patch Antenna for 5G Cubesats',
    projectDescription: 'Return loss (S11) and smith chart impedance verification for fabricated Rogers substrate prototype.',
    projectDeadline: '2026-12-05',
    urgencyLevel: 'High',
    facultyGuide: 'Dr. P. V. Ramana (ECE)',
    status: 'pending_faculty',
    aiFairnessScore: 87,
    createdAt: '2026-11-23T10:20:00Z'
  }
];

export const INITIAL_CONFLICTS: ConflictCase[] = [
  {
    id: 'conf-2026-001',
    equipmentId: 'eq-sem-01',
    equipmentName: 'FEI Quanta 200 Scanning Electron Microscope (SEM)',
    date: '2026-11-25',
    timeSlot: '11:00 - 13:00 (Overlap)',
    contenders: [
      {
        bookingId: 'bk-101',
        studentName: 'Aarav Sharma',
        studentEmail: 'aarav.sharma@campus.edu',
        department: 'Materials Science',
        projectTitle: 'Zinc-Oxide Nanowire Synthesis for Next-Gen Solar Cells',
        projectDeadline: '2026-11-28 (in 3 days)',
        urgency: 'Critical Capstone',
        priorHoursThisWeek: 2,
        submissionTime: '2026-11-22 09:30'
      },
      {
        bookingId: 'bk-102',
        studentName: 'Priya Iyer',
        studentEmail: 'priya.iyer@campus.edu',
        department: 'Biotechnology',
        projectTitle: 'Chitosan Scaffolds for Tissue Engineering',
        projectDeadline: '2026-12-15 (in 20 days)',
        urgency: 'Normal',
        priorHoursThisWeek: 8,
        submissionTime: '2026-11-22 14:15'
      }
    ],
    aiRecommendation: {
      preferredBookingId: 'bk-101',
      preferredStudentName: 'Aarav Sharma',
      fairnessScore: 94,
      reasoning: 'Aarav Sharma holds a Critical Capstone project facing an imminent submission deadline in 3 days (Nov 28) with only 2 prior usage hours this week. Priya Iyer has an assignment deadline in 20 days (Dec 15) and has already utilized 8 hours of equipment time this week. Allocating the requested slot to Aarav prevents project blockage while preserving fairness.',
      suggestedAlternative: {
        bookingId: 'bk-102',
        studentName: 'Priya Iyer',
        alternativeEquipmentId: 'eq-sem-01',
        alternativeEquipmentName: 'FEI Quanta 200 Scanning Electron Microscope (SEM)',
        alternativeSlot: '2026-11-25 at 14:30 - 17:30 (Same day afternoon slot)',
        compromiseReason: 'Moves Priya to an open same-day afternoon window without delaying her 20-day distant deadline.'
      }
    }
  }
];

export const DEPARTMENT_UTILIZATION_DATA: DepartmentUtilization[] = [
  {
    department: 'CSE',
    totalEquipment: 8,
    activeBookings: 24,
    utilizationRate: 94,
    peakHours: '13:00 - 18:00',
    bottleneckResources: ['NVIDIA DGX Station A100', 'Jetson AGX Orin Cluster']
  },
  {
    department: 'Materials Science',
    totalEquipment: 6,
    activeBookings: 18,
    utilizationRate: 86,
    peakHours: '10:00 - 15:00',
    bottleneckResources: ['FEI Quanta SEM', 'Rigaku SmartLab XRD']
  },
  {
    department: 'ECE',
    totalEquipment: 12,
    activeBookings: 28,
    utilizationRate: 75,
    peakHours: '11:00 - 16:00',
    bottleneckResources: ['Keysight 20GHz VNA', 'ZCU102 FPGA Dev Kits']
  },
  {
    department: 'Biotechnology',
    totalEquipment: 7,
    activeBookings: 14,
    utilizationRate: 70,
    peakHours: '09:00 - 13:00',
    bottleneckResources: ['Formlabs Form 3B+ SLA', 'Confocal Microscope']
  },
  {
    department: 'Mechanical',
    totalEquipment: 10,
    activeBookings: 16,
    utilizationRate: 67,
    peakHours: '14:00 - 17:00',
    bottleneckResources: ['Instron 100kN UTM', 'Subsonic Wind Tunnel']
  },
  {
    department: 'Robotics',
    totalEquipment: 5,
    activeBookings: 9,
    utilizationRate: 64,
    peakHours: '15:00 - 19:00',
    bottleneckResources: ['KUKA KR 6 Industrial Arm', 'Spot Quadruped Cell']
  }
];
