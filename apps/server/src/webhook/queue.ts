import { logger } from "../services/logger.js";

type Task = () => Promise<void>;

class WebhookQueue {
  private tasks: Task[] = [];
  private processing = false;

  enqueue(task: Task): void {
    this.tasks.push(task);
    void this.drain();
  }

  private async drain(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.tasks.length > 0) {
      const task = this.tasks.shift()!;
      try {
        await task();
      } catch (err) {
        logger.error({ err }, "Webhook queue task failed after all retries");
      }
    }

    this.processing = false;
  }

  get size(): number {
    return this.tasks.length;
  }
}

export const webhookQueue = new WebhookQueue();
