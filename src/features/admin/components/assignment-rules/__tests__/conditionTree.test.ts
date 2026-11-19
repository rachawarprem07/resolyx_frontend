import { describe, expect, it } from 'vitest';
import type { ConditionGroupNode, ConditionNode } from '../../../types/rule.types';
import {
  addChild,
  changeField,
  changeOperator,
  countConditions,
  createCondition,
  createGroup,
  emptyRoot,
  ensureIds,
  mapServerErrors,
  removeNode,
  setLogic,
  updateNode,
  validateTree,
} from '../conditionTree';
import { META } from './fixtures';

const cond = (id: string, field: string, operator: string, value: ConditionNode['value']): ConditionNode => ({
  type: 'condition', id, field, operator, value,
});

function sampleTree(): ConditionGroupNode {
  return {
    type: 'group', id: 'root', logic: 'OR',
    children: [
      { type: 'group', id: 'g1', logic: 'AND', children: [cond('a', 'priority', 'is', 'High'), cond('b', 'subject', 'contains', 'vpn')] },
      cond('c', 'customer_type', 'is', 'Enterprise'),
    ],
  };
}

describe('tree editing', () => {
  it('creates a default condition with a valid operator and value for its type', () => {
    const c = createCondition(META, 'priority');
    expect(c).toMatchObject({ field: 'priority', operator: 'is', value: 'Low' });
    expect(createCondition(META, 'tags')).toMatchObject({ operator: 'contains_any', value: [] });
  });

  it('adds conditions and nested groups', () => {
    let tree = emptyRoot(META);
    const g = createGroup(META, 'OR');
    tree = addChild(tree, 'root', g);
    tree = addChild(tree, g.id, createCondition(META, 'subject'));
    expect(countConditions(tree)).toBe(3);
    expect((tree.children[1] as ConditionGroupNode).children).toHaveLength(2);
  });

  it('switching AND/OR keeps every entered value', () => {
    const before = sampleTree();
    const after = setLogic(setLogic(before, 'g1', 'OR'), 'root', 'AND');
    expect(after.logic).toBe('AND');
    const g1 = after.children[0] as ConditionGroupNode;
    expect(g1.logic).toBe('OR');
    expect(g1.children).toEqual((before.children[0] as ConditionGroupNode).children);
    expect(after.children[1]).toEqual(before.children[1]);
  });

  it('removes nodes and prunes groups left empty, never the root', () => {
    let tree = sampleTree();
    tree = removeNode(tree, 'a');
    tree = removeNode(tree, 'b');
    expect(tree.children.map((c) => c.id)).toEqual(['c']);
    expect(removeNode(tree, 'root')).toBe(tree);
  });

  it('updates a node immutably', () => {
    const tree = sampleTree();
    const next = updateNode<ConditionNode>(tree, 'b', (n) => ({ ...n, value: 'printer' }));
    expect(((next.children[0] as ConditionGroupNode).children[1] as ConditionNode).value).toBe('printer');
    expect(((tree.children[0] as ConditionGroupNode).children[1] as ConditionNode).value).toBe('vpn');
  });

  it('ensureIds names the root and fills missing ids', () => {
    const raw = { type: 'group', logic: 'AND', children: [{ type: 'condition', field: 'priority', operator: 'is', value: 'High' }] };
    const tree = ensureIds(raw as unknown as ConditionGroupNode) as ConditionGroupNode;
    expect(tree.id).toBe('root');
    expect(tree.children[0]!.id).toBeTruthy();
  });
});

describe('field and operator changes', () => {
  it('changing to a field of another type resets operator and value', () => {
    const c = changeField(META, cond('x', 'priority', 'is', 'High'), 'created_at');
    expect(c.operator).toBe('is');
    expect(typeof c.value).toBe('string');
    expect(String(c.value)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('keeps typed text when switching between text fields', () => {
    const c = changeField(META, cond('x', 'subject', 'contains', 'vpn'), 'subject');
    expect(c.value).toBe('vpn');
  });

  it('carries a single value into a list operator and back', () => {
    const list = changeOperator(META, cond('x', 'priority', 'is', 'High'), 'in');
    expect(list.value).toEqual(['High']);
    expect(changeOperator(META, list, 'is').value).toBe('High');
  });

  it('uses period and range shapes for date operators', () => {
    expect(changeOperator(META, cond('x', 'created_at', 'is', '2026-11-01'), 'between').value).toEqual(['2026-11-01', '2026-11-01']);
    expect(changeOperator(META, cond('x', 'created_at', 'is', '2026-11-01'), 'within_last').value).toEqual({ amount: 7, unit: 'days' });
  });
});

describe('validation', () => {
  it('flags empty values, bad numbers, empty lists and reversed ranges', () => {
    const tree: ConditionGroupNode = {
      type: 'group', id: 'root', logic: 'AND',
      children: [
        cond('t', 'subject', 'is', '  '),
        cond('n', 'message_count', 'gt', 'abc'),
        cond('l', 'priority', 'in', []),
        cond('r', 'created_at', 'between', ['2026-12-01', '2026-11-01']),
        cond('ok', 'is_unassigned', 'is_true', null),
      ],
    };
    const { nodeErrors, treeError } = validateTree(META, tree);
    expect(Object.keys(nodeErrors).sort()).toEqual(['l', 'n', 'r', 't']);
    expect(treeError).toBeNull();
  });

  it('requires at least one condition', () => {
    expect(validateTree(META, { type: 'group', id: 'root', logic: 'AND', children: [] }).treeError).toMatch(/at least one/);
  });

  it('maps backend error paths onto node ids', () => {
    const errors = mapServerErrors(sampleTree(), [
      { path: 'root.0.1', message: 'Subject contains: value is required' },
      { path: 'root.1', message: 'unknown field' },
      { path: 'name', message: 'ignored' },
    ]);
    expect(errors).toEqual({ b: 'value is required', c: 'unknown field' });
  });
});
