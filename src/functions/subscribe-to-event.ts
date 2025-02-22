import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'

interface SubscribeToEventParams {
  firstName: string
  lastName: string
  email: string
}

export async function subscribeToEvent({
  firstName,
  lastName,
  email,
}: SubscribeToEventParams) {
  const result = await db
    .insert(subscriptions)
    .values({
      firstName,
      lastName,
      email,
    })
    .returning()

  const subscriber = result[0]
  console.log('🚀 ~ subscriber:', subscriber)

  return {
    subscriberId: subscriber.id,
  }
}
