/**
 * Advanced Preset artifact (`*.apreset.json`) and runtime-facing types.
 *
 * The artifact is produced by the CLI compiler from YAML + Markdown sources and consumed by the
 * SillyTavern extension. It is plain data: every condition is a pre-compiled expression AST and
 * every prompt is a list of message blocks made of (optionally conditional) text pieces.
 */
import type { Expr } from './expr';

export const FORMAT_VERSION = 1 as const;

export type Transport = 'prefill' | 'plaintext' | 'structured' | 'tool-single' | 'tool-multi';
export const TRANSPORTS: readonly Transport[] = ['prefill', 'plaintext', 'structured', 'tool-single', 'tool-multi'];
export type Style = 'dialogue' | 'imperative';
export type Role = 'system' | 'user' | 'assistant';
export type ActorId = string;

/** A piece of prompt text, optionally guarded by a condition (e.g. `@style` fragments). */
export interface Piece {
  text: string;
  when?: Expr;
}
/** One chat message worth of content. `role` overrides the region role (`@as`). */
export interface Block {
  role?: Role;
  pieces: Piece[];
}
/** Prompt content: one or more message blocks. */
export type Content = Block[];

export interface Actor {
  name: string;
  /** Prefix template; usually `{{ap::name::<actor>}}: `. */
  prefix: string;
  color?: string;
}

export type MergeRule = 'none' | 'join' | { wrap: string };

export interface Region {
  id: string;
  role: Role;
  merge: MergeRule;
  separator: string;
  /** Native region: holds ST markers; AP never writes into it. */
  native?: boolean;
}

export type SemanticAnchor = 'historyStart' | 'historyEnd' | 'tail';

export interface ParamOption {
  value: string | number;
  label?: string;
  /** Text used by `{{ap::param::id}}`; defaults to `value`. */
  text?: string;
}
export interface Param {
  id: string;
  type: 'text' | 'number' | 'select';
  label: string;
  description?: string;
  group?: string;
  /** Text used when the parameter is unset ('' / 0). */
  unset?: string;
  /** Another parameter whose value is used when this one is unset. */
  fallback?: string;
  unit?: string;
  min?: number;
  max?: number;
  options?: ParamOption[];
  default: string | number;
}

export interface Group {
  label: string;
  description?: string;
  order: number;
  /** Exclusive groups rendered as a segmented choice may offer "none". */
  allowNone?: boolean;
  /** Panel tab: modules (default) or writing (for parameter groups). */
  tab?: 'modules' | 'writing';
}

export interface Question {
  id: string;
  text: string;
}
export interface ModuleQuestions {
  mandatory: Question[];
  optional: Question[];
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  group?: string;
  /** `always` modules are system modules (always on, hidden from the panel). */
  toggle: 'always' | 'user';
  exclusive?: string;
  default: boolean;
  /** Module-level condition: when false, the module contributes nothing this turn. */
  when?: Expr;
  structures: string[];
  questions: ModuleQuestions;
  /** Source path, for diagnostics. */
  source?: string;
}

export interface Entry {
  /** `<module>/<entry>` */
  id: string;
  module: string;
  region: string;
  order: number;
  when?: Expr;
  content: Content;
}

export type StageKind = 'text' | 'content' | 'patch';

export interface Stage {
  id: string;
  actor: ActorId;
  kind: StageKind;
  label: string;
  optional?: boolean;
  questions?: 'ask' | 'answer';
  when?: Expr;
  /** Dialogue style: the stage is written as `<tag>…</tag>` instead of a prefixed segment. */
  tag?: string;
  /** Reserved request-segment hook (D10). v1 only accepts `default`. */
  executor?: 'default';
}

export interface WorkflowSections {
  /** Shared by both styles. */
  preamble?: Content;
  intro: Partial<Record<Style, Content>>;
  outro: Partial<Record<Style, Content>>;
  stages: Record<string, Partial<Record<Style, Content>>>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  kind: 'story' | 'task';
  hint?: string;
  stages: Stage[];
  /** Stage after which structures are emitted (defaults to the last content stage). */
  structuresAfter?: string;
  sections: WorkflowSections;
}

export type StructureKind = 'reply' | 'memory' | 'recap' | 'impersonate' | 'synopsis' | 'options' | 'custom';
export const STRUCTURE_KINDS: readonly StructureKind[] = ['reply', 'memory', 'recap', 'impersonate', 'synopsis', 'options', 'custom'];

export interface StructureDecl {
  id: string;
  kind: StructureKind;
  tag: string;
  field: string;
  description?: string;
  /** options: number of options requested */
  count?: number;
  /** custom only */
  shape?: 'text' | 'kv';
  display?: 'card' | 'hidden';
  title?: string;
  formatPrompt: { tag: string; field: string };
}

export interface RegexDecl {
  id: string;
  pattern: string;
  flags: string;
  target: 'input' | 'meta' | `recent:${number}`;
  requires?: Expr;
}

export interface MetaDecl {
  /** Trigger text, e.g. `@{{ap::name::narrator}}` (macros expanded at runtime). */
  trigger: string;
  wrap: boolean;
  recentCount: number;
  /** Built-in task → condition (usually a flag). First match wins. */
  tasks: { summary?: Expr; impersonate?: Expr };
  /** Text sent when the Impersonate button is pressed. */
  impersonatePrompt: string;
}

export interface TokenSavingDecl {
  keepFullTurns: number;
  truncateUserAfter: number;
  synopsisTemplate: string;
}

export interface SyntheticTurn {
  id: string;
  label: string;
  user: string;
  tool: { name: string; description: string };
  thoughtSignature?: string;
  /** Tool results by tool mode. `{{first}}` = first stage tool. */
  response: { single: string; multi: string; parallel: string };
}

export interface CarrierPrompt {
  identifier: string;
  name: string;
  role?: Role;
  content?: string;
  system_prompt?: boolean;
  marker?: boolean;
  injection_position?: number;
  injection_depth?: number;
  forbid_overrides?: boolean;
  [key: string]: unknown;
}
export interface CarrierDecl {
  prompts: CarrierPrompt[];
  prompt_order: { identifier: string; enabled: boolean }[];
}

export interface ConnectionConfig {
  transport: Transport;
  workflow: string;
  forceTool: boolean;
  parallelTools: boolean;
  syntheticTurn: string | null;
  sendThoughtSignature: boolean;
  maxSteps: number;
  finalFallback: boolean;
}

export interface Configuration {
  connection: ConnectionConfig;
  /** ST Chat Completion settings written into the Carrier. */
  sampling: Record<string, unknown>;
  identity: { names: Record<ActorId, string>; prefixes: Record<ActorId, string> };
  modules: Record<string, boolean>;
  params: Record<string, string | number>;
  tokenSaving: { enabled: boolean; keepFullTurns: number; truncateUserAfter: number };
  meta: { recentCount: number };
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type SparseDiff = DeepPartial<Configuration>;

export interface RecommendedConfiguration {
  id: string;
  name: string;
  description?: string;
  diff: SparseDiff;
}

export interface Migration {
  /** Semver range of the *previous* preset version, e.g. `<7.0.0`. */
  from: string;
  rename: { modules?: Record<string, string>; params?: Record<string, string> };
}

export interface ThemeDecl {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

/** Panel strings for one locale. Keys mirror ids in the artifact. */
export interface LocaleTable {
  groups?: Record<string, { label?: string; description?: string }>;
  modules?: Record<string, { name?: string; description?: string }>;
  params?: Record<string, { label?: string; description?: string; options?: Record<string, string> }>;
  workflows?: Record<string, { name?: string; description?: string }>;
  stages?: Record<string, string>;
  configurations?: Record<string, { name?: string; description?: string }>;
  structures?: Record<string, { title?: string }>;
  [key: string]: unknown;
}

export interface QuestionsDecl {
  /** Template for the Questions region. `{{ap::questions::mandatory}}` / `optional` lists are available. */
  region: string;
}

export interface APreset {
  formatVersion: typeof FORMAT_VERSION;
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  minAdvancedPreset?: string;
  /** Content hash of the artifact (sha256 of the canonical JSON without `hash`). */
  hash: string;

  actors: Record<ActorId, Actor>;
  narrator: ActorId;
  user: ActorId;
  styles: Record<Transport, Style>;
  plaintextFormat: 'prefix' | 'tag';
  contentMarker: string;
  /** Prefill transport: text of the single user message placed before the assistant prefill. */
  prefillGuide: string;
  /** Prefill transport: how each history message is rendered (`{{prefix}}`, `{{name}}`, `{{content}}`). */
  historyItemTemplate: string;
  /** Imperative style: heading line placed before each stage section. */
  stageHeading: string;
  stop: string[];

  regions: Region[];
  anchors: Record<SemanticAnchor, string>;
  /** Region that receives the workflow (CoT / task) prompt. */
  workflowRegion: string;
  /** Region that receives the generated Questions block. */
  questionsRegion?: string;

  params: Param[];
  groups: Record<string, Group>;
  modules: Module[];
  entries: Entry[];
  workflows: Workflow[];
  structures: Record<string, StructureDecl>;
  regex: RegexDecl[];
  meta: MetaDecl;
  tokenSaving: TokenSavingDecl;
  syntheticTurns: SyntheticTurn[];
  tools: { submit: string; stagePrefix: string; structures: string; stageResult: string; nudge: string };
  theme: ThemeDecl;
  carrier: CarrierDecl;
  configurationDefaults: Configuration;
  configurations: RecommendedConfiguration[];
  defaultConfiguration: string;
  migrations: Migration[];
  moduleOrder: string[];
  locales: Record<string, LocaleTable>;
}
