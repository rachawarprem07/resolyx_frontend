import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentRulesPage } from '../AssignmentRulesPage';
import { META, makeRule } from '../../components/assignment-rules/__tests__/fixtures';
import { ApiError } from '@/lib/http';

vi.mock('@/lib/assignmentRulesApi', () => ({
  assignmentRulesApi: {
    list: vi.fn(),
    fields: vi.fn(),
    agents: vi.fn(),
    teams: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    setStatus: vi.fn(),
    duplicate: vi.fn(),
    ruleExecutions: vi.fn(),
    executions: vi.fn(),
  },
}));

import { assignmentRulesApi } from '@/lib/assignmentRulesApi';

const api = vi.mocked(assignmentRulesApi);
const STATS = { total_rules: 1, active_rules: 1, inactive_rules: 0, tickets_assigned_automatically: 4 };
const AGENTS = [{ id: 7, name: 'Alice Agent', email: 'a@x.test', role: 'support_agent', is_available: true, open_tickets: 2, team_ids: [] }];

beforeEach(() => {
  vi.clearAllMocks();
  api.fields.mockResolvedValue(META);
  api.agents.mockResolvedValue(AGENTS);
  api.teams.mockResolvedValue([]);
  api.list.mockResolvedValue({ items: [makeRule()], total: 1, stats: STATS });
  api.executions.mockResolvedValue({ items: [], total: 0 });
});

describe('AssignmentRulesPage', () => {
  it('shows summary cards and the rules table', async () => {
    render(<AssignmentRulesPage />);
    expect(await screen.findByText('High to Alice')).toBeInTheDocument();
    expect(screen.getByText('Tickets assigned automatically').nextSibling).toHaveTextContent('4');
    expect(screen.getByText('Priority is High')).toBeInTheDocument();
    expect(screen.getByText('Alice Agent')).toBeInTheDocument();
  });

  it('shows the empty state', async () => {
    api.list.mockResolvedValue({ items: [], total: 0, stats: { ...STATS, total_rules: 0, active_rules: 0 } });
    render(<AssignmentRulesPage />);
    expect(await screen.findByText('No assignment rules yet')).toBeInTheDocument();
  });

  it('shows an error state with retry', async () => {
    api.list.mockRejectedValueOnce(new ApiError(500, 'Server exploded'));
    render(<AssignmentRulesPage />);
    expect(await screen.findByText('Server exploded')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByText('High to Alice')).toBeInTheDocument();
  });

  it('passes filters and sort to the API', async () => {
    const user = userEvent.setup();
    render(<AssignmentRulesPage />);
    await screen.findByText('High to Alice');
    await user.selectOptions(screen.getByLabelText('Filter by status'), 'inactive');
    await user.selectOptions(screen.getByLabelText('Sort rules'), 'priority_desc');
    await waitFor(() =>
      expect(api.list).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'inactive', sort: 'priority_desc' }), expect.anything()),
    );
  });

  it('deactivates a rule from the actions menu', async () => {
    const user = userEvent.setup();
    api.setStatus.mockResolvedValue(makeRule({ is_active: false }));
    render(<AssignmentRulesPage />);
    await screen.findByText('High to Alice');
    await user.click(screen.getByRole('button', { name: 'Actions for High to Alice' }));
    await user.click(screen.getByRole('menuitem', { name: 'Deactivate' }));
    expect(api.setStatus).toHaveBeenCalledWith(1, false);
    expect(await screen.findByRole('status')).toHaveTextContent('deactivated');
  });

  it('confirms before deleting', async () => {
    const user = userEvent.setup();
    api.remove.mockResolvedValue(undefined);
    render(<AssignmentRulesPage />);
    await screen.findByText('High to Alice');
    await user.click(screen.getByRole('button', { name: 'Actions for High to Alice' }));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete assignment rule?' });
    await user.click(within(dialog).getByRole('button', { name: 'Delete rule' }));
    expect(api.remove).toHaveBeenCalledWith(1);
  });

  it('validates the editor inline and shows server errors on the right field', async () => {
    const user = userEvent.setup();
    api.create.mockRejectedValue(
      new ApiError(422, 'The assignment target is invalid.', [
        { path: 'assignment_config.agent_id', message: 'Agent is inactive and cannot receive assignments.' },
      ]),
    );
    render(<AssignmentRulesPage />);
    await screen.findByText('High to Alice');
    await user.click(screen.getByRole('button', { name: /create rule/i }));

    const drawer = screen.getByRole('dialog', { name: /create assignment rule/i });
    await user.click(within(drawer).getByRole('button', { name: 'Create rule' }));
    expect(within(drawer).getByText('Rule name is required.')).toBeInTheDocument();
    expect(within(drawer).getByText('Select an agent.')).toBeInTheDocument();
    expect(api.create).not.toHaveBeenCalled();

    await user.type(within(drawer).getByLabelText(/rule name/i), 'New rule');
    await user.selectOptions(within(drawer).getByLabelText(/^agent/i), '7');
    await user.click(within(drawer).getByRole('button', { name: 'Create rule' }));
    await waitFor(() => expect(api.create).toHaveBeenCalled());
    expect(api.create.mock.calls[0]![0]).toMatchObject({ name: 'New rule', assignment_config: { agent_id: 7 } });
    expect(await within(drawer).findByText('Agent is inactive and cannot receive assignments.')).toBeInTheDocument();
  });

  it('switches to the execution history tab', async () => {
    const user = userEvent.setup();
    render(<AssignmentRulesPage />);
    await screen.findByText('High to Alice');
    await user.click(screen.getByRole('tab', { name: 'Execution history' }));
    expect(await screen.findByText('No executions yet')).toBeInTheDocument();
    expect(api.executions).toHaveBeenCalled();
  });
});
