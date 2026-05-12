window.siteContent = {
  banner:
    "Eli Gault-Crabb / Cornell InfoSci Graduate / UDub Pole Vaulter / Future Office Rookie",

  versionText: "personal os / v0.1",

  navItems: [
    {
      id: "about",
      label: "About",
      icon: "assets/abt.png",
      preview: "A short note, a portrait, and the basics.",
      action: "modal",
      modalId: "about-modal",
    },
    {
      id: "blog",
      label: "Blog",
      icon: "assets/sketch icons.jpeg",
      preview: "Personal essays, notes, and drafts.",
      action: "route",
      href: "blog.html",
    },
    {
      id: "adventures",
      label: "Adventures",
      icon: "assets/adventurez.png",
      preview: "Photos, videos, and field notes.",
      action: "route",
      href: "adventures.html",
    },
    {
      id: "resume",
      label: "Resume",
      icon: "assets/resume.png",
      preview: "Work, school, projects, and experience.",
      action: "route",
      href: "resume.html",
    },
    {
      id: "contact",
      label: "Contact",
      icon: "assets/contact.png",
      preview: "Email and social links in one place.",
      action: "modal",
      modalId: "contact-modal",
    },
  ],

  about: {
    title: "About",
    text:
      "This notebook is ready for your bio, favorite photo, small details, and anything that feels like you.",
    image: "assets/abt.png",
  },

  dailyNote: {
    title: "Daily note",
    text: "Working on the first version of the personal operating system.",
  },

  contact: {
    title: "Contact",
    email: "eligaultcrabb1@gmail.com",
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/eligaultcrabb",
      },
      {
        label: "GitHub",
        href: "https://github.com/eligaultcrabb1",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/eligc._/",
      },
    ],
  },

  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/eligaultcrabb",
      icon: "linkedin",
    },
    {
      label: "Email Eli",
      href: "mailto:eligaultcrabb1@gmail.com?subject=Hello%20Eli",
      icon: "email",
    },
    {
      label: "GitHub",
      href: "https://github.com/eligaultcrabb1",
      icon: "github",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/eligc._/",
      icon: "instagram",
    },
  ],
};
