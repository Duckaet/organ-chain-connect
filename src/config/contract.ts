export const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";

export const RPC_URL = "http://127.0.0.1:7545"; // Ganache default, swap for any RPC

export const CONTRACT_ABI = [
  "function createRequest(uint256 patientId, string organType) public returns (uint256)",
  "function assignRequest(uint256 requestId, address doctorAddress) public",
  "function updateRequestStatus(uint256 requestId, uint8 status, bytes32 reasonHash) public",
  "function getRequest(uint256 requestId) public view returns (uint256, uint256, string, uint8, address, bytes32)",
  "function getRequestCount() public view returns (uint256)",
  "event RequestCreated(uint256 indexed requestId, uint256 indexed patientId, string organType)",
  "event RequestAssigned(uint256 indexed requestId, address indexed doctorAddress)",
  "event RequestStatusUpdated(uint256 indexed requestId, uint8 status, bytes32 reasonHash)",
];
