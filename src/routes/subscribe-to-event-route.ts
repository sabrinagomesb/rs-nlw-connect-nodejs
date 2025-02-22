import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { subscribeToEvent } from '../functions/subscribe-to-event'

export const subscribeToEventRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/subscriptions',
    {
      schema: {
        summary: 'Subscribe to an event',
        tags: ['subscriptions'],
        body: z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            subscriberId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { firstName, lastName, email } = request.body

      const { subscriberId } = await subscribeToEvent({
        firstName,
        lastName,
        email,
      })

      return reply.status(201).send({
        subscriberId,
      })
    }
  )
}
