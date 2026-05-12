import type { StateRule } from "../types/rules";

export const stateRules = {
  AL: {
    state: "AL",
    label: "Alabama",
    deadlineDays: 60,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  AK: {
    state: "AK",
    label: "Alaska",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  AZ: {
    state: "AZ",
    label: "Arizona",
    deadlineDays: 14,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  AR: {
    state: "AR",
    label: "Arkansas",
    deadlineDays: 60,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  CA: {
    state: "CA",
    label: "California",
    deadlineDays: 21,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  CO: {
    state: "CO",
    label: "Colorado",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 3
  },
  CT: {
    state: "CT",
    label: "Connecticut",
    deadlineDays: 21,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  DE: {
    state: "DE",
    label: "Delaware",
    deadlineDays: 20,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  FL: {
    state: "FL",
    label: "Florida",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  GA: {
    state: "GA",
    label: "Georgia",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 3
  },
  HI: {
    state: "HI",
    label: "Hawaii",
    deadlineDays: 14,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  ID: {
    state: "ID",
    label: "Idaho",
    deadlineDays: 21,
    itemizedRequired: true,
    penaltyMultiplier: 3
  },
  IL: {
    state: "IL",
    label: "Illinois",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  IN: {
    state: "IN",
    label: "Indiana",
    deadlineDays: 45,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  IA: {
    state: "IA",
    label: "Iowa",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  KS: {
    state: "KS",
    label: "Kansas",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  KY: {
    state: "KY",
    label: "Kentucky",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  LA: {
    state: "LA",
    label: "Louisiana",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  ME: {
    state: "ME",
    label: "Maine",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  MD: {
    state: "MD",
    label: "Maryland",
    deadlineDays: 45,
    itemizedRequired: true,
    penaltyMultiplier: 3
  },
  MA: {
    state: "MA",
    label: "Massachusetts",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 3
  },
  MI: {
    state: "MI",
    label: "Michigan",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  MN: {
    state: "MN",
    label: "Minnesota",
    deadlineDays: 21,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  MS: {
    state: "MS",
    label: "Mississippi",
    deadlineDays: 45,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  MO: {
    state: "MO",
    label: "Missouri",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  MT: {
    state: "MT",
    label: "Montana",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  NE: {
    state: "NE",
    label: "Nebraska",
    deadlineDays: 14,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  NV: {
    state: "NV",
    label: "Nevada",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  NH: {
    state: "NH",
    label: "New Hampshire",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  NJ: {
    state: "NJ",
    label: "New Jersey",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  NM: {
    state: "NM",
    label: "New Mexico",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  NY: {
    state: "NY",
    label: "New York",
    deadlineDays: 14,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  NC: {
    state: "NC",
    label: "North Carolina",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  ND: {
    state: "ND",
    label: "North Dakota",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 3
  },
  OH: {
    state: "OH",
    label: "Ohio",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  OK: {
    state: "OK",
    label: "Oklahoma",
    deadlineDays: 45,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  OR: {
    state: "OR",
    label: "Oregon",
    deadlineDays: 31,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  PA: {
    state: "PA",
    label: "Pennsylvania",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  RI: {
    state: "RI",
    label: "Rhode Island",
    deadlineDays: 20,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  SC: {
    state: "SC",
    label: "South Carolina",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 3
  },
  SD: {
    state: "SD",
    label: "South Dakota",
    deadlineDays: 14,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  TN: {
    state: "TN",
    label: "Tennessee",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  TX: {
    state: "TX",
    label: "Texas",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  UT: {
    state: "UT",
    label: "Utah",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  VT: {
    state: "VT",
    label: "Vermont",
    deadlineDays: 14,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  VA: {
    state: "VA",
    label: "Virginia",
    deadlineDays: 45,
    itemizedRequired: true,
    penaltyMultiplier: 1
  },
  WA: {
    state: "WA",
    label: "Washington",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  WV: {
    state: "WV",
    label: "West Virginia",
    deadlineDays: 60,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  WI: {
    state: "WI",
    label: "Wisconsin",
    deadlineDays: 21,
    itemizedRequired: true,
    penaltyMultiplier: 2
  },
  WY: {
    state: "WY",
    label: "Wyoming",
    deadlineDays: 30,
    itemizedRequired: true,
    penaltyMultiplier: 1
  }
} satisfies Record<string, StateRule>;
