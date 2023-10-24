import { trpc } from '@/lib/server/trpc';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { getCsrfToken } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutateAsync: createAccount } = trpc.auth.signup.useMutation();

  return (
    <div className="flex min-h-screen items-center justify-center font-mono">
      <div className="d-card w-96 bg-base-100 shadow-xl">
        <div className="d-card-body text-center font-bold">
          <h1 className="text-4xl font-bold">Sign Up</h1>
          <div>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="d-form-control w-full max-w-xs">
              <label className="d-label">
                <span className="d-label-text">Name</span>
              </label>
              <input
                name="username"
                type="text"
                placeholder="John Doe"
                className="d-input-bordered d-input d-input-sm w-full max-w-xs"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="d-form-control w-full max-w-xs">
              <label className="d-label">
                <span className="d-label-text">Email</span>
              </label>
              <input
                name="username"
                type="text"
                placeholder="name@email.com"
                className="d-input-bordered d-input d-input-sm w-full max-w-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="d-form-control w-full max-w-xs">
              <label className="d-label">
                <span className="d-label-text">Password</span>
              </label>
              <input
                name="password"
                type="password"
                className="d-input-bordered d-input d-input-sm w-full max-w-xs"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-form-control w-full max-w-xs">
              <label className="d-label">
                <span className="d-label-text">Confirm Password</span>
              </label>
              <input
                name="password"
                type="password"
                className="d-input-bordered d-input d-input-sm w-full max-w-xs"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <br />
            <button
              className="d-btn-sm d-btn"
              onClick={async () => {
                if (password !== confirmPassword) {
                  alert('Passwords do not match');
                  return;
                }
                const resp = await createAccount({
                  name: username,
                  email,
                  password,
                });

                if (resp.name) {
                  alert('Account created, please sign in');
                  router.replace('/auth/signin');
                }
                return;
                // const resp = await signIn("credentials", {
                //   username,
                //   password,
                //   redirect: false,
                // });
                // if (resp?.error) {
                //   alert(resp.error);
                // } else {
                //   // console.log("resp", resp);
                //   router.replace("/");
                // }
              }}
            >
              Create Account
            </button>
            <br />
            <Link href="/auth/signin">Already have an account?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
