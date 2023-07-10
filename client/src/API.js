export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyNjFjY2E3OS0wNjZlLTRjZjEtOTQ3Ny03MWExYTRiODU1NmYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4ODk0Njg3OCwiZXhwIjoxNjkxNTM4ODc4fQ.9zM_z6u-1n9ZHdSWXYu1Y2R0yfxk9jjc6KuX93MBSrQ";
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const { roomId } = await res.json();
  return roomId;
};