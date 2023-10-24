import { authOptions } from '@/lib/server/auth';
import { getServerSession } from 'next-auth/next';

const serverFunction = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    res.send({
      content: `Hello! ${session.user.name}! This is protected content. You can access it because you are signed in with a session.`,
    });
  } else {
    res.send({
      error:
        'You must be signed in to view the protected content on this page.',
    });
  }
};

export default serverFunction;
