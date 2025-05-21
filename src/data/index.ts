// src/data/index.js
import { characterSections } from './sistema/character';
import { skillsSection } from './sistema/skills';
import { professionsSection } from './sistema/professions';
import { capacitiesSection } from './sistema/capacities';
import { plansSections } from './sistema/plans';
import { navigationSection } from './sistema/navegation';
import { inventorySection } from './sistema/inventory';
import { citiesSection } from './sistema/cities';

export const systemInfo = [
  {
    title: "Personagens",
    description: "Informações fundamentais dos personagens, suas origens e capacidades.",
    sections: characterSections
  },
  {
    title: "Perícias",
    description: "Perícias e habilidades dos personagens.",
    sections: [skillsSection]
  },
  {
    title: "Ocupações",
    description: "Ocupações e capacidades profissionais.",
    sections: [
      professionsSection,
      capacitiesSection
    ]
  },
  {
    title: "Planos",
    description: "Informações sobre diferentes planos existenciais.",
    sections: plansSections
  },
  navigationSection, // Ensure these are structured as categories with title and sections
  inventorySection,
  citiesSection
];