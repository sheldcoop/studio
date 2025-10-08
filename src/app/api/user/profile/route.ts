import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';
import { getSession } from '@/lib/session';

// GET user profile
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(session.uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: userDoc.data() });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// UPDATE user profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { displayName, photoURL } = body;

    // Validate input
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (displayName !== undefined) {
      if (typeof displayName !== 'string' || displayName.length < 2) {
        return NextResponse.json(
          { error: 'Display name must be at least 2 characters' },
          { status: 400 }
        );
      }
      updates.displayName = displayName;
    }

    if (photoURL !== undefined) {
      if (typeof photoURL !== 'string') {
        return NextResponse.json(
          { error: 'Photo URL must be a string' },
          { status: 400 }
        );
      }
      updates.photoURL = photoURL;
    }

    // Update Firestore
    await adminDb.collection('users').doc(session.uid).update(updates);

    // Update session
    if (displayName !== undefined) {
      session.displayName = displayName;
    }
    if (photoURL !== undefined) {
      session.photoURL = photoURL;
    }
    await session.save();

    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
