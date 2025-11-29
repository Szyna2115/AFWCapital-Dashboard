import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Get dashboard stats
app.get('/make-server-e6446f40/dashboard/stats', async (c) => {
  try {
    const stats = await kv.get('dashboard_stats');
    
    if (!stats) {
      return c.json({
        topCards: [
          { label: 'Total Return', value: '0%', change: '0%' },
          { label: 'Total Balance', value: '$0', change: '0%' },
          { label: 'Win Rate', value: '0%', change: '0%' }
        ],
        metrics: {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          averageWin: '$0',
          averageLoss: '$0',
          maxDrawdown: '0%'
        }
      });
    }
    
    return c.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return c.json({ error: 'Failed to fetch dashboard stats' }, 500);
  }
});

// Get chart data (30-day performance)
app.get('/make-server-e6446f40/dashboard/chart', async (c) => {
  try {
    const chartData = await kv.get('chart_data');
    
    if (!chartData) {
      // Return empty array if no data
      return c.json([]);
    }
    
    return c.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return c.json({ error: 'Failed to fetch chart data' }, 500);
  }
});

// Get recent activity
app.get('/make-server-e6446f40/dashboard/activity', async (c) => {
  try {
    const activity = await kv.get('recent_activity');
    
    if (!activity) {
      return c.json([]);
    }
    
    return c.json(activity);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return c.json({ error: 'Failed to fetch recent activity' }, 500);
  }
});

// Get all accounts
app.get('/make-server-e6446f40/accounts', async (c) => {
  try {
    const accounts = await kv.getByPrefix('account_');
    
    if (!accounts || accounts.length === 0) {
      return c.json([]);
    }
    
    return c.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return c.json({ error: 'Failed to fetch accounts' }, 500);
  }
});

// Update dashboard stats (called by your trading bot)
app.post('/make-server-e6446f40/dashboard/stats', async (c) => {
  try {
    const data = await c.req.json();
    await kv.set('dashboard_stats', data);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating dashboard stats:', error);
    return c.json({ error: 'Failed to update dashboard stats' }, 500);
  }
});

// Update chart data (called by your trading bot)
app.post('/make-server-e6446f40/dashboard/chart', async (c) => {
  try {
    const data = await c.req.json();
    await kv.set('chart_data', data);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating chart data:', error);
    return c.json({ error: 'Failed to update chart data' }, 500);
  }
});

// Update recent activity (called by your trading bot)
app.post('/make-server-e6446f40/dashboard/activity', async (c) => {
  try {
    const data = await c.req.json();
    await kv.set('recent_activity', data);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating recent activity:', error);
    return c.json({ error: 'Failed to update recent activity' }, 500);
  }
});

// Add or update account (called by your trading bot)
app.post('/make-server-e6446f40/accounts', async (c) => {
  try {
    const account = await c.req.json();
    const accountId = account.id || `account_${Date.now()}`;
    await kv.set(accountId, account);
    return c.json({ success: true, accountId });
  } catch (error) {
    console.error('Error updating account:', error);
    return c.json({ error: 'Failed to update account' }, 500);
  }
});

// Delete account
app.delete('/make-server-e6446f40/accounts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return c.json({ error: 'Failed to delete account' }, 500);
  }
});

Deno.serve(app.fetch);
