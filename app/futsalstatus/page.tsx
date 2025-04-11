'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Ensure you have <Toaster /> in layout.tsx

export default function FutsalStatusPage() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<'checking' | 'pending' | 'approved' | 'rejected' | 'none'>('checking');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hideCard, setHideCard] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      const ownerId=session?.user?.id;
      if (!ownerId) return;
      console.log(session?.user?.id)

      try {
        const res = await fetch(`http://localhost:5000/api/by-owner?ownerId=${ownerId}`);
        if (!res.ok) throw new Error('No futsal found');

        const data = await res.json();
        const futsalstatus=data.status || data?.futsal?.status;

        if (futsalstatus === 'approved') {
          setStatus('approved');
          toast.success('Futsal approved! Redirecting to dashboard...');
          setTimeout(() => {
            setHideCard(true);
            router.push('/dashboard');
          }, 3000);
        } else if (futsalstatus === 'rejected') {
          setStatus('rejected');
          if (data.feedback) setFeedback(data.feedback);
        } else {
          setStatus('pending');
        }
      } catch (err) {
        console.error(err);
        setStatus('none');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [session]);

  const cardClass =
    'bg-white border rounded-2xl shadow-md p-8 max-w-md w-full text-center';

  const renderContent = () => {
    if (hideCard) return null;

    switch (status) {
      case 'checking':
        return (
          <div className={cardClass}>
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Checking futsal status...</p>
          </div>
        );

      case 'pending':
        return (
          <div className={`${cardClass} border-yellow-400`}>
            <h2 className="text-xl font-bold text-yellow-700 mb-2">Request on Hold</h2>
            <p className="text-yellow-700">
              Your futsal is currently pending admin approval.<br />
              We'll redirect you once it's approved.
            </p>
          </div>
        );

      case 'rejected':
        return (
          <div className={`${cardClass} border-red-400`}>
            <h2 className="text-xl font-bold text-red-700 mb-2">Futsal Request Declined</h2>
            <p className="text-red-600 mb-4">
              Your futsal was not approved. Please reapply with correct details.
            </p>
            {feedback && (
              <div className="text-left bg-red-100 border border-red-300 rounded p-3 mb-4 text-sm text-red-800">
                <strong>Admin Feedback:</strong>
                <p>{feedback}</p>
              </div>
            )}
            <button
              onClick={() => router.push('/createfutsal')}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
            >
              Reapply
            </button>
          </div>
        );

      case 'none':
        return (
          <div className={`${cardClass} border-gray-300`}>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Futsal Found</h2>
            <p className="text-gray-600 mb-4">You haven't created a futsal yet.</p>
            <button
              onClick={() => router.push('/createfutsal')}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
            >
              Create Now
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {renderContent()}
    </div>
  );
}
