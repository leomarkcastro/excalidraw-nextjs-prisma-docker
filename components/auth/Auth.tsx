import { signIn, signOut, useSession } from 'next-auth/react';

export default function Auth() {
  const { data: session } = useSession();

  async function testRestricted() {
    const response = await fetch('/api/test/restricted');
    const data = await response.json();
    // console.log(data);
  }

  // console.log('session', session);

  if (session) {
    return (
      <div className="flex flex-col items-end justify-end break-all text-right">
        <p>
          Signed in as <br />
          {session.user?.email ?? session.user?.name ?? session.user?.id}
        </p>
        <button className="text-secondary" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <>
      <button
        className="bg-secondary p-2 text-secondary-content"
        onClick={() =>
          signIn(undefined, {
            callbackUrl: window.location.href,
          })
        }
      >
        Sign in
      </button>
    </>
  );
}
