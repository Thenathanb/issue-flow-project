'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const IssueSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  assignedToId: z.string().optional(),
})

export type ActionState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
}

export async function createIssue(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    priority: formData.get('priority'),
    assignedToId: formData.get('assignedToId') || undefined,
  }

  const result = IssueSchema.safeParse(raw)

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    }
  }

  await prisma.issue.create({
    data: result.data,
  })

  revalidatePath('/issues')
  revalidatePath('/dashboard')

  return { success: true, message: 'Issue created successfully' }
}

export async function updateIssue(
  id: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    priority: formData.get('priority'),
    assignedToId: formData.get('assignedToId') || undefined,
  }

  const result = IssueSchema.safeParse(raw)

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    }
  }

  await prisma.issue.update({
    where: { id },
    data: result.data,
  })

  revalidatePath('/issues')
  revalidatePath('/dashboard')

  return { success: true, message: 'Issue updated successfully' }
}

export async function deleteIssue(id: string): Promise<ActionState> {
  await prisma.issue.delete({
    where: { id },
  })

  revalidatePath('/issues')
  revalidatePath('/dashboard')

  return { success: true, message: 'Issue deleted successfully' }
}
