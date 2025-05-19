'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

const settingsSchema = z.object({
  defaultLeadPrice: z.string().min(1, 'Price is required'),
  maxZipCodesPerUser: z.string().min(1, 'Max zip codes is required'),
  enableAutoAssignment: z.boolean(),
  enableEmailNotifications: z.boolean(),
  webhookUrl: z.string().url('Invalid webhook URL').optional().or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      defaultLeadPrice: '50',
      maxZipCodesPerUser: '10',
      enableAutoAssignment: true,
      enableEmailNotifications: true,
      webhookUrl: '',
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast({
        title: 'Settings updated',
        description: 'Your settings have been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="defaultLeadPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Lead Price ($)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                The default price for leads in new zip codes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxZipCodesPerUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Zip Codes Per User</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Maximum number of zip codes a user can subscribe to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enableAutoAssignment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Auto Assignment</FormLabel>
                <FormDescription>
                  Automatically assign leads to users based on their zip codes
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enableEmailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email Notifications</FormLabel>
                <FormDescription>
                  Send email notifications for new leads and updates
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="webhookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webhook URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://your-webhook-url.com" />
              </FormControl>
              <FormDescription>
                URL to receive real-time lead notifications
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
} 