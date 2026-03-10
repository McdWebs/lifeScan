import OpenAI from 'openai';

// Keys that map to affiliate links defined in client/src/lib/affiliateLinks.js
const AFFILIATE_KEYS = [
  'locksmith','internet-provider','energy-provider','home-insurance',
  'auto-insurance','life-insurance','moving-company','529-plan',
  'financial-advisor','estate-planning','identity-protection','meal-delivery',
  'baby-gear','storage-unit','resume-service','professional-networking',
  'wedding-registry','travel-booking','home-security','hvac-service',
  'pest-control','cleaning-service','pediatrician-finder','gym-finder',
  'gym-membership','meal-kit','budgeting-app',
];

let client;
function getClient() {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const AFFILIATE_KEYS_SET = new Set(AFFILIATE_KEYS);

/**
 * Generates a complete checklist from scratch for a custom, freetext life event.
 * Returns an array of task objects matching the Checklist task schema.
 */
export async function generateCustomChecklist(eventDescription) {
  const prompt = `You are a helpful life-planning assistant. The user has described a life event or situation and needs a comprehensive, actionable checklist.

Life event / situation: "${eventDescription}"

Generate a thorough checklist of tasks to help the user navigate this situation.

Rules:
- Create 15–30 tasks grouped into logical categories
- Each task must have a clear, specific title (max 80 chars)
- Each task should have a practical description (1–2 sentences explaining why or how)
- Group tasks into 3–6 named categories (e.g. "Legal", "Finance", "Health", "Admin", "Home", "Work")
- For the "affiliateCategory" field you MUST use ONLY one of these exact string keys, or null. Do NOT invent new keys, do NOT use URLs, do NOT use any value not in this list:
  ${AFFILIATE_KEYS.join(', ')}
- Set completed: false and completedAt: null for all tasks

Return a JSON object: { "eventTitle": "short descriptive title (max 40 chars)", "tasks": [...] }
Each task object: { "title": string, "description": string, "category": string, "affiliateCategory": string|null, "completed": false, "completedAt": null }`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await getClient().chat.completions.create(
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);
    const parsed = JSON.parse(response.choices[0].message.content);

    // Sanitize: strip any affiliateCategory value the AI invented that isn't in our known list
    const tasks = (parsed.tasks || []).map((task) => ({
      ...task,
      affiliateCategory: AFFILIATE_KEYS_SET.has(task.affiliateCategory) ? task.affiliateCategory : null,
    }));

    return {
      eventTitle: parsed.eventTitle || eventDescription.slice(0, 40),
      tasks,
    };
  } catch (error) {
    clearTimeout(timeout);
    console.error('OpenAI custom checklist generation failed:', error.message);
    throw error;
  }
}

export async function personalizeChecklist(eventType, answers, baseTasks) {
  try {
    const prompt = `You are helping personalize a life event checklist for "${eventType}".

The user provided these answers about their situation:
${JSON.stringify(answers, null, 2)}

Here is the base checklist of tasks:
${JSON.stringify(baseTasks, null, 2)}

Based on the user's answers, personalize this checklist:
- Adjust task titles and descriptions to be specific to their situation
- Reorder tasks if a different priority makes sense
- Add any additional relevant tasks
- Remove tasks that don't apply
- Keep the same object structure for each task: { title, description, category, affiliateCategory (string or null), completed (false), completedAt (null) }

Return a JSON object with a single key "tasks" containing the personalized array of task objects.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await getClient().chat.completions.create(
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed.tasks;
  } catch (error) {
    console.error('OpenAI personalization failed, using base tasks:', error.message);
    return baseTasks;
  }
}
