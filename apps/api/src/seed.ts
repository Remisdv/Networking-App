import { dataSource } from './database/data-source';
import { Company } from './companies/entities/company.entity';
import { Offer } from './offers/entities/offer.entity';
import { Student } from './students/entities/student.entity';

async function seed() {
  await dataSource.initialize();

  const offerRepository = dataSource.getRepository(Offer);
  const studentRepository = dataSource.getRepository(Student);
  const companyRepository = dataSource.getRepository(Company);

  await offerRepository.delete({});
  await studentRepository.delete({});
  await companyRepository.delete({});

  const companies = await companyRepository.save([
    companyRepository.create({
      name: 'TechNova',
      website: 'https://www.technova.example',
      logoUrl: 'https://dummyimage.com/120x120/0f172a/ffffff&text=TN',
      location: 'Paris',
      description: 'Scale-up SaaS specialisee dans la data visualisation temps reel.',
    }),
    companyRepository.create({
      name: 'GreenFuture',
      website: 'https://www.greenfuture.example',
      logoUrl: 'https://dummyimage.com/120x120/14532d/ffffff&text=GF',
      location: 'Lyon',
      description: 'Startup climat qui accompagne les industriels dans la decarbonation.',
    }),
    companyRepository.create({
      name: 'DataBridge',
      website: 'https://www.databridge.example',
      logoUrl: 'https://dummyimage.com/120x120/1d4ed8/ffffff&text=DB',
      location: 'Lille',
      description: 'ESN qui conçoit des plateformes d integration de donnees pour le retail.',
    }),
  ]);

  const [technova, greenfuture, databridge] = companies;

  await offerRepository.save([
    offerRepository.create({
      title: 'Developpeur Front React',
      description:
        'Participation aux features UI du dashboard analytics avec React, TanStack Query et Tailwind.',
      location: 'Paris (hybride)',
      contractType: 'Alternance',
      tags: ['react', 'typescript', 'ui'],
      weeklyHours: 35,
      salaryRange: '1000-1200 EUR brut / mois',
      company: technova,
    }),
    offerRepository.create({
      title: 'Ingenieur Data junior',
      description:
        'Mise en place de pipelines ingest et transformation sur notre datalake (AWS, dbt, Python).',
      location: 'Remote',
      contractType: 'Apprentissage',
      tags: ['python', 'airflow', 'sql'],
      weeklyHours: 35,
      salaryRange: '1100-1300 EUR brut / mois',
      company: technova,
    }),
    offerRepository.create({
      title: 'Charge de projets Climat',
      description:
        'Support au pilotage des projets de decarbonation et suivi des plans d action clients.',
      location: 'Lyon',
      contractType: 'Alternance',
      tags: ['gestion de projet', 'bilan carbone'],
      weeklyHours: 35,
      salaryRange: '950-1100 EUR brut / mois',
      company: greenfuture,
    }),
    offerRepository.create({
      title: 'Product Designer',
      description: 'Production de wireframes et design system pour l application mobile (Figma).',
      location: 'Paris',
      tags: ['ux', 'ui', 'figma'],
      weeklyHours: 32,
      contractType: 'Alternance',
      company: greenfuture,
    }),
    offerRepository.create({
      title: 'Developpeur Backend Node.js',
      description: 'Developpement de microservices Node.js/Kafka pour des clients retail.',
      location: 'Lille',
      contractType: 'Contrat pro',
      tags: ['node.js', 'kafka', 'microservices'],
      weeklyHours: 35,
      company: databridge,
    }),
    offerRepository.create({
      title: 'Analyste Cybersecurite',
      description: 'Veille de vulnerabilites et redaction de playbooks de reponse a incident.',
      location: 'Remote (France)',
      contractType: 'Alternance',
      tags: ['cyber', 'soc', 'veille'],
      weeklyHours: 35,
      salaryRange: '1050-1250 EUR brut / mois',
      company: databridge,
    }),
  ]);

  await studentRepository.save([
    studentRepository.create({
      firstName: 'Amelie',
      lastName: 'Durand',
      email: 'amelie.durand@example.com',
      graduationYear: 2025,
      skills: ['React', 'TypeScript', 'Tailwind', 'UX'],
    }),
    studentRepository.create({
      firstName: 'Lina',
      lastName: 'Benali',
      email: 'lina.benali@example.com',
      graduationYear: 2026,
      skills: ['Python', 'SQL', 'Airflow', 'Snowflake'],
    }),
    studentRepository.create({
      firstName: 'Sacha',
      lastName: 'Rossi',
      email: 'sacha.rossi@example.com',
      graduationYear: 2025,
      skills: ['Node.js', 'Kafka', 'Docker'],
    }),
    studentRepository.create({
      firstName: 'Noa',
      lastName: 'Martin',
      email: 'noa.martin@example.com',
      graduationYear: 2024,
      skills: ['Gestion de projet', 'Bilan carbone', 'Notion'],
    }),
    studentRepository.create({
      firstName: 'Elie',
      lastName: 'Keller',
      email: 'elie.keller@example.com',
      graduationYear: 2026,
      skills: ['Securite', 'SIEM', 'Python'],
    }),
  ]);

  console.log('Seed PostgreSQL effectue avec succes');
}

seed()
  .catch((error) => {
    console.error('Seed PostgreSQL echoue', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
