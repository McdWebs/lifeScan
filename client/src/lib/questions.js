const questions = {
  boughtHouse: [
    {
      id: "first-home",
      text: "Is this your first home?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "have-kids",
      text: "Do you have kids?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "got-mortgage",
      text: "Did you get a mortgage?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No, I paid in full" },
      ],
    },
    {
      id: "property-type",
      text: "Is it a house or condo?",
      options: [
        { value: "house", label: "House" },
        { value: "condo", label: "Condo" },
      ],
    },
  ],

  newBaby: [
    {
      id: "first-child",
      text: "Is this your first child?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "both-parents-working",
      text: "Are both parents working?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "health-insurance",
      text: "Do you have health insurance?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "have-pediatrician",
      text: "Do you have a pediatrician?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "Not yet" },
      ],
    },
  ],

  newJob: [
    {
      id: "first-job",
      text: "Is this your first job?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "relocating",
      text: "Are you relocating?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "employer-401k",
      text: "Does your employer offer a 401k?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "remote-position",
      text: "Is this a remote position?",
      options: [
        { value: "yes", label: "Yes, fully remote" },
        { value: "hybrid", label: "Hybrid" },
        { value: "no", label: "No, on-site" },
      ],
    },
  ],

  movedCity: [
    {
      id: "moved-for-work",
      text: "Did you move for work?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "know-anyone",
      text: "Do you know anyone in the new city?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "renting-or-buying",
      text: "Are you renting or buying?",
      options: [
        { value: "renting", label: "Renting" },
        { value: "buying", label: "Buying" },
      ],
    },
    {
      id: "same-state",
      text: "Did you move within the same state?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No, different state" },
      ],
    },
  ],

  gotMarried: [
    {
      id: "changing-name",
      text: "Are either of you changing your last name?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "combine-finances",
      text: "Do you plan to combine finances?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "partial", label: "Partially" },
      ],
    },
    {
      id: "have-children",
      text: "Do either of you have children?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "buying-home",
      text: "Are you buying a home together?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "already-own", label: "We already own one" },
      ],
    },
  ],
};

export default questions;
