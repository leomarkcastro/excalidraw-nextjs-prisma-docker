import { authOptions } from '@/lib/server/auth';
import NextAuth from 'next-auth';

// @ts-ignore
export default NextAuth(authOptions);
