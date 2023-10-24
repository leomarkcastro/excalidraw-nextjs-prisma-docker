import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session } = useSession();

  async function testRestricted() {
    const response = await fetch('/api/test/restricted');
    const data = await response.json();
    // console.log(data);
  }

  if (session) {
    return (
      <div className="flex flex-col ">
        <p>Signed in as {session.user?.email}</p>
        <p>Account Info {JSON.stringify(session.user)}</p>
        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={testRestricted}>Test Restricted URL</button>
      </div>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
