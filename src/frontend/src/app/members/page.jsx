const util = require("../../../../backend/util.js");

export default function Members() {
  const users = util.readJSON("../../../../../../users.json");

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-background text-text">
      <div className="flex flex-wrap justify-center">
        {users.map((user, index) => (
          <div key={index} className="p-4 m-4 border border-gray-300 rounded">
            <img
              src={user.pfp}
              alt={`Profile of ${user.username}`}
              className="rounded-full h-16 w-16 object-cover"
            />
            <p>{user.userId}</p>
            <p>{user.username}</p>
            <p>{user.email}</p>
            <p>{user.signature}</p>
            <p>Member since {user.memberSince}</p>
          </div>
        ))}
      </div>
    </main>
  );
}