'use client';

import { Loader2, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { politicalTopics } from '@/lib/data/political-topics';
import Tag from './tag';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { notifyMe } from '@/lib/notifications/notify-me';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from './ui/responsive-drawer-dialog';

function NotifyMeDialog() {
  const [topics, setTopics] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTopicClick = (topic: string) => {
    setTopics((prevTopics) =>
      prevTopics.includes(topic)
        ? prevTopics.filter((t) => t !== topic)
        : [...prevTopics, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;

    setLoading(true);

    try {
      await notifyMe(email, topics);

      toast.success('Thank you for signing up!');
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="outline">
          <Mail />
          Get Notified on White House Actions
        </Button>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent>
        <form onSubmit={handleSubmit}>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              Stay Informed on White House Actions
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Tell us what topics you care about. We&apos;ll email you directly
              when the White House releases updates or takes action on those
              issues.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <section className="flex flex-col gap-4 px-4 md:px-0">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  spellCheck="false"
                  autoCapitalize="none"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="topics">
                  Topics <span className="text-destructive">*</span>
                </Label>

                <div className="flex flex-wrap gap-1">
                  {politicalTopics.map((topic) => (
                    <Tag
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
                      className={cn(
                        topics.includes(topic) &&
                          'border-primary/30 bg-primary/10 text-primary'
                      )}
                    >
                      {topic}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* <div className="grid gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="interests">Your Interests</Label>
                <p className="text-xs text-muted-foreground">
                  Write a few words about what you&apos;re interested in.
                </p>
              </div>
              <Textarea
                id="interests"
                name="interests"
                placeholder="I would like to be notified about Healthcare, Immigration, and Infrastructure."
                rows={5}
                className="min-h-24"
              />
            </div> */}
            </div>
          </section>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </ResponsiveDialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Mail />}
              Submit
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

export default NotifyMeDialog;
