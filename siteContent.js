window.siteContent = {
  banner:
    "Eli Gault-Crabb / Cornell InfoSci Graduate / UW Pole Vaulter",

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
  ],

  about: {
    title: "About",
    heading: "Hey, I’m Eli.",
    body: [
      "I built this site as a digital home base. It’s a place where I can share personal projects, blog a few thoughts, and show a little more about who I am.",
    ],
    images: [
      {
        src: "assets/graduation-photo.JPG",
        caption: "Senior year, Ithaca, NY",
      },
      {
        src: "assets/uwjersey.jpg",
        caption: "Husky Opener, 2026",
      },
      {
        src: "assets/famwed.jpg",
        caption: "The Gault-Crabbs in Madison, WI",
      },
    ],
    currentlyTitle: "Currently:",
    currently: [
      "Studying Informatics + Data Science",
      "Pole vaulting for the University of Washington Track & Field team",
      "Interested in project management, sales analytics, and leveraging A.I.",
      "Current favorite album: Siamese Dream by The Smashing Pumpkins",
    ],
  },

  dailyNote: {
    title: "Daily note",
    text: "Working on the first version of the personal operating system.",
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
