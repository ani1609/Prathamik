export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyZDIwY2ZhYi0wOTQ5LTQxZDMtYjI1ZC1lNTFhNmE3MWNlZGYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4ODQ2MjE1MiwiZXhwIjoxNjkxMDU0MTUyfQ.Uipvv68jRITPHbRQuw8VjLfJJsmjPttHb4eNVP2uhGE";
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