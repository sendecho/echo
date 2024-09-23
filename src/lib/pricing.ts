export const PLANS = [
  {
    name: "Free",
    tagline: "For hobby projects",
    price: {
      monthly: 0,
      yearly: 0,
    },
    limits: {
      users: 1,
      contacts: 50,
      emails: 100,
    },
    features: [
      {
        text: "1 User"
      },
      {
        text: "Up to 50 Contacts"
      },
      {
        text: "Up to 100 Emails per month"
      }
    ]
  },
  {
    name: "Hobby",
    tagline: "For hobby projects",
    price: {
      monthly: 24,
      yearly: 228,
      ids: {
        monthly: "price_1P5Z5ZFZvZV4f5fZvZV4f5fZ",
        yearly: "price_1P5Z5ZFZvZV4f5fZvZV4f5fZ",
      }
    },
    limits: {
      users: 3,
      contacts: 1000,
      emails: 2000,
    },
    features: [
      {
        text: "3 Users"
      },
      {
        text: "Up to 1000 Contacts"
      },
      {
        text: "Up to 2000 Emails per month"
      }
    ]
  },
  {
    name: "Pro",
    tagline: "For hobby projects",
    price: {
      monthly: 59,
      yearly: 588,
      ids: {
        monthly: "price_1Q29doCqtHptuYvpf2EgxqVM",
        yearly: "price_1Q29e8CqtHptuYvp0nlzFtVw",
      }
    },
    limits: {
      users: 25,
      contacts: null,
      emails: 5000,
    },
    features: [
      {
        text: "Up to 25 Users"
      },
      {
        text: "Unlimited Contacts"
      },
      {
        text: "Up to 5000 Emails per month"
      }
    ]
  },
]

export const FREE_PLAN = PLANS.find((plan) => plan.name === "Free");
export const HOBBY_PLAN = PLANS.find((plan) => plan.name === "Hobby");
export const PRO_PLAN = PLANS.find((plan) => plan.name === "Pro");

export const getPlanFromPriceId = (priceId: string) => {
  return PLANS.find((plan) => plan.price.ids?.includes(priceId)) || null;
}

export const getCurrentPlan = (plan: string) => {
  return (
    PLANS.find((p) => p.name.toLowerCase() === plan.toLowerCase()) || null
  );
}