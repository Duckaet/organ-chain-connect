export const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

export const RPC_URL = "http://127.0.0.1:7545"; // Ganache default, swap for any RPC

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "requestId", type: "uint256" },
      { internalType: "address", name: "doctor", type: "address" },
    ],
    name: "assignRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "requestId", type: "uint256" }],
    name: "beginReview",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "patientId", type: "string" },
      { internalType: "string", name: "organType", type: "string" },
    ],
    name: "createRequest",
    outputs: [{ internalType: "uint256", name: "requestId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "doctor", type: "address" }],
    name: "registerDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "doctor", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "DoctorRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "requestId", type: "uint256" },
      { indexed: true, internalType: "address", name: "doctor", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "RequestAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "requestId", type: "uint256" },
      { indexed: false, internalType: "string", name: "patientId", type: "string" },
      { indexed: false, internalType: "string", name: "organType", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "RequestCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "requestId", type: "uint256" },
      { indexed: false, internalType: "enum OrganX.RequestStatus", name: "status", type: "uint8" },
      { indexed: false, internalType: "bytes32", name: "decisionHash", type: "bytes32" },
      { indexed: true, internalType: "address", name: "doctor", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "RequestStatusUpdated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "requestId", type: "uint256" },
      { internalType: "bool", name: "approve", type: "bool" },
      { internalType: "bytes32", name: "reasonHash", type: "bytes32" },
    ],
    name: "updateRequestStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "allRequestIds",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllRequestIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "requestId", type: "uint256" }],
    name: "getRequest",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "requestId", type: "uint256" },
          { internalType: "string", name: "patientId", type: "string" },
          { internalType: "string", name: "organType", type: "string" },
          { internalType: "address", name: "assignedDoctor", type: "address" },
          { internalType: "enum OrganX.RequestStatus", name: "status", type: "uint8" },
          { internalType: "bytes32", name: "decisionHash", type: "bytes32" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
        ],
        internalType: "struct OrganX.OrganRequest",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hospitalAdmin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "registeredDoctors",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "requests",
    outputs: [
      { internalType: "uint256", name: "requestId", type: "uint256" },
      { internalType: "string", name: "patientId", type: "string" },
      { internalType: "string", name: "organType", type: "string" },
      { internalType: "address", name: "assignedDoctor", type: "address" },
      { internalType: "enum OrganX.RequestStatus", name: "status", type: "uint8" },
      { internalType: "bytes32", name: "decisionHash", type: "bytes32" },
      { internalType: "uint256", name: "createdAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRequests",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
