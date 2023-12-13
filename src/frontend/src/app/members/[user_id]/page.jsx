import { getUserById } from "../../../../../backend/util";

export default async function User({ params: {user_id} }) {
	const user = await getUserById(user_id);
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24 bg-background text-text font-mono">
				<div>{user.username}</div>
      </main>
    </>
  )
}