import React, { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ConditionGroupNode, ConditionNode } from '../../../types/rule.types';
import { ConditionBuilder } from '../ConditionBuilder';
import { META } from './fixtures';

let latest: ConditionGroupNode;

const Harness: React.FC<{ initial: ConditionGroupNode; errors?: Record<string, string> }> = ({ initial, errors }) => {
  const [tree, setTree] = useState(initial);
  latest = tree;
  return <ConditionBuilder meta={META} value={tree} onChange={setTree} errors={errors} />;
};

const start = (): ConditionGroupNode => ({
  type: 'group', id: 'root', logic: 'AND',
  children: [{ type: 'condition', id: 'c1', field: 'priority', operator: 'is', value: 'High' }],
});

describe('ConditionBuilder', () => {
  it('renders one row per condition with field, operator and value controls', () => {
    render(<Harness initial={start()} />);
    const row = screen.getByTestId('condition-row');
    expect(within(row).getByLabelText('Field')).toHaveValue('priority');
    expect(within(row).getByLabelText('Operator')).toHaveValue('is');
    expect(within(row).getByLabelText('Priority value')).toHaveValue('High');
  });

  it('adds and removes conditions', async () => {
    const user = userEvent.setup();
    render(<Harness initial={start()} />);
    await user.click(screen.getByRole('button', { name: /add condition/i }));
    expect(screen.getAllByTestId('condition-row')).toHaveLength(2);
    await user.click(screen.getAllByRole('button', { name: /remove condition/i })[0]!);
    expect(screen.getAllByTestId('condition-row')).toHaveLength(1);
  });

  it('adds a nested group with the opposite logic and connectors', async () => {
    const user = userEvent.setup();
    render(<Harness initial={start()} />);
    await user.click(screen.getAllByRole('button', { name: /add group/i })[0]!);
    const group = screen.getByTestId('condition-group');
    expect(group).toHaveAttribute('data-logic', 'OR');
    expect(within(group).getAllByTestId('condition-row')).toHaveLength(1);
    expect(latest.children[1]!.type).toBe('group');
  });

  it('switching ALL/ANY keeps entered values', async () => {
    const user = userEvent.setup();
    render(<Harness initial={start()} />);
    await user.type(screen.getByRole('button', { name: /add condition/i }), '{enter}');
    const rows = screen.getAllByTestId('condition-row');
    await user.selectOptions(within(rows[1]!).getByLabelText('Field'), 'subject');
    await user.type(within(rows[1]!).getByLabelText('Subject value'), 'vpn down');

    await user.click(screen.getByRole('radio', { name: 'ANY' }));
    expect(latest.logic).toBe('OR');
    expect((latest.children[0] as ConditionNode).value).toBe('High');
    expect((latest.children[1] as ConditionNode).value).toBe('vpn down');
    expect(screen.getByLabelText('Subject value')).toHaveValue('vpn down');
  });

  it('offers operators for the field type and renders a matching value input', async () => {
    const user = userEvent.setup();
    render(<Harness initial={start()} />);
    const row = screen.getByTestId('condition-row');

    await user.selectOptions(within(row).getByLabelText('Field'), 'created_at');
    const ops = within(row).getAllByRole('option').map((o) => o.textContent);
    expect(ops).toEqual(expect.arrayContaining(['Is Between', 'Is Within Last']));
    expect(within(row).getByLabelText('Created Date value')).toHaveAttribute('type', 'date');

    await user.selectOptions(within(row).getByLabelText('Operator'), 'within_last');
    expect(within(row).getByLabelText('Time unit')).toHaveValue('days');

    await user.selectOptions(within(row).getByLabelText('Field'), 'is_unassigned');
    expect(within(row).getByText('No value needed')).toBeInTheDocument();

    await user.selectOptions(within(row).getByLabelText('Field'), 'message_count');
    expect(within(row).getByLabelText('Message Count value')).toHaveAttribute('type', 'number');
  });

  it('multi-select values for "Is Any Of"', async () => {
    const user = userEvent.setup();
    render(<Harness initial={start()} />);
    await user.selectOptions(screen.getByLabelText('Operator'), 'in');
    expect((latest.children[0] as ConditionNode).value).toEqual(['High']);
    await user.click(screen.getByRole('button', { name: 'Priority values' }));
    await user.click(screen.getByRole('option', { name: 'Urgent' }));
    expect((latest.children[0] as ConditionNode).value).toEqual(['High', 'Urgent']);
  });

  it('id-valued selects store numbers', async () => {
    const user = userEvent.setup();
    render(<Harness initial={start()} />);
    await user.selectOptions(screen.getByLabelText('Field'), 'assigned_agent');
    expect((latest.children[0] as ConditionNode).value).toBe(7);
  });

  it('tags accept free-form chips', async () => {
    const user = userEvent.setup();
    render(<Harness initial={start()} />);
    await user.selectOptions(screen.getByLabelText('Field'), 'tags');
    await user.type(screen.getByLabelText('Tags values'), 'vpn{enter}network,');
    expect((latest.children[0] as ConditionNode).value).toEqual(['vpn', 'network']);
  });

  it('shows inline errors on the offending row', () => {
    render(<Harness initial={start()} errors={{ c1: 'Enter a value.' }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a value.');
    expect(screen.getByLabelText('Priority value')).toHaveAttribute('aria-invalid', 'true');
  });

  it('removing a group removes its conditions', async () => {
    const user = userEvent.setup();
    render(<Harness initial={start()} />);
    await user.click(screen.getAllByRole('button', { name: /add group/i })[0]!);
    await user.click(screen.getByRole('button', { name: 'Remove group' }));
    expect(screen.queryByTestId('condition-group')).not.toBeInTheDocument();
    expect(latest.children).toHaveLength(1);
  });
});
