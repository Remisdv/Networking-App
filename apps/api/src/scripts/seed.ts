import "reflect-metadata";
import { config } from "dotenv";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

config({ path: ".env" });

const projectId = process.env.FIREBASE_PROJECT_ID ?? "alt-platform-dev";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL ?? "";
const privateKey = (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

if (!clientEmail || !privateKey) {
  console.error("Missing Firebase credentials. Check your environment variables.");
  process.exit(1);
}

const app = initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
  projectId,
});

const firestore = getFirestore(app);

const students = [
  {
    id: "student-1",
    fullName: "Alice Martin",
    headline: "Product Design Student",
    city: "Paris",
    school: "HEC",
    skills: ["Design", "Figma", "User Research"],
    bio: "Product design student passionate about inclusive experiences.",
  },
  {
    id: "student-2",
    fullName: "Hugo Leroy",
    headline: "Data Analyst Apprentice",
    city: "Lyon",
    school: "INSA",
    skills: ["Python", "SQL", "PowerBI"],
    bio: "Data analyst apprentice focusing on marketing insights.",
  },
  {
    id: "student-3",
    fullName: "Camille Dubois",
    headline: "Software Engineer",
    city: "Paris",
    school: "Polytechnique",
    skills: ["TypeScript", "NestJS", "React"],
    bio: "Full-stack engineer building modern web applications.",
  },
  {
    id: "student-4",
    fullName: "Noah Bernard",
    headline: "Cybersecurity Student",
    city: "Lille",
    school: "Epitech",
    skills: ["Pentesting", "Network Security", "Python"],
    bio: "Cybersecurity enthusiast focused on defensive tooling.",
  },
  {
    id: "student-5",
    fullName: "Emma Caron",
    headline: "Marketing & Growth Apprentice",
    city: "Bordeaux",
    school: "ESCP",
    skills: ["SEO", "Content", "Analytics"],
    bio: "Growth marketer building data-driven campaigns.",
  },
];

const companies = [
  {
    id: "company-1",
    name: "Nova Tech",
    sector: "Technology",
    city: "Paris",
    logoUrl: "https://logo.dev/novatech.png",
    description: "Scale-up building productivity tools for remote teams.",
    validatedStudents: ["student-3"],
  },
  {
    id: "company-2",
    name: "Green Finance",
    sector: "Finance",
    city: "Lyon",
    logoUrl: "https://logo.dev/greenfinance.png",
    description: "Fintech helping SMEs access sustainable financing.",
    validatedStudents: [],
  },
  {
    id: "company-3",
    name: "HealthForward",
    sector: "Health",
    city: "Marseille",
    logoUrl: "https://logo.dev/healthforward.png",
    description: "Healthcare startup simplifying patient onboarding.",
    validatedStudents: ["student-2"],
  },
];

const apprenticeships = [
  {
    id: "apprenticeship-1",
    title: "Frontend Engineer Apprentice",
    companyId: "company-1",
    location: "Paris",
    startDate: new Date().toISOString(),
  },
  {
    id: "apprenticeship-2",
    title: "Product Marketing Apprentice",
    companyId: "company-1",
    location: "Remote",
    startDate: new Date().toISOString(),
  },
  {
    id: "apprenticeship-3",
    title: "Data Analyst Apprentice",
    companyId: "company-2",
    location: "Lyon",
    startDate: new Date().toISOString(),
  },
  {
    id: "apprenticeship-4",
    title: "Growth Marketing Apprentice",
    companyId: "company-2",
    location: "Lyon",
    startDate: new Date().toISOString(),
  },
  {
    id: "apprenticeship-5",
    title: "Cybersecurity Analyst Apprentice",
    companyId: "company-3",
    location: "Marseille",
    startDate: new Date().toISOString(),
  },
  {
    id: "apprenticeship-6",
    title: "UX Research Apprentice",
    companyId: "company-3",
    location: "Marseille",
    startDate: new Date().toISOString(),
  },
];

const schools = [
  { id: "school-1", name: "HEC", city: "Paris", premium: true },
  { id: "school-2", name: "INSA", city: "Lyon", premium: false },
  { id: "school-3", name: "Polytechnique", city: "Palaiseau", premium: true },
];

async function seedCollection(collectionName: string, records: Array<Record<string, unknown>>) {
  const batch = firestore.batch();
  records.forEach((record) => {
    const docRef = firestore.collection(collectionName).doc(record.id as string);
    batch.set(docRef, record);
  });
  await batch.commit();
  console.log(`Seeded ${records.length} documents into ${collectionName}`);
}

(async () => {
  await seedCollection("students", students);
  await seedCollection("companies", companies);
  await seedCollection("apprenticeships", apprenticeships);
  await seedCollection("schools", schools);
  console.log("Seeding complete");
  process.exit(0);
})();
