import { eq } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'
import { redis } from '../redis/client'

interface SubscribeToEventParams {
  firstName: string
  lastName: string
  email: string
  referrerId?: string | null
}

export async function subscribeToEvent({
  firstName,
  lastName,
  email,
  referrerId,
}: SubscribeToEventParams) {
  const subscriberExists = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email))

  if (subscriberExists.length > 0) {
    return {
      subscriberId: subscriberExists[0].id,
    }
  }

  const result = await db
    .insert(subscriptions)
    .values({
      firstName,
      lastName,
      email,
    })
    .returning()

  if (referrerId) {
    await redis.zincrby('referral:ranking', 1, referrerId)
  }

  const subscriber = result[0]
  console.log('🚀 ~ subscriber:', subscriber)

  return {
    subscriberId: subscriber.id,
  }
}
