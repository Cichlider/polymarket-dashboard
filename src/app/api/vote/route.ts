import { NextResponse } from 'next/server';
import { addVote, getAllVotes } from '@/lib/store';

export async function GET() {
  const votes = getAllVotes();
  return NextResponse.json(votes);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { marketId, outcome } = body;
    
    if (!marketId || !outcome) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const updatedVotes = addVote(marketId, outcome);
    return NextResponse.json(updatedVotes);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
