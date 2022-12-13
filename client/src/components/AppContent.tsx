import { CSSProperties, useState } from "react";
import { trpc } from "../utils/trpc";

export default function AppContent() {
  const hello = trpc.hello.useQuery();
  const users = trpc.users.useQuery();
  const addUser = trpc.userCreate.useMutation({});
  const [newUserName, setNewUserName] = useState("");

  const userStyle: CSSProperties = {
    border: "1px solid skyblue",
    width: 100,
    textAlign: "center",
  };

  return (
    <main>
      <div>{JSON.stringify(hello.data, null, 2)}</div>
      <input
        type="text"
        onChange={(e) => {
          setNewUserName(e.currentTarget.value);
        }}
        value={newUserName}
      />
      <button
        onClick={() => {
          addUser.mutate(
            {
              name: newUserName,
            },
            {
              onSuccess: () => {
                users.refetch();
                setNewUserName("");
              },
            }
          );
        }}
      >
        Create User
      </button>

      {users.data?.map((user) => (
        <div
          key={user.id}
          style={{
            display: "flex",
          }}
        >
          <div style={userStyle}>{user.id}</div>
          <div style={userStyle}>{user.name}</div>
        </div>
      ))}
    </main>
  );
}
