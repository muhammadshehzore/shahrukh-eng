"use client";

export default function UserList({ users, onSelect, unread = {} }) {
  return (
    <div className="border p-4 w-64 rounded shadow">
      <h2 className="font-bold mb-2">Users</h2>
      {users.length === 0 && <p>No users online</p>}
      <ul>
        {users.map((username) => (
          <li
            key={username}
            onClick={() => onSelect(username)}
            className="cursor-pointer p-1 hover:bg-gray-200 rounded flex justify-between items-center"
          >
            <span>{username}</span>
            {unread[username] > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                {unread[username]}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
