import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_PATH, 'votes.json');

// 确保数据目录存在
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH);
}

export interface VoteData {
  [marketId: string]: {
    [outcome: string]: number;
  };
}

function getVotes(): VoteData {
  if (!fs.existsSync(DB_FILE)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveVotes(data: VoteData) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function addVote(marketId: string, outcome: string) {
  const data = getVotes();
  if (!data[marketId]) {
    data[marketId] = {};
  }
  if (!data[marketId][outcome]) {
    data[marketId][outcome] = 0;
  }
  data[marketId][outcome] += 1;
  saveVotes(data);
  return data;
}

export function getAllVotes() {
  return getVotes();
}
