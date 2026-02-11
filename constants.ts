import { Application, ApplicationStatus, Job } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Solutions',
    location: 'Remote',
    salary: '$140k - $180k',
    description: 'We are looking for an expert in React and TypeScript to lead our frontend initiatives.',
    requirements: ['5+ years React', 'TypeScript expert', 'Tailwind CSS'],
    responsibilities: [
      'Architect and build scalable frontend applications using React and TypeScript',
      'Collaborate with designers to implement pixel-perfect UIs',
      'Mentor junior developers and conduct code reviews'
    ],
    postedAt: '2 days ago',
    deadline: '2024-12-31'
  },
  {
    id: 'j2',
    title: 'Product Designer',
    company: 'Creative Studio',
    location: 'New York, NY',
    salary: '$110k - $150k',
    description: 'Design intuitive and beautiful user experiences for our global client base.',
    requirements: ['Figma mastery', 'UX Research', 'Prototyping'],
    responsibilities: [
      'Create user flows, wireframes, and high-fidelity prototypes',
      'Conduct user research and usability testing',
      'Work closely with engineering to ensure design feasibility'
    ],
    postedAt: '1 week ago',
    deadline: '2024-11-15'
  },
  {
    id: 'j3',
    title: 'Backend Developer (Go)',
    company: 'StreamLine',
    location: 'Austin, TX',
    salary: '$130k - $170k',
    description: 'Build high-performance microservices in Go.',
    requirements: ['Go', 'PostgreSQL', 'Docker'],
    responsibilities: [
      'Design and implement microservices in Go',
      'Optimize database queries and ensure system reliability',
      'Maintain CI/CD pipelines'
    ],
    postedAt: '3 days ago'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    candidateId: 'c1',
    candidateName: 'Alex Johnson',
    candidateEmail: 'alex.j@example.com',
    appliedAt: '2023-10-25',
    status: ApplicationStatus.REVIEWING,
    skills: ['React', 'Node.js', 'AWS'],
    resumeLink: '#'
  },
  {
    id: 'a2',
    jobId: 'j1',
    candidateId: 'c2',
    candidateName: 'Sarah Smith',
    candidateEmail: 'sarah.s@example.com',
    appliedAt: '2023-10-24',
    status: ApplicationStatus.APPLIED,
    skills: ['Angular', 'Java', 'SQL'],
    resumeLink: '#'
  },
  {
    id: 'a3',
    jobId: 'j2',
    candidateId: 'c3',
    candidateName: 'Mike Brown',
    candidateEmail: 'mike.b@example.com',
    appliedAt: '2023-10-20',
    status: ApplicationStatus.REJECTED,
    feedback: 'While your portfolio is impressive, we are looking for someone with more specific experience in SaaS product design. We encourage you to apply for our Junior Designer role when it opens.',
    skills: ['Photoshop', 'Sketch'],
    resumeLink: '#'
  }
];