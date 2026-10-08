import celebration from "@/assets/community-celebration.jpg";
import welcome from "@/assets/community-welcome.jpg";

export const trailImages = [celebration, welcome];

export type Publication = {
  slug: string;
  title: string;
  description: string;
  date: string;
  edition: string;
  cover: string;
  pageCount: number;
  sections: string[];
};

// Illustrative monthly editions; replace with the actual newspaper content.
export const publications: Publication[] = [
  { slug: "september-2026", title: "September 2026", description: "A monthly roundup of celebrations, birthdays, new joiners, festivals, and achievements.", date: "Sep 2026", edition: "No. 24", cover: celebration, pageCount: 24, sections: ["Celebrations & Festivals", "Birthday Wishes", "Welcome, New Joiners", "Achievements & Milestones", "Around Our Community"] },
  { slug: "august-2026", title: "August 2026", description: "A monthly roundup of celebrations, birthdays, new joiners, festivals, and achievements.", date: "Aug 2026", edition: "No. 23", cover: welcome, pageCount: 20, sections: ["Celebrations & Festivals", "Birthday Wishes", "Welcome, New Joiners", "Achievements & Milestones", "Around Our Community"] },
  { slug: "july-2026", title: "July 2026", description: "A monthly roundup of celebrations, birthdays, new joiners, festivals, and achievements.", date: "Jul 2026", edition: "No. 22", cover: celebration, pageCount: 24, sections: ["Celebrations & Festivals", "Birthday Wishes", "Welcome, New Joiners", "Achievements & Milestones", "Around Our Community"] },
  { slug: "june-2026", title: "June 2026", description: "A monthly roundup of celebrations, birthdays, new joiners, festivals, and achievements.", date: "Jun 2026", edition: "No. 21", cover: welcome, pageCount: 20, sections: ["Celebrations & Festivals", "Birthday Wishes", "Welcome, New Joiners", "Achievements & Milestones", "Around Our Community"] },
  { slug: "may-2026", title: "May 2026", description: "A monthly roundup of celebrations, birthdays, new joiners, festivals, and achievements.", date: "May 2026", edition: "No. 20", cover: celebration, pageCount: 24, sections: ["Celebrations & Festivals", "Birthday Wishes", "Welcome, New Joiners", "Achievements & Milestones", "Around Our Community"] },
  { slug: "april-2026", title: "April 2026", description: "A monthly roundup of celebrations, birthdays, new joiners, festivals, and achievements.", date: "Apr 2026", edition: "No. 19", cover: welcome, pageCount: 20, sections: ["Celebrations & Festivals", "Birthday Wishes", "Welcome, New Joiners", "Achievements & Milestones", "Around Our Community"] },
  { slug: "march-2026", title: "March 2026", description: "A monthly roundup of celebrations, birthdays, new joiners, festivals, and achievements.", date: "Mar 2026", edition: "No. 18", cover: celebration, pageCount: 24, sections: ["Celebrations & Festivals", "Birthday Wishes", "Welcome, New Joiners", "Achievements & Milestones", "Around Our Community"] },
  { slug: "february-2026", title: "February 2026", description: "A monthly roundup of celebrations, birthdays, new joiners, festivals, and achievements.", date: "Feb 2026", edition: "No. 17", cover: welcome, pageCount: 20, sections: ["Celebrations & Festivals", "Birthday Wishes", "Welcome, New Joiners", "Achievements & Milestones", "Around Our Community"] },
];

export const getPublication = (slug: string) => publications.find((p) => p.slug === slug);
