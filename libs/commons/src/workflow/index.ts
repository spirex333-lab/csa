import { z } from 'zod';

// ── Trigger node config schemas ──────────────────────────────────────────────

export const manualConfigSchema = z.object({
  triggerType: z.literal('manual'),
});

export const webhookConfigSchema = z.object({
  triggerType: z.literal('webhook'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string().min(1),
});

export const cronConfigSchema = z.object({
  triggerType: z.literal('cron'),
  expression: z
    .string()
    .min(9)
    .refine(
      (v) => /^(\S+\s){4}\S+$/.test(v.trim()),
      'Must be a valid 5-part cron expression (e.g. "0 * * * *")'
    ),
});

// ── Action node config schemas ────────────────────────────────────────────────

export const httpConfigSchema = z.object({
  url: z.string().min(1),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
});

export const ifConfigSchema = z.object({
  expression: z.string().min(1),
});

export const delayConfigSchema = z.object({
  durationMs: z.number().int().positive(),
});

export const transformConfigSchema = z.object({
  template: z.string().min(1),
});

export const emailConfigSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

// ── Union maps ────────────────────────────────────────────────────────────────

export const triggerConfigSchemas = {
  manual: manualConfigSchema,
  webhook: webhookConfigSchema,
  cron: cronConfigSchema,
} as const;

export const actionConfigSchemas = {
  http: httpConfigSchema,
  if: ifConfigSchema,
  delay: delayConfigSchema,
  transform: transformConfigSchema,
  email: emailConfigSchema,
} as const;

export const TRIGGER_NODE_TYPES = new Set(Object.keys(triggerConfigSchemas) as TriggerNodeType[]);
export const ACTION_NODE_TYPES = new Set(Object.keys(actionConfigSchemas) as ActionNodeType[]);

// ── Types ─────────────────────────────────────────────────────────────────────

export type TriggerNodeType = keyof typeof triggerConfigSchemas;
export type ActionNodeType = keyof typeof actionConfigSchemas;
export type WorkflowNodeType = TriggerNodeType | ActionNodeType;

export type ManualConfig = z.infer<typeof manualConfigSchema>;
export type WebhookConfig = z.infer<typeof webhookConfigSchema>;
export type CronConfig = z.infer<typeof cronConfigSchema>;
export type HttpConfig = z.infer<typeof httpConfigSchema>;
export type IfConfig = z.infer<typeof ifConfigSchema>;
export type DelayConfig = z.infer<typeof delayConfigSchema>;
export type TransformConfig = z.infer<typeof transformConfigSchema>;
export type EmailConfig = z.infer<typeof emailConfigSchema>;

// ── Defaults ──────────────────────────────────────────────────────────────────

export const triggerDefaults: Record<TriggerNodeType, Record<string, unknown>> = {
  manual: { triggerType: 'manual' } satisfies ManualConfig,
  webhook: { triggerType: 'webhook', method: 'POST', path: '/webhook' } satisfies WebhookConfig,
  cron: { triggerType: 'cron', expression: '0 * * * *' } satisfies CronConfig,
};

export const actionDefaults: Record<ActionNodeType, Record<string, unknown>> = {
  http: { url: '', method: 'GET' } satisfies HttpConfig,
  if: { expression: '' } satisfies IfConfig,
  delay: { durationMs: 1000 } satisfies DelayConfig,
  transform: { template: '{}' } satisfies TransformConfig,
  email: { to: '', subject: '', body: '' } satisfies EmailConfig,
};

export const getNodeKind = (nodeType: WorkflowNodeType): 'trigger' | 'action' =>
  nodeType in triggerConfigSchemas ? 'trigger' : 'action';

export const getNodeConfigDefaults = (nodeType: WorkflowNodeType): Record<string, unknown> =>
  getNodeKind(nodeType) === 'trigger'
    ? (triggerDefaults[nodeType as TriggerNodeType] ?? {})
    : (actionDefaults[nodeType as ActionNodeType] ?? {});

// ── Config validation ─────────────────────────────────────────────────────────

export type ConfigValidationResult =
  | { success: true; errors: string[] }
  | { success: false; errors: string[] };

export function validateNodeConfig(
  nodeId: string,
  kind: string,
  nodeType: string,
  config: unknown
): ConfigValidationResult {
  const errors: string[] = [];

  if (kind === 'trigger') {
    const schema = triggerConfigSchemas[nodeType as TriggerNodeType];
    if (!schema) {
      errors.push(`Node ${nodeId}: unsupported trigger nodeType "${nodeType}".`);
      return { success: false, errors };
    }
    const result = schema.safeParse(config);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`Node ${nodeId} (${nodeType}): ${issue.path.join('.')} — ${issue.message}`);
      }
    }
  } else if (kind === 'action') {
    const schema = actionConfigSchemas[nodeType as ActionNodeType];
    if (!schema) {
      errors.push(`Node ${nodeId}: unsupported action nodeType "${nodeType}".`);
      return { success: false, errors };
    }
    const result = schema.safeParse(config);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`Node ${nodeId} (${nodeType}): ${issue.path.join('.')} — ${issue.message}`);
      }
    }
  }

  return errors.length > 0 ? { success: false, errors } : { success: true, errors };
}
