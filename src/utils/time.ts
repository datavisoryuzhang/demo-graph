export async function sleep(duration: number) { // milliseconds
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
