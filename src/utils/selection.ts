interface Option {
  value: string;
  label: string;
}

interface School {
  [key: string]: Option[];
}

interface Department {
  [key: string]: {
    [key: string]: Option[];
  };
}

export const colleges: Option[] = [
  {
    value: "College-of-Basic-and-Applied-Sciences",
    label: "College of Basic and Applied Sciences",
  },
  { value: "College-of-Health-Sciences", label: "College of Health Sciences" },
  { value: "College-of-Humanities", label: "College of Humanities" },
  { value: "College-of-Education", label: "College of Education" },
];

export const schools: School = {
  "College-of-Basic-and-Applied-Sciences": [
    { value: "School-of-Engineering", label: "School of Engineering" },
    {
      value: "School-of-Physical-and-Mathematical-Sciences",
      label: "School of Physical and Mathematical Sciences",
    },
    {
      value: "School-of-Biological-Sciences",
      label: "School of Biological Sciences",
    },
    { value: "School-of-Agriculture", label: "School of Agriculture" },
    {
      value: "School-of-Veterinary-Medicine",
      label: "School of Veterinary Medicine",
    },
  ],
  "College-of-Health-Sciences": [
    { value: "Medical-School", label: "Medical School" },
    { value: "School-of-Pharmacy", label: "School of Pharmacy" },
    {
      value: "School-of-Biomedical-and-Allied-Health-Sciences",
      label: "School of Biomedical and Allied Health Sciences",
    },
    {
      value: "School-of-Nursing-and-Midwifery",
      label: "School of Nursing and Midwifery",
    },
    { value: "School-of-Public-Health", label: "School of Public Health" },
    { value: "Dental-School", label: "Dental School" },
    {
      value: "School-of-Biomedical-and-Allied-Health-Sciences",
      label: "School of Biomedical and Allied Health Sciences",
    },
    {
      value: "Noguchi-Memorial-Institute-for-Medical-Research",
      label: "Noguchi Memorial Institute for Medical Research",
    },
    {
      value: "West-African-Centre-for-Cell-Biology-of-Infectious-Pathogens",
      label: "West African Centre for Cell Biology of Infectious Pathogens",
    },
    {
      value: "West-African-Genetics-Medicine-Centre",
      label: "West African Genetics Medicine Centre",
    },
  ],
  "College-of-Humanities": [
    { value: "School-of-Languages", label: "School of Languages" },
    {
      value: "School-of-Social-Sciences",
      label: "School of Social Sciences",
    },
    { value: "School-of-Performing-Arts", label: "School of Performing Arts" },
    { value: "School-of-Law", label: "School of Law" },
    { value: "Business-School", label: "Business School" },
    {
      value: "Institute of African Studies",
      label: "Institute of African Studies",
    },
    {
      value: "Institute-of-Statistical, Social and Economic Research",
      label: "Institute-of-Statistical, Social and Economic Research",
    },
    {
      value: "Centre-for-Climate-Change-and-Sustainability-Studies",
      label: "Centre for Climate Change and Sustainability Studies",
    },
    {
      value: "Centre-for-Social-Policy-Studies",
      label: "Centre for Social Policy Studies",
    },
    {
      value: "Centre-for-Migration-Studies",
      label: "Centre for Migration Studies",
    },
    {
      value: "Centre-for-Gender-Studies-and-Advocacy",
      label: "Centre for Gender Studies and Advocacy",
    },
    { value: "Centre-for-Asian-Studies", label: "Center for Asian Studies" },
    {
      value: "Centre-for-Urban-Management-Studies",
      label: "Centre for Urban Management Studies",
    },
    {
      value: "Regional-Institute-for-Population-Studies",
      label: "Regional Institute for Population Studies",
    },
  ],
  "College-of-Education": [
    {
      value: "School-of-Information-and-Communication-Studies",
      label: "School of Information and Communication Studies",
    },
    {
      value: "School-of-Education-and-Leadership",
      label: "School of Education and Leadership",
    },
    {
      value: "School-of-Continuing-and-Distance-Education",
      label: "School of Continuing and Distance Education",
    },
  ],
};

export const levelTitleOptions: Option[] = [
  { value: "MSc", label: "MSc" },
  { value: "MEng", label: "MEng" },
  { value: "PhD", label: "PhD" },
  { value: "MBA", label: "MBA" },
  { value: "LLM", label: "LLM" },
  { value: "MA", label: "MA" },
  { value: "MPHil", label: "MPhil" },
  { value: "M.Agric", label: "M.Agric" },
  { value: "EMSc", label: "EMSc" },
  { value: "EMBA", label: "EMBA" },
  { value: "Other", label: "Other" },
];

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const researchAreaOptions: Option[] = [
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Data Science", label: "Data Science" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Computer Networks", label: "Computer Networks" },
  { value: "Database Systems", label: "Database Systems" },
  { value: "Human Computer Interaction", label: "Human Computer Interaction" },
  { value: "Computer Graphics", label: "Computer Graphics" },
  { value: "Distributed Systems", label: "Distributed Systems" },
  { value: "Algorithm Design", label: "Algorithm Design" },
  { value: "Computational Biology", label: "Computational Biology" },
  { value: "Internet of Things", label: "Internet of Things" },
  { value: "Cloud Computing", label: "Cloud Computing" },
  { value: "Blockchain Technology", label: "Blockchain Technology" },
  {
    value: "Mobile Application Development",
    label: "Mobile Application Development",
  },
  { value: "Web Development", label: "Web Development" },
  { value: "Game Development", label: "Game Development" },
  { value: "Robotics", label: "Robotics" },
  { value: "Computer Vision", label: "Computer Vision" },
];

export const departments: Department = {
  "College-of-Basic-and-Applied-Sciences": {
    "School-of-Physical-and-Mathematical-Sciences": [
      { value: "Computer Science", label: "Computer Science" },
      { value: "Mathematics", label: "Mathematics" },
      {
        value: "Statistics and Actuarial Science",
        label: "Statistics and Actuarial Science",
      },
      { value: "Physics", label: "Physics" },
      { value: "Chemistry", label: "Chemistry" },
      { value: "Earth Science", label: "Earth Science" },
    ],
    "School-of-Engineering": [
      { value: "Agricultural Engineering", label: "Agricultural Engineering" },
      { value: "Biomedical Engineering", label: "Biomedical Engineering" },
      { value: "Computer Engineering", label: "Computer Engineering" },
      {
        value: "Materials Science and Engineering",
        label: "Materials Science and Engineering",
      },
      { value: "Food Process Engineering", label: "Food Process Engineering" },
    ],
    "School-of-Agriculture": [
      { value: "Soil Science", label: "Soil Science" },
      { value: "Crop Science", label: "Crop Science" },
      { value: "Animal Science", label: "Animal Science" },
      {
        value: "Agricultural Economics and Agribusiness",
        label: "Agricultural Economics and Agribusiness",
      },
      { value: "Agricultural Extension", label: "Agricultural Extension" },
      {
        value: "Family and Consumer Sciences",
        label: "Family and Consumer Sciences",
      },
    ],
    "School-of-Veterinary-Medicine": [
      { value: "Veterinary Medicine", label: "Veterinary Medicine" },
      { value: "Veterinary Anatomy", label: "Veterinary Anatomy" },
      { value: "Veterinary Physiology", label: "Veterinary Physiology" },
      { value: "Veterinary Pharmacology", label: "Veterinary Pharmacology" },
      { value: "Veterinary Pathology", label: "Veterinary Pathology" },
      { value: "Veterinary Microbiology", label: "Veterinary Microbiology" },
    ],
    "School-of-Biological-Sciences": [
      {
        value: "Biochemistry, Cell and Molecular Biology",
        label: "Biochemistry, Cell and Molecular Biology",
      },
      {
        value: "Marine and Fisheries Sciences",
        label: "Marine and Fisheries Sciences",
      },
    ],
  },
};

export const institute = {
  "College-of-Humanities": [
    {
      value: "Institute of African Studies",
      label: "Institute of African Studies",
    },
    {
      value: "Institute-of-Statistical, Social and Economic Research",
      label: "Institute-of-Statistical, Social and Economic Research",
    },
    {
      value: "Centre-for-Climate-Change-and-Sustainability-Studies",
      label: "Centre for Climate Change and Sustainability Studies",
    },
    {
      value: "Centre-for-Social-Policy-Studies",
      label: "Centre for Social Policy Studies",
    },
    {
      value: "Centre-for-Migration-Studies",
      label: "Centre for Migration Studies",
    },
    {
      value: "Centre-for-Gender-Studies-and-Advocacy",
      label: "Centre for Gender Studies and Advocacy",
    },
    { value: "Centre-for-Asian-Studies", label: "Center for Asian Studies" },
    {
      value: "Centre-for-Urban-Management-Studies",
      label: "Centre for Urban Management Studies",
    },
    {
      value: "Regional-Institute-for-Population-Studies",
      label: "Regional Institute for Population Studies",
    },
  ],
  "College-of-Health-Sciences": [
    {
      value: "Noguchi-Memorial-Institute-for-Medical-Research",
      label: "Noguchi Memorial Institute for Medical Research",
    },
    {
      value: "West-African-Centre-for-Cell-Biology-of-Infectious-Pathogens",
      label: "West African Centre for Cell Biology of Infectious Pathogens",
    },
    {
      value: "West-African-Genetics-Medicine-Centre",
      label: "West African Genetics Medicine Centre",
    },
  ],
};
