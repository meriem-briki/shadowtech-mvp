export async function createDailyRoom(sessionName: string) {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) throw new Error('DAILY_API_KEY is not set');

  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: sessionName,
      properties: {
        enable_chat: true,
        enable_screenshare: true,
        exp: Math.round(Date.now() / 1000) + 3600 * 2, // 2 hours from now
      },
    }),
  });

  if (!response.ok && response.status !== 400) { // 400 might mean room already exists
    throw new Error(`Failed to create Daily room: ${await response.text()}`);
  }

  return response.json();
}

export async function createDailyToken(roomName: string, userId: string, isOwner: boolean = false) {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) throw new Error('DAILY_API_KEY is not set');

  const response = await fetch('https://api.daily.co/v1/meeting-tokens', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_id: userId,
        is_owner: isOwner,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create Daily token: ${await response.text()}`);
  }

  const { token } = await response.json();
  return token;
}
