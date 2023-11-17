import { getAllStories } from "@/stores";

export async function initStories() {
  const stories = getAllStories();
  const tasks = stories.map(store => store?.init?.())
  return await Promise.all(tasks)
}
